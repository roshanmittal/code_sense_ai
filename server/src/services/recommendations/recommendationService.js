const dsaProblems = require('../../config/dsaProblems');

class RecommendationService {
  /**
   * Recommend problems based on detected patterns and data structures
   * @param {Object} param0 
   * @returns {Array} Recommended problems
   */
  getRecommendations({ detectedPatterns = [], dataStructures = [], limit = 6 }) {
    if (!detectedPatterns || detectedPatterns.length === 0) {
      // Fallback to high-yield foundational problems if no specific pattern is found
      return dsaProblems.slice(0, limit);
    }

    const scoredProblems = dsaProblems.map((problem) => {
      let score = 0;

      // Check pattern match
      detectedPatterns.forEach((pattern) => {
        const cleanPattern = pattern.toLowerCase();
        if (problem.pattern.toLowerCase().includes(cleanPattern) || cleanPattern.includes(problem.pattern.toLowerCase())) {
          score += 10;
        }

        // Check tags match
        problem.tags.forEach((tag) => {
          if (tag.toLowerCase().includes(cleanPattern) || cleanPattern.includes(tag.toLowerCase())) {
            score += 5;
          }
        });
      });

      // Check data structures match
      dataStructures.forEach((ds) => {
        const cleanDs = ds.toLowerCase();
        problem.tags.forEach((tag) => {
          if (cleanDs.includes(tag.toLowerCase()) || tag.toLowerCase().includes(cleanDs)) {
            score += 3;
          }
        });
      });

      return {
        ...problem,
        matchScore: score,
      };
    });

    // Sort by match score descending
    scoredProblems.sort((a, b) => b.matchScore - a.matchScore);

    // Return top recommendations
    return scoredProblems.slice(0, limit);
  }

  /**
   * Return all curated problems with optional filtering by pattern and difficulty
   */
  getAllProblems({ pattern, difficulty } = {}) {
    let filtered = [...dsaProblems];
    if (pattern && pattern !== 'all') {
      filtered = filtered.filter((p) => p.pattern.toLowerCase() === pattern.toLowerCase());
    }
    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter((p) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    return filtered;
  }
}

module.exports = new RecommendationService();
