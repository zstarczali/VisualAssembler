//! VICE binary monitor kliens (VICE 3.5+, `-binarymonitor`).
//!
//! Csomag: STX ($02), API ($02), hossz (u32 LE), kérés-id (u32 LE), parancs, törzs.
//! Válasz: STX, API, hossz, típus, hibakód, kérés-id, törzs; az id $FFFFFFFF-es válaszok
//! események (stopped / resumed / registers), ezeket átlépjük. Bármely parancs megállítja
//! az emulációt, ezért minden munkamenet `exit`-tel ($AA) zárul (a `Drop` is küldi).

use std::io::{Read, Write};
use std::net::{SocketAddr, TcpStream};
use std::time::Duration;

pub const DEFAULT_PORT: u16 = 6502;

const STX: u8 = 0x02;
const API: u8 = 0x02;
const CMD_MEM_GET: u8 = 0x01;
const CMD_MEM_SET: u8 = 0x02;
const CMD_REG_GET: u8 = 0x31;
const CMD_REG_SET: u8 = 0x32;
const CMD_BANKS: u8 = 0x82;
const CMD_REGS_AVAILABLE: u8 = 0x83;
const CMD_EXIT: u8 = 0xAA;
const CMD_CHECKPOINT_SET: u8 = 0x12;
const CMD_CHECKPOINT_DELETE: u8 = 0x13;
const CMD_ADVANCE: u8 = 0x71;
const CMD_UNTIL_RETURN: u8 = 0x73;
const CMD_PING: u8 = 0x81;
const CMD_KEYBOARD_FEED: u8 = 0x72;
const EVENT_STOPPED: u8 = 0x62;
const CHECKPOINT_EXEC: u8 = 4;
const MEMSPACE_MAIN: u8 = 0;

pub struct Monitor {
    stream: TcpStream,
    next_id: u32,
    stopped: bool,
    /// PC of the last STOPPED event; a command that lets the CPU go clears it.
    stop_pc: Option<u16>,
}

fn io_err(e: std::io::Error) -> String {
    format!("VICE monitor: {}", e)
}

fn u16_at(b: &[u8], p: usize) -> Result<u16, String> {
    b.get(p..p + 2)
        .map(|s| u16::from_le_bytes([s[0], s[1]]))
        .ok_or_else(|| "VICE monitor: short response".to_string())
}

impl Monitor {
    pub fn connect(port: u16) -> Result<Self, String> {
        let addr: SocketAddr = ([127, 0, 0, 1], port).into();
        let stream = TcpStream::connect_timeout(&addr, Duration::from_millis(800)).map_err(io_err)?;
        stream.set_read_timeout(Some(Duration::from_secs(3))).map_err(io_err)?;
        stream.set_write_timeout(Some(Duration::from_secs(3))).map_err(io_err)?;
        let _ = stream.set_nodelay(true);
        Ok(Monitor { stream, next_id: 1, stopped: false, stop_pc: None })
    }

    /// One client at a time: a connection made right after the previous one closed can be
    /// dropped by the emulator, so it counts once a command has an answer.
    pub fn connect_ready(port: u16, patience: Duration) -> Result<Self, String> {
        let deadline = std::time::Instant::now() + patience;
        loop {
            let attempt = Monitor::connect(port).and_then(|mut monitor| {
                monitor.request(CMD_PING, &[])?;
                Ok(monitor)
            });
            match attempt {
                Ok(monitor) => return Ok(monitor),
                Err(_) if std::time::Instant::now() < deadline => std::thread::sleep(Duration::from_millis(150)),
                Err(error) => return Err(error),
            }
        }
    }

    fn packet(&mut self, cmd: u8, body: &[u8], out: &mut Vec<u8>) -> u32 {
        let id = self.next_id;
        self.next_id = self.next_id.wrapping_add(1).max(1);
        out.extend_from_slice(&[STX, API]);
        out.extend_from_slice(&(body.len() as u32).to_le_bytes());
        out.extend_from_slice(&id.to_le_bytes());
        out.push(cmd);
        out.extend_from_slice(body);
        id
    }

    fn request(&mut self, cmd: u8, body: &[u8]) -> Result<Vec<u8>, String> {
        let mut pkt = Vec::with_capacity(11 + body.len());
        let id = self.packet(cmd, body, &mut pkt);
        self.stream.write_all(&pkt).map_err(io_err)?;
        self.stopped = cmd != CMD_EXIT;
        self.read_reply(id, cmd)
    }

