#!/usr/bin/env python3
import json

with open('/Users/ztarczali/Library/CloudStorage/OneDrive-GoToTechnologiesUSALLC/Documents/GitHub/VisualAssembler/samples/bouncing-sprites-demo.json', 'r') as f:
    data = json.load(f)

print("Checking all sprite data in bouncing-sprites-demo.json:")
print("=" * 60)

for block in data['program']:
    if block.get('isByteMacro') and 'sprite' in block.get('id', '').lower():
        raw = block.get('rawOperand', '')
        count = len([b for b in raw.split(',') if b.strip()])
        status = "✓ OK" if count == 64 else f"✗ WRONG ({count} bytes)"
        print(f"{block['id']:15s}: {count:2d} bytes  {status}")
        
        if count != 64:
            print(f"   Description: {block.get('description', 'N/A')}")

