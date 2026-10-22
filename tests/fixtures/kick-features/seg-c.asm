.file [name="seg-c.patched.prg", segments="Base,Patch", allowOverlap]
.segmentdef Base [prgFiles="seg-base.prg"]
.segmentdef Patch []
.segment Patch
        *=$c003 "Insert jmp"
        jmp $c000
.segment Music [sidFiles="t.sid", outPrg="seg-c.music.prg"]
.disk [filename="seg-c.d64", name="THE DISK", id="2024!"] {
        [name="PATCHED", type="prg", segments="Base,Patch", allowOverlap],
        [name="MUSIC", type="prg", segments="Music"],
}
