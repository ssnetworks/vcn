'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, EyeOff, ShieldCheck, Database, HeartHandshake } from 'lucide-react';

export default function Confidentiality() {
  const [activeTab, setActiveTab] = useState(0);

  const securityLayers = [
    {
      icon: Lock,
      title: 'Encrypted Channels',
      tagline: 'SECURE ENCRYPTION CORE',
      desc: 'All cases submitted to VCN are encrypted at rest and during transit. Communication through our portals is strictly isolated, ensuring intercepts are mathematically unfeasible.',
      details: [
        'TLS 1.3 Transport Encryption for all client connections',
        'AES-256-GCM hardware-accelerated encryption at rest',
        'Encrypted backup protocols to offline cold vaults',
      ],
    },
    {
      icon: EyeOff,
      title: 'Anonymous Submissions',
      tagline: 'IDENTITY DE-LINKING PIPELINE',
      desc: 'We support fully anonymous submissions. Reporting users do not need to supply a name, email address, or phone number to register an incident.',
      details: [
        'Zero logging of victim IP addresses on submission API',
        'Automatic stripping of file metadata (EXIF/GPS) from evidence uploads',
        'Pseudonymous identifier auto-generation (e.g. rep_3892)',
      ],
    },
    {
      icon: HeartHandshake,
      title: 'Victim-First Protocols',
      tagline: 'CONFIDENTIAL ADVOCACY STANDARD',
      desc: 'Our coordination processes align with victim emotional stability and legal security. Investigators undergo rigorous background checks and sign legally binding NDAs.',
      details: [
        'Consent-driven case tracking where you specify data sharing bounds',
        'Access controls strictly limiting who views open files',
        'Full right to request case file erasure at any stage',
      ],
    },
    {
      icon: Database,
      title: 'Data Retention Control',
      tagline: 'PURGING & DELETION CONTROLS',
      desc: 'Unlike traditional platforms, we do not monetize, analyze, or archive details for secondary usage. We enforce structural data pruning schedules once a case resolves.',
      details: [
        'Automated case resolution data purging options',
        'Absolute zero-tracking marketing cookies or telemetry',
        'Compliance audit logs visible to administrators to track access',
      ],
    },
  ];

  return (
    <section id="confidentiality" className="py-24 relative overflow-hidden bg-slate-950/50">
      {/* Visual background element */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyber-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-cyber-cyan font-mono text-sm tracking-widest uppercase">
            // ZERO-TRUST PROTOCOLS
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            How We Protect Your Confidentiality
          </h3>
          <p className="text-slate-400 text-lg leading-relaxed">
            Privacy is not an add-on; it is our foundation. Explore the technical and ethical measures we employ to secure every submission.
          </p>
        </div>

        {/* Tab Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-16 items-start">
          
          {/* Left - Tab List */}
          <div className="lg:col-span-4 space-y-3">
            {securityLayers.map((layer, index) => {
              const Icon = layer.icon;
              return (
                <button
                  key={layer.title}
                  onClick={() => setActiveTab(index)}
                  className={`w-full text-left p-4 rounded-sm border transition-all duration-300 flex items-center space-x-4 cursor-pointer ${
                    activeTab === index
                      ? 'glass-panel border-cyber-cyan bg-cyber-cyan/5 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                      : 'border-slate-900 bg-transparent hover:border-slate-800 hover:bg-slate-900/30'
                  }`}
                >
                  <div className={`p-2.5 rounded-sm border ${
                    activeTab === index 
                      ? 'border-cyber-cyan/30 bg-cyber-cyan/15 text-cyber-cyan' 
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={`font-mono text-sm uppercase tracking-wide font-bold ${
                      activeTab === index ? 'text-white' : 'text-slate-400'
                    }`}>
                      {layer.title}
                    </h4>
                    <span className="text-[9px] text-slate-500 font-mono tracking-widest block uppercase mt-0.5">
                      {layer.tagline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right - Tab Details Viewer */}
          <div className="lg:col-span-8 min-h-[340px]">
            <AnimatePresence mode="wait">
              {securityLayers.map((layer, index) => {
                if (index !== activeTab) return null;
                const Icon = layer.icon;
                return (
                  <motion.div
                    key={layer.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel-glow p-8 rounded-sm h-full relative"
                  >
                    <div className="absolute top-4 right-4 text-[9px] font-mono text-cyber-cyan/50 tracking-wider">
                      PROTOCOL: SECURE_CORE_v1.4
                    </div>

                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-10 h-10 rounded-sm border border-cyber-cyan/30 bg-cyber-cyan/5 flex items-center justify-center text-cyber-cyan">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="text-xl font-bold font-mono text-white tracking-wide uppercase">
                        {layer.title} Details
                      </h4>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      {layer.desc}
                    </p>

                    <div className="border-t border-slate-900 pt-6">
                      <h5 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">
                        System Implementation Checklist
                      </h5>
                      <ul className="space-y-3">
                        {layer.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start space-x-3 text-slate-300 text-xs font-mono">
                            <ShieldCheck className="h-4.5 w-4.5 text-cyber-cyan flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
