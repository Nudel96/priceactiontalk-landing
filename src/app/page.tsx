"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const brand = {
  darkBlue: "#0d1b2a",
  turquoise: "#1b9aaa",
  green: "#7cfc00",
  white: "#ffffff",
  darkGrey: "#2e2e2e",
};

export default function Home() {
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d1b2a] text-white flex flex-col font-sans">
      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex justify-between items-center px-6 py-4 bg-[#0d1b2a] shadow-xl sticky top-0 z-50"
      >
        <div className="flex items-center gap-4">
          <Image src="/Logo.jpg" alt="Logo" width={48} height={48} className="rounded-full bg-white p-1 shadow-lg" />
          <span className="font-extrabold text-2xl tracking-wide text-[#1b9aaa]">PRICEACTIONTALK</span>
        </div>
        <nav className="flex items-center gap-4 font-medium">
          <a href="#features" className="hover:text-[#7cfc00] transition">Features</a>
          <a href="#levels" className="hover:text-[#7cfc00] transition">Levels</a>
          <a href="#pricing" className="hover:text-[#7cfc00] transition">Pricing</a>
          <a href="#faq" className="hover:text-[#7cfc00] transition">FAQ</a>
          {/* Instagram Button */}
          <a href="https://www.instagram.com/priceactiontalk/" target="_blank" rel="noopener noreferrer" className="ml-3">
            <motion.div
              whileHover={{ scale: 1.2, backgroundColor: brand.turquoise }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#2e2e2e] hover:bg-[#7cfc00] transition-all shadow-md cursor-pointer"
            >
              {/* IG SVG Icon */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="5" stroke="#fff" strokeWidth="2"/><circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="#fff"/></svg>
            </motion.div>
          </a>
          <a href="#login" className="ml-3 px-5 py-2 bg-[#7cfc00] text-[#0d1b2a] rounded-full font-bold shadow-lg hover:bg-[#1b9aaa] hover:text-white transition-all">Login</a>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="flex flex-col items-center justify-center py-24 px-6 bg-gradient-to-br from-[#0d1b2a] to-[#2e2e2e] relative overflow-hidden"
      >
        {/* Glow circle BG */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 1.3 }}
          className="absolute -top-32 right-1/2 w-[700px] h-[700px] rounded-full bg-[#1b9aaa] opacity-20 blur-3xl pointer-events-none z-0"
        ></motion.div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-7 text-[#1b9aaa] drop-shadow-xl text-center z-10">Competence. Clarity. No Bullshit.</h1>
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-xl md:text-2xl max-w-2xl text-center mb-12 text-[#fff] z-10"
        >
          The only trading community focused on real knowledge, actual results, and long-term growth – no guru hype. Lifetime access. No subscription.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.08, backgroundColor: brand.green, color: brand.darkBlue }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-[#7cfc00] text-[#0d1b2a] px-10 py-4 rounded-full text-xl font-extrabold shadow-xl mb-2 transition-all z-10"
          onClick={() => setShowPayment(true)}
        >
          Get Access Now
        </motion.button>
      </motion.section>

      {/* Features Section */}
      <motion.section id="features" className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Structured Learning",
            desc: "Unlock a unique level-based system, with PDFs, videos, tasks, and reflection – step-by-step, challenge by challenge.",
            delay: 0.1,
          },
          {
            title: "Pro Community",
            desc: "Connect with traders from Germany, India, Pakistan, UAE, Hong Kong & USA. 200+ members – one mindset: real progress.",
            delay: 0.2,
          },
          {
            title: "Lifetime Access",
            desc: "Pay once. Learn forever. No subscriptions. Payment via Stripe, Crypto or PayPal.",
            delay: 0.3,
          },
        ].map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: f.delay, duration: 0.7 }}
            className="bg-[#2e2e2e] rounded-2xl p-8 shadow-xl hover:scale-105 transition-transform"
          >
            <h2 className="text-2xl font-bold mb-3 text-[#1b9aaa]">{f.title}</h2>
            <p className="text-[#fff] opacity-80">{f.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Level Preview Section */}
      <motion.section id="levels" className="py-16 px-6 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-3xl font-bold mb-10 text-[#1b9aaa] text-center"
        >
          Unlock Levels by Learning & Doing
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="bg-[#2e2e2e] rounded-2xl flex flex-col items-center p-8 shadow-xl hover:scale-105 transition-transform"
          >
            <h3 className="text-xl font-bold text-[#7cfc00] mb-2">C-Tier (Sessionality)</h3>
            <p className="mb-4 text-[#fff] opacity-90">Example PDF: Gold Seasonality – annual & monthly patterns, macro cycles, why smart traders focus on the second half of the year.</p>
            <a href="/Sessionality.pdf" target="_blank" className="underline text-[#1b9aaa] hover:text-[#7cfc00]">Preview PDF</a>
          </motion.div>
        </div>
      </motion.section>

      {/* Pricing & Payment Section */}
      <motion.section id="pricing" className="py-20 px-6 bg-[#171717] text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-4xl font-extrabold mb-6 text-[#7cfc00]"
        >
          Lifetime Access – All Levels
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl mb-8 text-[#fff] opacity-85"
        >
          One payment, no subscription. Unlock your trading journey for life.
        </motion.p>
        <motion.a
          whileHover={{ scale: 1.09, backgroundColor: brand.turquoise, color: brand.white }}
          transition={{ type: "spring", stiffness: 240 }}
          href="https://buy.stripe.com/test_28E5kw3FS07T1vOc0w6Ri00"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#7cfc00] text-[#0d1b2a] px-12 py-5 rounded-full text-2xl font-extrabold shadow-2xl hover:bg-[#1b9aaa] hover:text-white transition-all inline-block"
        >
          Pay via Stripe & Get Access
        </motion.a>
      </motion.section>

      {/* FAQ Section */}
      <motion.section id="faq" className="py-16 px-6 max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-[#1b9aaa] text-center"
        >
          FAQ
        </motion.h2>
        <div className="space-y-6 text-left">
          <div>
            <h3 className="text-xl font-semibold text-[#7cfc00]">How do I access the content?</h3>
            <p className="text-[#fff] opacity-90">After payment, you’ll be able to create an account and unlock content step-by-step as you complete challenges and submit assignments.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#7cfc00]">Can I pay with crypto?</h3>
            <p className="text-[#fff] opacity-90">Yes, crypto and PayPal options are coming soon.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#7cfc00]">Is there a subscription or hidden fees?</h3>
            <p className="text-[#fff] opacity-90">No. One payment, lifetime access. No hidden fees or subscriptions – ever.</p>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-[#0d1b2a] py-8 px-6 text-center">
        <p className="text-[#fff] opacity-70">&copy; 2025 PriceActionTalk. All rights reserved.</p>
      </footer>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#2e2e2e] p-10 rounded-2xl shadow-2xl max-w-lg w-full flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-4 text-[#7cfc00]">Lifetime Access via Stripe</h2>
            <p className="text-[#fff] opacity-90 mb-7">Complete your payment securely to unlock all levels. No subscription.</p>
            <a
              href="https://buy.stripe.com/test_28E5kw3FS07T1vOc0w6Ri00"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#7cfc00] text-[#0d1b2a] px-8 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-[#1b9aaa] hover:text-white transition-all mb-4"
            >
              Pay Now
            </a>
            <button className="text-[#fff] opacity-70 mt-2 underline hover:text-[#7cfc00]" onClick={() => setShowPayment(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