    fn read_reply(&mut self, id: u32, cmd: u8) -> Result<Vec<u8>, String> {
        // események közt is határidő: egy folyamatos eseményáram se akaszthassa meg a választ
        let deadline = std::time::Instant::now() + Duration::from_secs(3);
        loop {
            if std::time::Instant::now() > deadline {
                return Err("VICE monitor: no reply".to_string());
            }
            let mut head = [0u8; 12];
            self.stream.read_exact(&mut head).map_err(io_err)?;
            if head[0] != STX {
                return Err("VICE monitor: unexpected data".to_string());
            }
            let len = u32::from_le_bytes([head[2], head[3], head[4], head[5]]) as usize;
            let mut data = vec![0u8; len];
            self.stream.read_exact(&mut data).map_err(io_err)?;
            if u32::from_le_bytes([head[8], head[9], head[10], head[11]]) != id {
                self.note_event(head[6], &data);
                continue;
            }
            if head[7] != 0 {
                return Err(format!("VICE monitor: error ${:02X} for command ${:02X}", head[7], cmd));
            }
            return Ok(data);
        }
    }

    fn note_event(&mut self, kind: u8, data: &[u8]) {
        if kind == EVENT_STOPPED {
            self.stop_pc = u16_at(data, 0).ok();
        }
    }

    /// Reads the events waiting on the socket, at most `wait` for the first one; for a CPU that
    /// runs in the debugger, since any command would stop it.
    pub fn poll_events(&mut self, wait: Duration) -> Result<(), String> {
        self.stream.set_read_timeout(Some(wait.max(Duration::from_millis(1)))).map_err(io_err)?;
        let outcome = loop {
            let mut head = [0u8; 12];
            match self.stream.peek(&mut head) {
                Ok(0) => break Err("VICE monitor: connection closed".to_string()),
                Ok(n) if n < head.len() => break Ok(()),
                Ok(_) => {}
                Err(e) if matches!(e.kind(), std::io::ErrorKind::WouldBlock | std::io::ErrorKind::TimedOut) => break Ok(()),
                Err(e) => break Err(io_err(e)),
            }
            self.stream.set_read_timeout(Some(Duration::from_secs(3))).map_err(io_err)?;
            self.stream.read_exact(&mut head).map_err(io_err)?;
            let len = u32::from_le_bytes([head[2], head[3], head[4], head[5]]) as usize;
            let mut data = vec![0u8; len];
            self.stream.read_exact(&mut data).map_err(io_err)?;
            self.note_event(head[6], &data);
            self.stream.set_read_timeout(Some(Duration::from_millis(1))).map_err(io_err)?;
        };
        self.stream.set_read_timeout(Some(Duration::from_secs(3))).map_err(io_err)?;
        outcome
    }

    pub fn stop_pc(&self) -> Option<u16> {
        self.stop_pc
    }

    /// A command that lets the CPU go. A stop event can come twice in a row: one that arrives
    /// before the reply belongs to the previous run, the stop of this run comes after it.
    fn run_command(&mut self, cmd: u8, body: &[u8]) -> Result<(), String> {
        self.request(cmd, body)?;
        self.stop_pc = None;
        Ok(())
    }

    /// For a stop that came from elsewhere, with no event: gives the PC it is at.
    pub fn note_stop(&mut self) -> Result<Option<u16>, String> {
        let pc = self.register_id("PC")?;
        self.stop_pc = self.registers()?.iter().find(|(id, _)| *id == pc).map(|(_, v)| *v);
        Ok(self.stop_pc)
    }

    /// Puts PETSCII text into the C64's keyboard buffer.
    pub fn keyboard_feed(&mut self, text: &[u8]) -> Result<(), String> {
        let mut body = vec![text.len() as u8];
        body.extend_from_slice(text);
        self.request(CMD_KEYBOARD_FEED, &body).map(|_| ())
    }

