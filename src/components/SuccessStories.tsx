'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Quote, Heart } from 'lucide-react';

export default function SuccessStories() {
  const stories = [
    {
      id: 'VCN-8902',
      victim: 'De-identified Case (United States)',
      category: 'Cyber Harassment Recovery',
      quote: 'After weeks of relentless stalking and deepfake harassment on Instagram, I felt completely helpless. The VCN team analyzed the harasser\'s network, compiled a detailed forensic report, and guided me through escalation. The accounts were permanently suspended and I finally got my life back.',
      date: 'June 2026',
    },
    {
      id: 'VCN-6712',
      victim: 'De-identified Case (India)',
      category: 'Telegram Abuse Mitigation',
      quote: 'Someone created a fake profile of me sharing modified private photos. VCN responded swiftly, tracked down the channel organizers, and coordinated with platforms to take down the groups within 48 hours. Their ethical and legal compliance instructions were invaluable.',
      date: 'May 2026',
    },
    {
      id: 'VCN-4401',
      victim: 'De-identified Case (United Kingdom)',
      category: 'Phishing Scam Assessment',
      quote: 'My accounts were compromised, and the hacker was demanding a ransom under threat of leaking business records. VCN helped me isolate my devices, purge malware, recover my primary email, and draft a clean evidence dossier for the cybercrime unit. Deeply grateful for their safety counseling.',
      date: 'April 2026',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-cyber-cyan font-mono text-sm tracking-widest uppercase">
            // SUPPORT JOURNAL
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Sanitized Success Stories
          </h3>
          <p className="text-slate-400 text-lg leading-relaxed">
            Review feedback from individuals who received cyber safety assistance. Personal names, specific locations, and account identifiers have been scrubbed to protect victim safety.
          </p>
        </div>

        {/* Stories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass-panel hover:glass-panel-glow p-8 rounded-sm transition-all duration-300 relative flex flex-col justify-between"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-cyber-cyan/15 pointer-events-none" />
              
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-cyber-cyan/80 mb-4 uppercase tracking-wider">
                  <MessageSquare className="h-3 w-3" />
                  <span>CASE REF: {story.id}</span>
                </div>

                <p className="text-slate-300 text-sm italic leading-relaxed mb-6">
                  "{story.quote}"
                </p>
              </div>

              <div className="border-t border-slate-900 pt-4 mt-6">
                <h4 className="text-white text-xs font-bold font-mono">
                  {story.victim}
                </h4>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>{story.category}</span>
                  <span className="flex items-center text-cyber-blue">
                    <Heart className="h-2.5 w-2.5 mr-1 fill-cyber-blue" />
                    {story.date}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
