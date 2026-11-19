import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  ExternalLink, 
  Filter, 
  BookOpen, 
  Layers,
  Sparkles
} from 'lucide-react';
import { recommendationService } from '../services/recommendationService';
import { Badge, DifficultyBadge } from '../components/common/Badge';

export const RecommendationsPage = () => {
  const [problems, setProblems] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const patternsList = [
    'all',
    'Two Pointers',
    'Sliding Window',
    'Binary Search',
    'Dynamic Programming',
    'Hashing',
    'Graph Algorithms',
    'Tree Traversal',
    'Greedy',
    'Backtracking',
    'Stack and Queue',
    'Sorting',
  ];

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const data = await recommendationService.getProblems({
          pattern: selectedPattern,
          difficulty: selectedDifficulty,
        });
        if (data.success) {
          setProblems(data.problems);
        }
      } catch (err) {
        console.error('Failed to load problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [selectedPattern, selectedDifficulty]);

  const filteredProblems = problems.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Page Header */}
      <div className="flex flex-col gap-1 pb-4 border-b border-[#30363d]">
        <h1 className="text-xl font-bold text-gray-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-400" />
          <span>Curated DSA Problem Recommendations</span>
        </h1>
        <p className="text-xs text-gray-400">
          Grounded algorithmic problem recommendations organized by pattern, data structure, and asymptotic complexity.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161b22] border border-[#30363d] p-3.5 rounded-xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search box */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems, patterns, topics..."
              className="w-full bg-[#0d1117] text-gray-200 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#30363d] focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Pattern Filter */}
          <select
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            className="bg-[#0d1117] text-gray-200 text-xs px-3 py-1.5 rounded-lg border border-[#30363d] focus:outline-none focus:border-indigo-500"
          >
            {patternsList.map((pat) => (
              <option key={pat} value={pat}>
                {pat === 'all' ? 'All Algorithmic Patterns' : pat}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-[#0d1117] text-gray-200 text-xs px-3 py-1.5 rounded-lg border border-[#30363d] focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div className="text-xs text-gray-400 font-mono">
          {filteredProblems.length} Problem{filteredProblems.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Problem Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-400">Loading problem recommendations...</div>
      ) : filteredProblems.length === 0 ? (
        <div className="p-12 bg-[#161b22] border border-[#30363d] rounded-xl text-center text-gray-400">
          No problems matching the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProblems.map((prob) => (
            <div
              key={prob.id}
              className="bg-[#161b22] border border-[#30363d] hover:border-indigo-500/50 rounded-xl p-4 shadow-sm flex flex-col justify-between transition-all hover:shadow-indigo-500/5 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-gray-200 group-hover:text-indigo-400 transition-colors">
                    {prob.title}
                  </h3>
                  <DifficultyBadge difficulty={prob.difficulty} />
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  <Badge variant="purple" size="sm">
                    {prob.pattern}
                  </Badge>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3">
                  {prob.description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between py-2 border-t border-[#30363d]/60 text-[11px] font-mono text-gray-400 mb-3">
                  <span>Target Time: <span className="text-emerald-400 font-semibold">{prob.timeComplexity}</span></span>
                  <span>Space: <span className="text-sky-400 font-semibold">{prob.spaceComplexity}</span></span>
                </div>

                <a
                  href={prob.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#21262d] hover:bg-indigo-600 text-gray-200 hover:text-white border border-[#30363d] hover:border-indigo-600 text-xs font-medium transition-colors"
                >
                  <span>Solve on Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