    /// Deletes checkpoints by number and sets execution checkpoints that stop the CPU, all in one
    /// write so that they are served together; gives the new numbers.
    pub fn update_checkpoints(&mut self, delete: &[u32], set: &[u16]) -> Result<Vec<u32>, String> {
        let mut packets = Vec::new();
        let mut deleted = Vec::with_capacity(delete.len());
        for number in delete {
            deleted.push(self.packet(CMD_CHECKPOINT_DELETE, &number.to_le_bytes(), &mut packets));
        }
        let mut created = Vec::with_capacity(set.len());
        for address in set {
            let mut body = address.to_le_bytes().to_vec();
            body.extend_from_slice(&address.to_le_bytes());
            body.extend_from_slice(&[1, 1, CHECKPOINT_EXEC, 0]);
            created.push(self.packet(CMD_CHECKPOINT_SET, &body, &mut packets));
        }
        if packets.is_empty() {
            return Ok(Vec::new());
        }
        self.stream.write_all(&packets).map_err(io_err)?;
        self.stopped = true;
        for id in deleted {
            self.read_reply(id, CMD_CHECKPOINT_DELETE)?;
        }
        let mut numbers = Vec::with_capacity(created.len());
        for id in created {
            let reply = self.read_reply(id, CMD_CHECKPOINT_SET)?;
            let number = reply.get(0..4).ok_or("VICE monitor: short response")?;
            numbers.push(u32::from_le_bytes([number[0], number[1], number[2], number[3]]));
        }
        Ok(numbers)
    }

    /// One instruction, over a JSR with `over`; the stop arrives as an event.
    pub fn advance(&mut self, over: bool) -> Result<(), String> {
        let mut body = vec![u8::from(over)];
        body.extend_from_slice(&1u16.to_le_bytes());
        self.run_command(CMD_ADVANCE, &body)
    }

    /// Runs until the current routine returns, or it runs out of the machine's budget for that if
    /// it never does; the stop arrives as an event. Not waited for: the machine answers only then.
    pub fn until_return(&mut self) -> Result<(), String> {
        let mut pkt = Vec::with_capacity(11);
        self.packet(CMD_UNTIL_RETURN, &[], &mut pkt);
        self.poll_events(Duration::from_millis(1))?;
        self.stop_pc = None;
        self.stream.write_all(&pkt).map_err(io_err)?;
        self.stopped = true;
        Ok(())
    }

    /// A regiszterek azonosítói és nevei.
    pub fn register_names(&mut self) -> Result<Vec<(u8, String)>, String> {
        let b = self.request(CMD_REGS_AVAILABLE, &[MEMSPACE_MAIN])?;
        let count = u16_at(&b, 0)?;
        let mut out = Vec::with_capacity(count as usize);
        let mut p = 2;
        for _ in 0..count {
            let size = *b.get(p).ok_or("VICE monitor: short response")? as usize;
            let id = *b.get(p + 1).ok_or("VICE monitor: short response")?;
            let nlen = *b.get(p + 3).ok_or("VICE monitor: short response")? as usize;
            let name = b.get(p + 4..p + 4 + nlen).ok_or("VICE monitor: short response")?;
            out.push((id, String::from_utf8_lossy(name).to_string()));
            p += 1 + size;
        }
        Ok(out)
    }

    /// Bank azonosító név szerint ("ram", "cpu", …); ismeretlennél 0 (default).
    pub fn bank_id(&mut self, name: &str) -> Result<u16, String> {
        let b = self.request(CMD_BANKS, &[])?;
        let count = u16_at(&b, 0)?;
        let mut p = 2;
        for _ in 0..count {
            let size = *b.get(p).ok_or("VICE monitor: short response")? as usize;
            let id = u16_at(&b, p + 1)?;
            let nlen = *b.get(p + 3).ok_or("VICE monitor: short response")? as usize;
            if b.get(p + 4..p + 4 + nlen) == Some(name.as_bytes()) {
                return Ok(id);
            }
            p += 1 + size;
        }
        Ok(0)
    }

    pub fn register_id(&mut self, name: &str) -> Result<u8, String> {
        let b = self.request(CMD_REGS_AVAILABLE, &[MEMSPACE_MAIN])?;
        let count = u16_at(&b, 0)?;
        let mut p = 2;
        for _ in 0..count {
            let size = *b.get(p).ok_or("VICE monitor: short response")? as usize;
            let id = *b.get(p + 1).ok_or("VICE monitor: short response")?;
            let nlen = *b.get(p + 3).ok_or("VICE monitor: short response")? as usize;
            if b.get(p + 4..p + 4 + nlen) == Some(name.as_bytes()) {
                return Ok(id);
            }
            p += 1 + size;
        }
        Err(format!("VICE monitor: no register {}", name))
    }

