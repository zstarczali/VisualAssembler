#!/usr/bin/env python3
"""Calculate exact memory layout for bouncing sprites demo"""

# BASIC SYS stub starts at $0801
origin = 0x0801

# BASIC SYS stub structure:
# 0801: 01 08 (load address)
# 0803: 0C 08 (next line address)
# 0805: 0A 00 (line number 10)
# 0807: 9E (SYS token)
# 0808-080B: "2061" (ASCII digits for 2061 decimal = $080D)
# 080C: 00 (end of line)
# 080D: 00 00 (end of BASIC program)

basic_sys_size = 0x0C  # 12 bytes (from 0x0801 to 0x080C)
code_start = origin + basic_sys_size  # 0x080D

print(f"Memory Layout Analysis")
print(f"=" * 60)
print(f"BASIC SYS stub: ${origin:04X} - ${origin + basic_sys_size - 1:04X} ({basic_sys_size} bytes)")
print(f"Code start:     ${code_start:04X}")
print()

# Simulate program layout
cursor = code_start

# JMP main (3 bytes)
print(f"  JMP main:     ${cursor:04X} - ${cursor + 2:04X} (3 bytes)")
cursor += 3

# vel_x BYTE (8 bytes)
print(f"  vel_x:        ${cursor:04X} - ${cursor + 7:04X} (8 bytes)")
cursor += 8

# vel_y BYTE (8 bytes)
print(f"  vel_y:        ${cursor:04X} - ${cursor + 7:04X} (8 bytes)")
cursor += 8

# ALIGN 64
print(f"\n  Before ALIGN: ${cursor:04X}")
remainder = cursor % 64
if remainder != 0:
    padding = 64 - remainder
    cursor += padding
    print(f"  ALIGN 64 padding: {padding} bytes")
print(f"  After ALIGN:  ${cursor:04X}")
print()

# Sprite data
for i in range(8):
    sprite_addr = cursor + (i * 64)
    sprite_ptr = sprite_addr // 64
    print(f"  Sprite {i}: ${sprite_addr:04X} - ${sprite_addr + 63:04X} (64 bytes) → pointer ${sprite_ptr:02X}")

print()
print(f"Expected sprite pointers: ${cursor // 64:02X} - ${(cursor + 7*64) // 64:02X}")
print()

# What pointers are actually being used?
print("PROBLEM ANALYSIS:")
print("=" * 60)
actual_pointers = [0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28]
for i, ptr in enumerate(actual_pointers):
    actual_addr = ptr * 64
    expected_addr = cursor + (i * 64)
    diff = actual_addr - expected_addr
    print(f"Sprite {i}: pointer ${ptr:02X} → ${actual_addr:04X}, expected ${expected_addr:04X}, diff: {diff:+d} bytes")

