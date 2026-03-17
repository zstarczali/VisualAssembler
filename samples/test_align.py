#!/usr/bin/env python3
"""Test ALIGN calculation logic"""

# Test case 1: With BASIC SYS stub
print("Test case 1: With BASIC SYS stub (origin override = $080D)")
print("=" * 60)

origin = 0x080D  # BASIC SYS stub uses this as origin override
cursor = origin
cursor += 3  # JMP main

print(f"Current address: ${cursor:04X} (decimal {cursor})")
print(f"ALIGN 64 calculation:")
print(f"  cursor % 64 = {cursor} % 64 = {cursor % 64}")

remainder = cursor % 64
padding = (64 - remainder) if remainder != 0 else 0
print(f"  padding = 64 - {remainder} = {padding}")
print(f"  After ALIGN: ${cursor + padding:04X}")
print()

# Test case 2: Without BASIC SYS stub
print("Test case 2: Without BASIC SYS stub (origin = $0801)")
print("=" * 60)

origin = 0x0801
cursor = origin
cursor += 3  # JMP main

print(f"Current address: ${cursor:04X} (decimal {cursor})")
print(f"ALIGN 64 calculation:")
print(f"  cursor % 64 = {cursor} % 64 = {cursor % 64}")

remainder = cursor % 64
padding = (64 - remainder) if remainder != 0 else 0
print(f"  padding = 64 - {remainder} = {padding}")
print(f"  After ALIGN: ${cursor + padding:04X}")
print()

print("CONCLUSION:")
print("=" * 60)
print("ALIGN 64 works correctly in BOTH cases!")
print("The issue must be something else...")

