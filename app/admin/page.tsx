"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AdminPage() {
  const [queries, setQueries] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  const DISCLAIMER = `Disclaimer: This response is for general legal awareness only and does not constitute legal advice or create any advocate-client relationship.`;

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
    let query = supabase
      .from("queries")
      .select("*")
      .order("created_at", { ascending: false });

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

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("queries").update({ status }).eq("id", id);
    if (user) fetchQueries(user);
  };

  // 🔥 DOUBLE CONFIRM DELETE
  const deleteQuery = async (id: string) => {
    const confirm1 = confirm("Delete this query?");
    if (!confirm1) return;

    const confirm2 = prompt("Type DELETE to confirm");
    if (confirm2 !== "DELETE") return;

    await supabase.from("queries").delete().eq("id", id);
    if (user) fetchQueries(user);
  };

  // 🔥 DOUBLE CONFIRM REFUSE
  const refuseQuery = async (id: string, reason: string) => {
    if (!reason || !reason.trim()) {
      alert("Enter reason");
      return;
    }

    const confirm1 = confirm("Refuse this query?");
    if (!confirm1) return;

    const confirm2 = prompt("Type REFUSE to confirm");
    if (confirm2 !== "REFUSE") return;

    await supabase
      .from("queries")
      .update({
        status: "refused",
        refusal_reason: reason,
      })
      .eq("id", id);

    if (user) fetchQueries(user);
  };

  const assignUser = async (id: string, name: string) => {
    await supabase.from("queries").update({ assigned_to: name }).eq("id", id);
    if (user) fetchQueries(user);
  };

  const saveResponse = async (id: string, response: string) => {
    await supabase
      .from("queries")
      .update({ response, status: "responded" })
      .eq("id", id);

    if (user) fetchQueries(user);
  };

  const handleResponseChange = (id: string, value: string) => {
    const updated = queries.map((q) =>
      q.id === id ? { ...q, response: value } : q
    );
    setQueries(updated);
  };

  // 🔥 WHATSAPP BACK
  const sendWhatsApp = (q: any) => {
    if (!q.phone) {
      alert("No phone");
      return;
    }

    const message = `Hello ${q.name},

With reference to your query (${q.ticket_id}):

${q.response || "Response pending"}

${DISCLAIMER}

– Team Oh! So Legal`;

    const url = `https://wa.me/${q.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="space-y-6">
        {queries.map((q) => (
          <div
            key={q.id}
            className="bg-white/10 backdrop-blur-xl p-5 rounded-xl border border-white/10 shadow-lg"
          >

            <p><strong>Ticket:</strong> {q.ticket_id}</p>
            <p><strong>Name:</strong> {q.name}</p>
            <p><strong>Category:</strong> {q.category}</p>

            <p className="mt-2 text-gray-300">
              <strong>Query:</strong> {q.query}
            </p>

            {q.file_url && (
              <a
                href={q.file_url}
                target="_blank"
                className="text-blue-400 underline block mt-2"
              >
                View File
              </a>
            )}

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

            {/* RESPONSE */}
            <textarea
              className="w-full p-3 mt-3 rounded bg-white text-black"
              value={q.response || ""}
              onChange={(e) => handleResponseChange(q.id, e.target.value)}
            />

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

            {/* SENIOR CONTROLS */}
            {user?.role === "senior" && (
              <div className="mt-4 space-y-2">

                <input
                  placeholder="Refusal reason"
                  className="w-full p-2 text-black rounded"
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
                    className="bg-red-700 px-4 py-2 rounded"
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