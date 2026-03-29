"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function AskQuery() {

  const inputStyle =
    "w-full p-3 bg-white text-black rounded border border-gray-300";

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

  const generateTicket = () => {
    return `OSL-${Date.now()}`;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!agreed) {
      alert("Please accept Terms");
      return;
    }

    setLoading(true);

    const ticket_id = generateTicket();

    let file_url = null;

    // 📁 UPLOAD FILE IF EXISTS
    if (file) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("query-files")
        .upload(fileName, file);

      if (uploadError) {
        alert("File upload failed");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("query-files")
        .getPublicUrl(fileName);

      file_url = data.publicUrl;
    }

    // 🧾 INSERT QUERY
    const { error } = await supabase.from("queries").insert([
      {
        ...form,
        ticket_id,
        file_url,
      },
    ]);

    if (!error) {

      // 📧 EMAIL
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          ticket: ticket_id,
          phone: form.phone,
          category: form.category,
          query: form.query,
        }),
      });

      setTicket(ticket_id);

      setForm({
        name: "",
        email: "",
        phone: "",
        category: "",
        query: "",
      });

      setFile(null);
      setAgreed(false);

    } else {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-neutral-900 p-8 rounded-2xl">

        <h1 className="text-3xl mb-6 text-center">
          Ask Your Legal Query
        </h1>

        {ticket && (
          <div className="bg-green-700 p-4 mb-6 rounded text-center">
            Your query has been securely received.
            <br />
            Ticket ID: <strong>{ticket}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Full Name"
            className={inputStyle}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            placeholder="Email"
            className={inputStyle}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            placeholder="Phone"
            className={inputStyle}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />

          <select
            className={inputStyle}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select Category</option>
            <option>Property</option>
            <option>Family</option>
            <option>Criminal</option>
            <option>Job</option>
            <option>Money</option>
            <option>Documents</option>
            <option>Not Sure</option>
          </select>

          <textarea
            placeholder="Describe your issue..."
            className={inputStyle}
            rows={5}
            value={form.query}
            onChange={(e) => setForm({ ...form, query: e.target.value })}
            required
          />

          {/* 📁 FILE UPLOAD */}
          <div>
            <label className="text-sm text-gray-400">
              Upload Document (optional)
            </label>
            <input
              type="file"
              className="w-full mt-2 text-sm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="text-xs text-gray-400">
            This platform provides general legal awareness and not legal advice.
          </div>

          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="underline text-blue-400">
                Terms
              </Link>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

        </form>

      </div>
    </div>
  );
}