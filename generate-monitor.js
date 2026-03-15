const fs = require('fs');

// Minimal implementation to generate monitor output
const opcodeMap = {
  LDA: { immediate: 0xA9, zeroPage: 0xA5, absolute: 0xAD, absoluteX: 0xBD, absoluteY: 0xB9, indirectX: 0xA1, indirectY: 0xB1 },
  STA: { zeroPage: 0x85, absolute: 0x8D, absoluteX: 0x9D, absoluteY: 0x99, indirectX: 0x81, indirectY: 0x91 },
  ORA: { immediate: 0x09, zeroPage: 0x05, absolute: 0x0D, absoluteX: 0x1D, absoluteY: 0x19, indirectX: 0x01, indirectY: 0x11 },
  JSR: { absolute: 0x20 },
  RTS: { implied: 0x60 },
  JMP: { absolute: 0x4C },
  SEI: { implied: 0x78 },
  INX: { implied: 0xE8 },
  CPX: { immediate: 0xE0 },
  BNE: { relative: 0xD0 },
  TAX: { implied: 0xAA },
  LSR: { implied: 0x4A },
  CLC: { implied: 0x18 },
  ADC: { immediate: 0x69, zeroPage: 0x65 },
  INC: { zeroPage: 0xE6 },
  BCC: { relative: 0x90 },
  AND: { immediate: 0x29 },
  LDY: { immediate: 0xA0 }
};

const sample = JSON.parse(fs.readFileSync('./samples/setpixel-demo.json', 'utf8'));
const origin = parseInt(sample.origin, 16);

let address = origin;
const labels = new Map();

// First pass - collect labels
sample.program.forEach(block => {
  if (block.isLabel && block.labelName) {
    labels.set(block.labelName, address);
  } else if (!block.isComment) {
    const size = getSize(block);
    address += size;
  }
});

function getSize(block) {
  if (block.isLabel || block.isComment) return 0;
  if (block.addressingMode === 'implied') return 1;
  if (block.addressingMode === 'immediate' || block.addressingMode === 'zeroPage' || 
      block.addressingMode === 'relative' || block.addressingMode === 'indirectX' || 
      block.addressingMode === 'indirectY') return 2;
  return 3;
}

// Second pass - generate output
address = origin;
let output = [];

sample.program.forEach((block, i) => {
  if (block.isComment) {
    output.push(`; ${block.operand}`);
    return;
  }
  
  if (block.isLabel && block.labelName) {
    output.push(`${block.labelName}:`);
    return;
  }

  const opcode = opcodeMap[block.mnemonic]?.[block.addressingMode];
  if (!opcode) {
    output.push(`.${address.toString(16).toUpperCase().padStart(4, '0')}  ?? ??    ${block.mnemonic} ${block.operand} [UNKNOWN OPCODE]`);
    address += getSize(block);
    return;
  }

  let bytes = [opcode];
  let operandVal = null;

  if (block.addressingMode !== 'implied') {
    const raw = block.rawOperand;
    
    if (labels.has(raw)) {
      operandVal = labels.get(raw);
    } else {
      operandVal = parseInt(raw.replace(/^\$/, ''), 16);
    }

    if (block.addressingMode === 'relative') {
      const offset = operandVal - (address + 2);
      bytes.push(offset & 0xFF);
    } else if (block.addressingMode === 'immediate' || block.addressingMode === 'zeroPage' || 
               block.addressingMode === 'indirectX' || block.addressingMode === 'indirectY') {
      bytes.push(operandVal & 0xFF);
    } else {
      bytes.push(operandVal & 0xFF, (operandVal >> 8) & 0xFF);
    }
  }

  const bytesStr = bytes.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ').padEnd(8);
  output.push(`.${address.toString(16).toUpperCase().padStart(4, '0')}  ${bytesStr} ${block.mnemonic} ${block.operand}`);
  
  address += bytes.length;
});

// Print last 50 lines around setpixel subroutine
const setpixelIndex = output.findIndex(line => line.includes('setpixel:'));
console.log('Lines around setpixel subroutine:');
output.slice(setpixelIndex - 5, setpixelIndex + 30).forEach(line => console.log(line));
