#!/usr/bin/env python3
import json

file_path = '/Users/ztarczali/Library/CloudStorage/OneDrive-GoToTechnologiesUSALLC/Documents/GitHub/VisualAssembler/samples/bouncing-sprites-demo.json'

with open(file_path, 'r') as f:
    data = json.load(f)

# Find the main "loop" label (the infinite loop at the end)
loop_index = None
for i, block in enumerate(data['program']):
    if block.get('labelName') == 'loop' and block.get('isLabel'):
        loop_index = i
        break

if loop_index is None:
    print("ERROR: loop label not found!")
    exit(1)

print(f"Found loop at index {loop_index}")

# Create raster wait blocks - insert RIGHT AFTER the loop label
raster_wait_blocks = [
    {
        "id": "wait-raster-1",
        "category": "Adatmozgas",
        "mnemonic": "LDA",
        "operand": "$D012",
        "rawOperand": "D012",
        "description": "Read current raster line.",
        "addressingMode": "absolute",
        "base": "hex",
        "validationError": "",
        "collapsed": True
    },
    {
        "id": "wait-raster-2",
        "category": "Aritmetika",
        "mnemonic": "CMP",
        "operand": "#$FF",
        "rawOperand": "FF",
        "description": "Wait for bottom of screen (line 255).",
        "addressingMode": "immediate",
        "base": "hex",
        "validationError": "",
        "collapsed": True
    },
    {
        "id": "wait-raster-3",
        "category": "Ugrasok",
        "mnemonic": "BNE",
        "operand": "loop",
        "rawOperand": "loop",
        "description": "Loop until raster line 255.",
        "addressingMode": "relative",
        "base": "hex",
        "validationError": "",
        "collapsed": True
    }
]

# Insert raster wait right after loop label
insert_index = loop_index + 1
for i, block in enumerate(raster_wait_blocks):
    data['program'].insert(insert_index + i, block)

print(f"Inserted {len(raster_wait_blocks)} raster wait blocks after loop label")

with open(file_path, 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"✓ Fixed {file_path}")
