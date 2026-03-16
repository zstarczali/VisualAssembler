const fs = require('fs');
const path = require('path');

// Load app.js and extract necessary functions
const appCode = fs.readFileSync('./app.js', 'utf8');

// Extract addressingModes
const addressingModesMatch = appCode.match(/const addressingModes = \{[\s\S]+?\n\};/);
const addressingModes = eval('(' + addressingModesMatch[0].substring(24) + ')');

// Extract opcodeMap
const opcodeMapMatch = appCode.match(/const opcodeMap = \{[\s\S]+?\n\};/);
const opcodeMap = eval('(' + opcodeMapMatch[0].substring(18) + ')');

// Load sample
const sample = JSON.parse(fs.readFileSync('./samples/setpixel-demo.json', 'utf8'));

console.log('Checking indirectY blocks:');
sample.program.forEach((b, i) => {
  if (b.addressingMode === 'indirectY') {
    const opcode = opcodeMap[b.mnemonic]?.[b.addressingMode];
    console.log(`Block ${i}: ${b.mnemonic} ${b.operand} → opcode=$${opcode?.toString(16).toUpperCase().padStart(2, '0')} rawOp="${b.rawOperand}"`);
  }
});

console.log('\nChecking absoluteX lookup table loads:');
sample.program.forEach((b, i) => {
  if (b.addressingMode === 'absoluteX' && (b.operand?.includes('row40') || b.operand?.includes('bitmask'))) {
    const opcode = opcodeMap[b.mnemonic]?.[b.addressingMode];
    console.log(`Block ${i}: ${b.mnemonic} ${b.operand} → opcode=$${opcode?.toString(16).toUpperCase().padStart(2, '0')}`);
  }
});
