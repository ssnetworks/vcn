'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  CheckSquare,
  AlertOctagon,
  Eye,
  Key,
  ShieldAlert,
  Flame,
  ChevronDown,
  X,
} from 'lucide-react';

export default function Resources() {
  const [selectedResource, setSelectedResource] = useState<number | null>(null);

  const resources = [
    {
      icon: ShieldCheck,
      title: 'Cyber Safety Tips',
      category: 'General Safety',
      brief: 'Basic precautions to keep your devices secure and prevent unauthorized access.',
      details: [
        'Check link prefixes always: Look for HTTPS and verify domains carefully before typing login credentials.',
        'Disable location tagging on camera apps: Photos contain EXIF metadata displaying exact GPS coordinates.',
        'Purge browser cookies regularly: Session cookies can be stolen via malware to hijack accounts without password entry.',
        'Isolate public Wi-Fi access: Use a reputable VPN or cellular hotspots in airports, hotels, and cafés.',
      ],
    },
    {
      icon: ShieldAlert,
      title: 'Women\'s Digital Safety Guide',
      category: 'Targeted Protection',
      brief: 'Crucial steps for protecting personal identity, photos, and locating stalkers.',
      details: [
        'Hard lock profiles: Enable Instagram private account toggle and restrict Facebook profiles to friends only.',
        'Decline unauthorized messages: Keep Instagram/WhatsApp direct messages restricted to followers/contacts only.',
        'Audit active login devices: Check social account settings weekly and log out of all unrecognized browsers.',
        'Mask contact details: Avoid sharing phone numbers or personal emails publicly; use alias emails for online registers.',
      ],
    },
    {
      icon: AlertOctagon,
      title: 'Scam Prevention',
      category: 'Financial Safety',
      brief: 'Recognize phishing schemes, fake employment offers, and cryptocurrency frauds.',
      details: [
        'Verify recruiters: Ensure job offers come from official company domains. Never pay deposits for "training kit equipment".',
        'Protect One-Time Passwords (OTPs): VCN, banks, and platforms will never contact you asking for security codes.',
        'Trace crypto transaction addresses: Always review transfer hashes. Be suspicious of automated double-your-investment plans.',
        'Double-check invoice emails: Scammers spoof payment warnings. Verify bills directly on the vendor\'s official portal.',
      ],
    },
    {
      icon: Eye,
      title: 'Child Online Safety',
      category: 'Family Care',
      brief: 'Best practices to defend minors from online predation and child abuse networks.',
      details: [
        'Enable device parental filters: Configure Google Family Link, Apple Screen Time, or Microsoft Safety groups.',
        'Educate on privacy limits: Instruct kids to never share school addresses, schedules, photos, or gaming room codes.',
        'Audit gaming chat settings: Set voice and text chats in games like Roblox, Discord, or Fortnite to friends-only.',
        'Conduct regular digital reviews: Talk with kids openly about online interactions and watch for secretive device habits.',
      ],
    },
    {
      icon: Key,
      title: 'Social Media Privacy',
      category: 'Identity Security',
      brief: 'Audit active app authorizations, visibility settings, and platform trackers.',
      details: [
        'Clean app connections: Open settings and revoke access to old or third-party web apps linking to your accounts.',
        'Block search indexing: Disable the platform option allowing search engines to index your profile page.',
        'Filter search tags: Configure settings so tag requests require manual approval before appearing on your feed.',
        'Remove phone recoveries: Replace SMS recovery with authenticator apps to mitigate SIM-swapping risks.',
      ],
    },
    {
      icon: FileText,
      title: 'Password Security',
      category: 'Credential Hardening',
      brief: 'Mastering authentication methods, password managers, and multi-factor safety.',
      details: [
        'Implement password managers: Adopt vaults like Bitwarden, 1Password, or KeePass for randomized passwords.',
        'Adopt passphrases: Construct passwords out of 4-5 random words (e.g., "cyber-shield-ninjas-confidential-2026").',
        'Configure authenticator apps: Migrate from SMS 2FA to Google Authenticator, Authy, or hardware YubiKeys.',
        'Differentiate keys: Never reuse passwords across email, banking, and social accounts.',
      ],
    },
    {
      icon: Flame,
      title: 'Latest Cyber Threats',
      category: 'Threat Intelligence',
      brief: 'Stay informed on modern hacker vectors, AI scams, and malware trends.',
      details: [
        'AI voice cloning scams: Fraudsters clone a family member\'s voice from video posts and call asking for emergency money.',
        'Malicious session hijacking: Malware downloads mimicking gaming cheats steal browser state, bypassing 2FA.',
        'Ransomware targeting home devices: Phishing attachments posing as shipping notifications lock personal photo vaults.',
        'Quishing (QR code phishing): Spoof QR codes placed on public parking meters redirect users to billing collection clones.',
      ],
    },
    {
      icon: CheckSquare,
      title: 'Emergency Response Checklist',
      category: 'Incident Response',
      brief: 'Immediate protocols to deploy if you are undergoing active hacking or extortion.',
      details: [
        'Document and capture evidence: Take immediate screenshots of threats, profiles, message timestamps, and email headers.',
        'Never submit to extortion payouts: Paying extortionists does not guarantee deletion; they will request more funds.',
        'Isolate compromised hardware: Turn off internet access and run offline security scans to detect trojans.',
        'Report to cyber safety teams: Notify local authorities, submit cases to VCN, and flag the profiles on the hosting platform.',
      ],
    },
  ];

  return (
    <section id="resources" className="py-24 relative overflow-hidden bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-cyber-cyan font-mono text-sm tracking-widest uppercase">
            // AWARENESS KNOWLEDGEBASE
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Security Guides & Awareness Resources
          </h3>
          <p className="text-slate-400 text-lg leading-relaxed">
            Equip yourself with the tools and techniques needed to stay secure in an increasingly complex digital landscape.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {resources.map((res, index) => {
            const Icon = res.icon;
            return (
              <motion.div
                key={res.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="glass-panel hover:glass-panel-glow p-6 rounded-sm flex flex-col justify-between cursor-pointer group transition-all duration-300 relative"
                onClick={() => setSelectedResource(index)}
              >
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-cyan/0 group-hover:border-cyber-cyan/40 transition-colors" />
                
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyber-cyan mb-4 uppercase tracking-wider">
                    <span>{res.category}</span>
                  </div>
                  <div className="w-10 h-10 rounded-sm bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyber-cyan group-hover:border-cyber-cyan/35 mb-4 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2 font-mono group-hover:text-cyber-cyan transition-colors">
                    {res.title}
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {res.brief}
                  </p>
                </div>

                <div className="mt-6 flex items-center text-xs font-mono text-cyber-cyan group-hover:underline">
                  <span>Open Handbook</span>
                  <ChevronDown className="h-3.5 w-3.5 ml-1 rotate-270" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Expanded Modal Overlay */}
      <AnimatePresence>
        {selectedResource !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResource(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="glass-panel-glow p-8 rounded-sm max-w-lg w-full relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedResource(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-sm border border-cyber-cyan bg-cyber-cyan/5 flex items-center justify-center text-cyber-cyan">
                  {React.createElement(resources[selectedResource].icon, { className: 'h-5 w-5' })}
                </div>
                <div>
                  <h4 className="text-lg font-bold font-mono text-white">
                    {resources[selectedResource].title}
                  </h4>
                  <span className="text-[9px] font-mono text-cyber-cyan tracking-widest uppercase">
                    VCN HANDBOOK // {resources[selectedResource].category}
                  </span>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">
                {resources[selectedResource].brief}
              </p>

              <div className="border-t border-slate-900 pt-6">
                <h5 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">
                  Checklist Guidelines & Safeguards
                </h5>
                <ul className="space-y-4">
                  {resources[selectedResource].details.map((detail, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-slate-300 text-xs font-mono leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan mt-1.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setSelectedResource(null)}
                className="cyber-btn w-full mt-8 py-3 rounded-sm text-xs font-mono tracking-wider cursor-pointer"
              >
                CLOSE HANDBOOK
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
