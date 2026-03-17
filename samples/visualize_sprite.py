#!/usr/bin/env python3
"""Visualize C64 sprite data"""

def visualize_sprite(hex_data):
    """Convert hex sprite data to ASCII art"""
    bytes_list = [int(b.strip().replace('$', ''), 16) for b in hex_data.split(',')]
    
    print(f"Total bytes: {len(bytes_list)}")
    if len(bytes_list) != 64:
        print(f"WARNING: Expected 64 bytes, got {len(bytes_list)}")
    
    print("\nSprite visualization (24x21 pixels):")
    print("-" * 26)
    
    # C64 sprite: 24x21 pixels = 3 bytes per row × 21 rows = 63 bytes + 1 padding
    for row in range(21):
        if row * 3 + 2 >= len(bytes_list):
            break
        byte1 = bytes_list[row * 3]
        byte2 = bytes_list[row * 3 + 1]
        byte3 = bytes_list[row * 3 + 2]
        
        # Convert to binary and display
        line = ""
        for byte_val in [byte1, byte2, byte3]:
            for bit in range(7, -1, -1):
                line += "█" if (byte_val & (1 << bit)) else " "
        print(f"{line}│")
    
    print("-" * 26)
    print(f"Padding byte: ${bytes_list[63]:02X}" if len(bytes_list) > 63 else "No padding byte!")

# Test with Square sprite (should be all filled)
square_data = "$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF,$00"

print("=" * 60)
print("SQUARE SPRITE (should be 24x21 filled block):")
print("=" * 60)
visualize_sprite(square_data)

# Test with Circle sprite
circle_data = "$00,$00,$00,$00,$00,$00,$01,$FF,$80,$07,$FF,$E0,$0F,$FF,$F0,$1F,$FF,$F8,$3F,$FF,$FC,$7F,$FF,$FE,$7F,$FF,$FE,$7F,$FF,$FE,$7F,$FF,$FE,$7F,$FF,$FE,$7F,$FF,$FE,$3F,$FF,$FC,$1F,$FF,$F8,$0F,$FF,$F0,$07,$FF,$E0,$01,$FF,$80,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00,$00"

print("\n" + "=" * 60)
print("CIRCLE SPRITE:")
print("=" * 60)
visualize_sprite(circle_data)

