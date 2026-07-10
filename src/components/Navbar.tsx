'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Confidentiality', href: '#confidentiality' },
    { name: 'Resources', href: '#resources' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-cyber-cyan/15 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <img
                src="/logo.jpg"
                alt="VCN Logo"
                className="h-8 w-8 rounded-full border border-cyber-cyan/40 object-cover group-hover:scale-110 transition-transform duration-300 bg-white"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wider text-white font-mono">
                  VCN<span className="text-cyber-cyan animate-pulse">_</span>
                </span>
                <span className="text-[9px] tracking-widest text-slate-400 uppercase font-sans">
                  Vigilant Cyber Ninjas
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-cyber-cyan transition-colors duration-200 text-sm font-medium tracking-wide uppercase font-mono"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA & Admin Link */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/report/status"
              className="text-xs font-mono tracking-wider text-slate-400 hover:text-cyber-cyan transition-colors uppercase mr-2"
            >
              Track Status
            </Link>
            <Link href="/report">
              <button className="cyber-btn px-6 py-2.5 rounded-sm text-sm cursor-pointer">
                Report a Case
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '64px' }}
      >
        <div className="px-4 pt-8 pb-6 space-y-6 flex flex-col items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-xl font-medium tracking-wider text-slate-300 hover:text-cyber-cyan font-mono"
            >
              {link.name}
            </a>
          ))}
          <div className="w-full border-t border-slate-800 my-4" />
          <Link href="/report/status" onClick={() => setIsOpen(false)} className="text-lg font-mono text-slate-300 hover:text-cyber-cyan tracking-wider">
            Track Status
          </Link>
          <div className="w-full border-t border-slate-800 my-2" />
          <Link href="/report" onClick={() => setIsOpen(false)} className="w-full flex justify-center">
            <button className="cyber-btn w-full max-w-xs py-3 rounded-sm text-base">
              Report a Case
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
