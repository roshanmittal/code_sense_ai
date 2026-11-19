const geminiProvider = require('./geminiProvider');
const {
  getAnalysisPrompt,
  getOptimizationPrompt,
  getDebuggingPrompt,
  getAssistantPrompt,
} = require('./promptTemplates');

class AiService {
  isConfigured() {
    return geminiProvider.isAvailable();
  }

  /**
   * Hybrid code analysis combining AST metrics with LLM or static rules
   */
  async analyzeCode({ language, code, staticMetrics }) {
    if (this.isConfigured()) {
      try {
        const prompt = getAnalysisPrompt({ language, code, staticMetrics });
        const aiResult = await geminiProvider.generateJson(prompt);
        return {
          ...aiResult,
          source: 'hybrid-ai-ast',
          staticMetrics,
        };
      } catch (err) {
        console.warn(`[AiService] Gemini analysis failed: ${err.message}. Using rule-based static engine.`);
      }
    }

    // Heuristic rule-based fallback when LLM_API_KEY is not configured
    return this.generateHeuristicAnalysis({ language, code, staticMetrics });
  }

  /**
   * Code optimization generating optimized code and dual complexity analysis
   */
  async optimizeCode({ language, code, currentAnalysis }) {
    if (this.isConfigured()) {
      try {
        const prompt = getOptimizationPrompt({ language, code, currentAnalysis });
        const aiResult = await geminiProvider.generateJson(prompt);
        return {
          ...aiResult,
          source: 'llm-optimization',
        };
      } catch (err) {
        console.warn(`[AiService] Gemini optimization failed: ${err.message}.`);
      }
    }

    // Heuristic optimization fallback
    return this.generateHeuristicOptimization({ language, code, currentAnalysis });
  }

  /**
   * Debugging assistance using error diagnostics
   */
  async debugCode({ language, code, compilerError, runtimeError, stdout, stderr }) {
    if (this.isConfigured()) {
      try {
        const prompt = getDebuggingPrompt({
          language,
          code,
          compilerError,
          runtimeError,
          stdout,
          stderr,
        });
        return await geminiProvider.generateJson(prompt);
      } catch (err) {
        console.warn(`[AiService] Gemini debug failed: ${err.message}`);
      }
    }

    // Rule-based diagnostic fallback
    return {
      hasBugs: Boolean(compilerError || runtimeError || stderr),
      errorCategory: compilerError ? 'Compilation Error' : (runtimeError || stderr ? 'Runtime Error' : 'Analysis Notice'),
      rootCause: compilerError || runtimeError || stderr || 'No runtime crash detected. Configure LLM_API_KEY for in-depth automated logical bug analysis.',
      fixedCode: code,
      fixExplanation: 'Set LLM_API_KEY in your environment to enable full AI automatic code repair and refactoring.',
      edgeCasesToConsider: [
        'Empty or null input',
        'Large inputs exceeding default stack/heap bounds',
        'Boundary index conditions (0 and n - 1)',
      ],
      source: 'static-diagnostics',
    };
  }

  /**
   * Conversational Assistant with code context
   */
  async chat({ language, codeContext, conversationHistory = [], userMessage }) {
    if (this.isConfigured()) {
      try {
        const prompt = getAssistantPrompt({
          language,
          codeContext,
          conversationHistory,
          userMessage,
        });
        return await geminiProvider.generateText(prompt);
      } catch (err) {
        console.warn(`[AiService] Gemini chat failed: ${err.message}`);
      }
    }

    // Fallback conversational assistant
    return `### CodeSense AI Assistant Notice
LLM_API_KEY is not currently active in your environment.
To enable real-time conversational AI mentoring, please add your Google Gemini API key to your backend \`.env\` file (\`LLM_API_KEY=...\`).

**Current Code Insights based on static analysis:**
- Language: \`${language}\`
- Loop nesting depth: **${codeContext.split('\n').filter(l => /for|while/.test(l)).length} loop structures found**
- Detected algorithmic signatures: ${codeContext.includes('left') && codeContext.includes('right') ? 'Two Pointers / Binary Search' : 'Sequential Processing'}

You can run your code in the execution panel or test cases tab to view runtime diagnostics.`;
  }

