use super::ast::{BinOp, ColorTarget, Expr, Stmt, VarType};
use super::lexer::Token;
use super::lexer::Token::{LBracket, RBracket};

fn token_label(t: &Token) -> String {
    match t {
        Token::StringLit(s) => format!("\"{}\"", s),
        Token::Number(n) => n.to_string(),
        Token::Addr(n) => format!("${:04X}", n),
        Token::Ident(s) => s.clone(),
        Token::Eof => "<end of file>".into(),
        Token::Newline => "<newline>".into(),
        Token::Assign => "'='".into(),
        Token::Plus => "'+'".into(),
        Token::Minus => "'-'".into(),
        Token::Star => "'*'".into(),
        Token::Slash => "'/'".into(),
        Token::LParen => "'('".into(),
        Token::RParen => "')'".into(),
        Token::LBracket => "'['".into(),
        Token::RBracket => "']'".into(),
        Token::Comma => "','".into(),
        Token::Colon => "':'".into(),
        Token::Eq => "'=='".into(),
        Token::NotEq => "'!='".into(),
        Token::Lt => "'<'".into(),
        Token::Gt => "'>'".into(),
        Token::LtEq => "'<='".into(),
        Token::GtEq => "'>='".into(),
        // Keywords: show as lowercase source text
        other => format!("'{}'", format!("{:?}", other).to_lowercase()),
    }
}

/// Recursively fold constant arithmetic/bitwise expressions at parse time.
/// `Number(a) op Number(b)` → `Number(result)` using i16 wrapping arithmetic.
/// Comparison ops are NOT folded (they return 0/1 but context differs).
fn fold_const_expr(e: Expr) -> Expr {
    match e {
        Expr::BinOp(l, op, r) => {
            let l = fold_const_expr(*l);
            let r = fold_const_expr(*r);
            if let (Expr::Number(a), Expr::Number(b)) = (&l, &r) {
                let a = *a;
                let b = *b;
                let result: Option<i16> = match op {
                    BinOp::Add => Some(a.wrapping_add(b)),
                    BinOp::Sub => Some(a.wrapping_sub(b)),
                    BinOp::Mul => Some(a.wrapping_mul(b)),
                    BinOp::Div => {
                        if b != 0 {
                            Some(a.wrapping_div(b))
                        } else {
                            None
                        }
                    }
                    BinOp::Mod => {
                        if b != 0 {
                            Some(a.wrapping_rem(b))
                        } else {
                            None
                        }
                    }
                    BinOp::And => Some(a & b),
                    BinOp::Or => Some(a | b),
                    BinOp::Xor => Some(a ^ b),
                    BinOp::Shl => Some(a.wrapping_shl(b as u32)),
                    BinOp::Shr => Some(((a as u16).wrapping_shr(b as u32)) as i16),
                    _ => None, // comparisons: don't fold
                };
                if let Some(n) = result {
                    return Expr::Number(n);
                }
            }
            Expr::BinOp(Box::new(l), op, Box::new(r))
        }
        other => other,
    }
}

pub struct Parser {
    tokens: Vec<Token>,
    pos: usize,
    line: usize,
    consts: std::collections::HashMap<String, i16>,
    declared_vars: std::collections::HashSet<String>,
    base_dir: Option<std::path::PathBuf>,
    errors: Vec<String>,
    skip_var_check: bool,
}

impl Parser {
    pub fn new(tokens: Vec<Token>) -> Self {
        Self {
            tokens,
            pos: 0,
            line: 1,
            consts: std::collections::HashMap::new(),
            declared_vars: std::collections::HashSet::new(),
            base_dir: None,
            errors: vec![],
            skip_var_check: false,
        }
    }

    pub fn new_with_base(tokens: Vec<Token>, base_dir: std::path::PathBuf) -> Self {
        Self {
            tokens,
            pos: 0,
            line: 1,
            consts: std::collections::HashMap::new(),
            declared_vars: std::collections::HashSet::new(),
            base_dir: Some(base_dir),
            errors: vec![],
            skip_var_check: false,
        }
    }

    pub fn new_with_consts(
        tokens: Vec<Token>,
        consts: std::collections::HashMap<String, i16>,
    ) -> Self {
        Self {
            tokens,
            pos: 0,
            line: 1,
            consts,
            declared_vars: std::collections::HashSet::new(),
            base_dir: None,
            errors: vec![],
            skip_var_check: false,
        }
    }

    pub fn new_with_consts_and_base(
        tokens: Vec<Token>,
        consts: std::collections::HashMap<String, i16>,
        base_dir: Option<std::path::PathBuf>,
    ) -> Self {
        Self {
            tokens,
            pos: 0,
            line: 1,
            consts,
            declared_vars: std::collections::HashSet::new(),
            base_dir,
            errors: vec![],
            skip_var_check: false,
        }
    }

    pub fn errors(&self) -> &[String] {
        &self.errors
    }

    /// Parse a SID file at compile time and build a LoadSid statement.
    ///
    /// PSID/RSID header layout (big-endian):
    ///   $00-$03  magic "PSID" or "RSID"
    ///   $04-$05  version (1 or 2)
    ///   $06-$07  data offset into file (= $76 for v1, $7C for v2)
    ///   $08-$09  load address (0 = first 2 bytes of data are the address)
    ///   $0A-$0B  init address
    ///   $0C-$0D  play address
    ///   ... more header fields ...
    ///   At data_offset: music data
    fn parse_load_sid(&mut self, filename: &str, override_addr: Option<u16>) -> Option<Stmt> {
        // Resolve the path relative to the source file's directory.
        let path: std::path::PathBuf = if let Some(base) = &self.base_dir {
            base.join(filename)
        } else {
            std::path::PathBuf::from(filename)
        };

        let bytes = match std::fs::read(&path) {
            Ok(b) => b,
            Err(e) => {
                self.errors
                    .push(format!("load sid: cannot read '{}': {}", path.display(), e));
                return None;
            }
        };

        // Validate magic and minimum header size (need at least 14 bytes for the address fields)
        if bytes.len() < 14 || (&bytes[0..4] != b"PSID" && &bytes[0..4] != b"RSID") {
            self.errors.push(format!(
                "load sid: '{}' is not a valid PSID/RSID file",
                filename
            ));
            return None;
        }

        let data_offset = u16::from_be_bytes([bytes[0x06], bytes[0x07]]) as usize;
        let load_addr_hdr = u16::from_be_bytes([bytes[0x08], bytes[0x09]]);
        let init_addr = u16::from_be_bytes([bytes[0x0A], bytes[0x0B]]);
        let play_addr = u16::from_be_bytes([bytes[0x0C], bytes[0x0D]]);

        if data_offset >= bytes.len() {
            self.errors.push(format!(
                "load sid: '{}' data offset beyond file end",
                filename
            ));
            return None;
        }

        let music_raw = &bytes[data_offset..];

        // If load address in header is 0, the first two bytes of the data are the load address (PRG-style).
        let (load_addr_from_file, music_data) = if load_addr_hdr == 0 {
            if music_raw.len() < 2 {
                self.errors
                    .push(format!("load sid: '{}' truncated data section", filename));
                return None;
            }
            let a = u16::from_le_bytes([music_raw[0], music_raw[1]]);
            (a, music_raw[2..].to_vec())
        } else {
            (load_addr_hdr, music_raw.to_vec())
        };

        // An explicit address in source overrides whatever the SID header says.
        let load_addr = override_addr.unwrap_or(load_addr_from_file);

        // Inject sid_init and sid_play as compile-time constants so the source
        // code can reference them in expressions, sys calls, irq statements, etc.
        self.consts.insert("sid_init".to_string(), init_addr as i16);
        self.consts.insert("sid_play".to_string(), play_addr as i16);

        Some(Stmt::LoadSid {
            load_addr,
            init_addr,
            play_addr,
            data: music_data,
        })
    }

    fn peek(&self) -> &Token {
        self.tokens.get(self.pos).unwrap_or(&Token::Eof)
    }

    fn peek2(&self) -> &Token {
        self.tokens.get(self.pos + 1).unwrap_or(&Token::Eof)
    }

    fn advance(&mut self) -> Token {
        let t = self.tokens.get(self.pos).cloned().unwrap_or(Token::Eof);
        self.pos += 1;
        if matches!(t, Token::Newline) {
            self.line += 1;
        } else if let Token::AsmSource(_, n) = &t {
            self.line += n; // count newlines inside asm { } blocks
        }
        t
    }

    fn skip_newlines(&mut self) {
        loop {
            match self.peek() {
                Token::Newline | Token::Colon | Token::Semicolon => {
                    self.advance();
                }
                _ => break,
            }
        }
    }

    fn expect_newline(&mut self) {
        loop {
            match self.peek() {
                Token::Newline => {
                    self.advance();
                }
                _ => break,
            }
        }
    }

    fn parse_param_list(&mut self) -> Vec<(String, Option<VarType>)> {
        let mut params = vec![];
        if self.peek() == &Token::LParen {
            self.advance(); // (
            while !matches!(self.peek(), Token::RParen | Token::Eof) {
                if let Token::Ident(p) = self.peek().clone() {
                    self.advance();
                    let ptype = if self.peek() == &Token::Colon {
                        self.advance();
                        match self.peek() {
                            Token::Int => { self.advance(); Some(VarType::Int) }
                            Token::Str => { self.advance(); Some(VarType::Str) }
                            Token::Float => { self.advance(); Some(VarType::Float) }
                            Token::Word => { self.advance(); Some(VarType::Word) }
                            _ => None,
                        }
                    } else {
                        None
                    };
                    params.push((p, ptype));
                } else {
                    self.advance();
                }
                if self.peek() == &Token::Comma {
                    self.advance();
                }
            }
            if self.peek() == &Token::RParen {
                self.advance();
            } // )
        }
        params
    }

    fn reject_stmt(&mut self, message: &str) -> Option<Stmt> {
        self.errors.push(format!("line {}: {}", self.line, message));
        while !matches!(self.peek(), Token::Newline | Token::Eof) {
            self.advance();
        }
        self.expect_newline();
        None
    }

    /// Pre-scan tokens to collect all `var name` declarations.
    /// Handles `include` recursively by spawning sub-parsers for included files.
    fn pre_scan_var_decls(&mut self) {
        let saved_pos = self.pos;
        let saved_line = self.line;
        self.pos = 0;
        self.line = 1;
        self.skip_newlines();
        while self.peek() != &Token::Eof {
            if self.peek() == &Token::Include {
                self.advance(); // 'include'
                if let Token::StringLit(path) = self.peek().clone() {
                    self.advance();
                    let resolved = if let Some(ref base) = self.base_dir {
                        base.join(&path)
                    } else {
                        std::path::PathBuf::from(&path)
                    };
                    let sub_base = resolved.parent().map(|p| p.to_path_buf());
                    if let Ok(src) = std::fs::read_to_string(&resolved) {
                        let mut lex = super::lexer::Lexer::new(&src);
                        let toks = lex.tokenize();
                        let mut sub = Parser::new_with_consts_and_base(
                            toks,
                            std::collections::HashMap::new(),
                            sub_base,
                        );
                        sub.pre_scan_var_decls();
                        self.declared_vars.extend(sub.declared_vars);
                    }
                }
            } else if self.peek() == &Token::Var {
                self.advance(); // 'var'
                if let Token::Ident(name) = self.advance() {
                    self.declared_vars.insert(name);
                }
                // skip rest of line
                while !matches!(self.peek(), Token::Newline | Token::Eof) {
                    self.advance();
                }
            } else if self.peek() == &Token::Newline {
                self.advance();
            } else {
                self.advance();
            }
        }
        // restore position
        self.pos = saved_pos;
        self.line = saved_line;
    }

