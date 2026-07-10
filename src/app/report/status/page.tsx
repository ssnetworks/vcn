'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  ArrowLeft,
  Lock,
  Hourglass,
  CheckCircle,
  FileX,
  Terminal,
  Activity,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface StatusReport {
  id: string;
  category: string;
  status: 'New' | 'Under Investigation' | 'Resolved' | 'Dismissed';
  dateOfIncident: string;
  notes: string;
  createdAt: string;
}

export default function StatusCheckerPage() {
  const [caseId, setCaseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<StatusReport | null>(null);
  const [error, setError] = useState('');

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setReport(null);

    if (!caseId.trim()) {
      setError('Please input a valid Case ID.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/reports/status?id=${caseId.trim()}`);
      const data = await response.json();
      
      if (data.success) {
        setReport(data.report);
      } else {
        setError(data.error || 'Case ID not registered in VCN secure nodes.');
      }
    } catch (err) {
      setError('Network communication failure. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 bg-slate-950 font-sans selection:bg-cyber-cyan selection:text-black">
      <div className="scanlines-overlay" />
      <Navbar />

      {/* Background patterns */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-[140px] pointer-events-none" />

      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-cyber-cyan transition-colors">
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>RETURN TO OPERATIONS CENTER</span>
          </Link>
        </div>

        <div className="space-y-8">
          
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold font-mono text-white flex items-center space-x-2 tracking-tight">
              <Terminal className="h-8 w-8 text-cyber-cyan" />
              <span>TRACK CASE STATUS</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              If you have registered an incident with VCN, input your unique Case ID reference code below to check on investigation progress, status updates, and resolutions.
            </p>
          </div>

          {/* Form checker */}
          <form onSubmit={handleCheckStatus} className="glass-panel p-6 rounded-sm space-y-4">
            <div>
              <label className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                Secure Case Identifier
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    placeholder="e.g. rep_1001"
                    className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="cyber-btn px-6 py-2.5 rounded-sm text-xs font-mono tracking-wider disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'QUERYING VAULT...' : 'CHECK STATUS'}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs font-mono text-red-500 mt-2">
                [ALERT] {error}
              </div>
            )}
          </form>

          {/* Results Viewer */}
          <AnimatePresence mode="wait">
            {report && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-panel-glow p-8 rounded-sm space-y-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-cyber-cyan" />
                    <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                      Operational Ledger: {report.id}
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">
                    FILED: {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Status Layout cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1 bg-slate-900/50 p-4 rounded-sm border border-slate-900">
                    <span className="text-[9px] text-slate-500 block uppercase">Incident Scope</span>
                    <span className="text-white text-xs font-sans font-bold">{report.category}</span>
                  </div>

                  <div className="space-y-1 bg-slate-900/50 p-4 rounded-sm border border-slate-900">
                    <span className="text-[9px] text-slate-500 block uppercase">Operational Status</span>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      {report.status === 'New' && (
                        <>
                          <Lock className="h-4 w-4 text-cyber-blue animate-pulse" />
                          <span className="text-cyber-blue font-bold">New File</span>
                        </>
                      )}
                      {report.status === 'Under Investigation' && (
                        <>
                          <Hourglass className="h-4 w-4 text-amber-500" />
                          <span className="text-amber-500 font-bold">Under Investigation</span>
                        </>
                      )}
                      {report.status === 'Resolved' && (
                        <>
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">Case Resolved</span>
                        </>
                      )}
                      {report.status === 'Dismissed' && (
                        <>
                          <FileX className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-400 font-bold">File Archived / Dismissed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Resolution Notes box */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    VCN Coordinator Operational Update
                  </label>
                  <div className="bg-[#03050a] border border-slate-900 p-4 rounded-sm text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                    {report.notes}
                  </div>
                </div>

                {/* Secure communication check */}
                <div className="border-t border-slate-900 pt-4 flex items-center justify-between text-[9px] font-mono text-slate-500">
                  <span>AES_256 CASE FILE // ENCRYPTED ACCESS ONLY</span>
                  <span className="flex items-center text-cyber-cyan">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                    SECURE SHIELD ACTIVE
                  </span>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </main>

      <Footer />
    </div>
  );
}
