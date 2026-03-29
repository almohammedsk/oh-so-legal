"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AskQuery() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    query: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState("");

  const generateTicket = () => `OSL-${Date.now()}`;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!agreed) {
      alert("Please accept Terms");
      return;
    }

    setLoading(true);

    const ticket_id = generateTicket();
    let file_url = null;

    if (file) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("query-files")
        .upload(fileName, file);

      if (!error) {
        const { data } = supabase.storage
          .from("query-files")
          .getPublicUrl(fileName);

        file_url = data.publicUrl;
      }
    }

    await supabase.from("queries").insert([
      { ...form, ticket_id, file_url },
    ]);

    setTicket(ticket_id);
    setForm({ name:"", email:"", phone:"", category:"", query:"" });
    setFile(null);
    setAgreed(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* Glow background */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-600 opacity-20 blur-3xl rounded-full bottom-10 right-10"></div>

      <motion.div
        initial={{ opacity:0, y:30 }}
        animate={{ opacity:1, y:0 }}
        className="w-full max-w-xl bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl"
      >

        <h1 className="text-3xl mb-2 text-center font-semibold">
          Submit Your Legal Query
        </h1>

        {/* 🔒 CONFIDENTIAL BADGE */}
        <div className="text-green-400 text-sm text-center mb-4">
          🔒 Confidential Submission
        </div>

        {ticket && (
          <div className="bg-green-600 p-3 mb-4 rounded text-center">
            Ticket Created: {ticket}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Full Name"
            className="w-full p-3 rounded bg-white text-black"
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
            required
          />

          <input
            placeholder="Email"
            className="w-full p-3 rounded bg-white text-black"
            value={form.email}
            onChange={(e)=>setForm({...form,email:e.target.value})}
            required
          />

          <input
            placeholder="Phone"
            className="w-full p-3 rounded bg-white text-black"
            value={form.phone}
            onChange={(e)=>setForm({...form,phone:e.target.value})}
            required
          />

          <select
            className="w-full p-3 rounded bg-white text-black"
            value={form.category}
            onChange={(e)=>setForm({...form,category:e.target.value})}
            required
          >
            <option value="">Select Category</option>
            <option>Property</option>
            <option>Family</option>
            <option>Criminal</option>
            <option>Corporate</option>
            <option>Recovery</option>
            <option>Other</option>
          </select>

          <textarea
            placeholder="Describe your issue..."
            rows={5}
            className="w-full p-3 rounded bg-white text-black"
            value={form.query}
            onChange={(e)=>setForm({...form,query:e.target.value})}
            required
          />

          <input
            type="file"
            onChange={(e)=>setFile(e.target.files?.[0] || null)}
          />

          {/* 🔥 CONFIDENTIALITY TEXT */}
          <div className="text-xs text-gray-400 leading-relaxed">
            All information shared on this platform is treated as confidential and is used solely for the purpose of providing general legal awareness based on the details submitted. Reasonable administrative and technical safeguards are implemented to protect user data. However, users are advised not to share highly sensitive or privileged information.
          </div>

          <div className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e)=>setAgreed(e.target.checked)}
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="underline text-blue-400">
                Terms & Conditions
              </Link>
            </span>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded bg-gradient-to-r from-purple-500 to-blue-500"
          >
            {loading ? "Submitting..." : "Submit Query"}
          </button>

        </form>
      </motion.div>
    </div>
  );
}