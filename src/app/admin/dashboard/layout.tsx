'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldAlert,
  LayoutDashboard,
  FolderLock,
  History,
  Users,
  LogOut,
  Terminal,
  ShieldCheck,
  UserCheck,
  Mail,
} from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authorized, setAuthorized] = useState(false);
  const [operator, setOperator] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    const token = localStorage.getItem('vcn_session_token');
    const username = localStorage.getItem('vcn_username');
    const userRole = localStorage.getItem('vcn_user_role');

    if (!token || !username) {
      localStorage.removeItem('vcn_session_token');
      localStorage.removeItem('vcn_username');
      localStorage.removeItem('vcn_user_role');
      router.push('/admin');
    } else {
      setOperator(username);
      setRole(userRole || 'Investigator');
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    // Audit logout action if we want, or just client-side clear
    localStorage.removeItem('vcn_session_token');
    localStorage.removeItem('vcn_username');
    localStorage.removeItem('vcn_user_role');
    router.push('/admin');
  };

  const navItems = [
    { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Case Files', href: '/admin/dashboard/reports', icon: FolderLock },
    { name: 'Inquiries Inbox', href: '/admin/dashboard/inquiries', icon: Mail },
    { name: 'Audit Logs', href: '/admin/dashboard/audit', icon: History },
    { name: 'Team Users', href: '/admin/dashboard/users', icon: Users },
  ];

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-mono text-xs">
        <Terminal className="h-8 w-8 text-cyber-cyan animate-spin mb-4" />
        <span>ESTABLISHING SECURE PROTOCOL...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 bg-[#02040a] flex flex-col md:flex-row font-sans antialiased selection:bg-cyber-cyan selection:text-black">
      <div className="scanlines-overlay" />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950/80 border-r border-slate-900 flex flex-col justify-between shrink-0 z-30">
        
        {/* Top Section */}
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-slate-900">
            <Link href="/" className="flex items-center space-x-2">
              <ShieldCheck className="h-6 w-6 text-cyber-cyan" />
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-wider text-white font-mono">
                  VCN_CORE
                </span>
                <span className="text-[7px] tracking-widest text-slate-500 uppercase font-sans">
                  CONTROL DASHBOARD v3.2
                </span>
              </div>
            </Link>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-sm flex items-center space-x-3 text-xs font-mono tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyber-cyan/10 border-l-2 border-cyber-cyan text-cyber-cyan'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Info & Logout */}
        <div className="p-4 border-t border-slate-900 space-y-4">
          <div className="glass-panel border-slate-900 p-3 rounded-sm flex items-center space-x-3">
            <UserCheck className="h-8 w-8 text-cyber-cyan" />
            <div className="overflow-hidden">
              <div className="text-[10px] font-mono text-slate-400 truncate">
                OP: {operator}
              </div>
              <div className="text-[8px] font-mono text-cyber-cyan tracking-widest uppercase">
                {role}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full border border-red-500/20 bg-red-950/5 text-red-500 hover:bg-red-500 hover:text-black py-2.5 rounded-sm flex items-center justify-center space-x-2 text-xs font-mono tracking-wider transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>TERMINATE SESSION</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Status bar */}
        <header className="bg-slate-950/40 border-b border-slate-900 h-16 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center space-x-2 font-mono text-[10px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
            <span>OPERATIONAL STATUS: ONLINE</span>
            <span className="hidden sm:inline">| SECURE SHIELD CONNECTION ACTIVE</span>
          </div>

          <div className="text-[10px] font-mono text-slate-500">
            TIME: {new Date().toLocaleDateString()}
          </div>
        </header>


        {/* Dynamic Pages Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#020408]">
          {children}
        </main>

      </div>
    </div>
  );
}
