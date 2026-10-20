const assert = require("node:assert/strict");
const vm = require("node:vm");

module.exports = (source, name) => {
  const declaration = new RegExp("^(?:async )?function " + name + "\\(", "m").exec(source);
  assert.ok(declaration, `Missing function ${name}`);
  const start = declaration.index;
  // A JS parser validates candidate endings, so braces in strings, regexes and comments are safe.
  const endings = /^}/gm;
  endings.lastIndex = start;
  for (let match; (match = endings.exec(source));) {
    const candidate = source.slice(start, match.index + 1);
    try {
      new vm.Script("(" + candidate + ")");
      return candidate;
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
    }
  }
  assert.fail(`Could not parse function ${name}`);
};
