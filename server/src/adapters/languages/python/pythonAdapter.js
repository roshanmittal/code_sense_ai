const BaseLanguageAdapter = require('../BaseLanguageAdapter');

class PythonAdapter extends BaseLanguageAdapter {
  constructor() {
    super(
      'python',
      'Python 3',
      'python',
      71, // Judge0 Python 3.8.1
      { language: 'python', version: '3.10.0' }
    );
  }

  getDefaultBoilerplate() {
    return `# Python 3 - CodeSense AI Workspace
def two_sum(nums, target):
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []

# Test harness
if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    target = 9
    print(f"Result: {two_sum(nums, target)}")
`;
  }

  analyzeStaticStructure(code) {
    const lines = code.split('\n');
    let maxLoopDepth = 0;
    const loopLocations = [];
    const loopStack = [];
    const functionNames = new Set();
    const recursiveCalls = [];
    let usesDict = false;
    let usesSet = false;
    let usesList = false;
    let usesHeap = false;
    let usesDeque = false;
    let hasLogarithmicStep = false;
    const detectedPatterns = [];

    // First pass: identify functions
    const defRegex = /^\s*def\s+([a-zA-Z0-9_]+)\s*\(/;
    lines.forEach((line) => {
      const match = line.match(defRegex);
      if (match) {
        functionNames.add(match[1]);
      }
    });

    let currentFunction = null;
    let functionIndent = 0;

    lines.forEach((rawLine, idx) => {
      const lineNum = idx + 1;
      const trimmed = rawLine.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const indentMatch = rawLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1].length : 0;

      // Track function scope
      const defMatch = rawLine.match(defRegex);
      if (defMatch) {
        currentFunction = defMatch[1];
        functionIndent = currentIndent;
      } else if (currentFunction && currentIndent <= functionIndent && trimmed.length > 0) {
        // Exited function
        currentFunction = null;
      }

      // Check for recursive call inside function
      if (currentFunction && trimmed.includes(`${currentFunction}(`)) {
        // Make sure it's not the definition line itself
        if (!trimmed.startsWith('def ')) {
          recursiveCalls.push({
            function: currentFunction,
            line: lineNum,
          });
        }
      }

      // Adjust loop stack according to indentation
      while (loopStack.length > 0 && currentIndent <= loopStack[loopStack.length - 1].indent) {
        loopStack.pop();
      }

      // Check for loop statement
      if (/^\s*(for\s+[a-zA-Z0-9_,\s]+\s+in|while\s+)/.test(rawLine)) {
        loopStack.push({ indent: currentIndent, line: lineNum });
        if (loopStack.length > maxLoopDepth) {
          maxLoopDepth = loopStack.length;
        }
        loopLocations.push({
          depth: loopStack.length,
          line: lineNum,
          description: trimmed,
        });
      }

      // Check logarithmic indicators
      if (
        trimmed.includes('// 2') ||
        trimmed.includes('>> 1') ||
        trimmed.includes('//= 2') ||
        trimmed.includes('*= 2') ||
        trimmed.includes('math.floor') ||
        /range\([^,]+,[^,]+,[^)]*\*/.test(trimmed)
      ) {
        hasLogarithmicStep = true;
      }

      // Data structure detections
      if (trimmed.includes('{}') || trimmed.includes('dict(') || /\[.*\]\s*=/.test(trimmed)) usesDict = true;
      if (trimmed.includes('set(') || trimmed.includes('.add(')) usesSet = true;
      if (trimmed.includes('[]') || trimmed.includes('.append(') || trimmed.includes('list(')) usesList = true;
      if (trimmed.includes('heapq.') || trimmed.includes('heappush')) usesHeap = true;
      if (trimmed.includes('deque(') || trimmed.includes('.popleft()')) usesDeque = true;
    });

    // Pattern heuristics
    if (/(\bleft\b|\blow\b|\bl\b).+(\bright\b|\bhigh\b|\br\b)/i.test(code) && /while\s+\w+\s*[<>=]/.test(code)) {
      if (code.includes('// 2') || code.includes('>> 1') || code.includes('mid')) {
        detectedPatterns.push('Binary Search');
      } else {
        detectedPatterns.push('Two Pointers');
      }
    }

    if (usesDict || /lookup|seen|visited|freq|counter/i.test(code)) {
      detectedPatterns.push('Hashing');
    }

    if (code.includes('@lru_cache') || code.includes('memo') || /(\bdp\b|dp_table)\[/i.test(code)) {
      detectedPatterns.push('Dynamic Programming');
    }

    if (recursiveCalls.length > 0) {
      detectedPatterns.push('Recursion / DFS');
    }

    if (usesDeque || code.includes('popleft') || /bfs/i.test(code)) {
      detectedPatterns.push('BFS / Queue');
    }

    if (usesHeap || code.includes('heappop')) {
      detectedPatterns.push('Heap / Priority Queue');
    }

    if (code.includes('.sort(') || code.includes('sorted(')) {
      detectedPatterns.push('Sorting');
    }

    if (/while\s*.*right.*:/i.test(code) && /(window|left)/i.test(code)) {
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
    if (usesDict || usesSet || usesList || usesDeque || usesHeap) {
      ruleSpace = 'O(n)';
    } else if (recursiveCalls.length > 0) {
      ruleSpace = 'O(n) [call stack]';
    }

    return {
      language: 'python',
      isAstParsed: true,
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
        ...(usesDict ? ['Dictionary / Hash Map'] : []),
        ...(usesSet ? ['Set / Hash Set'] : []),
        ...(usesList ? ['List / Dynamic Array'] : []),
        ...(usesDeque ? ['Deque (Queue/Stack)'] : []),
        ...(usesHeap ? ['Heap / Priority Queue'] : []),
      ],
    };
  }
}

module.exports = PythonAdapter;
