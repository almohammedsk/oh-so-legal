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

  const handleResponseChange = (id: string, value: string) => {
    setQueries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, response: value } : q))
    );
  };

  const saveResponse = async (id: string, response: string) => {
    await supabase.from("queries").update({ response, status: "responded" }).eq("id", id);
    fetchQueries(user);
  };

  const assignUser = async (id: string, name: string) => {
    await supabase.from("queries").update({ assigned_to: name }).eq("id", id);
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

  const deleteQuery = async (id: string) => {
    if (!confirm("Delete this query?")) return;
    if (prompt("Type DELETE to confirm") !== "DELETE") return;

    await supabase.from("queries").delete().eq("id", id);
    fetchQueries(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">

      <h1 className="text-3xl mb-6">Admin Dashboard</h1>

      <div className="space-y-6">
        {queries.map((q) => (
          <div key={q.id} className="bg-white/10 backdrop-blur-xl p-5 rounded-xl">

            <p><strong>Ticket:</strong> {q.ticket_id}</p>
            <p><strong>Name:</strong> {q.name}</p>

            <p className="mt-2 text-gray-300">{q.query}</p>

            {/* RESPONSE */}
            <textarea
              className="w-full mt-3 p-3 rounded-lg !bg-white !text-black !placeholder-gray-500"
              placeholder="Write response..."
              value={q.response || ""}
              onChange={(e) => handleResponseChange(q.id, e.target.value)}
            />

            <button
              onClick={() => saveResponse(q.id, q.response)}
              className="bg-blue-600 px-4 py-2 rounded mt-2"
            >
              Save
            </button>

            {/* ✅ FIXED ASSIGN */}
            {user?.role === "senior" && (
              <select
                className="mt-3 w-full p-3 rounded-lg !bg-white !text-black"
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

            {/* ✅ FIXED REFUSAL INPUT */}
            {user?.role === "senior" && (
              <div className="mt-3 space-y-2">

                <input
                  placeholder="Reason for refusal"
                  className="w-full p-3 rounded-lg !bg-white !text-black !placeholder-gray-500"
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

          </div>
        ))}
      </div>
    </div>
  );
}