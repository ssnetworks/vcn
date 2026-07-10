'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, HeartHandshake, EyeOff, Lock } from 'lucide-react';

export default function About() {
  const cards = [
    {
      icon: HeartHandshake,
      title: 'Victim-First Support',
      desc: 'We prioritize the emotional and digital safety of victims of cyber abuse, providing guidance, trace reports, and mitigation methods.',
    },
    {
      icon: EyeOff,
      title: 'Absolute Confidentiality',
      desc: 'Your identity and report materials are stored in encrypted environments. We operate under strict secrecy. We do not disclose client details.',
    },
    {
      icon: Lock,
      title: 'Ethical Standards',
      desc: 'All our volunteers adhere to a rigorous code of ethical conduct, supporting digital rights and collaborating under legal parameters.',
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-950/40">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-blue/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-cyber-cyan font-mono text-sm tracking-widest uppercase"
          >
            // CODENAME: VIGILANT CYBER NINJAS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight"
          >
            About Our Community
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-400 leading-relaxed text-lg"
          >
            VCN is a global, volunteer-run ethical hacking community dedicated to defending vulnerable groups—specifically women and children—from online exploitation, harassment, and cybercrime. We provide cybersecurity guidance, gather structural evidence, and offer technical assistance to restore safety.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="glass-panel hover:glass-panel-glow p-8 rounded-sm transition-all duration-300 relative group"
              >
                {/* Tech Corner Accents */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-cyan/30 group-hover:border-cyber-cyan transition-colors" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-cyan/30 group-hover:border-cyber-cyan transition-colors" />

                <div className="bg-cyber-cyan/10 w-12 h-12 rounded-sm flex items-center justify-center border border-cyber-cyan/20 mb-6 group-hover:border-cyber-cyan/60 transition-colors">
                  <Icon className="h-6 w-6 text-cyber-cyan" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-mono">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Law Enforcement Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 glass-panel border-amber-500/20 bg-amber-500/5 p-6 rounded-sm text-center max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center space-x-2 text-amber-500 mb-2 font-mono text-sm font-bold">
            <ShieldAlert className="h-5 w-5" />
            <span>CRITICAL LEGAL NOTICE & DISCLAIMER</span>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            VCN is an ethical hacking and cyber safety advocacy community. **We are not a law enforcement agency.** We do not claim guaranteed outcomes, nor do we promise fixed response windows. VCN provides educational materials, emergency cybersecurity assistance, incident guidance, and digital evidence collection support. Where appropriate and legally compliant, we assist victims in formatting, reporting, and lodging reports with relevant platforms or official authorities.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
