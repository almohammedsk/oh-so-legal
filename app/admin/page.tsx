"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AdminPage() {
  const [queries, setQueries] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

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

  const handleResponseChange = (id: string, value: string) => {
    setQueries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, response: value } : q))
    );
  };

  const saveResponse = async (id: string, response: string) => {
    await supabase
      .from("queries")
      .update({ response, status: "responded" })
      .eq("id", id);

    fetchQueries(user);
  };

  const sendWhatsApp = (q: any) => {
    const message = `Hello ${q.name},

${q.response}

This is general legal awareness.`;

    window.open(`https://wa.me/${q.phone}?text=${encodeURIComponent(message)}`);
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

            {/* ✅ CONTACT INFO */}
            <p>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${q.email}`}
                className="text-blue-400 underline"
              >
                {q.email}
              </a>
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              <a
                href={`tel:${q.phone}`}
                className="text-green-400 underline"
              >
                {q.phone}
              </a>
            </p>

            {/* QUICK ACTIONS */}
            <div className="flex gap-2 mt-2 flex-wrap">
              <a
                href={`mailto:${q.email}`}
                className="bg-purple-600 px-4 py-2 rounded"
              >
                Open Email
              </a>

              <button
                onClick={() => sendWhatsApp(q)}
                className="bg-green-600 px-4 py-2 rounded"
              >
                WhatsApp
              </button>
            </div>

            <p className="mt-3 text-gray-300">{q.query}</p>

            {/* RESPONSE */}
            <textarea
              className="w-full mt-3 p-3 rounded-lg !bg-white !text-black"
              placeholder="Write response..."
              value={q.response || ""}
              onChange={(e) => handleResponseChange(q.id, e.target.value)}
            />

            <button
              onClick={() => saveResponse(q.id, q.response)}
              className="bg-blue-600 px-4 py-2 mt-2 rounded"
            >
              Save
            </button>

            {/* SENIOR CONTROLS */}
            {user?.role === "senior" && (
              <div className="mt-3 space-y-2">

                <input
                  placeholder="Reason for refusal"
                  className="w-full p-3 rounded-lg !bg-white !text-black"
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
          </div>
        ))}
      </div>
    </div>
  );
}