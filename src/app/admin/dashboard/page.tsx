'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  ShieldAlert,
  Inbox,
  Hourglass,
  CheckCircle,
  FileX,
  Activity,
  UserCheck,
  TrendingUp,
} from 'lucide-react';

interface Report {
  id: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface AuditLog {
  id: string;
  username: string;
  action: string;
  timestamp: string;
}

export default function DashboardOverviewPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('vcn_session_token');
        if (!token) return;

        // Fetch reports
        const reportsRes = await fetch('/api/reports', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        });
        const reportsData = await reportsRes.json();

        // Fetch audit logs
        const auditRes = await fetch('/api/audit', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        });
        const auditData = await auditRes.json();

        if (reportsData.success) setReports(reportsData.reports);
        if (auditData.success) setAuditLogs(auditData.auditLogs.slice(0, 5)); // Keep latest 5
      } catch (err) {
        console.error('Fetch dashboard details failure:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute counters
  const total = reports.length;
  const countNew = reports.filter(r => r.status === 'New').length;
  const countInvestigating = reports.filter(r => r.status === 'Under Investigation').length;
  const countResolved = reports.filter(r => r.status === 'Resolved').length;
  const countDismissed = reports.filter(r => r.status === 'Dismissed').length;

  // Recharts calculations: Category counts
  const categoryMap: { [key: string]: number } = {};
  reports.forEach(r => {
    categoryMap[r.category] = (categoryMap[r.category] || 0) + 1;
  });
  const categoryData = Object.keys(categoryMap).map(cat => ({
    name: cat.split(' ').slice(0, 2).join(' ') + '...', // shorten name for charts
    count: categoryMap[cat],
  }));

  // Recharts calculations: Priority counts
  const priorityMap = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  reports.forEach(r => {
    if (r.priority in priorityMap) {
      priorityMap[r.priority as keyof typeof priorityMap]++;
    }
  });
  const priorityData = Object.keys(priorityMap).map(pri => ({
    name: pri,
    value: priorityMap[pri as keyof typeof priorityMap],
  }));

  const COLORS = ['#10b981', '#0072ff', '#f59e0b', '#ef4444']; // green, blue, amber, red

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center font-mono text-slate-500 text-xs">
        <span>FETCHING METRICS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Title */}
      <div>
        <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
          System Overview Dashboard
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-mono">
          AGGREGATED CASE METRICS & COMPLIANCE TELEMETRY
        </p>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Total Cases */}
        <div className="glass-panel p-6 rounded-sm relative flex items-center justify-between">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-cyan/35" />
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Total Cases</span>
            <span className="text-3xl font-bold font-mono text-white">{total}</span>
          </div>
          <Inbox className="h-8 w-8 text-cyber-cyan/40" />
        </div>

        {/* New Cases */}
        <div className="glass-panel p-6 rounded-sm relative flex items-center justify-between">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyber-blue/35" />
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">New Files</span>
            <span className="text-3xl font-bold font-mono text-cyber-blue">{countNew}</span>
          </div>
          <ShieldAlert className="h-8 w-8 text-cyber-blue/40" />
        </div>

        {/* Under Investigation */}
        <div className="glass-panel p-6 rounded-sm relative flex items-center justify-between">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500/30" />
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Investigating</span>
            <span className="text-3xl font-bold font-mono text-amber-500">{countInvestigating}</span>
          </div>
          <Hourglass className="h-8 w-8 text-amber-500/40" />
        </div>

        {/* Resolved */}
        <div className="glass-panel p-6 rounded-sm relative flex items-center justify-between">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500/35" />
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Resolved</span>
            <span className="text-3xl font-bold font-mono text-emerald-500">{countResolved}</span>
          </div>
          <CheckCircle className="h-8 w-8 text-emerald-500/40" />
        </div>

        {/* Dismissed */}
        <div className="glass-panel p-6 rounded-sm relative flex items-center justify-between">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-700" />
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Dismissed</span>
            <span className="text-3xl font-bold font-mono text-slate-400">{countDismissed}</span>
          </div>
          <FileX className="h-8 w-8 text-slate-500/40" />
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category distribution chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-sm space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase tracking-wide">
            <TrendingUp className="h-4 w-4 text-cyber-cyan" />
            <span>Incidents Category Distribution</span>
          </div>
          <div className="h-[280px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} fontClassName="font-mono" />
                  <YAxis stroke="#64748b" fontSize={10} fontClassName="font-mono" allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'rgba(0,240,255,0.03)' }} />
                  <Bar dataKey="count" fill="#00f0ff" radius={[2, 2, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00f0ff' : '#0072ff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                NO CASE DATA AVAILABLE FOR ANALYSIS
              </div>
            )}
          </div>
        </div>

        {/* Priority split chart */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-sm space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase tracking-wide">
            <ShieldAlert className="h-4 w-4 text-cyber-cyan" />
            <span>Priority Level Split</span>
          </div>
          <div className="h-[280px] flex items-center justify-center">
            {reports.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, fontFamily: 'monospace' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-500 text-xs font-mono">
                NO CASE DATA
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Row: Recent activity console */}
      <div className="glass-panel p-6 rounded-sm space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase tracking-wide">
            <Activity className="h-4 w-4 text-cyber-cyan" />
            <span>Recent System Activity Audit Logs</span>
          </div>
          <span className="text-[9px] font-mono text-cyber-cyan animate-pulse">LIVE RECEPTOR ON</span>
        </div>

        {/* Terminal log logs */}
        <div className="bg-[#03050a] border border-slate-900 rounded-sm p-4 font-mono text-xs space-y-2.5 max-h-[220px] overflow-y-auto">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-400 border-b border-slate-900/30 pb-2 last:border-b-0 last:pb-0">
                <div className="flex items-start space-x-2">
                  <span className="text-cyber-cyan shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-slate-200 shrink-0 font-bold">OP: {log.username}</span>
                  <span className="text-slate-400 break-all">{log.action}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 mt-1 sm:mt-0 font-mono">ID: {log.id}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-600 text-center py-4">
              NO RECENT SYSTEM EVENT EMITTED
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
