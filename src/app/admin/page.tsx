'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Terminal, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // If user already logged in, redirect straight to dashboard
    const token = localStorage.getItem('vcn_session_token');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('vcn_session_token', data.token);
        localStorage.setItem('vcn_username', data.user.username);
        localStorage.setItem('vcn_user_role', data.user.role);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Communication link failure. Verify network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-cyber-cyan selection:text-black">
      <div className="scanlines-overlay" />
      
      {/* Background visual details */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="absolute w-80 h-80 bg-cyber-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Login Card */}
      <div className="glass-panel-glow p-8 rounded-sm max-w-md w-full relative z-10 space-y-6">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-4">
          <div className="flex items-center space-x-2">
            <Terminal className="h-5 w-5 text-cyber-cyan" />
            <span className="font-mono text-xs text-slate-400">VCN_TERMINAL v3.2</span>
          </div>
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-cyber-cyan/60 animate-pulse" />
          </div>
        </div>

        {/* Logo and Titles */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyber-cyan/5 border border-cyber-cyan/20">
            <ShieldCheck className="h-8 w-8 text-cyber-cyan" />
          </div>
          <h2 className="text-lg font-bold font-mono text-white tracking-widest uppercase">
            Admin Command Center
          </h2>
          <p className="text-[10px] font-mono text-slate-500 tracking-wider">
            AUTHORIZATION REQUIRED // SECURED PORTS ONLY
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Username */}
          <div className="space-y-1">
            <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              Operator Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username"
                className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              Access Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-xs font-mono text-center text-red-500 min-h-[1.25rem]">
            {error && <span>[ALERT] {error}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="cyber-btn w-full py-3 rounded-sm flex items-center justify-center space-x-2 text-xs font-mono tracking-wider disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'INITIALIZING SHIELD...' : 'REQUEST AUTHENTICATION'}</span>
          </button>

        </form>

        {/* Back Link */}
        <div className="text-center pt-2">
          <a
            href="/"
            className="text-[10px] font-mono text-slate-500 hover:text-cyber-cyan transition-colors"
          >
            &larr; Return to Public Site
          </a>
        </div>

      </div>
    </div>
  );
}
