'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Search,
  Filter,
  Eye,
  FileDown,
  User,
  ShieldCheck,
  Calendar,
  MapPin,
  MessageSquare,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';

interface Report {
  id: string;
  name?: string;
  isAnonymous: boolean;
  email?: string;
  phone?: string;
  country: string;
  state: string;
  category: string;
  dateOfIncident: string;
  socialMediaPlatform: string;
  description: string;
  evidenceUrl?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'Under Investigation' | 'Resolved' | 'Dismissed';
  investigator?: string;
  consent: boolean;
  notes?: string;
  createdAt: string;
}

interface TeamUser {
  id: string;
  username: string;
  role: string;
}

export default function CasesManagerPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');

  // Selected Report Modal
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Modal Edit states
  const [editStatus, setEditStatus] = useState<Report['status']>('New');
  const [editInvestigator, setEditInvestigator] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('vcn_session_token');
      if (!token) return;

      const response = await fetch('/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error('Fetch reports error:', err);
    }
  };

  const fetchTeamUsers = async () => {
    try {
      const token = localStorage.getItem('vcn_session_token');
      if (!token) return;

      const response = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setTeamUsers(data.users);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchReports(), fetchTeamUsers()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleOpenModal = (report: Report) => {
    setSelectedReport(report);
    setEditStatus(report.status);
    setEditInvestigator(report.investigator || '');
    setEditNotes(report.notes || '');
    setModalError('');
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    setSaving(true);
    setModalError('');

    try {
      const token = localStorage.getItem('vcn_session_token');
      const response = await fetch(`/api/reports/${selectedReport.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: editStatus,
          investigator: editInvestigator || null, // null out investigator if empty selected
          notes: editNotes,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh cases lists locally
        await fetchReports();
        setSelectedReport(data.report);
        // Alert success or close
      } else {
        setModalError(data.error || 'Failed to save changes.');
      }
    } catch (err) {
      setModalError('Network error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (!confirm(`WARNING: You are about to permanently delete Case ${id}. This action is irreversible and will remove all forensic evidence logs from the system database. Proceed?`)) {
      return;
    }
    
    setSaving(true);
    setModalError('');

    try {
      const token = localStorage.getItem('vcn_session_token');
      const response = await fetch(`/api/reports/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setSelectedReport(null);
        await fetchReports();
      } else {
        setModalError(data.error || 'Failed to delete case.');
      }
    } catch (err) {
      setModalError('Network error occurred.');
    } finally {
      setSaving(false);
    }
  };

  // CSV Export utility
  const handleExportCSV = () => {
    const headers = [
      'Case ID',
      'Created At',
      'Status',
      'Priority',
      'Category',
      'Anonymity',
      'Name',
      'Email',
      'Phone',
      'Country',
      'State',
      'Platform',
      'Incident Date',
      'Investigator Assigned',
      'Resolution Notes',
    ];

    const rows = filteredReports.map((r) => [
      r.id,
      r.createdAt,
      r.status,
      r.priority,
      r.category,
      r.isAnonymous ? 'Anonymous' : 'Disclosed',
      r.name || 'N/A',
      r.email || 'N/A',
      r.phone || 'N/A',
      r.country,
      r.state,
      r.socialMediaPlatform,
      r.dateOfIncident,
      r.investigator || 'Unassigned',
      r.notes || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VCN_Cases_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter Logic
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.state.toLowerCase().includes(search.toLowerCase()) ||
      r.country.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || r.priority === priorityFilter;
    const matchesPlatform = platformFilter === 'All' || r.socialMediaPlatform === platformFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesPlatform;
  });

  const platformsList = ['Instagram', 'Facebook', 'Telegram', 'WhatsApp', 'Twitter/X', 'Discord', 'TikTok', 'Dark Web', 'Other'];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center font-mono text-slate-500 text-xs">
        <span>ESTABLISHING DECRYPTED BRIDGE...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
            Case Files Vault
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-mono">
            SECURE RECORDS REGISTRY & FORENSICS COOPERATIVE
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="cyber-btn px-5 py-2.5 rounded-sm flex items-center justify-center space-x-2 text-xs font-mono tracking-wider cursor-pointer"
        >
          <FileDown className="h-4.5 w-4.5 text-black group-hover:text-cyber-cyan" />
          <span>EXPORT CASES (CSV)</span>
        </button>
      </div>

      {/* Filters Dashboard Panel */}
      <div className="glass-panel p-6 rounded-sm grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search details, ID, location..."
            className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-cyber-cyan font-mono"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-500 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-3 py-2.5 text-xs focus:outline-none focus:border-cyber-cyan font-mono"
          >
            <option value="All">Status: All</option>
            <option value="New">New</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Resolved">Resolved</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-slate-500 flex-shrink-0" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-3 py-2.5 text-xs focus:outline-none focus:border-cyber-cyan font-mono"
          >
            <option value="All">Priority: All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Platform Filter */}
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4 text-slate-500 flex-shrink-0" />
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-3 py-2.5 text-xs focus:outline-none focus:border-cyber-cyan font-mono"
          >
            <option value="All">Platform: All</option>
            {platformsList.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Reports Table container */}
      <div className="glass-panel rounded-sm overflow-hidden border border-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            
            <thead className="bg-[#030712] border-b border-slate-900 text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Case ID</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Anonymity</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Investigator</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-900 bg-transparent text-slate-300">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-900/20 transition-all">
                    
                    <td className="px-6 py-4 font-bold text-white tracking-wide">
                      {report.id}
                    </td>

                    <td className="px-6 py-4 font-sans text-slate-300 truncate max-w-[150px]">
                      {report.category}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] ${
                        report.isAnonymous 
                          ? 'border border-slate-800 text-slate-400 bg-slate-900/40' 
                          : 'border border-cyber-cyan/20 text-cyber-cyan bg-cyber-cyan/5'
                      }`}>
                        {report.isAnonymous ? 'Anonymous' : 'Disclosed'}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-sans text-slate-400 truncate max-w-[120px]">
                      {report.state}, {report.country}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                        report.priority === 'Critical'
                          ? 'border border-red-500/30 bg-red-950/20 text-red-500'
                          : report.priority === 'High'
                          ? 'border-amber-500/30 bg-amber-950/20 text-amber-500'
                          : report.priority === 'Medium'
                          ? 'border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue'
                          : 'border-slate-800 text-slate-500'
                      }`}>
                        {report.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                        report.status === 'New'
                          ? 'border border-cyber-blue/30 text-cyber-blue bg-cyber-blue/5 animate-pulse'
                          : report.status === 'Under Investigation'
                          ? 'border border-amber-500/30 text-amber-500 bg-amber-500/5'
                          : report.status === 'Resolved'
                          ? 'border border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                          : 'border border-slate-800 text-slate-500'
                      }`}>
                        {report.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-400">
                      {report.investigator || 'Unassigned'}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenModal(report)}
                        className="cyber-btn-secondary px-3 py-1.5 rounded-sm text-[10px] cursor-pointer inline-flex items-center space-x-1 hover:border-cyber-cyan"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-mono text-xs">
                    NO CASES MATCHING ACTIVE ENCRYPTION FILTERS
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Inspect Case Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Overlay backdrop */}
          <div
            onClick={() => setSelectedReport(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal layout box */}
          <div className="glass-panel-glow p-8 rounded-sm max-w-2xl w-full relative z-10 max-h-[85vh] overflow-y-auto space-y-6">
            
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header Title */}
            <div className="flex items-center space-x-3 border-b border-slate-900 pb-4">
              <FolderOpen className="h-6 w-6 text-cyber-cyan" />
              <div>
                <h3 className="text-base font-bold font-mono text-white">
                  Case File: {selectedReport.id}
                </h3>
                <span className="text-[9px] font-mono text-slate-500">
                  DATE REGISTERED: {new Date(selectedReport.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Metadata layout Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-2">
                <div className="flex items-center text-slate-500">
                  <User className="h-4 w-4 mr-2" />
                  <span className="mr-1 text-slate-400">Reporter:</span>
                  <span className="text-white">
                    {selectedReport.isAnonymous
                      ? 'ANONYMOUS FILE'
                      : selectedReport.name || 'Anonymous'}
                  </span>
                </div>
                
                {!selectedReport.isAnonymous && (
                  <>
                    <div className="text-slate-500 pl-6 break-all">
                      Email: <span className="text-slate-300">{selectedReport.email || 'N/A'}</span>
                    </div>
                    <div className="text-slate-500 pl-6">
                      Phone: <span className="text-slate-300">{selectedReport.phone || 'N/A'}</span>
                    </div>
                  </>
                )}

                <div className="flex items-center text-slate-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="mr-1 text-slate-400">Location:</span>
                  <span className="text-white">
                    {selectedReport.state}, {selectedReport.country}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-slate-500">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  <span className="mr-1 text-slate-400">Category:</span>
                  <span className="text-white text-xs font-sans">{selectedReport.category}</span>
                </div>

                <div className="flex items-center text-slate-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="mr-1 text-slate-400">Platform & Date:</span>
                  <span className="text-white">
                    {selectedReport.socialMediaPlatform} ({selectedReport.dateOfIncident})
                  </span>
                </div>

                {selectedReport.evidenceUrl && (
                  <div className="flex items-center pl-6">
                    <a
                      href={selectedReport.evidenceUrl.startsWith('data:') ? selectedReport.evidenceUrl : `data:text/plain;charset=utf-8,${encodeURIComponent(`VCN SECURE FORENSIC DOSSIER\n===========================\nCASE ID: ${selectedReport.id}\nCATEGORY: ${selectedReport.category}\nDATE OF REPORT: ${new Date(selectedReport.createdAt).toLocaleDateString()}\nPLATFORM: ${selectedReport.socialMediaPlatform}\nLOCATION: ${selectedReport.state}, ${selectedReport.country}\n\n[INCIDENT TIMELINE & DESCRIPTION]\n${selectedReport.description}\n\n[ADMINISTRATOR RESOLUTION NOTES]\n${selectedReport.notes || 'No resolution notes recorded.'}`)}`}
                      download={`evidence_${selectedReport.id}.${selectedReport.evidenceUrl.startsWith('data:') ? (selectedReport.evidenceUrl.split(';')[0].split('/')[1] === 'jpeg' ? 'jpg' : selectedReport.evidenceUrl.split(';')[0].split('/')[1] || 'bin') : 'txt'}`}
                      className="text-cyber-cyan hover:underline inline-flex items-center space-x-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      <span>Retrieve Evidence File</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Incident Description */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Case Narration & Timeline
              </label>
              <div className="bg-[#03050a] border border-slate-900 p-4 rounded-sm text-xs text-slate-300 font-sans leading-relaxed max-h-[160px] overflow-y-auto whitespace-pre-wrap">
                {selectedReport.description}
              </div>
            </div>

            {/* Evidence Image Preview */}
            {selectedReport.evidenceUrl && (
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  Forensic Evidence Preview Attachment
                </label>
                <div className="bg-[#03050a] border border-slate-900 p-4 rounded-sm flex flex-col items-center justify-center">
                  {selectedReport.evidenceUrl.startsWith('data:image/') ||
                  selectedReport.evidenceUrl.endsWith('.png') ||
                  selectedReport.evidenceUrl.endsWith('.jpg') ||
                  selectedReport.evidenceUrl.endsWith('.jpeg') ||
                  selectedReport.evidenceUrl.endsWith('.webp') ? (
                    <div className="relative group max-w-full flex flex-col items-center">
                      <img
                        src={selectedReport.evidenceUrl}
                        alt="Case Forensic Attachment"
                        className="max-h-64 object-contain rounded-sm border border-slate-800 shadow-md group-hover:border-cyber-cyan/40 transition-colors"
                      />
                    </div>
                  ) : (
                    <div className="text-slate-500 text-xs font-mono py-4 text-center">
                      [ATTACHED SECURE BINARY / DATA VAULT NODE]
                      <div className="mt-1 text-[9px] text-slate-600 break-all select-all">
                        {selectedReport.evidenceUrl}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Management Editor Form */}
            <form onSubmit={handleSaveChanges} className="border-t border-slate-900 pt-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Status Selection */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                    Operational Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as Report['status'])}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-cyber-cyan font-mono"
                  >
                    <option value="New">New</option>
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Dismissed">Dismissed</option>
                  </select>
                </div>

                {/* Investigator Assignment */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                    Assign Investigator
                  </label>
                  <select
                    value={editInvestigator}
                    onChange={(e) => setEditInvestigator(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-cyber-cyan font-mono"
                  >
                    <option value="">-- Unassigned --</option>
                    {teamUsers.map((user) => (
                      <option key={user.id} value={user.username}>
                        {user.username} ({user.role})
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Resolution Notes / Investigator updates */}
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                  Resolution logs / Private Case Notes
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  placeholder="Record investigation steps, metadata findings, platform reporting activities, or resolution comments..."
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-cyber-cyan font-sans leading-relaxed"
                />
              </div>

              {/* Status Alert and save buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                <div className="text-xs font-mono text-red-500">
                  {modalError && <span>[ERROR] {modalError}</span>}
                </div>
                
                <div className="flex space-x-3 justify-end w-full">
                  <button
                    type="button"
                    onClick={() => handleDeleteCase(selectedReport.id)}
                    className="border border-red-500/35 bg-red-950/15 hover:bg-red-500 hover:text-black text-red-500 px-5 py-2.5 rounded-sm text-xs font-mono cursor-pointer transition-colors mr-auto"
                  >
                    DELETE CASE
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedReport(null)}
                    className="cyber-btn-secondary px-5 py-2.5 rounded-sm text-xs font-mono cursor-pointer"
                  >
                    CLOSE FILE
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="cyber-btn px-6 py-2.5 rounded-sm text-xs font-mono tracking-wider disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? 'RECORDING UPDATES...' : 'SAVE CHANGES'}
                  </button>
                </div>
              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}
