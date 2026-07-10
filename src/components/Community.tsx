'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Heart, UserPlus, Users2 } from 'lucide-react';

export default function Community() {
  const sections = [
    {
      icon: Users2,
      title: 'Who Can Join',
      desc: 'Security researchers, software engineers, OSINT analysts, legal advisors, and cyber safety advocates who want to donate their skills.',
    },
    {
      icon: Shield,
      title: 'Code of Ethics',
      desc: 'Strict adherence to white-hat practices. No unauthorized breaches, maintaining total victim confidentiality, and cooperating under guidance.',
    },
    {
      icon: BookOpen,
      title: 'Training & Academy',
      desc: 'Active members receive weekly hands-on training in forensics, metadata scrubbing, secure hosting, and OSINT gathering methodologies.',
    },
    {
      icon: Heart,
      title: 'Our Core Values',
      desc: 'Empathy-driven support, technical integrity, absolute transparency with victims, and strict legal compliance in evidence building.',
    },
  ];

  return (
    <section id="community" className="py-24 relative overflow-hidden bg-slate-950/40">
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-cyber-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left info panel */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-cyber-cyan font-mono text-sm tracking-widest uppercase">
              // VOLUNTEER DIVISION
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Join the Vanguard of Digital Defense
            </h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              VCN runs on the passion and expertise of volunteers globally. We do not charge victims, and we operate strictly as a non-commercial community. Whether you are an expert reverse-engineer or a safety community coordinator, there is a place for you.
            </p>
            
            <div className="pt-4">
              <a href="#contact">
                <button className="cyber-btn px-8 py-3.5 rounded-sm flex items-center space-x-2 text-xs font-mono tracking-wider cursor-pointer">
                  <UserPlus className="h-4 w-4 text-black group-hover:text-cyber-cyan" />
                  <span>Become a Volunteer</span>
                </button>
              </a>
            </div>
          </div>

          {/* Right Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sections.map((sec, index) => {
              const Icon = sec.icon;
              return (
                <motion.div
                  key={sec.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass-panel p-6 rounded-sm hover:border-cyber-cyan/40 transition-colors"
                >
                  <div className="w-9 h-9 rounded-sm bg-slate-900 border border-slate-800 text-cyber-cyan flex items-center justify-center mb-4">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white font-mono mb-2">
                    {sec.title}
                  </h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {sec.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
