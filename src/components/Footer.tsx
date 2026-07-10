'use client';

import React from 'react';
import Link from 'next/link';
import { Github, Twitter, MessageSquare } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms & Conditions', href: '#terms' },
    { name: 'Responsible Disclosure Policy', href: '#disclosure' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'Code of Ethics', href: '#ethics' },
  ];

  const quickLinks = [
    { name: 'About VCN', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Privacy Center', href: '#confidentiality' },
    { name: 'Security Handbook', href: '#resources' },
    { name: 'Volunteer Application', href: '#community' },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Info & Logo */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/logo.jpg"
                alt="VCN Logo"
                className="h-7 w-7 rounded-full border border-cyber-cyan/40 object-cover bg-white"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-wider text-white font-mono">
                  VCN<span className="text-cyber-cyan animate-pulse">_</span>
                </span>
                <span className="text-[8px] tracking-widest text-slate-500 uppercase font-sans">
                  Vigilant Cyber Ninjas
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Ethical hacking community committed to combating harassment, trafficking, and online abuse while maintaining total confidentiality.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-500 hover:text-cyber-cyan transition-colors" title="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="text-slate-500 hover:text-cyber-cyan transition-colors" title="Twitter/X">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-slate-500 hover:text-cyber-cyan transition-colors" title="Secure chat">
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white mb-4">
              Community Menu
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-cyber-cyan text-xs transition-colors font-mono"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal Policy Documentation */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white mb-4">
              Compliance & Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-cyber-cyan text-xs transition-colors font-mono"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Operational Coordinates */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white mb-4">
              Operational Center
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs font-mono">
              <li>Address: SECURE_DIGITAL_WORKSPACE</li>
              <li>Coordinates: ONION_ROUTING_ACTIVE</li>
              <li>Network: IPFS_VAULT_ENABLED</li>
              <li>Duty Hours: 24/7/365 GLOBAL</li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-500 gap-4">
          <div className="text-center sm:text-left">
            <span>&copy; {currentYear} Vigilant Cyber Ninjas. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
            <span>ENCRYPTED PORTAL ACTIVE</span>
            <span className="text-slate-800 font-mono">|</span>
            <Link
              href="/admin"
              className="text-slate-600 hover:text-cyber-cyan font-mono font-bold transition-colors select-none text-[11px]"
              title="System Terminal Console"
            >
              &gt;_
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