    /// Check whether a name refers to a declared variable or a compile-time constant.
    fn is_declared(&self, name: &str) -> bool {
        self.declared_vars.contains(name) || self.consts.contains_key(name)
    }

    pub fn parse(&mut self) -> Vec<Stmt> {
        // Pre-scan: collect all var declarations (including from included files)
        self.pre_scan_var_decls();

        let mut stmts = vec![];
        self.skip_newlines();
        while self.peek() != &Token::Eof {
            if self.peek() == &Token::Include {
                self.advance(); // consume 'include'
                if let Token::StringLit(path) = self.peek().clone() {
                    self.advance();
                    // Resolve relative to the source file's directory if available,
                    // otherwise fall back to CWD.
                    let resolved = if let Some(ref base) = self.base_dir {
                        base.join(&path)
                    } else {
                        std::path::PathBuf::from(&path)
                    };
                    // Sub-parser inherits the same base_dir so nested includes work.
                    let sub_base = resolved.parent().map(|p| p.to_path_buf());
                    match std::fs::read_to_string(&resolved) {
                        Ok(src) => {
                            let mut lex = super::lexer::Lexer::new(&src);
                            let toks = lex.tokenize();
                            let consts = self.consts.clone();
                            let decl_vars = self.declared_vars.clone();
                            let mut sub = Parser::new_with_consts_and_base(toks, consts, sub_base);
                            sub.declared_vars = decl_vars;
                            let sub_stmts = sub.parse();
                            self.consts.extend(sub.consts.into_iter());
                            self.declared_vars.extend(sub.declared_vars);
                            self.errors.extend(sub.errors);
                            stmts.extend(sub_stmts);
                        }
                        Err(e) => eprintln!("include '{}': {}", resolved.display(), e),
                    }
                }
                self.expect_newline();
            } else if let Some(s) = self.parse_stmt() {
                stmts.push(s);
            }
            self.skip_newlines();
        }
        stmts
    }

    fn parse_addr(&mut self) -> u16 {
        match self.peek().clone() {
            Token::Addr(a) => {
                self.advance();
                a
            }
            Token::Number(n) => {
                self.advance();
                n as u16
            }
            Token::Ident(name) => {
                if let Some(&val) = self.consts.get(&name) {
                    self.advance();
                    val as u16
                } else {
                    0
                }
            }
            _ => 0,
        }
    }

    fn parse_asm_line(&mut self) -> Vec<u8> {
        let mut bytes = vec![];
        loop {
            match self.peek().clone() {
                Token::Addr(v) => {
                    self.advance();
                    bytes.push(v as u8);
                    bytes.push((v >> 8) as u8);
                }
                Token::Number(n) => {
                    self.advance();
                    bytes.push(n as u8);
                }
                Token::Comma => {
                    self.advance();
                }
                Token::Newline | Token::Eof => {
                    self.advance();
                    break;
                }
                _ => break,
            }
        }
        bytes
    }

    fn parse_asm_block(&mut self) -> Vec<u8> {
        let mut bytes = vec![];
        loop {
            match self.peek().clone() {
                Token::RBrace | Token::Eof => {
                    self.advance();
                    break;
                }
                Token::Newline => {
                    self.advance();
                }
                Token::Addr(v) => {
                    self.advance();
                    bytes.push(v as u8);
                    bytes.push((v >> 8) as u8);
                }
                Token::Number(n) => {
                    self.advance();
                    bytes.push(n as u8);
                }
                Token::Comma => {
                    self.advance();
                }
                _ => {
                    self.advance();
                }
            }
        }
        bytes
    }

    fn parse_body(&mut self) -> Vec<Stmt> {
        let mut body = vec![];
        loop {
            self.skip_newlines();
            if matches!(self.peek(), Token::End | Token::Eof) {
                break;
            }
            if let Some(s) = self.parse_stmt() {
                body.push(s);
            }
        }
        if self.peek() == &Token::End {
            self.advance();
        }
        self.expect_newline();
        body
    }

    /// Body of a `case` or `else` arm — stops at `case`, `else`, or `end` (does not consume the stopper).
    fn parse_select_body(&mut self) -> Vec<Stmt> {
        let mut body = vec![];
        loop {
            self.skip_newlines();
            if matches!(
                self.peek(),
                Token::Case | Token::Else | Token::End | Token::Eof
            ) {
                break;
            }
            if let Some(s) = self.parse_stmt() {
                body.push(s);
            }
        }
        body
    }

    /// For loop body: stops at `next` (or `end` for backward compat).
    /// Optionally consumes the loop variable name after `next` (e.g. `next i`).
    fn parse_for_body(&mut self) -> Vec<Stmt> {
        let mut body = vec![];
        loop {
            self.skip_newlines();
            if matches!(self.peek(), Token::Next | Token::End | Token::Eof) {
                break;
            }
            if let Some(s) = self.parse_stmt() {
                body.push(s);
            }
        }
        if matches!(self.peek(), Token::Next | Token::End) {
            self.advance();
        }
        // consume optional loop var after 'next': `next i`
        if let Token::Ident(_) = self.peek().clone() {
            self.advance();
        }
        self.expect_newline();
        body
    }

