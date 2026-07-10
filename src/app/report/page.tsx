'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ArrowLeft,
  Lock,
  EyeOff,
  Eye,
  FileUp,
  AlertTriangle,
  RefreshCw,
  Send,
  CheckCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ReportPage() {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    category: '',
    dateOfIncident: '',
    socialMediaPlatform: '',
    description: '',
    priority: 'Medium',
    consent: false,
  });

  // Evidence file
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceBase64, setEvidenceBase64] = useState('');

  // CAPTCHA State
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState('');

  // Loading & Submission State
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedCaseId, setSubmittedCaseId] = useState('');
  const [error, setError] = useState('');

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  // Handle Simulated Evidence Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceName(file.name);
      
      // Convert to base64 to simulate transmission
      const reader = new FileReader();
      reader.onload = () => {
        setEvidenceBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Captcha validation
    if (parseInt(captchaInput) !== num1 + num2) {
      setError('CAPTCHA verification answer is incorrect.');
      return;
    }

    if (!form.consent) {
      setError('You must consent to data processing to submit a case.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          isAnonymous,
          evidenceFile: evidenceBase64,
          captchaAnswer: parseInt(captchaInput),
          captchaExpected: num1 + num2,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setSubmittedCaseId(data.reportId);
      } else {
        setError(data.error || 'Failed to submit report. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Network communication error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'Women Cyber Safety Support',
    'Cyber Harassment Assistance',
    'Social Media Account Recovery Guidance',
    'Online Scam Reporting Guidance',
    'Cyber Awareness Programs',
    'Digital Privacy Consultation',
    'OSINT Support',
    'Ethical Hacking Awareness',
    'Emergency Cyber Assistance',
  ];

  const platforms = ['Instagram', 'Facebook', 'Telegram', 'WhatsApp', 'Twitter/X', 'Discord', 'TikTok', 'Dark Web', 'Other'];

  return (
    <div className="relative min-h-screen text-slate-100 bg-slate-950 font-sans selection:bg-cyber-cyan selection:text-black">
      <div className="scanlines-overlay" />
      <Navbar />

      {/* Cyber Grid background */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-[140px] pointer-events-none" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-cyber-cyan transition-colors">
            <ArrowLeft className="h-4.5 w-4.5" />
            <span>RETURN TO OPERATIONS CENTER</span>
          </Link>
        </div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Header Titles */}
              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold font-mono text-white flex items-center space-x-2 tracking-tight">
                  <ShieldAlert className="h-8 w-8 text-cyber-cyan animate-pulse" />
                  <span>SECURE CASE PORTAL</span>
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                  Submit details of online stalking, abuse, cyber extortion, child safety risks, or phishing scams. Every report is audited and securely analyzed under strict confidentiality filters. Already submitted a case? <Link href="/report/status" className="text-cyber-cyan hover:underline font-mono">Track Case Status &rarr;</Link>
                </p>
              </div>

              {/* Confidentiality Notice */}
              <div className="glass-panel border-cyber-cyan/30 bg-cyber-cyan/5 p-4 rounded-sm flex items-start space-x-3">
                <Lock className="h-5 w-5 text-cyber-cyan flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-200">
                  <strong>Notice:</strong> All submitted reports are treated as strictly confidential. Your privacy is protected throughout the entire analysis process.
                </div>
              </div>

              {/* Law Enforcement Disclaimer */}
              <div className="glass-panel border-amber-500/20 bg-amber-500/5 p-4 rounded-sm flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <strong>Disclaimer:</strong> VCN is an ethical hacking and cyber safety advocacy community. **We are not a law enforcement agency.** We do not claim guaranteed outcomes, and do not promise fixed response times. We provide guidance, investigation analysis, and evidence dossiers to help you file official complaints.
                </div>
              </div>

              {/* Secure Form Panel */}
              <form onSubmit={handleSubmit} className="glass-panel-glow p-8 rounded-sm space-y-6">
                
                {/* 1. Anonymity Toggle */}
                <div className="border-b border-slate-900 pb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wide">
                      Anonymity Setting
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">
                      Choose whether to link your name and contact details to this file.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(true)}
                      className={`px-4 py-2 rounded-sm text-xs font-mono tracking-wider border cursor-pointer transition-all ${
                        isAnonymous
                          ? 'border-cyber-cyan bg-cyber-cyan/5 text-cyber-cyan'
                          : 'border-slate-800 bg-transparent text-slate-400'
                      }`}
                    >
                      <EyeOff className="h-3.5 w-3.5 inline mr-1.5" />
                      Anonymous
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(false)}
                      className={`px-4 py-2 rounded-sm text-xs font-mono tracking-wider border cursor-pointer transition-all ${
                        !isAnonymous
                          ? 'border-cyber-cyan bg-cyber-cyan/5 text-cyber-cyan'
                          : 'border-slate-800 bg-transparent text-slate-400'
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5 inline mr-1.5" />
                      Disclosed
                    </button>
                  </div>
                </div>

                {/* 2. Optional Disclosed Fields */}
                <AnimatePresence>
                  {!isAnonymous && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-6 overflow-hidden border-b border-slate-900 pb-6"
                    >
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Optional"
                          className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Optional"
                          className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Optional"
                          className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 3. Location Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                      Country of Residence *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                      placeholder="e.g. United States, India"
                      className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                      State / Province / Region *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      placeholder="e.g. California, Maharashtra"
                      className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* 4. Incident Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                      Incident Category *
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                    >
                      <option value="">-- Choose Category --</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                      Date of Incident *
                    </label>
                    <input
                      type="date"
                      name="dateOfIncident"
                      value={form.dateOfIncident}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                      Platform Used *
                    </label>
                    <select
                      name="socialMediaPlatform"
                      value={form.socialMediaPlatform}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                    >
                      <option value="">-- Choose Platform --</option>
                      {platforms.map((plat) => (
                        <option key={plat} value={plat}>
                          {plat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. Case Details */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                    Incident Description *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Provide a comprehensive timeline of events. Mention any profiles involved, threats received, and details that could assist our ethical hacking team..."
                    className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-sans leading-relaxed"
                  />
                </div>

                {/* 6. Evidence upload & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  
                  {/* File Upload */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                      Upload Evidence (Screenshots/Logs)
                    </label>
                    <div className="relative border border-dashed border-slate-800 bg-slate-900/40 rounded-sm p-4 flex flex-col items-center justify-center cursor-pointer hover:border-cyber-cyan/50 transition-colors">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <FileUp className="h-6 w-6 text-slate-500 mb-2" />
                      <span className="text-xs font-mono text-slate-400">
                        {evidenceName ? evidenceName : 'Drop file here or browse'}
                      </span>
                    </div>
                  </div>

                  {/* Priority Level */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                      Priority Level *
                    </label>
                    <div className="grid grid-cols-4 gap-2 text-center font-mono">
                      {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setForm({ ...form, priority: level })}
                          className={`py-2 rounded-sm text-xs border cursor-pointer transition-all ${
                            form.priority === level
                              ? level === 'Critical'
                                ? 'border-red-500 bg-red-950/20 text-red-500'
                                : level === 'High'
                                ? 'border-amber-500 bg-amber-950/20 text-amber-500'
                                : 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
                              : 'border-slate-800 bg-transparent text-slate-500 hover:border-slate-700'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* 7. Security Verification CAPTCHA */}
                <div className="border-t border-slate-900 pt-6">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                    Security Verification CAPTCHA *
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-slate-900 border border-slate-850 px-4 py-2.5 rounded-sm font-mono text-sm text-cyber-cyan">
                      <span>{num1}</span>
                      <span>+</span>
                      <span>{num2}</span>
                      <span>=</span>
                    </div>
                    
                    <input
                      type="number"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      required
                      placeholder="Answer"
                      className="w-24 bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                    />

                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="p-2.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-sm hover:border-slate-700 transition-all cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 8. Consent */}
                <div className="flex items-start space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={form.consent}
                    onChange={handleChange}
                    className="h-4 w-4 rounded-sm border-slate-800 bg-slate-900 text-cyber-cyan focus:ring-0 cursor-pointer mt-1"
                  />
                  <label htmlFor="consent" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
                    I consent to the VCN community processing my submitted details under secure encryption standards. I verify that this information is accurate and submitted in good faith for digital safety support. *
                  </label>
                </div>

                {/* Submit button / Errors */}
                <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="text-xs font-mono text-red-500">
                    {error && <span>[ERROR] {error}</span>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="cyber-btn px-8 py-3.5 rounded-sm flex items-center justify-center space-x-2 text-xs font-mono tracking-wider disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="h-4 w-4 text-black group-hover:text-cyber-cyan" />
                    <span>{submitting ? 'COMMUNICATING CORRIDORS...' : 'TRANSMIT REPORT'}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel-glow p-8 rounded-sm text-center max-w-xl mx-auto space-y-6 my-12"
            >
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-cyber-cyan animate-bounce" />
              </div>

              <h2 className="text-2xl font-mono font-bold text-white tracking-wide uppercase">
                Case Lodged Successfully
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                VCN has securely received your transmission. Our investigators review active files based on severity metrics. Please copy and record the Case ID below.
              </p>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-sm font-mono text-center space-y-1">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                  Secure Case Identifier
                </div>
                <div className="text-xl font-bold text-cyber-cyan tracking-wider">
                  {submittedCaseId}
                </div>
              </div>

              <p className="text-xs text-amber-500 border border-amber-500/20 bg-amber-500/5 p-3 rounded-sm leading-relaxed">
                Notice: VCN does not contact you via public social handles. Any follow-up will occur through the email address you optionalized or via encrypted keys if initialized. Please keep this ID confidential.
              </p>

              <div className="pt-4">
                <Link href="/">
                  <button className="cyber-btn px-6 py-2.5 rounded-sm text-xs font-mono tracking-wider cursor-pointer">
                    Return to Center
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <Footer />
    </div>
  );
}
