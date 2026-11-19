const BaseLanguageAdapter = require('../BaseLanguageAdapter');

class CppAdapter extends BaseLanguageAdapter {
  constructor() {
    super(
      'cpp',
      'C++ (GCC)',
      'cpp',
      54, // Judge0 C++ (GCC 9.2.0)
      { language: 'c++', version: '10.2.0' }
    );
  }

  getDefaultBoilerplate() {
    return `// C++ (GCC) - CodeSense AI Workspace
#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> lookup;
    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        if (lookup.count(complement)) {
            return {lookup[complement], i};
        }
        lookup[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    
    if (result.size() == 2) {
        cout << "Result: [" << result[0] << ", " << result[1] << "]" << endl;
    } else {
        cout << "No solution found." << endl;
    }
    return 0;
}
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
    let usesVector = false;
    let usesQueue = false;
    let usesStack = false;
    let usesPriorityQueue = false;
    let hasLogarithmicStep = false;
    const detectedPatterns = [];

    // Identify C++ functions: e.g. int func(int a, ...) or void dfs(...)
    const funcRegex = /\b(?:int|void|bool|double|string|vector<[^>]+>|long long)\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/;
    lines.forEach((line) => {
      const match = line.match(funcRegex);
      if (match && match[1] !== 'main') {
        functionNames.add(match[1]);
      }
    });

    // Brace-tracking stack
    const scopeStack = []; // { type: 'loop' | 'func' | 'block', name?: string }
    let currentFunction = null;

    lines.forEach((rawLine, idx) => {
      const lineNum = idx + 1;
      const trimmed = rawLine.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

      const hasFor = /\bfor\s*\([^;]+;[^;]+;[^)]*\)/.test(trimmed);
      const hasWhile = /\bwhile\s*\([^)]+\)/.test(trimmed);

      if (hasFor || hasWhile) {
        currentLoopDepth++;
        if (currentLoopDepth > maxLoopDepth) {
          maxLoopDepth = currentLoopDepth;
        }
        loopLocations.push({
          depth: currentLoopDepth,
          line: lineNum,
          description: trimmed,
        });
      }

      // Check function definition start
      const funcMatch = trimmed.match(funcRegex);
      if (funcMatch) {
        currentFunction = funcMatch[1];
      }

      // Track braces
      const openBraces = (trimmed.match(/\{/g) || []).length;
      const closeBraces = (trimmed.match(/\}/g) || []).length;

      for (let i = 0; i < openBraces; i++) {
        if (hasFor || hasWhile) {
          scopeStack.push({ type: 'loop' });
        } else if (currentFunction && i === 0 && funcMatch) {
          scopeStack.push({ type: 'func', name: currentFunction });
        } else {
          scopeStack.push({ type: 'block' });
        }
      }

      // Check recursion only within the active function's body
      if (currentFunction && currentFunction !== 'main') {
        if (trimmed.includes(`${currentFunction}(`) && !funcRegex.test(trimmed)) {
          recursiveCalls.push({ function: currentFunction, line: lineNum });
        }
      }

      for (let i = 0; i < closeBraces; i++) {
        if (scopeStack.length > 0) {
          const popped = scopeStack.pop();
          if (popped.type === 'loop' && currentLoopDepth > 0) {
            currentLoopDepth--;
          }
          if (popped.type === 'func') {
            currentFunction = null;
          }
        } else if (currentLoopDepth > 0) {
          currentLoopDepth--;
        }
      }

      // Check logarithmic indicators
      if (
        trimmed.includes('/ 2') ||
        trimmed.includes('>> 1') ||
        trimmed.includes('/= 2') ||
        trimmed.includes('*= 2') ||
        trimmed.includes('mid =')
      ) {
        hasLogarithmicStep = true;
      }

      // Data structure detections
      if (trimmed.includes('unordered_map') || trimmed.includes('map<')) usesMap = true;
      if (trimmed.includes('unordered_set') || trimmed.includes('set<')) usesSet = true;
      if (trimmed.includes('vector<') || trimmed.includes('new int[')) usesVector = true;
      if (trimmed.includes('queue<')) usesQueue = true;
      if (trimmed.includes('stack<')) usesStack = true;
      if (trimmed.includes('priority_queue<')) usesPriorityQueue = true;
    });

    // Pattern heuristics
    if (/(\bleft\b|\blow\b|\bl\b).+(\bright\b|\bhigh\b|\br\b)/i.test(code) && /while\s*\(/.test(code)) {
      if (code.includes('mid') || code.includes('/ 2') || code.includes('>> 1')) {
        detectedPatterns.push('Binary Search');
      } else {
        detectedPatterns.push('Two Pointers');
      }
    }

    if (usesMap || usesSet) {
      detectedPatterns.push('Hashing');
    }

    if (/(\bdp\b|memo)\[/i.test(code) || code.includes('vector<vector<int>> dp')) {
      detectedPatterns.push('Dynamic Programming');
    }

    if (recursiveCalls.length > 0) {
      detectedPatterns.push('Recursion / DFS');
    }

    if (usesQueue || code.includes('queue<')) {
      detectedPatterns.push('BFS / Queue');
    }

    if (usesStack || code.includes('stack<')) {
      detectedPatterns.push('Stack and Queue');
    }

    if (usesPriorityQueue || code.includes('priority_queue')) {
      detectedPatterns.push('Heap / Priority Queue');
    }

    if (code.includes('sort(')) {
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
    if (usesMap || usesSet || usesVector || usesQueue || usesStack || usesPriorityQueue) {
      ruleSpace = 'O(n)';
    } else if (recursiveCalls.length > 0) {
      ruleSpace = 'O(n) [call stack]';
    }

    return {
      language: 'cpp',
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
        ...(usesMap ? ['std::unordered_map / Hash Table'] : []),
        ...(usesSet ? ['std::unordered_set / Hash Set'] : []),
        ...(usesVector ? ['std::vector / Dynamic Array'] : []),
        ...(usesQueue ? ['std::queue'] : []),
        ...(usesStack ? ['std::stack'] : []),
        ...(usesPriorityQueue ? ['std::priority_queue (Heap)'] : []),
      ],
    };
  }
}

module.exports = CppAdapter;