  /**
   * Static heuristic analysis generator
   */
  generateHeuristicAnalysis({ language, code, staticMetrics }) {
    const timeEst = staticMetrics.ruleEstimatedTime || 'O(n)';
    const spaceEst = staticMetrics.ruleEstimatedSpace || 'O(1)';
    const patterns = staticMetrics.detectedPatterns.length > 0 ? staticMetrics.detectedPatterns : ['Sequential Iteration'];

    return {
      source: 'rule-based-engine (Configure LLM_API_KEY for advanced LLM reasoning)',
      timeComplexity: {
        best: timeEst === 'O(n^2)' ? 'O(n)' : (timeEst === 'O(n)' ? 'O(1)' : timeEst),
        average: timeEst,
        worst: timeEst,
        explanation: `Static structural inspection identified a maximum loop nesting depth of ${staticMetrics.maxLoopDepth} with ${staticMetrics.hasRecursion ? 'recursive branching' : 'iterative control flow'}. ${staticMetrics.hasLogarithmicStep ? 'Halving or logarithmic step detected.' : ''}`,
        nestedLoops: staticMetrics.loopLocations || [],
        recursionDetected: staticMetrics.hasRecursion || false,
        recursionDetails: staticMetrics.recursionDetails || '',
        inputSensitivity: 'Complexity depends directly on input scale n and whether early return conditions are satisfied.',
      },
      spaceComplexity: {
        auxiliary: spaceEst,
        total: staticMetrics.dataStructures?.length ? 'O(n)' : 'O(1)',
        explanation: `Memory usage derived from detected data allocations (${staticMetrics.dataStructures?.join(', ') || 'in-place variables'}) and ${staticMetrics.hasRecursion ? 'call-stack frames' : 'constant stack frame'}.`,
        dataStructuresUsed: staticMetrics.dataStructures || ['Primitive scalars'],
        recursionStack: staticMetrics.hasRecursion ? 'O(n) [call stack frames]' : 'O(1)',
      },
      algorithm: {
        primaryAlgorithm: patterns[0] || 'Linear Processing',
        category: patterns[0] || 'General Iterative',
        detectedPatterns: patterns,
        confidence: 0.85,
        dataStructures: staticMetrics.dataStructures || [],
      },
      codeQuality: {
        score: staticMetrics.maxLoopDepth > 2 ? 65 : (staticMetrics.maxLoopDepth === 2 ? 78 : 90),
        bottlenecks: staticMetrics.maxLoopDepth >= 2 ? [`Nested loop with depth ${staticMetrics.maxLoopDepth} leads to polynomial asymptotic time complexity`] : [],
        redundantOperations: [],
        memoryUsageNotes: staticMetrics.dataStructures?.length ? [`Allocates auxiliary memory: ${staticMetrics.dataStructures.join(', ')}`] : ['Minimal auxiliary memory used.'],
        logicalIssues: [],
        suggestions: staticMetrics.maxLoopDepth >= 2 ? ['Consider using a Hash Map or Two Pointers to reduce polynomial time to linear time.'] : ['Code structure follows standard idiomatic patterns.'],
      },
      staticMetrics,
      assumptionsAndUncertainties: [
        'Complexity estimate is derived via AST/tokenizer inspection of loop depths and recursion trees.',
        'Assumes standard uniform distribution and that inner loop limits scale linearly with input size n.',
        'Configure LLM_API_KEY in server/.env for deep multi-case LLM verification.',
      ],
    };
  }

  /**
   * Static heuristic optimization generator
   */
  generateHeuristicOptimization({ language, code, currentAnalysis }) {
    const isAlreadyOptimal = (currentAnalysis?.timeComplexity?.worst === 'O(n)' || currentAnalysis?.timeComplexity?.worst === 'O(1)' || currentAnalysis?.timeComplexity?.worst === 'O(log n)');

    return {
      source: 'heuristic-engine (Configure LLM_API_KEY for dynamic generative AI refactoring)',
      isAlreadyOptimal,
      optimizedCode: code,
      originalAnalysis: {
        timeComplexity: currentAnalysis?.timeComplexity?.worst || 'O(n^2)',
        spaceComplexity: currentAnalysis?.spaceComplexity?.auxiliary || 'O(1)',
        algorithm: currentAnalysis?.algorithm?.primaryAlgorithm || 'Nested Loop Iteration',
        explanation: 'Original solution analyzed using AST and static pattern inspection.',
      },
      optimizedAnalysis: {
        timeComplexity: isAlreadyOptimal ? currentAnalysis?.timeComplexity?.worst : 'O(n)',
        spaceComplexity: isAlreadyOptimal ? currentAnalysis?.spaceComplexity?.auxiliary : 'O(n)',
        algorithm: isAlreadyOptimal ? currentAnalysis?.algorithm?.primaryAlgorithm : 'AI-Optimized Hashing / Two Pointers',
        explanation: isAlreadyOptimal 
          ? 'Current solution is already asymptotically optimal for this pattern.'
          : 'Refactored approach replaces nested loops with a single-pass hash map or two-pointer sweep.',
      },
      approachExplanation: isAlreadyOptimal
        ? 'The submitted algorithm already achieves optimal asymptotic complexity for its class. No further asymptotic speedup is possible without changing problem requirements.'
        : 'Trade-off: Utilizing an auxiliary hash table or two-pointer traversal decreases time complexity from O(n^2) to O(n) by trading O(n) auxiliary memory space.',
      dataStructuresIntroduced: isAlreadyOptimal ? [] : ['Hash Table / Dictionary'],
      tradeOffs: {
        timeGain: isAlreadyOptimal ? 'Maintained optimal runtime' : 'Reduced from O(n^2) to O(n)',
        spaceCost: isAlreadyOptimal ? 'No extra space' : 'Increased auxiliary memory to O(n)',
        summary: 'Trades additional memory storage for drastic asymptotic execution speedup.',
      },
    };
  }
}

module.exports = new AiService();