    fn parse_stmt(&mut self) -> Option<Stmt> {
        self.skip_newlines();
        match self.peek().clone() {
            Token::Inc => {
                self.advance();
                let name = if let Token::Ident(n) = self.advance() {
                    if !self.is_declared(&n) {
                        self.errors.push(format!(
                            "line {}: variable '{}' is not declared (use 'var {}' first)",
                            self.line, n, n
                        ));
                    }
                    n
                } else {
                    return self.reject_stmt("expected variable name after 'inc'");
                };
                self.expect_newline();
                Some(Stmt::Inc(name))
            }
            Token::Dec => {
                self.advance();
                let name = if let Token::Ident(n) = self.advance() {
                    if !self.is_declared(&n) {
                        self.errors.push(format!(
                            "line {}: variable '{}' is not declared (use 'var {}' first)",
                            self.line, n, n
                        ));
                    }
                    n
                } else {
                    return self.reject_stmt("expected variable name after 'dec'");
                };
                self.expect_newline();
                Some(Stmt::Dec(name))
            }
            Token::Screen => {
                self.advance();
                let col = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let row = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let char_expr = self.parse_expr();
                let color_expr = if self.peek() == &Token::Comma {
                    self.advance();
                    Some(self.parse_expr())
                } else {
                    None
                };
                self.expect_newline();
                Some(Stmt::Screen {
                    col,
                    row,
                    char_expr,
                    color_expr,
                })
            }
            Token::Var => {
                self.advance();
                let name = if let Token::Ident(n) = self.advance() {
                    self.declared_vars.insert(n.clone());
                    n
                } else {
                    return None;
                };
                let vtype = if self.peek() == &Token::Colon {
                    self.advance();
                    match self.peek() {
                        Token::Int => {
                            self.advance();
                            Some(VarType::Int)
                        }
                        Token::Str => {
                            self.advance();
                            Some(VarType::Str)
                        }
                        Token::Float => {
                            self.advance();
                            Some(VarType::Float)
                        }
                        Token::Word => {
                            self.advance();
                            Some(VarType::Word)
                        }
                        _ => None,
                    }
                } else {
                    None
                };
                if self.peek() == &Token::Assign {
                    self.advance();
                }
                // array(N) initializer
                if matches!(self.peek(), Token::Array) {
                    self.advance(); // consume 'array'
                    if self.peek() == &Token::LParen {
                        self.advance();
                    }
                    let size = self.parse_expr();
                    if self.peek() == &Token::RParen {
                        self.advance();
                    }
                    self.expect_newline();
                    return Some(Stmt::VarDecl {
                        name,
                        vtype: Some(VarType::Array),
                        expr: size,
                    });
                }
                // array_word(N) initializer — word (16-bit) element array
                if matches!(self.peek(), Token::ArrayWord) {
                    self.advance(); // consume 'array_word'
                    if self.peek() == &Token::LParen {
                        self.advance();
                    }
                    let size = self.parse_expr();
                    if self.peek() == &Token::RParen {
                        self.advance();
                    }
                    self.expect_newline();
                    return Some(Stmt::VarDecl {
                        name,
                        vtype: Some(VarType::WordArray),
                        expr: size,
                    });
                }
                let expr = self.parse_expr();
                self.expect_newline();
                Some(Stmt::VarDecl { name, vtype, expr })
            }
            Token::Ident(name) => {
                self.advance();
                // Skip var-decl check for sub/fn calls: name(...)
                if self.peek() != &Token::LParen && !self.is_declared(&name) {
                    self.errors.push(format!(
                        "line {}: variable '{}' is not declared (use 'var {}' first)",
                        self.line, name, name
                    ));
                }
                if self.peek() == &LBracket {
                    // arr[idx] = val
                    self.advance(); // [
                    let idx = self.parse_expr();
                    if self.peek() == &RBracket {
                        self.advance();
                    } // ]
                    if self.peek() == &Token::Assign {
                        self.advance();
                    } // =
                    let val = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::ArraySet(name, idx, val))
                } else if self.peek() == &Token::PlusEq {
                    self.advance();
                    let rhs = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::Assign(
                        name.clone(),
                        Expr::BinOp(Box::new(Expr::Var(name)), BinOp::Add, Box::new(rhs)),
                    ))
                } else if self.peek() == &Token::MinusEq {
                    self.advance();
                    let rhs = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::Assign(
                        name.clone(),
                        Expr::BinOp(Box::new(Expr::Var(name)), BinOp::Sub, Box::new(rhs)),
                    ))
                } else if self.peek() == &Token::MulEq {
                    self.advance();
                    let rhs = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::Assign(
                        name.clone(),
                        Expr::BinOp(Box::new(Expr::Var(name)), BinOp::Mul, Box::new(rhs)),
                    ))
                } else if self.peek() == &Token::DivEq {
                    self.advance();
                    let rhs = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::Assign(
                        name.clone(),
                        Expr::BinOp(Box::new(Expr::Var(name)), BinOp::Div, Box::new(rhs)),
                    ))
                } else if self.peek() == &Token::And && self.peek2() == &Token::Assign {
                    self.advance();
                    self.advance(); // consume And, Assign
                    let rhs = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::Assign(
                        name.clone(),
                        Expr::BinOp(Box::new(Expr::Var(name)), BinOp::And, Box::new(rhs)),
                    ))
                } else if self.peek() == &Token::Or && self.peek2() == &Token::Assign {
                    self.advance();
                    self.advance();
                    let rhs = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::Assign(
                        name.clone(),
                        Expr::BinOp(Box::new(Expr::Var(name)), BinOp::Or, Box::new(rhs)),
                    ))
                } else if self.peek() == &Token::Xor && self.peek2() == &Token::Assign {
                    self.advance();
                    self.advance();
                    let rhs = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::Assign(
                        name.clone(),
                        Expr::BinOp(Box::new(Expr::Var(name)), BinOp::Xor, Box::new(rhs)),
                    ))
                } else if self.peek() == &Token::Shl && self.peek2() == &Token::Assign {
                    self.advance();
                    self.advance();
                    let rhs = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::Assign(
                        name.clone(),
                        Expr::BinOp(Box::new(Expr::Var(name)), BinOp::Shl, Box::new(rhs)),
                    ))
                } else if self.peek() == &Token::Shr && self.peek2() == &Token::Assign {
                    self.advance();
                    self.advance();
                    let rhs = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::Assign(
                        name.clone(),
                        Expr::BinOp(Box::new(Expr::Var(name)), BinOp::Shr, Box::new(rhs)),
                    ))
                } else if self.peek() == &Token::Assign {
                    self.advance();
                    let expr = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::Assign(name, expr))
                } else if self.peek() == &Token::LParen {
                    // name(arg1, arg2, ...) → Call with args
                    self.advance(); // (
                    let mut args = vec![];
                    while !matches!(self.peek(), Token::RParen | Token::Eof | Token::Newline) {
                        args.push(self.parse_expr());
                        if self.peek() == &Token::Comma {
                            self.advance();
                        }
                    }
                    if self.peek() == &Token::RParen {
                        self.advance();
                    } // )
                    self.expect_newline();
                    Some(Stmt::Call(name, args, self.line))
                } else {
                    self.expect_newline();
                    Some(Stmt::Call(name, vec![], self.line))
                }
            }
            Token::Print => {
                self.advance();
                // `print at col, row, expr...` — position cursor then print
                if self.peek() == &Token::At {
                    self.advance(); // consume 'at'
                    let col = self.parse_expr();
                    if self.peek() == &Token::Comma {
                        self.advance();
                    }
                    let row = self.parse_expr();
                    let mut args = vec![];
                    if self.peek() == &Token::Comma {
                        self.advance();
                        if !matches!(self.peek(), Token::Newline | Token::Eof | Token::Colon) {
                            args.push(self.parse_expr());
                            while self.peek() == &Token::Comma {
                                self.advance();
                                if !matches!(
                                    self.peek(),
                                    Token::Newline | Token::Eof | Token::Colon
                                ) {
                                    args.push(self.parse_expr());
                                }
                            }
                        }
                    }
                    self.expect_newline();
                    return Some(Stmt::PrintAt { col, row, args });
                }
                let mut args = vec![];
                // Collect comma-separated exprs until end of line, colon, or semicolon
                if !matches!(
                    self.peek(),
                    Token::Newline | Token::Eof | Token::Colon | Token::Semicolon
                ) {
                    args.push(self.parse_expr());
                    while self.peek() == &Token::Comma {
                        self.advance();
                        if !matches!(
                            self.peek(),
                            Token::Newline | Token::Eof | Token::Colon | Token::Semicolon
                        ) {
                            args.push(self.parse_expr());
                        }
                    }
                }
                // Consume optional trailing ';' (C64 BASIC print-modifier: suppress newline)
                let no_newline = if self.peek() == &Token::Semicolon {
                    self.advance();
                    true
                } else {
                    false
                };
                self.expect_newline();
                Some(Stmt::Print { args, no_newline })
            }
            Token::If => {
                self.advance();
                let cond = self.parse_expr();
                // consume 'then' if present
                if self.peek() == &Token::Then {
                    self.advance();
                }
                self.expect_newline();
                let mut then_body = vec![];
                let mut else_body: Option<Vec<Stmt>> = None;
                loop {
                    self.skip_newlines();
                    if matches!(self.peek(), Token::End | Token::Else | Token::Eof) {
                        break;
                    }
                    if let Some(s) = self.parse_stmt() {
                        then_body.push(s);
                    }
                }
                if self.peek() == &Token::Else {
                    self.advance();
                    self.expect_newline();
                    let mut eb = vec![];
                    loop {
                        self.skip_newlines();
                        if matches!(self.peek(), Token::End | Token::Eof) {
                            break;
                        }
                        if let Some(s) = self.parse_stmt() {
                            eb.push(s);
                        }
                    }
                    else_body = Some(eb);
                }
                if self.peek() == &Token::End {
                    self.advance();
                }
                self.expect_newline();
                Some(Stmt::If(cond, then_body, else_body))
            }
            Token::For => {
                // for i = expr to expr [step expr]
                //   body
                // next [i]
                self.advance();
                let var = if let Token::Ident(n) = self.advance() {
                    if !self.is_declared(&n) {
                        self.errors.push(format!(
                            "line {}: for-loop variable '{}' is not declared (use 'var {}' first)",
                            self.line, n, n
                        ));
                    }
                    n
                } else {
                    return None;
                };
                if self.peek() == &Token::Assign {
                    self.advance();
                }
                let from = self.parse_expr();
                if self.peek() == &Token::To {
                    self.advance();
                }
                let to = self.parse_expr();
                let step = if self.peek() == &Token::Step {
                    self.advance();
                    Some(self.parse_expr())
                } else {
                    None
                };
                self.expect_newline();
                let body = self.parse_for_body();
                Some(Stmt::ForLoop {
                    var,
                    from,
                    to,
                    step,
                    body,
                })
            }
            Token::Loop => {
                self.advance();
                // loop i = expr to expr [step expr]
                if let Token::Ident(var) = self.peek().clone() {
                    self.advance();
                    if self.peek() == &Token::Assign {
                        if !self.is_declared(&var) {
                            self.errors.push(format!(
                                "line {}: loop variable '{}' is not declared (use 'var {}' first)",
                                self.line, var, var
                            ));
                        }
                        self.advance();
                        let from = self.parse_expr();
                        // expect 'to'
                        if self.peek() == &Token::To {
                            self.advance();
                        }
                        let to = self.parse_expr();
                        let step = if self.peek() == &Token::Step {
                            self.advance();
                            Some(self.parse_expr())
                        } else {
                            None
                        };
                        self.expect_newline();
                        let body = self.parse_body();
                        return Some(Stmt::ForLoop {
                            var,
                            from,
                            to,
                            step,
                            body,
                        });
                    }
                    // fallthrough: treat ident as a statement inside loop 1
                    self.pos -= 1;
                }
                let count = if let Token::Number(n) = self.peek().clone() {
                    self.advance();
                    n.clamp(0, 255) as u8
                } else {
                    0
                }; // 0 = infinite loop
                self.expect_newline();
                let body = self.parse_body();
                Some(Stmt::Loop(count, body))
            }
            Token::While => {
                self.advance();
                let cond = self.parse_expr();
                self.expect_newline();
                let body = self.parse_body();
                Some(Stmt::WhileLoop(cond, body))
            }
            Token::Times => {
                // times N ... end — counted loop (alias for loop N ... end)
                self.advance();
                let count = if let Token::Number(n) = self.peek().clone() {
                    self.advance();
                    n.clamp(0, 255) as u8
                } else {
                    0
                };
                self.expect_newline();
                let body = self.parse_body();
                Some(Stmt::Loop(count, body))
            }
            Token::Break => {
                self.advance();
                self.expect_newline();
                Some(Stmt::Break)
            }
            Token::Continue => {
                self.advance();
                self.expect_newline();
                Some(Stmt::Continue)
            }
            Token::Select => {
                self.advance();
                let expr = self.parse_expr();
                self.expect_newline();
                let mut cases = vec![];
                let mut else_body = None;
                loop {
                    self.skip_newlines();
                    match self.peek().clone() {
                        Token::Case => {
                            self.advance();
                            let val = self.parse_expr();
                            if self.peek() == &Token::Colon {
                                self.advance();
                            }
                            self.skip_newlines();
                            let body = self.parse_select_body();
                            cases.push((val, body));
                        }
                        Token::Else => {
                            self.advance();
                            if self.peek() == &Token::Colon {
                                self.advance();
                            }
                            self.skip_newlines();
                            else_body = Some(self.parse_select_body());
                        }
                        Token::End | Token::Eof => break,
                        _ => break,
                    }
                }
                if self.peek() == &Token::End {
                    self.advance();
                }
                self.expect_newline();
                Some(Stmt::Select {
                    expr,
                    cases,
                    else_body,
                })
            }
            Token::Cls => {
                self.advance();
                let fast = self.peek() == &Token::Fast;
                if fast {
                    self.advance();
                }
                self.expect_newline();
                Some(Stmt::Cls { fast })
            }
            Token::Graphics => {
                self.advance();
                let on = match self.peek() {
                    Token::On => {
                        self.advance();
                        true
                    }
                    Token::Off => {
                        self.advance();
                        false
                    }
                    _ => true,
                };
                let multi = if on && self.peek() == &Token::Multi {
                    self.advance();
                    true
                } else {
                    false
                };
                let block = if on && !multi && self.peek() == &Token::Block {
                    self.advance();
                    true
                } else {
                    false
                };
                // `double` is detected as a plain identifier (not a reserved keyword)
                // so it stays usable as a normal name elsewhere (e.g. fn double()).
                let dbuf = if on && !multi && !block {
                    if let Token::Ident(s) = self.peek() {
                        if s == "double" {
                            self.advance();
                            true
                        } else {
                            false
                        }
                    } else {
                        false
                    }
                } else {
                    false
                };
                self.expect_newline();
                Some(Stmt::Graphics { on, multi, block, dbuf })
            }
            Token::Flip => {
                self.advance();
                self.expect_newline();
                Some(Stmt::Flip)
            }
            Token::Display => {
                self.advance();
                let on = match self.peek() {
                    Token::On => {
                        self.advance();
                        true
                    }
                    Token::Off => {
                        self.advance();
                        false
                    }
                    _ => true,
                };
                self.expect_newline();
                Some(Stmt::Display { on })
            }
            Token::Sys => {
                self.advance();
                let addr = self.parse_addr();
                let arg = if self.peek() == &Token::Comma {
                    self.advance(); // consume ','
                    Some(self.parse_expr())
                } else {
                    None
                };
                self.expect_newline();
                Some(Stmt::Sys { addr, arg })
            }
            Token::IrqExit => {
                self.advance();
                self.expect_newline();
                Some(Stmt::IrqExit)
            }
            Token::Asm => {
                self.advance();
                let bytes = if self.peek() == &Token::LBrace {
                    self.advance(); // consume '{'
                    self.parse_asm_block()
                } else {
                    self.parse_asm_line()
                };
                Some(Stmt::AsmBytes(bytes))
            }
            Token::AsmSource(src, _) => {
                // asm { ... } block: raw source captured by the lexer, assembled at codegen time
                let src = src.clone();
                self.advance();
                Some(Stmt::AsmSource(src))
            }
            Token::NumStr => {
                self.advance();
                let var = if let Token::Ident(n) = self.advance() {
                    n
                } else {
                    return None;
                };
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let addr = self.parse_addr();
                self.expect_newline();
                Some(Stmt::IntToStr { var, addr })
            }
            Token::Color => {
                self.advance();
                // color screen col, row, c — write color byte to $D800 + row*40 + col
                if self.peek() == &Token::Screen {
                    self.advance(); // consume 'screen'
                    let col = self.parse_expr();
                    if self.peek() == &Token::Comma {
                        self.advance();
                    }
                    let row = self.parse_expr();
                    if self.peek() == &Token::Comma {
                        self.advance();
                    }
                    let color = self.parse_expr();
                    self.expect_newline();
                    return Some(Stmt::ColorScreen { col, row, color });
                }
                let target = match self.peek() {
                    Token::Text => {
                        self.advance();
                        ColorTarget::Text
                    }
                    Token::Border => {
                        self.advance();
                        ColorTarget::Border
                    }
                    Token::Bg => {
                        self.advance();
                        ColorTarget::Bg
                    }
                    _ => ColorTarget::Text,
                };
                let expr = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Color { target, expr })
            }
            Token::Sub => {
                self.advance();
                let name = if let Token::Ident(n) = self.advance() {
                    n
                } else {
                    return None;
                };
                // parse optional parameter list: (p1, p2, ...)
                let params = self.parse_param_list();
                // Add sub parameters to declared_vars so they can be used in the body
                for (p, _) in &params {
                    self.declared_vars.insert(p.clone());
                }
                self.expect_newline();
                let mut body = vec![];
                loop {
                    self.skip_newlines();
                    if matches!(self.peek(), Token::End | Token::Eof) {
                        break;
                    }
                    if let Some(s) = self.parse_stmt() {
                        body.push(s);
                    }
                }
                if self.peek() == &Token::End {
                    self.advance();
                }
                self.expect_newline();
                Some(Stmt::SubDef(name, params, body))
            }
            Token::Fn => {
                self.advance();
                let name = if let Token::Ident(n) = self.advance() {
                    n
                } else {
                    return None;
                };
                // parse optional parameter list: (p1, p2, ...)
                let params = self.parse_param_list();
                // Add fn parameters to declared_vars so they can be used in the body
                for (p, _) in &params {
                    self.declared_vars.insert(p.clone());
                }
                // parse optional return type: : type
                let ret_type = if self.peek() == &Token::Colon {
                    self.advance();
                    match self.peek() {
                        Token::Int => { self.advance(); Some(VarType::Int) }
                        Token::Str => { self.advance(); Some(VarType::Str) }
                        Token::Float => { self.advance(); Some(VarType::Float) }
                        Token::Word => { self.advance(); Some(VarType::Word) }
                        _ => None,
                    }
                } else {
                    None
                };
                self.expect_newline();
                let mut body = vec![];
                loop {
                    self.skip_newlines();
                    if matches!(self.peek(), Token::End | Token::Eof) {
                        break;
                    }
                    if let Some(s) = self.parse_stmt() {
                        body.push(s);
                    }
                }
                if self.peek() == &Token::End {
                    self.advance();
                }
                self.expect_newline();
                Some(Stmt::FnDef(name, params, ret_type, body))
            }
            Token::Return => {
                self.advance();
                let expr = if matches!(self.peek(), Token::Newline | Token::Eof | Token::Colon | Token::Else) {
                    None
                } else {
                    Some(self.parse_expr())
                };
                self.expect_newline();
                Some(Stmt::Return(expr))
            }
            Token::Const => {
                self.advance();
                let name = if let Token::Ident(n) = self.advance() {
                    n
                } else {
                    return None;
                };
                if self.peek() == &Token::Assign {
                    self.advance();
                }
                let val = self.parse_expr();
                if let Expr::Number(v) = &val {
                    self.consts.insert(name.clone(), *v);
                }
                self.expect_newline();
                Some(Stmt::Const(name, val))
            }
            Token::Label => {
                self.advance();
                let name = if let Token::Ident(n) = self.advance() {
                    n
                } else {
                    return None;
                };
                self.expect_newline();
                Some(Stmt::Label(name))
            }
            Token::Goto => {
                self.advance();
                let name = if let Token::Ident(n) = self.advance() {
                    n
                } else {
                    return None;
                };
                let line = self.line;
                self.expect_newline();
                Some(Stmt::Goto(name, line))
            }
            Token::Gosub => {
                self.advance();
                let name = if let Token::Ident(n) = self.advance() {
                    n
                } else {
                    return None;
                };
                let line = self.line;
                self.expect_newline();
                Some(Stmt::Gosub(name, line))
            }
            Token::Chardef => {
                self.advance();
                let id = match self.parse_expr() {
                    Expr::Number(n) => n as u8,
                    _ => panic!("chardef: id must be a constant"),
                };
                self.expect_newline();
                // bytes: newline-separated / comma-separated constants until 'end'
                let mut bytes: Vec<u8> = Vec::new();
                loop {
                    while self.peek() == &Token::Newline {
                        self.advance();
                    }
                    if self.peek() == &Token::End {
                        self.advance();
                        break;
                    }
                    match self.parse_expr() {
                        Expr::Number(n) => bytes.push(n as u8),
                        _ => panic!("chardef: byte values must be constants"),
                    }
                    if self.peek() == &Token::Comma {
                        self.advance();
                    }
                }
                self.expect_newline();
                Some(Stmt::Chardef { id, bytes })
            }
            Token::Charset => {
                self.advance();
                let addr = match self.parse_expr() {
                    Expr::Number(n) => n as u16,
                    _ => panic!("charset: address must be a constant"),
                };
                self.expect_newline();
                Some(Stmt::CharsetBase(addr))
            }
            Token::SpriteFrame => {
                self.advance();
                let id = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let addr = self.parse_expr();
                self.expect_newline();
                Some(Stmt::SpriteFrame { id, addr })
            }
            Token::Mplot => {
                self.advance();
                let x = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let y = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let color = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Mplot { x, y, color })
            }
            Token::Music => {
                self.advance();
                match self.peek().clone() {
                    Token::Play => {
                        self.advance();
                        let song = match self.peek() {
                            Token::Newline | Token::Eof => Expr::Number(0),
                            _ => self.parse_expr(),
                        };
                        self.expect_newline();
                        Some(Stmt::MusicPlay(song))
                    }
                    Token::Stop => {
                        self.advance();
                        self.expect_newline();
                        Some(Stmt::MusicStop)
                    }
                    Token::Pause => {
                        self.advance();
                        self.expect_newline();
                        Some(Stmt::MusicPause)
                    }
                    Token::Resume => {
                        self.advance();
                        self.expect_newline();
                        Some(Stmt::MusicResume)
                    }
                    _ => {
                        self.expect_newline();
                        None
                    }
                }
            }
            Token::OnErr => {
                self.advance();
                // Optional 'goto' keyword
                if self.peek() == &Token::Goto {
                    self.advance();
                }
                let name = if let Token::Ident(n) = self.advance() {
                    n
                } else {
                    return None;
                };
                let line = self.line;
                self.expect_newline();
                Some(Stmt::OnErrGoto(name, line))
            }
            Token::Poke => {
                self.advance();
                let addr = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let val = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Poke(addr, val))
            }
            Token::Poke16 => {
                self.advance();
                let addr = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let val = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Poke16(addr, val))
            }
            Token::Open => {
                self.advance();
                let channel = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let device = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let secondary = self.parse_expr();
                let filename = if self.peek() == &Token::Comma {
                    self.advance();
                    if let Token::StringLit(s) = self.peek().clone() {
                        self.advance();
                        Some(s)
                    } else {
                        None
                    }
                } else {
                    None
                };
                self.expect_newline();
                Some(Stmt::Open {
                    channel,
                    device,
                    secondary,
                    filename,
                })
            }
            Token::Close => {
                self.advance();
                let channel = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Close(channel))
            }
            Token::PrintHash => {
                self.advance();
                let channel = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let mut args = vec![];
                if !matches!(self.peek(), Token::Newline | Token::Eof | Token::Colon) {
                    args.push(self.parse_expr());
                    while self.peek() == &Token::Comma {
                        self.advance();
                        if !matches!(self.peek(), Token::Newline | Token::Eof | Token::Colon) {
                            args.push(self.parse_expr());
                        }
                    }
                }
                self.expect_newline();
                Some(Stmt::PrintHash { channel, args })
            }
            Token::Rect => {
                self.advance();
                let mode = if matches!(self.peek(), Token::Erase) {
                    self.advance();
                    1u8
                } else if matches!(self.peek(), Token::Xor) {
                    self.advance();
                    2u8
                } else {
                    0u8
                };
                let x1 = self.parse_expr();
                if self.peek() == &Token::Comma { self.advance(); }
                let y1 = self.parse_expr();
                if self.peek() == &Token::Comma { self.advance(); }
                let x2 = self.parse_expr();
                if self.peek() == &Token::Comma { self.advance(); }
                let y2 = self.parse_expr();
                self.expect_newline();
                Some(match mode {
                    1 => Stmt::RectErase(x1, y1, x2, y2),
                    2 => Stmt::RectXor(x1, y1, x2, y2),
                    _ => Stmt::Rect(x1, y1, x2, y2),
                })
            }
            Token::Plot => {
                self.advance();
                if matches!(self.peek(), Token::Erase) {
                    self.advance();
                    let x = self.parse_expr();
                    if self.peek() == &Token::Comma {
                        self.advance();
                    }
                    let y = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::PlotErase(x, y))
                } else if matches!(self.peek(), Token::Xor) {
                    self.advance();
                    let x = self.parse_expr();
                    if self.peek() == &Token::Comma {
                        self.advance();
                    }
                    let y = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::PlotXor(x, y))
                } else {
                    let x = self.parse_expr();
                    if self.peek() == &Token::Comma {
                        self.advance();
                    }
                    let y = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::Plot(x, y))
                }
            }
            Token::Plot4 => {
                self.advance();
                if matches!(self.peek(), Token::Erase) {
                    self.advance();
                    let x = self.parse_expr();
                    if self.peek() == &Token::Comma {
                        self.advance();
                    }
                    let y = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::Plot4Erase(x, y))
                } else {
                    let x = self.parse_expr();
                    if self.peek() == &Token::Comma {
                        self.advance();
                    }
                    let y = self.parse_expr();
                    self.expect_newline();
                    Some(Stmt::Plot4(x, y))
                }
            }
            Token::Paint => {
                self.advance();
                let x = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let y = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Paint(x, y))
            }
            Token::Circle => {
                self.advance();
                let x = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let y = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let radius = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Circle { x, y, radius })
            }
            Token::Circle4 => {
                self.advance();
                let x = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let y = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let radius = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Circle4 { x, y, radius })
            }
            Token::Line => {
                self.advance();
                let mode = if matches!(self.peek(), Token::Erase) {
                    self.advance();
                    1u8
                } else if matches!(self.peek(), Token::Xor) {
                    self.advance();
                    2u8
                } else {
                    0u8
                };
                let x1 = self.parse_expr();
                if self.peek() == &Token::Comma { self.advance(); }
                let y1 = self.parse_expr();
                if self.peek() == &Token::Comma { self.advance(); }
                let x2 = self.parse_expr();
                if self.peek() == &Token::Comma { self.advance(); }
                let y2 = self.parse_expr();
                self.expect_newline();
                Some(match mode {
                    1 => Stmt::LineErase { x1, y1, x2, y2 },
                    2 => Stmt::LineXor   { x1, y1, x2, y2 },
                    _ => Stmt::Line      { x1, y1, x2, y2 },
                })
            }
            Token::Gcls => {
                self.advance();
                self.expect_newline();
                Some(Stmt::Gcls)
            }
            Token::Bye => {
                self.advance();
                self.expect_newline();
                Some(Stmt::Bye)
            }
            Token::Incbin => {
                self.advance();
                if let Token::StringLit(path) = self.peek().clone() {
                    self.advance();
                    self.expect_newline();
                    Some(Stmt::Incbin(path))
                } else {
                    self.expect_newline();
                    None
                }
            }
            Token::Sid => {
                self.advance();
                match self.peek().clone() {
                    Token::Volume => {
                        self.advance();
                        let expr = self.parse_expr();
                        self.expect_newline();
                        Some(Stmt::SidVolume(expr))
                    }
                    Token::Ident(ref s) if s == "stop" => {
                        self.advance();
                        self.expect_newline();
                        Some(Stmt::SidStop)
                    }
                    Token::Stop => {
                        self.advance();
                        self.expect_newline();
                        Some(Stmt::SidStop)
                    }
                    _ => {
                        self.errors
                            .push("sid: expected 'volume N' or 'stop'".to_string());
                        self.expect_newline();
                        None
                    }
                }
            }
            Token::Load => {
                self.advance();
                // `load sid "filename.sid"` — embed SID music at native load address
                if self.peek() == &Token::Sid {
                    self.advance(); // consume 'sid'
                    let filename = if let Token::StringLit(s) = self.peek().clone() {
                        self.advance();
                        s
                    } else {
                        self.errors
                            .push("load sid: expected a filename string".to_string());
                        self.expect_newline();
                        return None;
                    };
                    // Optional: load sid "file.sid", $2000  — override the SID header's load address
                    let override_addr: Option<u16> = if self.peek() == &Token::Comma {
                        self.advance();
                        Some(self.parse_addr())
                    } else {
                        None
                    };
                    self.expect_newline();
                    return self.parse_load_sid(&filename, override_addr);
                }
                let filename = if let Token::StringLit(s) = self.peek().clone() {
                    self.advance();
                    s
                } else {
                    String::new()
                };
                let addr = if self.peek() == &Token::Comma {
                    self.advance();
                    Some(self.parse_expr())
                } else {
                    None
                };
                self.expect_newline();
                Some(Stmt::Load { filename, addr })
            }
            Token::Save => {
                self.advance();
                let filename = if let Token::StringLit(s) = self.peek().clone() {
                    self.advance();
                    s
                } else {
                    String::new()
                };
                let (addr, len) = if self.peek() == &Token::Comma {
                    self.advance();
                    let a = self.parse_expr();
                    if self.peek() == &Token::Comma {
                        self.advance();
                    }
                    let l = self.parse_expr();
                    (Some(a), Some(l))
                } else {
                    (None, None)
                };
                self.expect_newline();
                Some(Stmt::Save {
                    filename,
                    addr,
                    len,
                })
            }
            Token::Cursor => {
                self.advance();
                let x = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let y = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Cursor { x, y })
            }
            Token::Repeat => {
                self.advance();
                self.expect_newline();
                self.skip_newlines();
                let mut body = vec![];
                while !matches!(self.peek(), Token::Until | Token::Eof) {
                    if let Some(s) = self.parse_stmt() {
                        body.push(s);
                    }
                    self.skip_newlines();
                }
                if matches!(self.peek(), Token::Until) {
                    self.advance();
                }
                let cond = self.parse_expr();
                self.expect_newline();
                Some(Stmt::RepeatLoop(body, cond))
            }
            Token::Input => {
                self.advance();
                // optional string prompt followed by comma
                let prompt = if let Token::StringLit(s) = self.peek().clone() {
                    self.advance();
                    if self.peek() == &Token::Comma {
                        self.advance();
                    }
                    Some(s)
                } else {
                    None
                };
                let var = if let Token::Ident(name) = self.peek().clone() {
                    self.advance();
                    if !self.is_declared(&name) {
                        self.errors.push(format!(
                            "line {}: variable '{}' is not declared (use 'var {}' first)",
                            self.line, name, name
                        ));
                    }
                    name
                } else {
                    String::new()
                };
                self.expect_newline();
                Some(Stmt::Input { prompt, var })
            }
            Token::Fill => {
                self.advance();
                // fill screen val — fill screen RAM $0400-$07FF with val
                if self.peek() == &Token::Screen {
                    self.advance();
                    let val = self.parse_expr();
                    self.expect_newline();
                    return Some(Stmt::FillScreen(val));
                }
                // fill color val — fill color RAM $D800-$DBFF with val
                if self.peek() == &Token::Color {
                    self.advance();
                    let val = self.parse_expr();
                    self.expect_newline();
                    return Some(Stmt::FillColor(val));
                }
                let addr = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let len = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let val = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Fill { addr, len, val })
            }
            Token::Memcopy => {
                self.advance();
                let src = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let dst = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let len = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Memcopy { src, dst, len })
            }
            Token::DrawMem => {
                self.advance();
                let src = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let dst = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let width = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let height = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let stride = self.parse_expr();
                self.expect_newline();
                Some(Stmt::DrawMem {
                    src,
                    dst,
                    width,
                    height,
                    stride,
                })
            }
            Token::Irq => {
                self.advance();
                self.skip_var_check = true;
                let handler = self.parse_expr();
                self.skip_var_check = false;
                let line = if self.peek() == &Token::Comma {
                    self.advance();
                    Some(self.parse_expr())
                } else {
                    None
                };
                self.expect_newline();
                Some(Stmt::Irq { handler, line })
            }
            Token::Nmi => {
                self.advance();
                self.skip_var_check = true;
                let handler = self.parse_expr();
                self.skip_var_check = false;
                self.expect_newline();
                Some(Stmt::Nmi { handler })
            }
            Token::NmiExit => {
                self.advance();
                self.expect_newline();
                Some(Stmt::NmiExit)
            }
            Token::CiaTimer => {
                self.advance();
                let period = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                self.skip_var_check = true;
                let handler = self.parse_expr();
                self.skip_var_check = false;
                self.expect_newline();
                Some(Stmt::CiaTimer { period, handler })
            }
            Token::Scroll => {
                self.advance();
                if let Token::Ident(ref s) = self.peek().clone() {
                    if s == "row" {
                        self.advance();
                        let row = self.parse_expr();
                        let dir = match self.peek().clone() {
                            Token::Ident(ref d) if d == "left" => {
                                self.advance();
                                "left"
                            }
                            Token::Ident(ref d) if d == "right" => {
                                self.advance();
                                "right"
                            }
                            _ => "left",
                        };
                        self.expect_newline();
                        if dir == "left" {
                            return Some(Stmt::ScrollRowLeft(row));
                        }
                        return self.reject_stmt("scroll row currently supports only 'left'");
                    }
                }
                // next token is 'x' or 'y' as Ident
                let dir = match self.peek().clone() {
                    Token::Ident(ref s) if s == "x" => {
                        self.advance();
                        'x'
                    }
                    Token::Ident(ref s) if s == "y" => {
                        self.advance();
                        'y'
                    }
                    _ => 'x', // default
                };
                let val = self.parse_expr();
                let mode = match self.peek().clone() {
                    Token::Ident(ref s) if s == "narrow" => {
                        self.advance();
                        Some(false)
                    }
                    Token::Ident(ref s) if s == "wide" => {
                        self.advance();
                        Some(true)
                    }
                    _ => None,
                };
                self.expect_newline();
                if dir == 'x' {
                    if let Some(wide) = mode {
                        Some(Stmt::ScrollXMode { value: val, wide })
                    } else {
                        Some(Stmt::ScrollX(val))
                    }
                } else {
                    Some(Stmt::ScrollY(val))
                }
            }
            Token::Speed => {
                self.advance();
                // speed max  → index 15 (fastest)
                // speed off  → index 0 (1 MHz, = off turbo)
                // speed N    → N in MHz for constants; raw index for variables
                let expr = match self.peek() {
                    Token::Max => {
                        self.advance();
                        Expr::Number(48)
                    } // 48+ MHz → index 15
                    Token::Off => {
                        self.advance();
                        Expr::Number(0)
                    } // 0 MHz → index 0 (1 MHz)
                    _ => self.parse_expr(),
                };
                self.expect_newline();
                Some(Stmt::Speed(expr))
            }
            Token::Badlines => {
                self.advance();
                let on = match self.peek() {
                    Token::On => {
                        self.advance();
                        true
                    }
                    Token::Off => {
                        self.advance();
                        false
                    }
                    _ => true,
                };
                self.expect_newline();
                Some(Stmt::Badlines(on))
            }
            Token::Lowercase => {
                self.advance();
                self.expect_newline();
                Some(Stmt::Lowercase)
            }
            Token::Uppercase => {
                self.advance();
                self.expect_newline();
                Some(Stmt::Uppercase)
            }
            Token::Data => {
                self.advance();
                let mut items = vec![];
                loop {
                    match self.peek().clone() {
                        Token::Number(n) => {
                            self.advance();
                            items.push(Expr::Number(n));
                        }
                        Token::Addr(n) => {
                            self.advance();
                            items.push(Expr::Number(n as i16));
                        }
                        Token::Comma => {
                            self.advance();
                        }
                        Token::Newline | Token::Eof => break,
                        _ => break,
                    }
                }
                self.expect_newline();
                Some(Stmt::Data(items))
            }
            Token::Read => {
                self.advance();
                if let Token::Ident(name) = self.peek().clone() {
                    self.advance();
                    if !self.is_declared(&name) {
                        self.errors.push(format!(
                            "line {}: variable '{}' is not declared (use 'var {}' first)",
                            self.line, name, name
                        ));
                    }
                    self.expect_newline();
                    Some(Stmt::Read(name))
                } else {
                    self.expect_newline();
                    None
                }
            }
            Token::Wait => {
                self.advance();
                // wait key — blocking wait until a key is pressed (KERNAL $FFE4 loop)
                if let Token::Ident(k) = self.peek().clone() {
                    if k == "key" {
                        self.advance(); // consume 'key'
                        self.expect_newline();
                        return Some(Stmt::WaitGetch);
                    }
                }
                let raster_target = matches!(self.peek(), Token::Raster);
                if raster_target {
                    self.advance();
                } // consume 'raster'
                let value = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Wait {
                    raster_target,
                    value,
                })
            }
            Token::Delay => {
                self.advance();
                let value = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Delay(value))
            }
            Token::Sound => {
                self.advance();
                let channel = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let freq = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let duration = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Sound {
                    channel,
                    freq,
                    duration,
                })
            }
            Token::Sprite => {
                self.advance();
                match self.peek() {
                    Token::On => {
                        self.advance();
                        let id = self.parse_expr();
                        self.expect_newline();
                        Some(Stmt::SpriteOn { id })
                    }
                    Token::Off => {
                        self.advance();
                        let id = self.parse_expr();
                        self.expect_newline();
                        Some(Stmt::SpriteOff { id })
                    }
                    Token::Color => {
                        self.advance();
                        let id = self.parse_expr();
                        if self.peek() == &Token::Comma {
                            self.advance();
                        }
                        let color = self.parse_expr();
                        self.expect_newline();
                        Some(Stmt::SpriteColor { id, color })
                    }
                    Token::Multi => {
                        self.advance();
                        let id = self.parse_expr();
                        if self.peek() == &Token::Comma {
                            self.advance();
                        }
                        let on = matches!(self.advance(), Token::On);
                        self.expect_newline();
                        Some(Stmt::SpriteMulticolor { id, on })
                    }
                    Token::Expand => {
                        self.advance();
                        // next token: ident "x" or "y"
                        let axis_x = match self.advance() {
                            Token::Ident(s) => s.to_lowercase() == "x",
                            _ => true, // default to x on unexpected token
                        };
                        let id = self.parse_expr();
                        if self.peek() == &Token::Comma {
                            self.advance();
                        }
                        let on = matches!(self.advance(), Token::On);
                        self.expect_newline();
                        if axis_x {
                            Some(Stmt::SpriteExpandX { id, on })
                        } else {
                            Some(Stmt::SpriteExpandY { id, on })
                        }
                    }
                    Token::Priority => {
                        self.advance();
                        let id = self.parse_expr();
                        if self.peek() == &Token::Comma {
                            self.advance();
                        }
                        let on = matches!(self.advance(), Token::On);
                        self.expect_newline();
                        Some(Stmt::SpritePriority { id, on })
                    }
                    _ => {
                        let id = self.parse_expr();
                        if self.peek() == &Token::Comma {
                            self.advance();
                        }
                        let x = self.parse_expr();
                        if self.peek() == &Token::Comma {
                            self.advance();
                        }
                        let y = self.parse_expr();
                        let data_addr = if self.peek() == &Token::Comma {
                            self.advance();
                            Some(self.parse_expr())
                        } else {
                            None
                        };
                        self.expect_newline();
                        Some(Stmt::Sprite {
                            id,
                            x,
                            y,
                            data_addr,
                        })
                    }
                }
            }
            Token::Sprdef => {
                self.advance();
                let id = match self.parse_expr() {
                    Expr::Number(n) => n as u8,
                    _ => panic!("sprdef: id must be a constant"),
                };
                self.expect_newline();
                // bytes: newline-separated rows, comma-separated within rows, until 'end'
                let mut bytes: Vec<u8> = Vec::new();
                loop {
                    while self.peek() == &Token::Newline {
                        self.advance();
                    }
                    if self.peek() == &Token::End {
                        self.advance();
                        break;
                    }
                    match self.parse_expr() {
                        Expr::Number(n) => bytes.push(n as u8),
                        _ => panic!("sprdef: byte values must be constants"),
                    }
                    if self.peek() == &Token::Comma {
                        self.advance();
                    }
                }
                self.expect_newline();
                Some(Stmt::SpriteDef { id, bytes })
            }
            Token::Reu => {
                self.advance();
                // parse op: stash / fetch / swap
                let op = match self.advance() {
                    Token::Stash => crate::compiler::ast::ReuOp::Stash,
                    Token::Fetch => crate::compiler::ast::ReuOp::Fetch,
                    _ => crate::compiler::ast::ReuOp::Swap,
                };
                let c64_addr = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let reu_bank = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let reu_addr = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let length = self.parse_expr();
                self.expect_newline();
                Some(Stmt::Reu {
                    op,
                    c64_addr,
                    reu_bank,
                    reu_addr,
                    length,
                })
            }
            Token::Waitkey => {
                self.advance();
                if self.peek() == &Token::LParen {
                    self.advance();
                } // skip (
                if self.peek() == &Token::RParen {
                    self.advance();
                } // skip )
                self.expect_newline();
                Some(Stmt::WaitKey)
            }
            Token::Call => {
                self.advance();
                let name = if let Token::Ident(n) = self.advance() {
                    n
                } else {
                    return None;
                };
                let mut args = vec![];
                if self.peek() == &Token::LParen {
                    self.advance(); // (
                    while !matches!(self.peek(), Token::RParen | Token::Eof | Token::Newline) {
                        args.push(self.parse_expr());
                        if self.peek() == &Token::Comma {
                            self.advance();
                        }
                    }
                    if self.peek() == &Token::RParen {
                        self.advance();
                    } // )
                }
                self.expect_newline();
                Some(Stmt::Call(name, args, self.line))
            }
            _ => {
                let tok = self.advance();
                self.errors.push(format!(
                    "line {}: unexpected {}",
                    self.line,
                    token_label(&tok)
                ));
                while !matches!(self.peek(), Token::Newline | Token::Eof) {
                    self.advance();
                }
                self.expect_newline();
                None
            }
        }
    }

    fn parse_expr(&mut self) -> Expr {
        let e = self.parse_or();
        fold_const_expr(e)
    }

    fn parse_or(&mut self) -> Expr {
        let mut left = self.parse_and();
        loop {
            let op = match self.peek() {
                Token::Or => BinOp::Or,
                Token::Xor => BinOp::Xor,
                _ => break,
            };
            self.advance();
            let right = self.parse_and();
            left = Expr::BinOp(Box::new(left), op, Box::new(right));
        }
        left
    }

    fn parse_and(&mut self) -> Expr {
        let mut left = self.parse_shift();
        loop {
            if matches!(self.peek(), Token::And) {
                self.advance();
                let right = self.parse_shift();
                left = Expr::BinOp(Box::new(left), BinOp::And, Box::new(right));
            } else {
                break;
            }
        }
        left
    }

    fn parse_shift(&mut self) -> Expr {
        let mut left = self.parse_unary();
        loop {
            let op = match self.peek() {
                Token::Shl => BinOp::Shl,
                Token::Shr => BinOp::Shr,
                _ => break,
            };
            self.advance();
            let right = self.parse_unary();
            left = Expr::BinOp(Box::new(left), op, Box::new(right));
        }
        left
    }

    fn parse_unary(&mut self) -> Expr {
        if matches!(self.peek(), Token::Not) {
            self.advance();
            return Expr::Not(Box::new(self.parse_unary()));
        }
        if matches!(self.peek(), Token::Minus) {
            self.advance();
            let inner = self.parse_unary();
            // Fold constant negative literals at parse time
            if let Expr::Number(n) = inner {
                return Expr::Number(n.wrapping_neg());
            }
            return Expr::BinOp(Box::new(Expr::Number(0)), BinOp::Sub, Box::new(inner));
        }
        self.parse_comparison()
    }

    fn parse_comparison(&mut self) -> Expr {
        let mut left = self.parse_additive();
        loop {
            let op = match self.peek() {
                Token::Eq => BinOp::Eq,
                Token::NotEq => BinOp::NotEq,
                Token::Lt => BinOp::Lt,
                Token::Gt => BinOp::Gt,
                Token::LtEq => BinOp::LtEq,
                Token::GtEq => BinOp::GtEq,
                _ => break,
            };
            self.advance();
            let right = self.parse_additive();
            left = Expr::BinOp(Box::new(left), op, Box::new(right));
        }
        left
    }

    fn parse_additive(&mut self) -> Expr {
        let mut left = self.parse_multiplicative();
        loop {
            let op = match self.peek() {
                Token::Plus => BinOp::Add,
                Token::Minus => BinOp::Sub,
                _ => break,
            };
            self.advance();
            let right = self.parse_multiplicative();
            // Compile-time string concatenation: "A" + "B" → "AB"
            if let (Expr::StringLit(a), BinOp::Add, Expr::StringLit(b)) = (&left, &op, &right) {
                left = Expr::StringLit(a.clone() + b);
            } else {
                left = Expr::BinOp(Box::new(left), op, Box::new(right));
            }
        }
        left
    }

    fn parse_multiplicative(&mut self) -> Expr {
        let mut left = self.parse_primary();
        loop {
            let op = match self.peek() {
                Token::Star => BinOp::Mul,
                Token::Slash => BinOp::Div,
                Token::Mod => BinOp::Mod,
                _ => break,
            };
            self.advance();
            let right = self.parse_primary();
            left = Expr::BinOp(Box::new(left), op, Box::new(right));
        }
        left
    }

    fn parse_primary(&mut self) -> Expr {
        match self.advance() {
            Token::Number(n) => Expr::Number(n),
            Token::Addr(a) => Expr::Number(a as i16),
            Token::FixedLit(v) => Expr::FixedLit(v),
            Token::StringLit(s) => Expr::StringLit(s),
            Token::Int => {
                // int(expr) — extract integer part (hi byte) of a float variable
                if self.peek() == &Token::LParen {
                    self.advance(); // consume '('
                    let e = self.parse_expr();
                    if self.peek() == &Token::RParen {
                        self.advance();
                    }
                    Expr::FixedToInt(Box::new(e))
                } else {
                    Expr::Number(0) // 'int' without '(' in expression context is a no-op
                }
            }
            Token::Ident(n) => {
                if let Some(&v) = self.consts.get(&n) {
                    Expr::Number(v)
                } else if self.peek() == &LBracket {
                    // arr[idx] expression
                    if !self.skip_var_check && !self.is_declared(&n) {
                        self.errors.push(format!(
                            "line {}: variable '{}' is not declared (use 'var {}' first)",
                            self.line, n, n
                        ));
                    }
                    self.advance(); // [
                    let idx = self.parse_expr();
                    if self.peek() == &RBracket {
                        self.advance();
                    } // ]
                    Expr::ArrayGet(n, Box::new(idx))
                } else if self.peek() == &Token::LParen {
                    // fn_call(args) expression — n is a function name, not a variable
                    self.advance(); // (
                    let mut args = vec![];
                    while !matches!(self.peek(), Token::RParen | Token::Eof | Token::Newline) {
                        args.push(self.parse_expr());
                        if self.peek() == &Token::Comma {
                            self.advance();
                        }
                    }
                    if self.peek() == &Token::RParen {
                        self.advance();
                    } // )
                    Expr::FnCall(n, args)
                } else {
                    if !self.skip_var_check && !self.is_declared(&n) {
                        self.errors.push(format!(
                            "line {}: variable '{}' is not declared (use 'var {}' first)",
                            self.line, n, n
                        ));
                    }
                    Expr::Var(n)
                }
            }
            Token::StrToInt => {
                // str_to_int("123") — compile-time conversion
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let val = if let Token::StringLit(s) = self.advance() {
                    s.trim().parse::<i16>().unwrap_or(0)
                } else {
                    0
                };
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Number(val)
            }
            Token::LParen => {
                let e = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                e
            }
            Token::Getch => {
                if self.peek() == &Token::LParen {
                    self.advance();
                } // skip (
                if self.peek() == &Token::RParen {
                    self.advance();
                } // skip )
                Expr::Getch
            }
            Token::Inkey => {
                if self.peek() == &Token::LParen {
                    self.advance();
                } // skip (
                if self.peek() == &Token::RParen {
                    self.advance();
                } // skip )
                Expr::Inkey
            }
            Token::Waitkey => {
                if self.peek() == &Token::LParen {
                    self.advance();
                } // skip (
                if self.peek() == &Token::RParen {
                    self.advance();
                } // skip )
                Expr::Waitkey
            }
            Token::StrLen => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let arg = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::StrLen(Box::new(arg))
            }
            Token::Asc => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let arg = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Asc(Box::new(arg))
            }
            Token::ReuDet => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::ReuPresent
            }
            Token::Turbo => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Turbo
            }
            Token::SpriteHit => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::SpriteHit
            }
            Token::SpriteBgHit => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::SpriteBgHit
            }
            Token::SpriteX => {
                // sprite_x(id) — read sprite X position: $D000 + id*2
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let id = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::SpriteX(Box::new(id))
            }
            Token::SpriteY => {
                // sprite_y(id) — read sprite Y position: $D001 + id*2
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let id = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::SpriteY(Box::new(id))
            }
            Token::Joy => {
                if self.peek() == &Token::LParen {
                    self.advance();
                } // skip (
                let port = match self.advance() {
                    Token::Number(1) => 1u8,
                    Token::Number(2) => 2u8,
                    _ => 2u8, // default to port 2
                };
                if self.peek() == &Token::RParen {
                    self.advance();
                } // skip )
                Expr::Joy(port)
            }
            Token::MouseX => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::MouseX
            }
            Token::MouseXHi => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::MouseXHi
            }
            Token::MouseY => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::MouseY
            }
            Token::MouseBtn => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::MouseBtn
            }
            Token::Peek => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let arg = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Peek(Box::new(arg))
            }
            Token::Peek16 => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let arg = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Peek16(Box::new(arg))
            }
            Token::Rnd => {
                if self.peek() == &Token::LParen {
                    self.advance(); // consume '('
                    if self.peek() == &Token::RParen {
                        self.advance(); // consume ')' — empty rnd()
                        Expr::Rnd
                    } else {
                        let n = self.parse_expr();
                        if self.peek() == &Token::RParen {
                            self.advance();
                        }
                        Expr::RndN(Box::new(n))
                    }
                } else {
                    Expr::Rnd
                }
            }
            Token::Abs => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let arg = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Abs(Box::new(arg))
            }
            Token::Min => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let a = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let b = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Min(Box::new(a), Box::new(b))
            }
            Token::Max => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let a = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let b = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Max(Box::new(a), Box::new(b))
            }
            Token::Bnot => {
                // bnot x — bitwise NOT: x XOR 255 (complement all 8 bits)
                let e = self.parse_primary();
                Expr::BinOp(Box::new(e), BinOp::Xor, Box::new(Expr::Number(255)))
            }
            Token::Clamp => {
                // clamp(val, lo, hi) — clamp val to [lo, hi] range (8-bit unsigned)
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let val = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let lo = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let hi = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Clamp(Box::new(val), Box::new(lo), Box::new(hi))
            }
            Token::Sgn => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let arg = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Sgn(Box::new(arg))
            }
            Token::Chr => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let arg = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::ChrStr(Box::new(arg))
            }
            Token::StrN => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let arg = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::StrN(Box::new(arg))
            }
            Token::Sin => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let arg = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Sin(Box::new(arg))
            }
            Token::Cos => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let arg = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Cos(Box::new(arg))
            }
            Token::Hex => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let arg = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::HexFmt(Box::new(arg))
            }
            Token::Bin => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let arg = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::BinFmt(Box::new(arg))
            }
            Token::Spc => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let n = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Spc(Box::new(n))
            }
            Token::Tab => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let n = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Tab(Box::new(n))
            }
            Token::Val => {
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let arg = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::Val(Box::new(arg))
            }
            Token::Dec => {
                // dec(n, width) — right-justified decimal in print context
                if self.peek() == &Token::LParen {
                    self.advance();
                }
                let n = self.parse_expr();
                if self.peek() == &Token::Comma {
                    self.advance();
                }
                let width = self.parse_expr();
                if self.peek() == &Token::RParen {
                    self.advance();
                }
                Expr::DecFmt(Box::new(n), Box::new(width))
            }
            _ => Expr::Number(0),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::super::lexer::Lexer;
    use super::*;

    fn parse(src: &str) -> Vec<Stmt> {
        let tokens = Lexer::new(src).tokenize();
        Parser::new(tokens).parse()
    }

    fn first_expr(src: &str) -> Expr {
        let tokens = Lexer::new(src).tokenize();
        let mut p = Parser::new(tokens);
        p.parse_expr()
    }

    // ── Variable declarations ────────────────────────────────────────────

    #[test]
    fn var_decl_simple() {
        let stmts = parse("var x = 5");
        assert!(matches!(&stmts[0], Stmt::VarDecl { name, vtype: None, .. } if name == "x"));
    }

    #[test]
    fn var_decl_with_type() {
        let stmts = parse("var x: int = 5");
        if let Stmt::VarDecl { name, vtype, .. } = &stmts[0] {
            assert_eq!(name, "x");
            assert!(matches!(vtype, Some(VarType::Int)));
        } else {
            panic!("Expected VarDecl");
        }
    }

    #[test]
    fn var_decl_string_type() {
        let stmts = parse("var s: string = \"hi\"");
        if let Stmt::VarDecl { name, vtype, .. } = &stmts[0] {
            assert_eq!(name, "s");
            assert!(matches!(vtype, Some(VarType::Str)));
        } else {
            panic!("Expected VarDecl");
        }
    }

    #[test]
    fn var_decl_float_type() {
        let stmts = parse("var f: float = 3");
        if let Stmt::VarDecl { name, vtype, .. } = &stmts[0] {
            assert_eq!(name, "f");
            assert!(matches!(vtype, Some(VarType::Float)));
        } else {
            panic!("Expected VarDecl");
        }
    }

    // ── Assignments ──────────────────────────────────────────────────────

    #[test]
    fn assign_statement() {
        let stmts = parse("x = 5");
        assert!(matches!(&stmts[0], Stmt::Assign(name, ..) if name == "x"));
    }

    // ── Expressions ──────────────────────────────────────────────────────

    #[test]
    fn expr_number() {
        assert!(matches!(first_expr("42"), Expr::Number(42)));
    }

    #[test]
    fn expr_var() {
        assert!(matches!(first_expr("myvar"), Expr::Var(n) if n == "myvar"));
    }

    #[test]
    fn expr_string() {
        assert!(matches!(first_expr("\"hello\""), Expr::StringLit(s) if s == "hello"));
    }

    #[test]
    fn expr_add() {
        // 1 + 2 is folded at parse time to Number(3)
        let e = first_expr("1 + 2");
        assert!(matches!(e, Expr::Number(3)));
    }

    #[test]
    fn string_concat_folds() {
        // "Hello " + "World" → single StringLit at parse time
        let e = first_expr("\"Hello \" + \"World\"");
        assert!(matches!(e, Expr::StringLit(s) if s == "Hello World"));
    }

    #[test]
    fn string_concat_triple() {
        let e = first_expr("\"A\" + \"B\" + \"C\"");
        assert!(matches!(e, Expr::StringLit(s) if s == "ABC"));
    }

    #[test]
    fn expr_mul() {
        // 3 * 4 is folded at parse time to Number(12)
        let e = first_expr("3 * 4");
        assert!(matches!(e, Expr::Number(12)));
    }

    #[test]
    fn expr_precedence() {
        // 1 + 2 * 3 = 1 + 6 = 7 (all constants, folded)
        let e = first_expr("1 + 2 * 3");
        assert!(matches!(e, Expr::Number(7)));
    }

    #[test]
    fn expr_eq() {
        let e = first_expr("a == b");
        assert!(matches!(e, Expr::BinOp(_, BinOp::Eq, _)));
    }

    #[test]
    fn expr_logic() {
        let e = first_expr("a == 1 and b == 2");
        assert!(matches!(e, Expr::BinOp(_, BinOp::And, _)));
    }

    #[test]
    fn expr_not() {
        let e = first_expr("not a");
        assert!(matches!(e, Expr::Not(_)));
    }

    #[test]
    fn expr_parens() {
        // (1 + 2) folded to Number(3)
        let e = first_expr("(1 + 2)");
        assert!(matches!(e, Expr::Number(3)));
    }

    #[test]
    fn expr_getch() {
        assert!(matches!(first_expr("getch()"), Expr::Getch));
    }

    // ── Print ────────────────────────────────────────────────────────────

    #[test]
    fn print_string() {
        let stmts = parse("print \"hello\"");
        assert!(matches!(&stmts[0], Stmt::Print { args, no_newline: false } if args.len() == 1));
    }

    #[test]
    fn print_multiple_args() {
        let stmts = parse("print \"X=\", x");
        assert!(matches!(&stmts[0], Stmt::Print { args, no_newline: false } if args.len() == 2));
    }

    #[test]
    fn print_empty() {
        // bare `print` = just newline
        let stmts = parse("print");
        assert!(matches!(&stmts[0], Stmt::Print { args, no_newline: false } if args.is_empty()));
    }

    #[test]
    fn print_var_var_string() {
        // print x, y, "text"  – all orders work
        let stmts = parse("print x, y, \"hello\"");
        assert!(matches!(&stmts[0], Stmt::Print { args, no_newline: false } if args.len() == 3));
    }

    #[test]
    fn print_string_var_string() {
        let stmts = parse("print \"A=\", a, \" B=\", b");
        assert!(matches!(&stmts[0], Stmt::Print { args, no_newline: false } if args.len() == 4));
    }

    // ── Control flow ─────────────────────────────────────────────────────

    #[test]
    fn if_then() {
        let stmts = parse("if x == 1 then\n  x = 2\nend");
        assert!(matches!(&stmts[0], Stmt::If(_, then_body, None) if then_body.len() == 1));
    }

    #[test]
    fn if_else() {
        let stmts = parse("if x == 1 then\n  x = 2\nelse\n  x = 3\nend");
        if let Stmt::If(_, _, else_body) = &stmts[0] {
            assert!(else_body.is_some());
            assert_eq!(else_body.as_ref().unwrap().len(), 1);
        } else {
            panic!("Expected If");
        }
    }

    // ── Loops ────────────────────────────────────────────────────────────

    #[test]
    fn loop_infinite() {
        let stmts = parse("loop\n  x = 1\nend");
        assert!(matches!(&stmts[0], Stmt::Loop(0, _))); // 0 = infinite
    }

    #[test]
    fn loop_counted() {
        let stmts = parse("loop 5\n  x = 1\nend");
        assert!(matches!(&stmts[0], Stmt::Loop(5, _)));
    }

    #[test]
    fn for_loop() {
        let stmts = parse("loop i = 1 to 5\n  print i\nend");
        assert!(matches!(&stmts[0], Stmt::ForLoop { var, .. } if var == "i"));
    }

    #[test]
    fn for_loop_with_step() {
        let stmts = parse("loop i = 0 to 10 step 2\n  print i\nend");
        if let Stmt::ForLoop { step, .. } = &stmts[0] {
            assert!(step.is_some());
        } else {
            panic!("Expected ForLoop");
        }
    }

    #[test]
    fn for_next_syntax() {
        let stmts = parse("for i = 1 to 5\n  print i\nnext");
        assert!(matches!(&stmts[0], Stmt::ForLoop { var, .. } if var == "i"));
    }

    #[test]
    fn for_next_with_var() {
        // `next i` — variable name after next is optional/cosmetic
        let stmts = parse("for i = 1 to 10\n  print i\nnext i");
        assert!(matches!(&stmts[0], Stmt::ForLoop { var, .. } if var == "i"));
    }

    #[test]
    fn for_next_with_step() {
        let stmts = parse("for i = 0 to 20 step 2\n  print i\nnext");
        if let Stmt::ForLoop { var, step, .. } = &stmts[0] {
            assert_eq!(var, "i");
            assert!(step.is_some());
        } else {
            panic!("Expected ForLoop");
        }
    }

    #[test]
    fn while_loop() {
        let stmts = parse("while x < 10\n  x = x + 1\nend");
        assert!(matches!(&stmts[0], Stmt::WhileLoop(_, _)));
    }

    #[test]
    fn break_stmt() {
        let stmts = parse("loop\n  break\nend");
        assert!(stmts.len() == 1);
    }

    // ── Subroutines ──────────────────────────────────────────────────────

    #[test]
    fn sub_def() {
        let stmts = parse("sub test()\n  print \"hi\"\nend");
        assert!(matches!(&stmts[0], Stmt::SubDef(name, _, _) if name == "test"));
    }

    #[test]
    fn sub_def_with_params() {
        let stmts = parse("sub draw(x, y:string)\n  print x\nend");
        if let Stmt::SubDef(name, params, _) = &stmts[0] {
            assert_eq!(name, "draw");
            assert_eq!(params.len(), 2);
            assert_eq!(params[0].0, "x");
            assert!(params[0].1.is_none());
            assert_eq!(params[1].0, "y");
            assert!(matches!(params[1].1, Some(VarType::Str)));
        } else {
            panic!("Expected SubDef");
        }
    }

    #[test]
    fn call_stmt() {
        let stmts = parse("test()");
        assert!(matches!(&stmts[0], Stmt::Call(name, _, _) if name == "test"));
    }

    #[test]
    fn call_with_args() {
        let stmts = parse("draw(10, 20)");
        if let Stmt::Call(name, args, _) = &stmts[0] {
            assert_eq!(name, "draw");
            assert_eq!(args.len(), 2);
        } else {
            panic!("Expected Call");
        }
    }

    #[test]
    fn return_stmt() {
        let stmts = parse("return");
        assert!(matches!(&stmts[0], Stmt::Return(_)));
    }

    // ── Graphics / Screen ────────────────────────────────────────────────

    #[test]
    fn cls() {
        let stmts = parse("cls");
        assert!(matches!(&stmts[0], Stmt::Cls { fast: false }));
    }
    #[test]
    fn cls_fast() {
        let stmts = parse("cls fast");
        assert!(matches!(&stmts[0], Stmt::Cls { fast: true }));
    }
    #[test]
    fn graphics_on() {
        let stmts = parse("graphics on");
        assert!(matches!(
            &stmts[0],
            Stmt::Graphics {
                on: true,
                multi: false,
                block: false,
                ..
            }
        ));
    }
    #[test]
    fn graphics_off() {
        let stmts = parse("graphics off");
        assert!(matches!(
            &stmts[0],
            Stmt::Graphics {
                on: false,
                multi: false,
                block: false,
                ..
            }
        ));
    }
    #[test]
    fn graphics_on_multi() {
        let stmts = parse("graphics on multi");
        assert!(matches!(
            &stmts[0],
            Stmt::Graphics {
                on: true,
                multi: true,
                block: false,
                ..
            }
        ));
    }
    #[test]
    fn graphics_on_double() {
        let stmts = parse("graphics on double");
        assert!(matches!(
            &stmts[0],
            Stmt::Graphics {
                on: true,
                multi: false,
                block: false,
                dbuf: true,
            }
        ));
    }
    #[test]
    fn flip_stmt() {
        let stmts = parse("flip");
        assert!(matches!(&stmts[0], Stmt::Flip));
    }

    // ── Colors ───────────────────────────────────────────────────────────

    #[test]
    fn color_num() {
        let stmts = parse("color 7");
        assert!(matches!(
            &stmts[0],
            Stmt::Color {
                target: ColorTarget::Text,
                ..
            }
        ));
    }
    #[test]
    fn color_text() {
        let stmts = parse("color text 7");
        assert!(matches!(
            &stmts[0],
            Stmt::Color {
                target: ColorTarget::Text,
                ..
            }
        ));
    }
    #[test]
    fn color_border() {
        let stmts = parse("color border 2");
        assert!(matches!(
            &stmts[0],
            Stmt::Color {
                target: ColorTarget::Border,
                ..
            }
        ));
    }
    #[test]
    fn color_bg() {
        let stmts = parse("color bg 0");
        assert!(matches!(
            &stmts[0],
            Stmt::Color {
                target: ColorTarget::Bg,
                ..
            }
        ));
    }

    // ── Sys / Asm ────────────────────────────────────────────────────────

    #[test]
    fn sys_stmt() {
        let stmts = parse("sys $FFD2");
        assert!(matches!(
            &stmts[0],
            Stmt::Sys {
                addr: 0xFFD2,
                arg: None
            }
        ));
    }
    #[test]
    fn sys_stmt_with_arg() {
        let stmts = parse("sys $1000, 0");
        assert!(matches!(
            &stmts[0],
            Stmt::Sys {
                addr: 0x1000,
                arg: Some(_)
            }
        ));
    }
    #[test]
    fn irq_exit_stmt() {
        let stmts = parse("irq_exit");
        assert!(matches!(&stmts[0], Stmt::IrqExit));
    }
    #[test]
    fn asm_inline() {
        let stmts = parse("asm $EA, $EA");
        assert!(matches!(&stmts[0], Stmt::AsmBytes(b) if b.len() == 2));
    }
    #[test]
    fn asm_block() {
        // asm { ... } now produces AsmSource; raw bytes are assembled at codegen time
        let stmts = parse("asm { $A9 $07 }");
        assert!(matches!(&stmts[0], Stmt::AsmSource(_)));
    }

    // ── IntToStr (numstr) ────────────────────────────────────────────────

    #[test]
    fn numstr_stmt() {
        let stmts = parse("numstr score, $0340");
        assert!(
            matches!(&stmts[0], Stmt::IntToStr { var, addr } if var == "score" && *addr == 0x0340)
        );
    }

    // ── New features: const, label, goto, poke, peek, rnd, abs, min, max, sgn ──

    #[test]
    fn const_stmt() {
        let stmts = parse("const SCRADDR = $0400");
        assert!(matches!(&stmts[0], Stmt::Const(name, Expr::Number(0x0400)) if name == "scraddr"));
    }

    #[test]
    fn const_stmt_decimal() {
        let stmts = parse("const SIZE = 100");
        assert!(matches!(&stmts[0], Stmt::Const(name, Expr::Number(100)) if name == "size"));
    }

    #[test]
    fn label_stmt() {
        let stmts = parse("label main_loop");
        assert!(matches!(&stmts[0], Stmt::Label(name) if name == "main_loop"));
    }

    #[test]
    fn goto_stmt() {
        let stmts = parse("goto main_loop");
        assert!(matches!(&stmts[0], Stmt::Goto(name, _) if name == "main_loop"));
    }

    #[test]
    fn poke_stmt() {
        let stmts = parse("poke $D020, 2");
        assert!(
            matches!(&stmts[0], Stmt::Poke(Expr::Number(addr), Expr::Number(2)) if *addr == 0xD020u16 as i16)
        );
    }

    #[test]
    fn poke_stmt_with_expr() {
        let stmts = parse("poke $0400 + 10, x");
        assert!(matches!(&stmts[0], Stmt::Poke(_, Expr::Var(name)) if name == "x"));
    }

    #[test]
    fn expr_peek() {
        let e = first_expr("peek($D012)");
        assert!(
            matches!(e, Expr::Peek(boxed) if matches!(*boxed, Expr::Number(addr) if addr == 0xD012u16 as i16))
        );
    }

    #[test]
    fn expr_peek_with_expr() {
        let e = first_expr("peek(addr)");
        assert!(matches!(e, Expr::Peek(boxed) if matches!(*boxed, Expr::Var(_))));
    }

    #[test]
    fn expr_rnd() {
        let e = first_expr("rnd()");
        assert!(matches!(e, Expr::Rnd));
    }

    #[test]
    fn expr_rnd_no_parens() {
        let e = first_expr("rnd");
        assert!(matches!(e, Expr::Rnd));
    }

    #[test]
    fn expr_abs() {
        let e = first_expr("abs(x)");
        assert!(matches!(e, Expr::Abs(boxed) if matches!(*boxed, Expr::Var(_))));
    }

    #[test]
    fn expr_abs_with_expr() {
        let e = first_expr("abs(x - 20)");
        assert!(matches!(e, Expr::Abs(boxed) if matches!(*boxed, Expr::BinOp(_, BinOp::Sub, _))));
    }

    #[test]
    fn expr_min() {
        let e = first_expr("min(x, 39)");
        assert!(
            matches!(e, Expr::Min(a, b) if matches!(*a, Expr::Var(_)) && matches!(*b, Expr::Number(39)))
        );
    }

    #[test]
    fn expr_max() {
        let e = first_expr("max(y, 0)");
        assert!(
            matches!(e, Expr::Max(a, b) if matches!(*a, Expr::Var(_)) && matches!(*b, Expr::Number(0)))
        );
    }

    #[test]
    fn expr_sgn() {
        let e = first_expr("sgn(x - 20)");
        assert!(matches!(e, Expr::Sgn(boxed) if matches!(*boxed, Expr::BinOp(_, BinOp::Sub, _))));
    }

    #[test]
    fn expr_sgn_simple() {
        let e = first_expr("sgn(dx)");
        assert!(matches!(e, Expr::Sgn(boxed) if matches!(*boxed, Expr::Var(_))));
    }

    // ── Arrays ───────────────────────────────────────────────────────────

    #[test]
    fn array_decl() {
        let stmts = parse("var scores = array(10)");
        if let Stmt::VarDecl {
            name,
            vtype,
            expr: Expr::Number(10),
        } = &stmts[0]
        {
            assert_eq!(name, "scores");
            assert!(matches!(vtype, Some(VarType::Array)));
        } else {
            panic!("Expected array VarDecl");
        }
    }

    #[test]
    fn array_set() {
        let stmts = parse("scores[0] = 100");
        assert!(
            matches!(&stmts[0], Stmt::ArraySet(name, Expr::Number(0), Expr::Number(100)) if name == "scores")
        );
    }

    #[test]
    fn array_get() {
        let e = first_expr("scores[i]");
        assert!(matches!(e, Expr::ArrayGet(name, _) if name == "scores"));
    }

    // ── Word (16-bit) vars ───────────────────────────────────────────────

    #[test]
    fn word_var_decl() {
        let stmts = parse("var ptr: word = $0400");
        if let Stmt::VarDecl { name, vtype, .. } = &stmts[0] {
            assert_eq!(name, "ptr");
            assert!(matches!(vtype, Some(VarType::Word)));
        } else {
            panic!("Expected VarDecl");
        }
    }

    #[test]
    fn const_substitution() {
        // const X = 10; var y = X + 5 → X substituted to 10, then 10+5 folded to 15
        let stmts = parse("const X = 10\nvar y = X + 5");
        assert!(
            matches!(&stmts[1], Stmt::VarDecl { name, expr: Expr::Number(15), .. }
            if name == "y")
        );
    }

    #[test]
    fn chr_str_expr() {
        let e = first_expr("chr$(65)");
        assert!(matches!(e, Expr::ChrStr(boxed) if matches!(*boxed, Expr::Number(65))));
    }

    #[test]
    fn plot_stmt() {
        let stmts = parse("plot 10, 20");
        assert!(matches!(
            &stmts[0],
            Stmt::Plot(Expr::Number(10), Expr::Number(20))
        ));
    }

    #[test]
    fn plot_stmt_vars() {
        let stmts = parse("plot x, y");
        assert!(
            matches!(&stmts[0], Stmt::Plot(Expr::Var(a), Expr::Var(b)) if a == "x" && b == "y")
        );
    }

    #[test]
    fn circle_stmt() {
        let stmts = parse("circle 160, 100, 32");
        assert!(matches!(
            &stmts[0],
            Stmt::Circle {
                x: Expr::Number(160),
                y: Expr::Number(100),
                radius: Expr::Number(32)
            }
        ));
    }

    #[test]
    fn gcls_stmt() {
        let stmts = parse("gcls");
        assert!(matches!(&stmts[0], Stmt::Gcls));
    }

    #[test]
    fn label_goto_sequence() {
        let stmts = parse("label start\nx = x + 1\ngoto start");
        assert_eq!(stmts.len(), 3);
        assert!(matches!(&stmts[0], Stmt::Label(_)));
        assert!(matches!(&stmts[1], Stmt::Assign(_, _)));
        assert!(matches!(&stmts[2], Stmt::Goto(_, _)));
    }
}