    /// Regiszterek (id → érték).
    pub fn registers(&mut self) -> Result<Vec<(u8, u16)>, String> {
        let b = self.request(CMD_REG_GET, &[MEMSPACE_MAIN])?;
        let count = u16_at(&b, 0)?;
        let mut out = Vec::with_capacity(count as usize);
        let mut p = 2;
        for _ in 0..count {
            let size = *b.get(p).ok_or("VICE monitor: short response")? as usize;
            let id = *b.get(p + 1).ok_or("VICE monitor: short response")?;
            out.push((id, u16_at(&b, p + 2)?));
            p += 1 + size;
        }
        Ok(out)
    }

    pub fn set_register(&mut self, id: u8, value: u16) -> Result<(), String> {
        let mut body = vec![MEMSPACE_MAIN, 1, 0, 3, id];
        body.extend_from_slice(&value.to_le_bytes());
        self.request(CMD_REG_SET, &body).map(|_| ())
    }

    pub fn read_memory(&mut self, start: u16, end: u16, bank: u16) -> Result<Vec<u8>, String> {
        let mut body = vec![0u8];
        body.extend_from_slice(&start.to_le_bytes());
        body.extend_from_slice(&end.to_le_bytes());
        body.push(MEMSPACE_MAIN);
        body.extend_from_slice(&bank.to_le_bytes());
        let b = self.request(CMD_MEM_GET, &body)?;
        let len = u16_at(&b, 0)? as usize;
        b.get(2..2 + len).map(|s| s.to_vec()).ok_or_else(|| "VICE monitor: short response".to_string())
    }

    pub fn write_memory(&mut self, start: u16, bytes: &[u8], bank: u16) -> Result<(), String> {
        if bytes.is_empty() {
            return Ok(());
        }
        if start as usize + bytes.len() > 0x10000 {
            return Err("VICE monitor: write past $FFFF".to_string());
        }
        let end = (start as usize + bytes.len() - 1) as u16;
        let mut body = vec![0u8];
        body.extend_from_slice(&start.to_le_bytes());
        body.extend_from_slice(&end.to_le_bytes());
        body.push(MEMSPACE_MAIN);
        body.extend_from_slice(&bank.to_le_bytes());
        body.extend_from_slice(bytes);
        self.request(CMD_MEM_SET, &body).map(|_| ())
    }

    pub fn resume(&mut self) -> Result<(), String> {
        self.run_command(CMD_EXIT, &[])
    }
}

impl Drop for Monitor {
    fn drop(&mut self) {
        if self.stopped {
            let _ = self.resume();
        }
    }
}

