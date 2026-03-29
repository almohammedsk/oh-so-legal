"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AdminPage() {
  const [queries, setQueries] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  const DISCLAIMER = `Disclaimer: This response is for general legal awareness only and does not constitute legal advice.`;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchQueries(parsedUser);
      fetchUsers();
    }
  }, []);

  const fetchQueries = async (currentUser: any) => {
    let query = supabase.from("queries").select("*").order("created_at", { ascending: false });

    if (currentUser.role === "junior") {
      query = query.eq("assigned_to", currentUser.name);
    }

    const { data } = await query;
    setQueries(data || []);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("users").select("*");
    setUsers(data || []);
  };

  const saveResponse = async (id: string, response: string) => {
    await supabase.from("queries").update({ response, status: "responded" }).eq("id", id);
    if (user) fetchQueries(user);
  };

  const handleResponseChange = (id: string, value: string) => {
    const updated = queries.map((q) => (q.id === id ? { ...q, response: value } : q));
    setQueries(updated);
  };

  const sendWhatsApp = (q: any) => {
    const msg = `Hello ${q.name},

${q.response}

${DISCLAIMER}`;

    window.open(`https://wa.me/${q.phone}?text=${encodeURIComponent(msg)}`);
  };

  const deleteQuery = async (id: string) => {
    if (!confirm("Delete this query?")) return;
    if (prompt("Type DELETE to confirm") !== "DELETE") return;

    await supabase.from("queries").delete().eq("id", id);
    fetchQueries(user);
  };

  const refuseQuery = async (id: string, reason: string) => {
    if (!reason) return alert("Enter reason");

    if (!confirm("Refuse this query?")) return;
    if (prompt("Type REFUSE to confirm") !== "REFUSE") return;

    await supabase
      .from("queries")
      .update({ status: "refused", refusal_reason: reason })
      .eq("id", id);

    fetchQueries(user);
  };

  const assignUser = async (id: string, name: string) => {
    await supabase.from("queries").update({ assigned_to: name }).eq("id", id);
    fetchQueries(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">

      <h1 className="text-3xl mb-6 font-semibold">Admin Dashboard</h1>

      <div className="space-y-6">
        {queries.map((q) => (
          <div
            key={q.id}
            className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-xl shadow-lg"
          >
            <p><strong>Ticket:</strong> {q.ticket_id}</p>
            <p><strong>Name:</strong> {q.name}</p>
            <p><strong>Category:</strong> {q.category}</p>

            <p className="mt-2 text-gray-200">{q.query}</p>

            {q.file_url && (
              <a href={q.file_url} target="_blank" className="text-blue-400 underline">
                View File
              </a>
            )}

            {/* RESPONSE BOX */}
            <textarea
              className="w-full mt-3 p-3 rounded-lg bg-white text-black placeholder-gray-500"
              placeholder="Write response..."
              value={q.response || ""}
              onChange={(e) => handleResponseChange(q.id, e.target.value)}
            />

            {/* BUTTONS */}
            <div className="flex gap-2 mt-2 flex-wrap">
              <button
                onClick={() => saveResponse(q.id, q.response)}
                className="bg-blue-600 px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => sendWhatsApp(q)}
                className="bg-green-600 px-4 py-2 rounded"
              >
                WhatsApp
              </button>
            </div>

            {/* ASSIGN */}
            {user?.role === "senior" && (
              <select
                className="mt-3 p-2 rounded text-black"
                value={q.assigned_to || ""}
                onChange={(e) => assignUser(q.id, e.target.value)}
              >
                <option value="">Assign</option>
                {users.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
            )}

            {/* REFUSE + DELETE */}
            {user?.role === "senior" && (
              <div className="mt-3 space-y-2">

                <input
                  placeholder="Reason for refusal"
                  className="w-full p-2 rounded text-black"
                  onChange={(e) => (q.refusal_reason = e.target.value)}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => refuseQuery(q.id, q.refusal_reason)}
                    className="bg-yellow-600 px-4 py-2 rounded"
                  >
                    Refuse
                  </button>

                  <button
                    onClick={() => deleteQuery(q.id)}
                    className="bg-red-600 px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            <p className="text-sm mt-2 text-gray-400">
              Status: {q.status}
            </p>

            {q.refusal_reason && (
              <p className="text-sm text-red-400">
                Reason: {q.refusal_reason}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}