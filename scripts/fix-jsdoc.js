const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function getAllFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

function isOnlyWhitespaceLine(l) {
  return /^\s*$/.test(l);
}

function isDocLine(l) {
  return /^\s*\*\s?/.test(l);
}

function isOpenComment(l) {
  return /^\s*\/\*\*/.test(l);
}

function isCloseComment(l) {
  return /^\s*\*\//.test(l);
}

function extractTag(line) {
  const m = line.match(/@(\w+)/);
  return m ? m[1] : null;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const result = [];
  let changed = false;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Detect JSDoc comment block
    if (isOpenComment(line)) {
      // Skip single-line comments like /** @type {*} */
      if (line.trim().endsWith('*/')) {
        result.push(line);
        i++;
        continue;
      }
      const blockStart = i;
      const blockLines = [line];
      i++;
      while (i < lines.length && !isCloseComment(lines[i])) {
        blockLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) {
        blockLines.push(lines[i]); // */
        i++;
      }

      // Get the full block text
      const blockText = blockLines.join('\n');

      // Check block properties across the full text
      const hasVariable = /@variable/.test(blockText);
      const hasObjectType = /@(?:param|returns|type)\s*\{\s*Object\s*\}/.test(blockText);
      const hasConstantDestruct = /@constant\s+\[/.test(blockText) || /@constant\s+\{[^}]*,[^}]*\}/.test(blockText);
      const hasDestructuredParam = /@param\s*\{[\s\S]*?[=,][\s\S]*?\}/.test(blockText);
      const hasOrphanRoot0 = /^\s*\*\s*@param\s+root\d+\s/m.test(blockText);
      const hasOrphanPath = /^\s*\*\s*@param\s+(?:ctx|streak|opts)\./m.test(blockText);
      const hasMinType = /@param\s*\{\s*min\s*\}/.test(blockText);

      // Get all tags in the block
      const tags = blockLines
        .filter(l => /@\w+/.test(l))
        .map(l => extractTag(l))
        .filter(Boolean);

      const tagSet = new Set(tags);

      // Rule 1: Remove blocks with ONLY @variable (and maybe @type)
      if (hasVariable) {
        const nonVariableTags = [...tagSet].filter(t => t !== 'variable' && t !== 'type');
        if (nonVariableTags.length === 0) {
          changed = true;
          continue; // Skip entire block
        }
      }

      // Rule 2: Remove @constant [destructured] blocks
      if (hasConstantDestruct) {
        changed = true;
        continue;
      }

      // Rule 2b: Fix {Object} -> {object} in type tags
      if (hasObjectType) {
        changed = true;
        const fixedLines = blockLines.map(l => {
          return l.replace(/\{\s*Object\s*\}/g, '{object}');
        });
        result.push(...fixedLines);
        continue;
      }

      // Rule 3: Fix @param { destructured } — replace type with {Object}
      if (hasDestructuredParam) {
        changed = true;
        // Concatenate @param lines that span multiple lines, fix them
        const fixedLines = [];
        let inParamBlock = false;
        let paramAccum = '';

        for (const bl of blockLines) {
          if (/^\s*\*\s*@param\s*\{/.test(bl) && /\{[\s\S]*\}/.test(bl)) {
            // Single-line @param with type and closing brace
            // e.g., @param { icon = "📘", ... } root0 - TODO: ...
            const nameMatch = bl.match(/\}\s*(root\d+|options)\b/);
            if (nameMatch) {
              fixedLines.push(bl.replace(/@param\s*\{[^}]*\}\s*(root\d+|options)\s*-?\s*[^]*/, `@param {Object} ${nameMatch[1]}`));
            } else {
              fixedLines.push(bl.replace(/@param\s*\{[^}]*\}\s*-?\s*[^]*/, '@param {Object} options'));
            }
          } else if (/^\s*\*\s*@param\s*\{/.test(bl) && !/\}/.test(bl)) {
            // Multi-line @param { ... starts here
            inParamBlock = true;
            paramAccum = bl;
          } else if (inParamBlock) {
            paramAccum += '\n' + bl;
            if (/\}/.test(bl)) {
              // End of multi-line param
              inParamBlock = false;
              const nameMatch = paramAccum.match(/\}\s*(root\d+|options)\b/);
              if (nameMatch) {
                fixedLines.push(bl.replace(/.*/, `@param {Object} ${nameMatch[1]}`));
              } else {
                fixedLines.push(bl.replace(/.*/, '@param {Object} options'));
              }
              paramAccum = '';
            }
          } else {
            fixedLines.push(bl);
          }
        }

        // Remove @param root0 lines
        const cleanedLines = fixedLines.map(l => {
          if (/^\s*\*\s*@param\s+root\d+\s/.test(l)) {
            return l.replace(/@param\s+root\d+\s.*/, '');
          }
          return l;
        });

        // Clean consecutive blank * lines
        const finalLines = [];
        let prevBlank = false;
        for (const l of cleanedLines) {
          const isBlank = /^\s*\*\s*$/.test(l) || /^\s*$/.test(l);
          if (isBlank && prevBlank) continue;
          const isAllWhitespace = /^\s*$/.test(l);
          if (isAllWhitespace && prevBlank) continue;
          finalLines.push(l);
          prevBlank = isBlank;
        }
        result.push(...finalLines);
        continue;
      }

      // Rule 4: Remove @param root0, root0.xxx, and @param xxx. lines
      if (hasOrphanRoot0 || hasOrphanPath) {
        changed = true;
        const fixedLines = blockLines.map(l => {
          if (/^\s*\*\s*@param\s+root\d+\s/.test(l)) {
            return ' *';
          }
          if (/^\s*\*\s*@param\s+root\d+\./.test(l)) {
            return ' *';
          }
          if (/^\s*\*\s*@param\s+(?:ctx|streak|opts)\./.test(l)) {
            return ' *';
          }
          return l;
        });
        // Clean consecutive blank * lines
        const cleanedLines = [];
        let prevBlank = false;
        for (const l of fixedLines) {
          const isBlank = /^\s*\*\s*$/.test(l);
          if (isBlank && prevBlank) continue;
          cleanedLines.push(l);
          prevBlank = isBlank;
        }
        result.push(...cleanedLines);
        continue;
      }

      // Rule 5: Fix @param { min }
      if (hasMinType) {
        changed = true;
        const fixedLines = blockLines.map(l => {
          return l.replace(/@param\s*\{\s*min\s*\}/g, '@param {number} min');
        });
        result.push(...fixedLines);
        continue;
      }

      // No match — keep the block as-is
      result.push(...blockLines);
      continue;
    }

    result.push(line);
    i++;
  }

  if (changed) {
    const output = result.join('\n');
    fs.writeFileSync(filePath, output, 'utf8');
    return true;
  }
  return false;
}

const files = getAllFiles(srcDir);
let modified = 0;

for (const filePath of files) {
  if (fixFile(filePath)) {
    const relPath = path.relative(srcDir, filePath);
    console.log(`Fixed: ${relPath}`);
    modified++;
  }
}

console.log(`\nFiles modified: ${modified}`);
