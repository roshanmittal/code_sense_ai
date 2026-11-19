import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.success) {
        navigate('/workspace');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('dev@codesense.ai');
    setPassword('password123');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl max-w-md w-full p-8 shadow-2xl flex flex-col gap-6">
        {/* Brand & Heading */}
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 tracking-tight">Sign In to CodeSense AI</h2>
          <p className="text-xs text-gray-400 mt-1">
            Access your code submissions, persistent analysis history, and AI metrics.
          </p>
        </div>

        {errorMsg && (
          <Alert type="danger" title="Authentication Error">
            {errorMsg}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div>
            <label className="text-gray-300 font-semibold mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@codesense.ai"
                className="w-full bg-[#0d1117] text-gray-100 pl-9 pr-3 py-2.5 rounded-lg border border-[#30363d] focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 font-semibold mb-1 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d1117] text-gray-100 pl-9 pr-3 py-2.5 rounded-lg border border-[#30363d] focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full mt-2"
          >
            Sign In
          </Button>
        </form>

        {/* Demo Quick Login */}
        <div className="pt-3 border-t border-[#30363d] flex flex-col gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFillDemo}
            leftIcon={<UserCheck className="w-4 h-4 text-indigo-400" />}
            className="w-full text-xs"
          >
            Auto-fill Registered Developer Account
          </Button>

          <p className="text-center text-xs text-gray-400 mt-2">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
