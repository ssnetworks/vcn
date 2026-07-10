'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, PhoneCall, Radio, Terminal } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden cyber-grid">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-blue/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Decorative cyber grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(3,7,18,0.2)_0%,rgba(3,7,18,0.95)_90%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass-panel border-cyber-cyan/30 text-xs font-mono text-cyber-cyan tracking-wider"
            >
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              <span>ACTIVE OPERATION: SECURING CYBERSPACE</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans"
            >
              Protecting Women.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-blue cyber-text-glow">
                Fighting Cybercrime.
              </span><br />
              Restoring Digital Safety.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-slate-300 text-lg max-w-xl leading-relaxed"
            >
              VCN (Vigilant Cyber Ninjas) is a community of ethical hackers committed to combating online harassment, cyber abuse, trafficking, child exploitation, and digital crimes while maintaining complete confidentiality for every victim.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/report">
                <button className="cyber-btn w-full sm:w-auto px-8 py-4 rounded-sm flex items-center justify-center space-x-3 cursor-pointer">
                  <ShieldAlert className="h-5 w-5 text-black group-hover:text-cyber-cyan" />
                  <span>Report a Case</span>
                </button>
              </Link>
              
              <a href="#about">
                <button className="cyber-btn-secondary w-full sm:w-auto px-8 py-4 rounded-sm flex items-center justify-center space-x-3 text-white cursor-pointer">
                  <Users className="h-5 w-5" />
                  <span>Join Our Community</span>
                </button>
              </a>

              <a href="#contact">
                <button className="cyber-btn-secondary w-full sm:w-auto px-8 py-4 rounded-sm flex items-center justify-center space-x-3 text-white cursor-pointer">
                  <PhoneCall className="h-5 w-5" />
                  <span>Contact Us</span>
                </button>
              </a>
            </motion.div>
          </div>

          {/* Hero Right Content: Interactive Cyber Shield / Animations */}
          <div className="lg:col-span-5 flex justify-center relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center"
            >
              {/* Outer Cyber Rings */}
              <div className="absolute inset-0 border border-dashed border-cyber-cyan/20 rounded-full animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-6 border border-cyber-blue/30 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
              <div className="absolute inset-16 border border-cyber-cyan/40 rounded-full animate-[spin_10s_linear_infinite]" />

              {/* Glowing Shield Backdrop */}
              <div className="absolute w-48 h-48 bg-cyber-cyan/10 rounded-full filter blur-2xl animate-pulse" />

              {/* Primary Interactive Shield Container */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative z-10 glass-panel border-cyber-cyan/40 w-44 h-44 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-shadow duration-300 group cursor-pointer"
              >
                <img
                  src="/logo.jpg"
                  alt="VCN Secure Core"
                  className="h-20 w-20 rounded-full border border-cyber-cyan/40 object-cover group-hover:scale-110 transition-transform duration-300 bg-white"
                />
                <span className="text-[10px] font-mono text-slate-400 mt-2 tracking-widest uppercase">
                  VCN SECURE CORE
                </span>
                <span className="text-[9px] font-mono text-cyber-cyan animate-pulse">
                  STATUS: ONLINE
                </span>
              </motion.div>

              {/* Status floating stats */}
              <div className="absolute top-4 left-4 glass-panel border-cyber-cyan/20 px-3 py-1.5 rounded-sm text-[10px] font-mono text-slate-300">
                <Terminal className="h-3 w-3 inline mr-1.5 text-cyber-cyan" />
                IP: SECURE_ONION
              </div>
              <div className="absolute bottom-8 right-0 glass-panel border-cyber-cyan/20 px-3 py-1.5 rounded-sm text-[10px] font-mono text-slate-300">
                <ShieldAlert className="h-3 w-3 inline mr-1.5 text-cyber-cyan" />
                ENC: AES_256_GCM
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
