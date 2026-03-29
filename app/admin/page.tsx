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

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("queries").update({ status }).eq("id", id);
    if (user) fetchQueries(user);
  };

  const deleteQuery = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this query?");
    if (!confirmDelete) return;

    await supabase.from("queries").delete().eq("id", id);
    if (user) fetchQueries(user);
  };

  const refuseQuery = async (id: string, reason: string) => {
    if (!reason || !reason.trim()) {
      alert("Please enter a reason");
      return;
    }

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleResponseChange = (id: string, value: string) => {
    const updated = queries.map((q) =>
      q.id === id ? { ...q, response: value } : q
    );
    setQueries(updated);
  };

  const saveResponse = async (id: string, response: string) => {
    await supabase
      .from("queries")
      .update({ response, status: "responded" })
      .eq("id", id);

    if (user) fetchQueries(user);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="space-y-6">
        {queries.map((q) => (
          <div key={q.id} className="bg-neutral-900 p-5 rounded-lg">

            <p><strong>Ticket:</strong> {q.ticket_id}</p>
            <p><strong>Name:</strong> {q.name}</p>
            <p><strong>Query:</strong> {q.query}</p>

            {q.file_url && (
              <a href={q.file_url} target="_blank" className="text-blue-400 underline">
                View File
              </a>
            )}

            {/* 👤 ASSIGN */}
            {user?.role === "senior" && (
              <select
                className="mt-2 text-black p-2 rounded"
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
              className="w-full p-2 mt-3 text-black rounded"
              value={q.response || ""}
              onChange={(e) => handleResponseChange(q.id, e.target.value)}
            />

            <button
              onClick={() => saveResponse(q.id, q.response)}
              className="bg-blue-600 px-4 py-2 mt-2 rounded"
            >
              Save Response
            </button>

            {/* 🔥 SENIOR CONTROLS */}
            {user?.role === "senior" && (
              <div className="mt-4 space-y-2">

                {/* REFUSE */}
                <input
                  placeholder="Reason for refusal"
                  className="w-full p-2 text-black rounded"
                  onChange={(e) => (q.refusal_reason = e.target.value)}
                />

                <button
                  onClick={() => refuseQuery(q.id, q.refusal_reason)}
                  className="bg-yellow-600 px-4 py-2 rounded mr-2"
                >
                  Refuse
                </button>

                {/* DELETE */}
                <button
                  onClick={() => deleteQuery(q.id)}
                  className="bg-red-700 px-4 py-2 rounded"
                >
                  Delete
                </button>

              </div>
            )}

            <p className="text-sm mt-2 text-gray-400">
              Status: {q.status}
            </p>

            {q.refusal_reason && (
              <p className="text-sm text-red-400">
                Refusal Reason: {q.refusal_reason}
              </p>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}