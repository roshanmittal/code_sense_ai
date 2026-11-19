const BaseLanguageAdapter = require('../BaseLanguageAdapter');
const acorn = require('acorn');

class JavascriptAdapter extends BaseLanguageAdapter {
  constructor() {
    super(
      'javascript',
      'JavaScript (Node.js)',
      'javascript',
      63, // Judge0 Node.js 12.14.0 or compatible
      { language: 'javascript', version: '18.15.0' }
    );
  }

  getDefaultBoilerplate() {
    return `// JavaScript (Node.js) - CodeSense AI Workspace
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

// Test harness
const nums = [2, 7, 11, 15];
const target = 9;
console.log("Result:", JSON.stringify(twoSum(nums, target)));
`;
  }

  analyzeStaticStructure(code) {
    const lines = code.split('\n');
    let maxLoopDepth = 0;
    let currentLoopDepth = 0;
    const loopLocations = [];
    const functionNames = new Set();
    const recursiveCalls = [];
    let usesMap = false;
    let usesSet = false;
    let usesArray = false;
    let hasLogarithmicStep = false;
    let detectedPatterns = [];
    let isAstParsed = false;

    try {
      const ast = acorn.parse(code, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        locations: true,
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true,
      });
      isAstParsed = true;

      const traverse = (node, depth = 0, currentFunc = null) => {
        if (!node || typeof node !== 'object') return;

        const isLoop =
          node.type === 'ForStatement' ||
          node.type === 'WhileStatement' ||
          node.type === 'DoWhileStatement' ||
          node.type === 'ForOfStatement' ||
          node.type === 'ForInStatement';

        let newDepth = depth;
        if (isLoop) {
          newDepth = depth + 1;
          if (newDepth > maxLoopDepth) maxLoopDepth = newDepth;
          loopLocations.push({
            depth: newDepth,
            line: node.loc ? node.loc.start.line : 1,
            description: `${node.type} at line ${node.loc ? node.loc.start.line : 'unknown'}`,
          });

          // Check for logarithmic steps in ForStatement update
          if (node.update) {
            const updateStr = code.slice(node.update.start, node.update.end);
            if (updateStr.includes('*=') || updateStr.includes('/=') || updateStr.includes('<<')) {
              hasLogarithmicStep = true;
            }
          }
        }

        let newFunc = currentFunc;
        if (
          node.type === 'FunctionDeclaration' ||
          node.type === 'FunctionExpression' ||
          node.type === 'ArrowFunctionExpression'
        ) {
          if (node.id && node.id.name) {
            functionNames.add(node.id.name);
            newFunc = node.id.name;
          }
        }

        // Detect recursive call
        if (node.type === 'CallExpression') {
          if (node.callee && node.callee.name && node.callee.name === currentFunc) {
            recursiveCalls.push({
              function: currentFunc,
              line: node.loc ? node.loc.start.line : 1,
            });
          }
          // Detect Map/Set allocations
          if (node.callee && node.callee.name === 'Map') usesMap = true;
          if (node.callee && node.callee.name === 'Set') usesSet = true;
        }

        if (node.type === 'NewExpression' && node.callee) {
          if (node.callee.name === 'Map') usesMap = true;
          if (node.callee.name === 'Set') usesSet = true;
          if (node.callee.name === 'Array') usesArray = true;
        }

        if (node.type === 'ArrayExpression') usesArray = true;

        for (const key of Object.keys(node)) {
          if (key === 'loc' || key === 'range') continue;
          const child = node[key];
          if (Array.isArray(child)) {
            for (const item of child) traverse(item, newDepth, newFunc);
          } else if (child && typeof child === 'object') {
            traverse(child, newDepth, newFunc);
          }
        }
      };

      traverse(ast, 0, null);
    } catch (parseErr) {
      // Fallback regex / line-based parser if Acorn encounters syntax/module errors
      isAstParsed = false;
      const loopRegex = /\b(for|while)\s*\(/g;
      lines.forEach((line, idx) => {
        const matches = line.match(loopRegex);
        if (matches) {
          currentLoopDepth++;
          if (currentLoopDepth > maxLoopDepth) maxLoopDepth = currentLoopDepth;
          loopLocations.push({
            depth: currentLoopDepth,
            line: idx + 1,
            description: `Loop found: ${line.trim()}`,
          });
        }
        if (line.includes('}') && currentLoopDepth > 0) {
          currentLoopDepth--;
        }
        if (line.includes('*=') || line.includes('/=') || line.includes('Math.floor') && line.includes('/ 2')) {
          hasLogarithmicStep = true;
        }
      });
    }

    // Pattern Recognition heuristics
    if (/(\bleft\b|\blow\b|\bi\b).+(\bright\b|\bhigh\b|\bj\b)/i.test(code) && /while\s*\([^<>=]*[<>=]/.test(code)) {
      if (/Math\.floor\s*\(\s*\([^)]+\)\s*\/\s*2\s*\)/i.test(code) || /(low\s*\+\s*high)\s*>>\s*1/i.test(code) || /(left\s*\+\s*right)/i.test(code)) {
        detectedPatterns.push('Binary Search');
      } else {
        detectedPatterns.push('Two Pointers');
      }
    }

    if (usesMap || /new\s+Map/i.test(code) || /\{\s*\}/.test(code) && /\[.*\]\s*=/.test(code)) {
      detectedPatterns.push('Hashing');
    }

    if (/(\bdp\b|memo|table)\[/i.test(code) || /memoization/i.test(code)) {
      detectedPatterns.push('Dynamic Programming');
    }

    if (recursiveCalls.length > 0) {
      detectedPatterns.push('Recursion / DFS');
    }

    if (/\.sort\s*\(/i.test(code)) {
      detectedPatterns.push('Sorting');
    }

    if (/while\s*\(.*(right|end|j).*\)/i.test(code) && /(window|left|start)/i.test(code)) {
      detectedPatterns.push('Sliding Window');
    }

    // Rule-based estimation
    let ruleTime = 'O(1)';
    if (hasLogarithmicStep && maxLoopDepth <= 1) {
      ruleTime = 'O(log n)';
    } else if (maxLoopDepth === 1) {
      ruleTime = 'O(n)';
    } else if (maxLoopDepth === 2) {
      ruleTime = 'O(n^2)';
    } else if (maxLoopDepth >= 3) {
      ruleTime = `O(n^${maxLoopDepth})`;
    } else if (recursiveCalls.length >= 2) {
      ruleTime = 'O(2^n)';
    } else if (recursiveCalls.length === 1) {
      ruleTime = 'O(n)';
    }

    let ruleSpace = 'O(1)';
    if (usesMap || usesSet || usesArray) {
      ruleSpace = 'O(n)';
    } else if (recursiveCalls.length > 0) {
      ruleSpace = 'O(n) [call stack]';
    }

    return {
      language: 'javascript',
      isAstParsed,
      lineCount: lines.length,
      maxLoopDepth,
      loopLocations,
      hasRecursion: recursiveCalls.length > 0,
      recursionDetails: recursiveCalls.length > 0 ? `Found ${recursiveCalls.length} recursive call sites` : 'No direct recursion detected',
      hasLogarithmicStep,
      detectedPatterns: [...new Set(detectedPatterns)],
      ruleEstimatedTime: ruleTime,
      ruleEstimatedSpace: ruleSpace,
      dataStructures: [
        ...(usesMap ? ['Map / Hash Table'] : []),
        ...(usesSet ? ['Set / Hash Set'] : []),
        ...(usesArray ? ['Array'] : []),
      ],
    };
  }
}

module.exports = JavascriptAdapter;
