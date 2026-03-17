#!/usr/bin/env python3
import json
import sys

def count_bytes(raw_operand):
    """Count comma-separated bytes in rawOperand"""
    return len([b for b in raw_operand.split(',') if b.strip()])

def fix_sprite_data(file_path):
    """Fix sprite data to ensure exactly 64 bytes"""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    modified = False
    for block in data.get('program', []):
        if block.get('isByteMacro') and 'sprite' in block.get('id', '').lower():
            raw = block.get('rawOperand', '')
            byte_count = count_bytes(raw)

            if byte_count == 63:
                # Add padding byte
                block['rawOperand'] = raw + ',$00'
                block['operand'] = block['rawOperand']
                if 'byteValues' in block:
                    block['byteValues'] = block['rawOperand']
                print(f"Fixed {block.get('id')}: {byte_count} -> 64 bytes")
                modified = True
            elif byte_count != 64:
                print(f"WARNING: {block.get('id')} has {byte_count} bytes (expected 64)")

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"\n✓ Fixed {file_path}")
    else:
        print(f"No fixes needed in {file_path}")

if __name__ == '__main__':
    fix_sprite_data('/Users/ztarczali/Library/CloudStorage/OneDrive-GoToTechnologiesUSALLC/Documents/GitHub/VisualAssembler/samples/bouncing-sprites-demo.json')
