"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[600px] h-[600px] bg-purple-600 opacity-20 blur-3xl rounded-full top-10 left-10"></div>
        <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-20 blur-3xl rounded-full bottom-10 right-10"></div>
      </div>

      {/* 🔥 HERO */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
      >
        Oh! So Legal
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-300 max-w-xl text-center text-lg mb-10"
      >
        Legal clarity, simplified.  
        Ask your query and get structured insights from experienced advocates.
      </motion.p>

      {/* 🔥 CTA BUTTONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4 flex-wrap justify-center mb-16"
      >
        <Link href="/ask-query">
          <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition">
            Ask a Legal Question
          </button>
        </Link>

        <Link href="/knowledge">
          <button className="px-8 py-3 rounded-full border border-gray-500 hover:bg-white hover:text-black transition">
            Explore Knowledge
          </button>
        </Link>
      </motion.div>

      {/* 🔥 FEATURES SECTION */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">

        {[
          {
            title: "Structured Responses",
            desc: "Clear, legally grounded insights — not vague opinions.",
          },
          {
            title: "Real Advocate Review",
            desc: "Your query is reviewed by practicing legal professionals.",
          },
          {
            title: "Fast Turnaround",
            desc: "Receive clarity within 36 hours.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.2 }}
            className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 hover:scale-105 transition"
          >
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </motion.div>
        ))}

      </div>

      {/* 🔥 FOOT NOTE */}
      <p className="text-xs text-gray-500 mt-16 text-center max-w-md">
        This platform provides general legal awareness and does not constitute legal advice.
      </p>

    </div>
  );
}