/// A `launch_vice` ezekkel indítja a VICE-t, hogy a monitor elérhető legyen.
pub fn launch_args(port: u16) -> Vec<String> {
    vec![
        "-binarymonitor".to_string(),
        "-binarymonitoraddress".to_string(),
        format!("ip4://127.0.0.1:{}", port),
    ]
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::net::TcpListener;
    use std::thread;

    // Kis ál-VICE: minden kérésre egy eseményt, majd a választ küldi a parancs szerint.
    fn fake_vice(handler: fn(u8, &[u8]) -> Vec<u8>) -> u16 {
        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let port = listener.local_addr().unwrap().port();
        thread::spawn(move || {
            let (mut s, _) = listener.accept().unwrap();
            loop {
                let mut head = [0u8; 11];
                if s.read_exact(&mut head).is_err() {
                    return;
                }
                let len = u32::from_le_bytes([head[2], head[3], head[4], head[5]]) as usize;
                let mut body = vec![0u8; len];
                s.read_exact(&mut body).unwrap();
                let reply = |s: &mut TcpStream, kind: u8, id: [u8; 4], data: &[u8]| {
                    let mut r = vec![STX, API];
                    r.extend_from_slice(&(data.len() as u32).to_le_bytes());
                    r.extend_from_slice(&[kind, 0]);
                    r.extend_from_slice(&id);
                    r.extend_from_slice(data);
                    s.write_all(&r).unwrap();
                };
                reply(&mut s, 0x62, [0xFF; 4], &[0x00, 0x10]);
                let data = handler(head[10], &body);
                reply(&mut s, head[10], [head[6], head[7], head[8], head[9]], &data);
            }
        });
        port
    }

    fn handler(cmd: u8, body: &[u8]) -> Vec<u8> {
        match cmd {
            CMD_BANKS => vec![2, 0, 10, 0, 0, 7, b'd', b'e', b'f', b'a', b'u', b'l', b't', 6, 1, 0, 3, b'r', b'a', b'm'],
            CMD_REGS_AVAILABLE => vec![2, 0, 4, 0, 8, 1, b'A', 5, 3, 16, 2, b'P', b'C'],
            CMD_REG_GET => vec![2, 0, 3, 0, 0x42, 0, 3, 3, 0x34, 0x12],
            CMD_MEM_GET => {
                let start = u16::from_le_bytes([body[1], body[2]]);
                let end = u16::from_le_bytes([body[3], body[4]]);
                let n = (end - start + 1) as usize;
                let mut out = (n as u16).to_le_bytes().to_vec();
                out.extend((0..n).map(|i| (start as usize + i) as u8));
                out
            }
            CMD_CHECKPOINT_SET => vec![u16::from_le_bytes([body[0], body[1]]) as u8, 0, 0, 0],
            CMD_MEM_SET => {
                assert_eq!(&body[..5], &[0, 0x00, 0xC0, 0x02, 0xC0]);
                assert_eq!(&body[6..8], &[1, 0], "writes go to the RAM bank");
                Vec::new()
            }
            _ => Vec::new(),
        }
    }

    #[test]
    fn session_skips_events_and_parses_replies() {
        let port = fake_vice(handler);
        let mut m = Monitor::connect(port).unwrap();
        assert_eq!(m.bank_id("ram").unwrap(), 1);
        assert_eq!(m.bank_id("nope").unwrap(), 0);
        assert_eq!(m.register_id("PC").unwrap(), 3);
        assert!(m.register_id("Q").is_err());
        assert_eq!(m.registers().unwrap(), vec![(0, 0x42), (3, 0x1234)]);
        assert_eq!(m.read_memory(0x10, 0x13, 0).unwrap(), vec![0x10, 0x11, 0x12, 0x13]);
        m.write_memory(0xC000, &[1, 2, 3], 1).unwrap();
        assert!(m.write_memory(0xFFFF, &[1, 2], 1).is_err());
        m.resume().unwrap();
    }

    // Valódi VICE-szal: x64sc -binarymonitor, majd `cargo test -- --ignored real_vice`
    #[test]
    #[ignore]
    fn real_vice_hot_reload_and_sampling() {
        let mut m = Monitor::connect(DEFAULT_PORT).unwrap();
        let ram = m.bank_id("ram").unwrap();
        m.write_memory(0xC000, &[0xEE, 0x20, 0xD0, 0x4C, 0x00, 0xC0], ram).unwrap();
        let pc = m.register_id("PC").unwrap();
        m.set_register(pc, 0xC000).unwrap();
        m.resume().unwrap();
        std::thread::sleep(Duration::from_millis(50));
        for _ in 0..20 {
            let regs = m.registers().unwrap();
            m.resume().unwrap();
            let v = regs.iter().find(|(id, _)| *id == pc).unwrap().1;
            assert!((0xC000..0xC006).contains(&v), "PC ${:04X}", v);
        }
        let cpu = m.bank_id("cpu").unwrap();
        assert_eq!(m.read_memory(0xC000, 0xC002, cpu).unwrap(), vec![0xEE, 0x20, 0xD0]);
    }

    #[test]
    fn checkpoint_changes_go_out_together() {
        let port = fake_vice(handler);
        let mut m = Monitor::connect(port).unwrap();
        assert_eq!(m.update_checkpoints(&[], &[]).unwrap(), Vec::<u32>::new());
        assert_eq!(m.update_checkpoints(&[7, 8], &[0x0810, 0x0820]).unwrap(), vec![0x10, 0x20]);
    }

    #[test]
    fn events_report_the_stop_without_a_command() {
        let port = fake_vice(handler);
        let mut m = Monitor::connect(port).unwrap();
        m.poll_events(Duration::from_millis(5)).unwrap();
        assert_eq!(m.stop_pc(), None, "nothing on the socket yet");
        m.bank_id("ram").unwrap();
        assert_eq!(m.stop_pc(), Some(0x1000), "the event before the reply counts");
        m.resume().unwrap();
        m.poll_events(Duration::from_millis(5)).unwrap();
    }

    #[test]
    fn launch_args_open_the_port() {
        assert_eq!(launch_args(6502), vec!["-binarymonitor", "-binarymonitoraddress", "ip4://127.0.0.1:6502"]);
    }
}
