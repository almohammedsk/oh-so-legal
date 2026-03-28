"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        width: hovered ? 460 : 70,
        height: 60,
        borderRadius: hovered ? 30 : 9999, // 🔥 perfect circle when collapsed
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
      }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
    >

      {/* 🌟 HALO (NOW OUTSIDE → VISIBLE) */}
      <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-30 blur-2xl"></div>

      {/* 🌑 DEPTH SHADOW (SEPARATION FROM BG) */}
      <div className="absolute inset-0 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.8)]"></div>

      {/* 🧊 GLASS BODY */}
      <div
        className="
          relative w-full h-full flex items-center justify-center px-5
          bg-white/10 backdrop-blur-2xl
          rounded-full
        "
      >

        {/* ✨ GLASS REFLECTION */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 via-transparent to-transparent opacity-40 pointer-events-none"></div>

        {hovered ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-6 text-sm text-white font-medium relative z-10"
          >
            <Link href="/" className="hover:text-purple-300 transition">
              Home
            </Link>

            <Link href="/ask-query" className="hover:text-blue-300 transition">
              Ask
            </Link>

            <Link href="/nri" className="hover:text-yellow-300 transition">
  NRI
</Link>

            <Link href="/knowledge" className="hover:text-pink-300 transition">
              Knowledge
            </Link>

            <Link href="/terms" className="hover:text-gray-300 transition">
              Terms
            </Link>

            <Link href="/login" className="hover:text-green-300 transition">
              Admin
            </Link>
          </motion.div>
        ) : (
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="relative z-10 text-lg font-bold tracking-widest bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          >
            OSL
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}