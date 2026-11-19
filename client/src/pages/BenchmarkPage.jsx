import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BarChart3, 
  Play, 
  Clock, 
  HardDrive, 
  Zap, 
  AlertTriangle, 
  ArrowLeft,
  CheckCircle2,
  Scale
} from 'lucide-react';
import { useCodeEditor } from '../context/CodeEditorContext';
import { benchmarkService } from '../services/benchmarkService';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Alert } from '../components/common/Alert';

export const BenchmarkPage = () => {
  const navigate = useNavigate();
  const { language, code, optimizationResult } = useCodeEditor();

  const originalSource = optimizationResult?.originalCode || code;
  const optimizedSource = optimizationResult?.optimizedCode || code;

  const [benchmarkData, setBenchmarkData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [iterations, setIterations] = useState(2);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    setErrorMsg(null);
    try {
      const data = await benchmarkService.runBenchmark({
        language,
        originalCode: originalSource,
        optimizedCode: optimizedSource,
        iterations,
      });
      if (data.success) {
        setBenchmarkData(data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Benchmarking failed.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#30363d]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/workspace')}
            className="p-2 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-gray-400 hover:text-white border border-[#30363d] transition-colors"
            title="Back to Workspace"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-400" />
              <span>Performance Benchmarking Suite</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Empirical wall-clock latency & memory benchmarking across varying input scales.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <span>Runs/Suite:</span>
            <select
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="bg-[#21262d] text-gray-100 text-xs px-2 py-1 rounded border border-[#30363d]"
            >
              <option value={1}>1 Run</option>
              <option value={2}>2 Runs (Averaged)</option>
              <option value={3}>3 Runs (Averaged)</option>
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleRunBenchmark}
            isLoading={isRunning}
            leftIcon={<Play className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />}
          >
            Execute Benchmark
          </Button>
        </div>
      </div>

      {errorMsg && (
        <Alert type="danger" title="Benchmark Run Error">
          {errorMsg}
        </Alert>
      )}

      {/* Prominent Theoretical vs Measured Big-O Disclaimer */}
      <Alert type="info" title="Distinction: Measured Runtime vs Theoretical Big-O">
        Theoretical complexity (e.g. O(n) vs O(n²)) governs how operations scale toward infinity. Wall-clock execution times measured below depend on system CPU cache, process startup overhead, and JVM/V8 JIT compilation. Measured latency provides practical performance insights but does not constitute a formal mathematical asymptotic proof.
      </Alert>

      {/* Benchmark Visuals & Charts */}
      {benchmarkData ? (
        <div className="flex flex-col gap-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-medium">Average Baseline Time:</span>
              <span className="text-xl font-bold font-mono text-gray-200">
                {benchmarkData.summary?.averageOriginalTimeMs} ms
              </span>
            </div>
            <div className="bg-[#161b22] border border-indigo-700/50 rounded-xl p-4 flex flex-col gap-1">
              <span className="text-xs text-indigo-300 font-medium">Average Optimized Time:</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {benchmarkData.summary?.averageOptimizedTimeMs} ms
              </span>
            </div>
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-medium">Peak Relative Speedup:</span>
              <span className="text-xl font-bold font-mono text-sky-400">
                {benchmarkData.benchmarkResults?.[benchmarkData.benchmarkResults.length - 1]?.speedup || '1.0x'}
              </span>
            </div>
          </div>

          {/* Recharts Execution Time Comparison */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Execution Time by Input Scale (Lower is Better)</span>
              </h3>
              <Badge variant="primary" size="sm">Milliseconds (ms)</Badge>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={benchmarkData.benchmarkResults}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                  <XAxis dataKey="name" stroke="#6e7681" fontSize={12} />
                  <YAxis stroke="#6e7681" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161b22',
                      borderColor: '#30363d',
                      borderRadius: '8px',
                      color: '#e6edf3',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="originalTimeMs" name="Original Code (ms)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="optimizedTimeMs" name="Optimized Code (ms)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Benchmark Results Table */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-[#21262d] border-b border-[#30363d] text-xs font-semibold text-gray-200">
              Benchmark Iteration Data
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-300">
                <thead className="bg-[#161b22] text-gray-400 uppercase tracking-wider text-[10px] border-b border-[#30363d]">
                  <tr>
                    <th className="px-4 py-3">Suite Name</th>
                    <th className="px-4 py-3">Original Time</th>
                    <th className="px-4 py-3">Optimized Time</th>
                    <th className="px-4 py-3">Speedup Ratio</th>
                    <th className="px-4 py-3">Output Parity</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d] font-mono">
                  {benchmarkData.benchmarkResults?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#21262d]/50">
                      <td className="px-4 py-3 font-semibold text-gray-200 font-sans">{row.name}</td>
                      <td className="px-4 py-3 text-rose-400">{row.originalTimeMs} ms</td>
                      <td className="px-4 py-3 text-emerald-400 font-semibold">{row.optimizedTimeMs} ms</td>
                      <td className="px-4 py-3 text-sky-400 font-bold">{row.speedup}</td>
                      <td className="px-4 py-3 font-sans">
                        {row.outputsMatch ? (
                          <Badge variant="success" size="sm">Identical</Badge>
                        ) : (
                          <Badge variant="warning" size="sm">Differs</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 font-sans">
                        <Badge variant={row.optimizedStatus === 'Success' ? 'success' : 'default'} size="sm">
                          {row.optimizedStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-12 text-center text-gray-400 flex flex-col items-center justify-center">
          <BarChart3 className="w-12 h-12 text-indigo-400 mb-3" />
          <h3 className="text-base font-semibold text-gray-200">Benchmark Ready</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md">
            Execute a comparative benchmark of your original and optimized code across small, medium, and large input scales.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={handleRunBenchmark}
            isLoading={isRunning}
            leftIcon={<Play className="w-4 h-4 fill-white" />}
            className="mt-5"
          >
            Start Benchmark Run
          </Button>
        </div>
      )}
    </div>
  );
};
