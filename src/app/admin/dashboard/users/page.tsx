'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Lock, ShieldAlert, Check } from 'lucide-react';

interface TeamUser {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function UsersManagerPage() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Form State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [roleInput, setRoleInput] = useState('Investigator');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('vcn_session_token');
      if (!token) return;

      const response = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('vcn_user_role');
    const operator = localStorage.getItem('vcn_username');
    if (role === 'SuperAdmin') {
      setIsSuperAdmin(true);
    }
    if (operator) {
      setCurrentUsername(operator);
    }

    const loadData = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);
    setSubmitting(true);

    try {
      const token = localStorage.getItem('vcn_session_token');
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
          role: roleInput,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFormSuccess(true);
        setUsernameInput('');
        setPasswordInput('');
        setRoleInput('Investigator');
        await fetchUsers(); // reload list
      } else {
        setFormError(data.error || 'Failed to create user.');
      }
    } catch (err) {
      setFormError('Network communication error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (name.toLowerCase() === currentUsername.toLowerCase()) {
      alert('Self-deletion is forbidden.');
      return;
    }

    if (!confirm(`Are you sure you want to terminate login credentials for operator "${name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('vcn_session_token');
      const response = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        await fetchUsers();
      } else {
        alert(data.error || 'Failed to delete user.');
      }
    } catch (err) {
      console.error('Delete user error:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center font-mono text-slate-500 text-xs">
        <span>FETCHING TEAM DATA...</span>
      </div>
    );
  }

  // Enforcement check: Lock panel for Investigators
  if (!isSuperAdmin) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="glass-panel border-red-500/25 bg-red-950/5 p-8 rounded-sm max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-red-500/10 border border-red-500/35 rounded-full text-red-500">
              <Lock className="h-10 w-10 animate-pulse" />
            </div>
          </div>
          <h2 className="text-lg font-bold font-mono text-white uppercase tracking-wider">
            Clearance Level Insufficient
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed font-mono text-xs">
            [ACCESS DENIED] SuperAdmin authorization parameters are required to modify user access credentials or audit roles. Your incident report access is unaffected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Title */}
      <div className="lg:col-span-12">
        <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
          Operator Registry Manager
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-mono">
          USER PRIVILEGES & CREDENTIAL CONFIGURATIONS
        </p>
      </div>

      {/* Left Column: Create User form */}
      <div className="lg:col-span-5">
        <form onSubmit={handleCreateUser} className="glass-panel p-6 rounded-sm space-y-6">
          
          <div className="flex items-center space-x-2 text-cyber-cyan border-b border-slate-900 pb-3">
            <UserPlus className="h-5 w-5" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest">
              Add Team Operator
            </h3>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Operator Username
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
              placeholder="e.g. j_smith"
              className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-2.5 text-xs focus:outline-none focus:border-cyber-cyan font-mono"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Initial Password
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              placeholder="Min 8 characters"
              className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-2.5 text-xs focus:outline-none focus:border-cyber-cyan font-mono"
            />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              System Access Role
            </label>
            <select
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-3 py-2.5 text-xs focus:outline-none focus:border-cyber-cyan font-mono"
            >
              <option value="Investigator">Investigator (Read/Update cases)</option>
              <option value="SuperAdmin">SuperAdmin (Full clearance)</option>
            </select>
          </div>

          {/* Status Message */}
          <div className="text-xs font-mono min-h-[1rem]">
            {formError && <span className="text-red-500">[ERROR] {formError}</span>}
            {formSuccess && (
              <span className="text-cyber-cyan flex items-center">
                <Check className="h-4 w-4 mr-1.5" />
                Credentials generated.
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="cyber-btn w-full py-3 rounded-sm flex items-center justify-center space-x-2 text-xs font-mono tracking-wider disabled:opacity-50 cursor-pointer"
          >
            <span>{submitting ? 'GENERATING...' : 'CREATE CREDENTIALS'}</span>
          </button>

        </form>
      </div>

      {/* Right Column: Users List */}
      <div className="lg:col-span-7">
        <div className="glass-panel rounded-sm overflow-hidden border border-slate-900">
          
          <div className="p-4 bg-[#030712] border-b border-slate-900 flex items-center space-x-2 text-white">
            <Users className="h-4 w-4 text-slate-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest">
              Active Operator Directory
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              
              <thead className="bg-[#030712]/50 border-b border-slate-900 text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3">Operator</th>
                  <th className="px-6 py-3">Clearance Role</th>
                  <th className="px-6 py-3">Registered At</th>
                  <th className="px-6 py-3 text-right">Delete</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-900 bg-transparent text-slate-300">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-900/10">
                    
                    <td className="px-6 py-3 font-bold text-white">
                      {user.username}
                      {user.username.toLowerCase() === currentUsername.toLowerCase() && (
                        <span className="ml-2 text-[9px] text-cyber-cyan border border-cyber-cyan/35 px-1 py-0.5 rounded-sm">
                          YOU
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold ${
                        user.role === 'SuperAdmin'
                          ? 'border border-cyber-cyan/30 bg-cyber-cyan/15 text-cyber-cyan'
                          : 'border border-slate-800 text-slate-400 bg-slate-900/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-3 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        disabled={user.username.toLowerCase() === currentUsername.toLowerCase()}
                        className="text-slate-500 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-500 p-1 rounded-sm cursor-pointer"
                        title={user.username.toLowerCase() === currentUsername.toLowerCase() ? 'Self-deletion forbidden' : 'Delete user'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </div>

    </div>
  );
}
