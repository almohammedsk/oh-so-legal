"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {/* ================= DESKTOP NAVBAR ================= */}
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
        className="hidden md:flex fixed top-6 right-6 z-50 items-center justify-center"
      >
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-30 blur-2xl"></div>

        <div className="relative w-full h-full flex items-center justify-center px-5 bg-white/10 backdrop-blur-2xl rounded-full border border-white/10">

          {hovered ? (
            <div className="flex gap-6 text-sm text-white">
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

      {/* ================= MOBILE NAVBAR ================= */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">

        <div className="flex gap-6 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/10 shadow-lg">

          <Link href="/" className="text-sm text-white">Home</Link>
          <Link href="/ask-query" className="text-sm text-white">Ask</Link>
          <Link href="/knowledge" className="text-sm text-white">Learn</Link>
          <Link href="/login" className="text-sm text-white">Admin</Link>

        </div>
      </div>
    </>
  );
}