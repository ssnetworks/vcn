'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  MessagesSquare,
  Key,
  Landmark,
  GraduationCap,
  Lock,
  Eye,
  Terminal,
  AlertTriangle,
} from 'lucide-react';

export default function Services() {
  const serviceList = [
    {
      icon: ShieldAlert,
      title: 'Women Cyber Safety Support',
      desc: 'Focused cybersecurity guidance and tools designed to protect women from stalking, online defamation, blackmail, and gender-based cyber threats.',
    },
    {
      icon: MessagesSquare,
      title: 'Cyber Harassment Assistance',
      desc: 'Technical consultation for victims of online bullying, cyberstalking, and digital threats. We assist in tracing sources and generating evidence packages.',
    },
    {
      icon: Key,
      title: 'Social Media Account Recovery Guidance',
      desc: 'Step-by-step assistance and recovery checklists for hacked accounts (Instagram, Facebook, LinkedIn, Google) to restore digital ownership safely.',
    },
    {
      icon: Landmark,
      title: 'Online Scam Reporting Guidance',
      desc: 'Assistance mapping transactions, documenting fraudulent interactions, and preparing compliance files for financial fraud reporting.',
    },
    {
      icon: GraduationCap,
      title: 'Cyber Awareness Programs',
      desc: 'Educational webinars, safety toolkits, and proactive security workshops aimed at reducing digital vulnerability across communities.',
    },
    {
      icon: Lock,
      title: 'Digital Privacy Consultation',
      desc: 'Personal threat modeling, browser hardening, mobile device security audits, and metadata purging recommendations.',
    },
    {
      icon: Eye,
      title: 'OSINT Support',
      desc: 'Open Source Intelligence investigations to locate exposed private details, trace malicious online actors, and map digital leaks.',
    },
    {
      icon: Terminal,
      title: 'Ethical Hacking Awareness',
      desc: 'Seminars exploring defensive penetration testing, security auditing, and safe development practices to guide aspiring cyber defenders.',
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Cyber Assistance',
      desc: 'Rapid-response checklists and secure digital safety support for active compromises, data leaks, or extortions in progress.',
    },
  ];

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-slate-950/20">
      {/* Background neon dots */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-cyber-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyber-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-cyber-cyan font-mono text-sm tracking-widest uppercase">
            // OPERATIONAL CAPABILITIES
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Cyber Assistance & Security Services
          </h3>
          <p className="text-slate-400 text-lg leading-relaxed">
            VCN provides specific guidance, analysis, and educational programs to help victims counter digital abuse and restore control of their online presence.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {serviceList.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="glass-panel hover:glass-panel-glow p-8 rounded-sm transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-sm border border-cyber-cyan/20 bg-cyber-cyan/5 flex items-center justify-center mb-6 group-hover:border-cyber-cyan/60 transition-colors">
                    <Icon className="h-6 w-6 text-cyber-cyan group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-3 font-mono tracking-wide">
                    {service.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>

                <div className="border-t border-slate-900 pt-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>SECURE ACCESS // GUIDANCE ONLY</span>
                  <span className="text-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    LEARN MORE &rarr;
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
