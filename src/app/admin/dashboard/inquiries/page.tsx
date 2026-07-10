'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Eye,
  Trash2,
  X,
  FileText,
  Clock,
  User,
  ShieldCheck,
  CheckCircle,
  Inbox,
  AlertCircle
} from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Reviewed' | 'Archived';
  createdAt: string;
}

export default function InquiriesInboxPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Selected Inquiry for Modal
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('vcn_session_token');
      const response = await fetch('/api/inquiries', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      const data = await response.json();
      if (data.success) {
        setInquiries(data.inquiries);
        setFilteredInquiries(data.inquiries);
      } else {
        setError(data.error || 'Failed to fetch general inquiries inbox.');
      }
    } catch (err) {
      setError('Communication error querying inquiries vault.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Filter inquiries logic
  useEffect(() => {
    let result = inquiries;

    if (statusFilter !== 'All') {
      result = result.filter((i) => i.status === statusFilter);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(term) ||
          i.email.toLowerCase().includes(term) ||
          i.subject.toLowerCase().includes(term) ||
          i.message.toLowerCase().includes(term) ||
          i.id.toLowerCase().includes(term)
      );
    }

    setFilteredInquiries(result);
  }, [searchTerm, statusFilter, inquiries]);

  // Handle status update
  const handleUpdateStatus = async (id: string, newStatus: Inquiry['status']) => {
    setActionLoading(true);
    setModalError('');
    try {
      const token = localStorage.getItem('vcn_session_token');
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        setSelectedInquiry(data.inquiry);
        // Refresh local items
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? data.inquiry : item))
        );
      } else {
        setModalError(data.error || 'Failed to update inquiry status.');
      }
    } catch (err) {
      setModalError('Network communication error.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle deletion
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm(`Permanently delete inquiry ${id}? This action is irreversible.`)) {
      return;
    }

    setActionLoading(true);
    setModalError('');
    try {
      const token = localStorage.getItem('vcn_session_token');
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSelectedInquiry(null);
        setInquiries((prev) => prev.filter((item) => item.id !== id));
      } else {
        setModalError(data.error || 'Failed to delete inquiry.');
      }
    } catch (err) {
      setModalError('Network communication error.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center space-x-2">
            <Mail className="h-5 w-5 text-cyber-cyan" />
            <span>GENERAL INQUIRIES INBOX</span>
          </h2>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1">
            Communication Node Ledger // Public Contact Logs
          </p>
        </div>
      </div>

      {/* Filtering Header Panel */}
      <div className="glass-panel p-4 rounded-sm flex flex-col md:flex-row items-center gap-4 text-xs font-mono">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by sender, email, subject, or message..."
            className="w-full bg-slate-900 border border-slate-800 text-white rounded-sm pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-cyber-cyan"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-slate-400 uppercase tracking-widest text-[9px]">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-cyber-cyan font-mono"
          >
            <option value="All">All Inquiries</option>
            <option value="Unread">Unread</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Main Inbox Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 font-mono text-xs animate-pulse">
          TUNNELING VAULT ENCRYPTION... RETRIEVING INBOX
        </div>
      ) : error ? (
        <div className="glass-panel border-red-500/20 bg-red-950/5 p-6 rounded-sm text-center font-mono text-xs text-red-400">
          <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
          {error}
        </div>
      ) : (
        <div className="glass-panel rounded-sm overflow-hidden border-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/80 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Date Submitted</th>
                  <th className="px-6 py-4 text-right">Clearance Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950 font-mono">
                {filteredInquiries.length > 0 ? (
                  filteredInquiries.map((inq) => (
                    <tr
                      key={inq.id}
                      className={`hover:bg-slate-900/40 transition-colors ${
                        inq.status === 'Unread' ? 'bg-cyber-cyan/[0.01] text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            inq.status === 'Unread'
                              ? 'bg-cyber-cyan animate-pulse'
                              : inq.status === 'Reviewed'
                              ? 'bg-emerald-500'
                              : 'bg-slate-600'
                          }`}
                          title={inq.status}
                        />
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] text-cyber-cyan">
                        {inq.id}
                      </td>
                      <td className="px-6 py-4 text-white">
                        <div className="font-sans font-semibold">{inq.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{inq.email}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-300 font-sans">
                        {inq.subject}
                      </td>
                      <td className="px-6 py-4 text-[10px] text-slate-500">
                        {new Date(inq.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
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
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-mono text-xs">
                      INBOX EMPTY // NO MATCHING COMMUNICATIONS
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Inquiry Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedInquiry(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="glass-panel-glow p-8 rounded-sm max-w-2xl w-full relative z-10 max-h-[85vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 border-b border-slate-900 pb-4">
              <Mail className="h-6 w-6 text-cyber-cyan" />
              <div>
                <h3 className="text-base font-bold font-mono text-white">
                  Communication Record: {selectedInquiry.id}
                </h3>
                <span className="text-[9px] font-mono text-slate-500">
                  TIMESTAMP: {new Date(selectedInquiry.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="text-slate-500">Sender Identity:</div>
                <div className="text-white font-sans font-semibold">{selectedInquiry.name}</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500">Email Address:</div>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="text-cyber-cyan hover:underline break-all"
                >
                  {selectedInquiry.email}
                </a>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1 border-t border-slate-900 pt-4">
              <div className="text-slate-500 text-[10px] font-mono uppercase tracking-wider">Subject Title</div>
              <div className="text-white font-sans text-sm font-semibold">{selectedInquiry.subject}</div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Message Content
              </label>
              <div className="bg-[#03050a] border border-slate-900 p-4 rounded-sm text-xs text-slate-300 font-sans leading-relaxed max-h-[220px] overflow-y-auto whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Admin Management options */}
            <div className="border-t border-slate-900 pt-6 space-y-4 font-mono text-xs">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'Reviewed')}
                    disabled={actionLoading || selectedInquiry.status === 'Reviewed'}
                    className="cyber-btn-secondary px-3 py-1.5 rounded-sm text-[10px] tracking-wide cursor-pointer disabled:opacity-40"
                  >
                    MARK AS REVIEWED
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'Archived')}
                    disabled={actionLoading || selectedInquiry.status === 'Archived'}
                    className="cyber-btn-secondary px-3 py-1.5 rounded-sm text-[10px] tracking-wide cursor-pointer disabled:opacity-40"
                  >
                    ARCHIVE INBOX
                  </button>
                </div>

                <div className="text-xs font-mono text-red-500">
                  {modalError && <span>[ERROR] {modalError}</span>}
                </div>
              </div>

              {/* Bottom buttons */}
              <div className="flex space-x-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                  disabled={actionLoading}
                  className="border border-red-500/35 bg-red-950/15 hover:bg-red-500 hover:text-black text-red-500 px-5 py-2.5 rounded-sm text-xs font-mono cursor-pointer transition-colors mr-auto disabled:opacity-40"
                >
                  DELETE ENTRY
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="cyber-btn-secondary px-5 py-2.5 rounded-sm text-xs font-mono cursor-pointer"
                >
                  CLOSE INBOX
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
