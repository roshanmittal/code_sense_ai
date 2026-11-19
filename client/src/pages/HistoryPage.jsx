import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, 
  Search, 
  Trash2, 
  Code2, 
  Clock, 
  HardDrive, 
  ExternalLink,
  Filter,
  Eye,
  X
} from 'lucide-react';
import { historyService } from '../services/historyService';
import { useCodeEditor } from '../context/CodeEditorContext';
import { useAuth } from '../context/AuthContext';
import { Badge, ComplexityBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const { setCode, setLanguage, setAnalysisResult, setOptimizationResult } = useCodeEditor();
  const { isAuthenticated } = useAuth();

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHistory = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await historyService.getHistory({
        language: selectedLanguage,
        search: searchQuery,
        page,
        limit: 10,
      });
      if (data.success) {
        setAnalyses(data.analyses);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedLanguage, page, isAuthenticated]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis record?')) return;
    try {
      await historyService.deleteHistoryItem(id);
      setAnalyses(analyses.filter((item) => item._id !== id));
      if (selectedItem?._id === id) setSelectedItem(null);
    } catch (err) {
      alert('Failed to delete history item');
    }
  };

  const handleOpenInWorkspace = (item) => {
    setLanguage(item.language);
    setCode(item.code);
    setAnalysisResult(item);
    navigate('/workspace');
  };

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Page Header */}
      <div className="flex flex-col gap-1 pb-4 border-b border-[#30363d]">
        <h1 className="text-xl font-bold text-gray-100 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <span>Persistent Analysis & Optimization History</span>
        </h1>
        <p className="text-xs text-gray-400">
          Stored code analyses, detected patterns, and optimization outcomes associated with your account.
        </p>
      </div>

      {!isAuthenticated ? (
        <div className="p-12 bg-[#161b22] border border-[#30363d] rounded-xl text-center text-gray-400 flex flex-col items-center justify-center">
          <History className="w-10 h-10 text-gray-500 mb-2" />
          <h3 className="text-sm font-semibold text-gray-200">Sign in to view your history</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mb-4">
            Analysis records are automatically saved to MongoDB when you are logged in.
          </p>
          <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        </div>
      ) : (
        <>
          {/* Search and Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161b22] border border-[#30363d] p-3.5 rounded-xl shadow-sm">
            <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search code snippets, algorithms, patterns..."
                  className="w-full bg-[#0d1117] text-gray-200 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#30363d] focus:outline-none focus:border-indigo-500"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm">
                Search
              </Button>
            </form>

            <div className="flex items-center gap-2">
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setPage(1);
                }}
                className="bg-[#0d1117] text-gray-200 text-xs px-3 py-1.5 rounded-lg border border-[#30363d] focus:outline-none"
              >
                <option value="all">All Languages</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
          </div>

          {/* History Records Table / Cards */}
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading history records...</div>
          ) : analyses.length === 0 ? (
            <div className="p-12 bg-[#161b22] border border-[#30363d] rounded-xl text-center text-gray-400">
              No analysis records found. Analyze code in the Workspace to save your first record!
            </div>
          ) : (
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-gray-300">
                  <thead className="bg-[#0d1117] text-gray-400 uppercase tracking-wider text-[10px] border-b border-[#30363d]">
                    <tr>
                      <th className="px-4 py-3">Language</th>
                      <th className="px-4 py-3">Algorithm & Patterns</th>
                      <th className="px-4 py-3">Time Complexity</th>
                      <th className="px-4 py-3">Space Complexity</th>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#30363d]">
                    {analyses.map((item) => (
                      <tr
                        key={item._id}
                        onClick={() => setSelectedItem(item)}
                        className="hover:bg-[#21262d]/50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-gray-200">
                          <Badge variant="cyan" size="sm">{item.language}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-200">
                            {item.algorithm?.primaryAlgorithm || 'General'}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {item.algorithm?.detectedPatterns?.map((pat, idx) => (
                              <span key={idx} className="text-[10px] text-gray-400 bg-[#0d1117] px-1.5 py-0.2 rounded border border-[#21262d]">
                                {pat}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <ComplexityBadge complexity={item.timeComplexity?.worst || 'O(n)'} type="time" />
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <ComplexityBadge complexity={item.spaceComplexity?.auxiliary || 'O(1)'} type="space" />
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-[11px] font-mono">
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenInWorkspace(item);
                              }}
                              className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-indigo-600 text-gray-200 hover:text-white border border-[#30363d] text-xs transition-colors"
                              title="Re-open code in Workspace editor"
                            >
                              Load
                            </button>
                            <button
                              onClick={(e) => handleDelete(item._id, e)}
                              className="p-1.5 rounded hover:bg-rose-950/40 text-gray-400 hover:text-rose-400 transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-3 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between text-xs text-gray-400">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span>Page {page} of {totalPages}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Quick Modal Preview of Selected Item */}
          {selectedItem && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-[#0d1117] border-b border-[#30363d]">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-sm text-gray-200">
                      Analysis Details – {selectedItem.language.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
                  <div>
                    <span className="text-gray-400 block mb-1 font-sans font-semibold">Source Code:</span>
                    <pre className="p-3 bg-[#0d1117] text-gray-200 rounded-lg border border-[#30363d] overflow-x-auto whitespace-pre-wrap">
                      {selectedItem.code}
                    </pre>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-sans">
                    <div className="p-3 bg-[#0d1117] rounded-lg border border-[#21262d]">
                      <div className="text-gray-400 mb-1">Time Complexity:</div>
                      <ComplexityBadge complexity={selectedItem.timeComplexity?.worst} type="time" />
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">{selectedItem.timeComplexity?.explanation}</p>
                    </div>
                    <div className="p-3 bg-[#0d1117] rounded-lg border border-[#21262d]">
                      <div className="text-gray-400 mb-1">Space Complexity:</div>
                      <ComplexityBadge complexity={selectedItem.spaceComplexity?.auxiliary} type="space" />
                      <p className="text-gray-300 text-xs mt-2 leading-relaxed">{selectedItem.spaceComplexity?.explanation}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-end gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setSelectedItem(null)}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenInWorkspace(selectedItem)}
                  >
                    Open in Workspace
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
