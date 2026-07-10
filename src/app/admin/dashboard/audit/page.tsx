'use client';

import React, { useState, useEffect } from 'react';
import { History, Search, Activity, ShieldAlert, Cpu } from 'lucide-react';

interface AuditLog {
  id: string;
  username: string;
  action: string;
  ip: string;
  timestamp: string;
}

export default function ComplianceAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('vcn_session_token');
      if (!token) return;

      const response = await fetch('/api/audit', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLogs(data.auditLogs);
      }
    } catch (err) {
      console.error('Fetch audit logs failure:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    return (
      log.id.toLowerCase().includes(search.toLowerCase()) ||
      log.username.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.ip.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center font-mono text-slate-500 text-xs">
        <span>COLLECTING COMPLIANCE TRAILS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
          System Compliance Audit Logs
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-mono">
          SECURED AUDIT TRAIL // FORENSIC LOG RECEPTOR
        </p>
      </div>

      {/* Warning Box */}
      <div className="glass-panel border-cyber-cyan/35 bg-cyber-cyan/5 p-4 rounded-sm flex items-start space-x-3">
        <Cpu className="h-5 w-5 text-cyber-cyan flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="text-xs text-slate-300 font-mono leading-relaxed">
          <strong>Immutable Record Notice:</strong> Audit logs record system actions to track investigator activities. Log records are write-only at the API layer and cannot be deleted or modified by standard operators.
        </div>
      </div>

      {/* Filters Search panel */}
      <div className="glass-panel p-6 rounded-sm flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter logs by operator, action, ID, or IP..."
            className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-cyber-cyan font-mono"
          />
        </div>
        <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
          RECORDS COUNT: {filteredLogs.length}
        </span>
      </div>

      {/* Audit Logs Table */}
      <div className="glass-panel rounded-sm overflow-hidden border border-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            
            <thead className="bg-[#030712] border-b border-slate-900 text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Log ID</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Operator</th>
                <th className="px-6 py-4">Action Event</th>
                <th className="px-6 py-4">Source IP</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-900 bg-transparent text-slate-400">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/25 transition-all">
                    
                    <td className="px-6 py-4 font-bold text-slate-500">
                      {log.id}
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className={`px-6 py-4 font-bold ${
                      log.username === 'SYSTEM' 
                        ? 'text-cyber-cyan' 
                        : log.username === 'admin'
                        ? 'text-white'
                        : 'text-slate-300'
                    }`}>
                      {log.username}
                    </td>

                    <td className="px-6 py-4 text-slate-200">
                      {log.action}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {log.ip}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-mono text-xs">
                    NO LOG ENTRIES RECORDED UNDER SEARCH FILTER
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
