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
        width: hovered ? 420 : 70,
        height: 60,
        borderRadius: hovered ? 30 : 9999,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
      }}
      className="fixed top-6 right-6 z-50 flex items-center justify-center"
    >
      {/* 🔥 HALO */}
      <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-30 blur-2xl"></div>

      {/* 🔥 SHADOW DEPTH */}
      <div className="absolute inset-0 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.8)]"></div>

      {/* 🔥 GLASS CONTAINER */}
      <div className="relative w-full h-full flex items-center justify-center px-5 bg-white/10 backdrop-blur-2xl rounded-full border border-white/10">

        {/* REFLECTION */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 via-transparent to-transparent opacity-30"></div>

        {hovered ? (
          <div className="flex gap-6 text-sm text-white relative z-10">
            <Link href="/">Home</Link>
            <Link href="/ask-query">Ask</Link>
            <Link href="/knowledge">Knowledge</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/login">Admin</Link>
          </div>
        ) : (
          <div className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            OSL
          </div>
        )}

      </div>
    </motion.div>
  );
}