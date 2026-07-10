import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Stats from '@/components/Stats';
import Services from '@/components/Services';
import Confidentiality from '@/components/Confidentiality';
import SuccessStories from '@/components/SuccessStories';
import Resources from '@/components/Resources';
import Community from '@/components/Community';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import MatrixBackground from '@/components/MatrixBackground';

export const metadata = {
  title: 'VCN - Vigilant Cyber Ninjas | Protecting Women & Fighting Cybercrime',
  description: 'VCN (Vigilant Cyber Ninjas) is a community of ethical hackers committed to combating online harassment, child exploitation, and cyber abuse with absolute confidentiality.',
};

export default function Home() {
  return (
    <div className="relative min-h-screen text-slate-100 bg-slate-950 font-sans antialiased selection:bg-cyber-cyan selection:text-black">
      {/* Scanline CRT overlay */}
      <div className="scanlines-overlay" />
      
      {/* Interactive Cyber Falling Code Canvas */}
      <MatrixBackground />

      {/* Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Stats />
        <Services />
        <Confidentiality />
        <SuccessStories />
        <Resources />
        <Community />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
