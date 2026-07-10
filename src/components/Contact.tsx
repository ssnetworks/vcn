'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Shield, AlertCircle, RefreshCw, Send, Check } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  
  // CAPTCHA State
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState<boolean | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaInput('');
    setCaptchaVerified(null);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Verify Captcha
    if (parseInt(captchaInput) !== num1 + num2) {
      setCaptchaVerified(false);
      setError('Incorrect security verification code. Please try again.');
      return;
    }
    setCaptchaVerified(true);
    setLoading(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setForm({
          name: '',
          email: '',
          subject: 'General Inquiry',
          message: '',
        });
        generateCaptcha();
      } else {
        setError(data.error || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setError('Network communication failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-slate-950/60 border-t border-slate-900">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyber-cyan/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-cyber-cyan font-mono text-sm tracking-widest uppercase">
            // COMMUNICATION CHANNELS
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Initiate Contact
          </h3>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Have general questions, partnership ideas, or volunteering inquiries? Use the secure contact form below. For reporting active cyber harassment cases, please use the **[Secure Case Portal](/report)**.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left panel: Info */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Safe Box */}
            <div className="glass-panel p-6 rounded-sm space-y-4">
              <div className="flex items-center space-x-3 text-cyber-cyan">
                <Shield className="h-6 w-6" />
                <h4 className="font-mono text-sm font-bold tracking-wide uppercase">
                  CONFIDENTIAL INBOX
                </h4>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Our support team reviews general inquiries within 24-48 hours. Communication is hosted on encrypted environments.
              </p>
              
              <div className="flex items-center space-x-3 pt-2 text-xs sm:text-sm font-mono text-white">
                <Mail className="h-4 w-4 text-cyber-cyan" />
                <span>contact@secure-vcn.org</span>
              </div>
            </div>

            {/* Emergency alert Box */}
            <div className="glass-panel border-amber-500/20 bg-amber-500/5 p-6 rounded-sm space-y-3">
              <div className="flex items-center space-x-2 text-amber-500 font-mono text-xs font-bold uppercase">
                <AlertCircle className="h-5 w-5" />
                <span>Emergency Situations</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                If you are in immediate physical danger, experiencing offline stalking, or under physical duress, please contact your local police department or national emergency lines immediately. **VCN is a cyber safety community, not a physical rescue team.**
              </p>
            </div>

          </div>

          {/* Right panel: Contact Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-sm space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                    Your Name / Alias
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
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
                    required
                    placeholder="e.g. safety@example.com"
                    className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                  Subject Category
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Volunteer Application">Volunteer Application</option>
                  <option value="Cyber Safety Training">Cyber Safety Training</option>
                  <option value="Media/Press Inquiry">Media/Press Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                  Message / Details
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Provide outline of your request..."
                  className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                />
              </div>

              {/* CAPTCHA */}
              <div className="border-t border-slate-900 pt-6">
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                  Security Check
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2 bg-slate-900 border border-slate-850 px-4 py-3 rounded-sm font-mono text-sm text-cyber-cyan">
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
                    className="w-24 bg-slate-900/60 border border-slate-800 text-white rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                  />

                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-3 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-sm hover:border-slate-700 transition-all cursor-pointer"
                    title="Refresh CAPTCHA"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Buttons & Status Alerts */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                
                {/* Status messages */}
                <div className="text-xs font-mono">
                  {error && <span className="text-red-500">{error}</span>}
                  {success && (
                    <span className="text-cyber-cyan flex items-center">
                      <Check className="h-4 w-4 mr-1.5" />
                      Secure message transmitted.
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="cyber-btn px-8 py-3.5 rounded-sm flex items-center justify-center space-x-2 text-xs font-mono tracking-wider disabled:opacity-50 cursor-pointer"
                >
                  <Send className="h-4 w-4 text-black group-hover:text-cyber-cyan" />
                  <span>{loading ? 'TRANSMITTING...' : 'SEND INQUIRY'}</span>
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
