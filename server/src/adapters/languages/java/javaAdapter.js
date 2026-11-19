const BaseLanguageAdapter = require('../BaseLanguageAdapter');

class JavaAdapter extends BaseLanguageAdapter {
  constructor() {
    super(
      'java',
      'Java (OpenJDK)',
      'java',
      62, // Judge0 Java (OpenJDK 13.0.1)
      { language: 'java', version: '15.0.2' }
    );
  }

  getDefaultBoilerplate() {
    return `// Java (OpenJDK) - CodeSense AI Workspace
import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println("Result: " + Arrays.toString(result));
    }
}
`;
  }

  analyzeStaticStructure(code) {
    const lines = code.split('\n');
    let maxLoopDepth = 0;
    let currentLoopDepth = 0;
    const loopLocations = [];
    const methodNames = new Set();
    const recursiveCalls = [];
    let usesMap = false;
    let usesSet = false;
    let usesList = false;
    let usesQueue = false;
    let usesStack = false;
    let usesPriorityQueue = false;
    let hasLogarithmicStep = false;
    const detectedPatterns = [];

    // Identify methods
    const methodRegex = /\b(?:public|private|protected|static)?\s+(?:int|void|boolean|double|String|int\[\]|List<[^>]+>)\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/;
    lines.forEach((line) => {
      const match = line.match(methodRegex);
      if (match && match[1] !== 'main') {
        methodNames.add(match[1]);
      }
    });

    const scopeStack = []; // { type: 'loop' | 'method' | 'block', name?: string }
    let currentMethod = null;

    lines.forEach((rawLine, idx) => {
      const lineNum = idx + 1;
      const trimmed = rawLine.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

      const hasFor = /\bfor\s*\(/.test(trimmed);
      const hasWhile = /\bwhile\s*\(/.test(trimmed);

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

      // Check method definition
      const methodMatch = trimmed.match(methodRegex);
      if (methodMatch) {
        currentMethod = methodMatch[1];
      }

      // Track braces
      const openBraces = (trimmed.match(/\{/g) || []).length;
      const closeBraces = (trimmed.match(/\}/g) || []).length;

      for (let i = 0; i < openBraces; i++) {
        if (hasFor || hasWhile) {
          scopeStack.push({ type: 'loop' });
        } else if (currentMethod && i === 0 && methodMatch) {
          scopeStack.push({ type: 'method', name: currentMethod });
        } else {
          scopeStack.push({ type: 'block' });
        }
      }

      // Check recursion only inside this method's body
      if (currentMethod && currentMethod !== 'main') {
        if (trimmed.includes(`${currentMethod}(`) && !methodRegex.test(trimmed)) {
          recursiveCalls.push({ function: currentMethod, line: lineNum });
        }
      }

      for (let i = 0; i < closeBraces; i++) {
        if (scopeStack.length > 0) {
          const popped = scopeStack.pop();
          if (popped.type === 'loop' && currentLoopDepth > 0) {
            currentLoopDepth--;
          }
          if (popped.type === 'method') {
            currentMethod = null;
          }
        } else if (currentLoopDepth > 0) {
          currentLoopDepth--;
        }
      }

      // Check logarithmic indicators
      if (
        trimmed.includes('/ 2') ||
        trimmed.includes('>>> 1') ||
        trimmed.includes('>> 1') ||
        trimmed.includes('/= 2') ||
        trimmed.includes('*= 2') ||
        trimmed.includes('mid =')
      ) {
        hasLogarithmicStep = true;
      }

      // Data structure detections
      if (trimmed.includes('Map<') || trimmed.includes('HashMap')) usesMap = true;
      if (trimmed.includes('Set<') || trimmed.includes('HashSet')) usesSet = true;
      if (trimmed.includes('List<') || trimmed.includes('ArrayList')) usesList = true;
      if (trimmed.includes('Queue<') || trimmed.includes('LinkedList') || trimmed.includes('ArrayDeque')) usesQueue = true;
      if (trimmed.includes('Stack<')) usesStack = true;
      if (trimmed.includes('PriorityQueue')) usesPriorityQueue = true;
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

    if (/(\bdp\b|memo)\[/i.test(code) || code.includes('int[][] dp')) {
      detectedPatterns.push('Dynamic Programming');
    }

    if (recursiveCalls.length > 0) {
      detectedPatterns.push('Recursion / DFS');
    }

    if (usesQueue) {
      detectedPatterns.push('BFS / Queue');
    }

    if (usesStack) {
      detectedPatterns.push('Stack and Queue');
    }

    if (usesPriorityQueue) {
      detectedPatterns.push('Heap / Priority Queue');
    }

    if (code.includes('Arrays.sort') || code.includes('Collections.sort')) {
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
    if (usesMap || usesSet || usesList || usesQueue || usesStack || usesPriorityQueue) {
      ruleSpace = 'O(n)';
    } else if (recursiveCalls.length > 0) {
      ruleSpace = 'O(n) [call stack]';
    }

    return {
      language: 'java',
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
        ...(usesMap ? ['java.util.HashMap'] : []),
        ...(usesSet ? ['java.util.HashSet'] : []),
        ...(usesList ? ['java.util.ArrayList'] : []),
        ...(usesQueue ? ['java.util.Queue / ArrayDeque'] : []),
        ...(usesStack ? ['java.util.Stack'] : []),
        ...(usesPriorityQueue ? ['java.util.PriorityQueue'] : []),
      ],
    };
  }
}

module.exports = JavaAdapter;
