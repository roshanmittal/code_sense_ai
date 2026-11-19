import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  LayoutDashboard, 
  Sparkles, 
  Zap, 
  Code2, 
  Terminal, 
  Clock, 
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';
import { Badge, ComplexityBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#6366f1', '#38bdf8', '#34d399', '#fbbf24', '#f43f5e', '#c084fc'];

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const data = await dashboardService.getStats();
          if (data.success) {
            setStats(data.stats);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Dashboard Top Welcome & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#30363d]">
        <div>
          <h1 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-400" />
            <span>Developer Analytics Dashboard</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time algorithmic metrics, complexity patterns, and optimization outcomes.
          </p>
        </div>

        <Link to="/workspace">
          <Button variant="primary" size="sm" leftIcon={<Code2 className="w-3.5 h-3.5" />}>
            Open Workspace
          </Button>
        </Link>
      </div>

      {!isAuthenticated && (
        <div className="p-4 bg-indigo-950/30 border border-indigo-800/40 rounded-xl text-xs text-indigo-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Sign in to store persistent analyses and synchronize your personal multi-day statistics.</span>
          </div>
          <Link to="/login">
            <Button variant="outline" size="sm" className="border-indigo-700/60 text-xs py-1">
              Sign In
            </Button>
          </Link>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Total Analyses</div>
            <div className="text-2xl font-bold font-mono text-gray-100 mt-1">
              {stats?.totalAnalyses ?? 0}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">Code submissions analyzed</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Total Optimizations</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              {stats?.totalOptimizations ?? 0}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">AI optimizations generated</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-600/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Saved Submissions</div>
            <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
              {stats?.totalSubmissions ?? 0}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">Stored in database</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-600/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Code2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Code Executions</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {stats?.totalExecutions ?? 0}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">Isolated runner executions</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-600/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Terminal className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual Charts: Languages and Pattern Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Language Distribution (Donut Chart) */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Programming Languages Used</span>
            </h3>
            <span className="text-[11px] text-gray-500 font-mono">Actual Records</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {stats?.languages && stats.languages.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.languages}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="name"
                  >
                    {stats.languages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161b22',
                      borderColor: '#30363d',
                      borderRadius: '8px',
                      color: '#e6edf3',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-gray-500 italic text-center">
                No language data recorded yet. Submit code in Workspace to visualize.
              </div>
            )}
          </div>
        </div>

        {/* Algorithmic Patterns Frequency (Bar Chart) */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Detected Algorithmic Patterns</span>
            </h3>
            <span className="text-[11px] text-gray-500 font-mono">Frequency</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {stats?.patterns && stats.patterns.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.patterns} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                  <XAxis dataKey="pattern" stroke="#6e7681" fontSize={11} angle={-15} textAnchor="end" />
                  <YAxis stroke="#6e7681" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161b22',
                      borderColor: '#30363d',
                      borderRadius: '8px',
                      color: '#e6edf3',
                    }}
                  />
                  <Bar dataKey="count" name="Detections" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-gray-500 italic text-center">
                No algorithmic patterns recorded yet. Run analysis to detect patterns.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7-Day Activity Area Chart */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>7-Day Coding & Analysis Activity</span>
          </h3>
          <span className="text-[11px] text-gray-500 font-mono">Database Timeline</span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.activityTimeline || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
              <XAxis dataKey="day" stroke="#6e7681" fontSize={12} />
              <YAxis stroke="#6e7681" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161b22',
                  borderColor: '#30363d',
                  borderRadius: '8px',
                  color: '#e6edf3',
                }}
              />
              <Area
                type="monotone"
                dataKey="analyses"
                stroke="#34d399"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#activityGradient)"
                name="Analyses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables: Recent Submissions & Recent Optimizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Submissions */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="px-4 py-3 bg-[#21262d] border-b border-[#30363d] text-xs font-semibold text-gray-200 flex items-center justify-between">
              <span>Recent Code Submissions</span>
              <Link to="/history" className="text-indigo-400 hover:underline text-[11px]">View All</Link>
            </div>
            {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
              <div className="divide-y divide-[#30363d]">
                {stats.recentSubmissions.map((sub) => (
                  <div key={sub._id} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#21262d]/50">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-200">{sub.title}</span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant="cyan" size="sm">{sub.language}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-500 italic">
                No recent submissions recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Optimizations */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="px-4 py-3 bg-[#21262d] border-b border-[#30363d] text-xs font-semibold text-gray-200 flex items-center justify-between">
              <span>Recent Optimizations</span>
              <Link to="/comparison" className="text-indigo-400 hover:underline text-[11px]">Compare</Link>
            </div>
            {stats?.recentOptimizations && stats.recentOptimizations.length > 0 ? (
              <div className="divide-y divide-[#30363d]">
                {stats.recentOptimizations.map((opt) => (
                  <div key={opt._id} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#21262d]/50">
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" size="sm">{opt.originalAnalysis?.timeComplexity || 'O(n^2)'}</Badge>
                      <ArrowRight className="w-3 h-3 text-gray-500" />
                      <Badge variant="primary" size="sm">{opt.optimizedAnalysis?.timeComplexity || 'O(n)'}</Badge>
                    </div>
                    <Badge variant="success" size="sm">{opt.language}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-500 italic">
                No optimization records generated yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
