"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AdminPage() {
  const [queries, setQueries] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  const DISCLAIMER = `Disclaimer: This response is provided solely for general legal awareness and informational purposes based on limited facts shared. It does not constitute legal advice.`;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchQueries(parsedUser);
      fetchUsers();
      fetchArticles();
    }
  }, []);

  const fetchQueries = async (currentUser: any) => {
    let query = supabase.from("queries").select("*");

    if (currentUser.role === "junior") {
      query = query.eq("assigned_to", currentUser.name);
    }

    const { data } = await query.order("created_at", { ascending: false });
    setQueries(data || []);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("users").select("*");
    setUsers(data || []);
  };

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    setArticles(data || []);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("queries").update({ status }).eq("id", id);
    if (user) fetchQueries(user);
  };

  const saveResponse = async (id: string, response: string) => {
    if (!response?.trim()) {
      alert("Response cannot be empty");
      return;
    }

    await supabase
      .from("queries")
      .update({ response, status: "responded" })
      .eq("id", id);

    if (user) fetchQueries(user);
    alert("Saved");
  };

  const assignUser = async (id: string, name: string) => {
    await supabase.from("queries").update({ assigned_to: name }).eq("id", id);
    if (user) fetchQueries(user);
  };

  const handleResponseChange = (id: string, value: string) => {
    const updated = queries.map((q) =>
      q.id === id ? { ...q, response: value } : q
    );
    setQueries(updated);
  };

  const createArticle = async () => {
    if (!title || !content) return alert("Fill all fields");

    await supabase.from("articles").insert([{ title, content }]);

    setTitle("");
    setContent("");
    fetchArticles();
    alert("Published");
  };

  const sendWhatsApp = (q: any) => {
    const message = `Hello ${q.name},

Regarding your query (${q.ticket_id}):

${q.response}

${DISCLAIMER}

– Oh! So Legal`;

    window.open(
      `https://wa.me/${q.phone}?text=${encodeURIComponent(message)}`
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* ARTICLE */}
      <div className="bg-white/10 p-6 rounded-xl mb-10">
        <h2 className="mb-3">Publish Article</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            background: "#fff",
            color: "#000",
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "10px"
          }}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          style={{
            background: "#fff",
            color: "#000",
            width: "100%",
            padding: "12px",
            borderRadius: "10px"
          }}
        />

        <button
          onClick={createArticle}
          className="mt-3 bg-purple-600 px-4 py-2 rounded"
        >
          Publish
        </button>
      </div>

      {/* QUERIES */}
      {queries.map((q) => (
        <div key={q.id} className="bg-neutral-900 p-5 mb-5 rounded-xl">

          <p><b>{q.ticket_id}</b></p>
          <p>{q.name}</p>
          <p>{q.query}</p>

          <textarea
            value={q.response || ""}
            onChange={(e) =>
              handleResponseChange(q.id, e.target.value)
            }
            rows={3}
            style={{
              background: "#ffffff",   // 🔥 FORCE WHITE
              color: "#000000",        // 🔥 FORCE BLACK TEXT
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              marginTop: "10px"
            }}
          />

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => saveResponse(q.id, q.response)}
              className="bg-blue-600 px-3 py-2 rounded"
            >
              Save
            </button>

            <button
              onClick={() => sendWhatsApp(q)}
              className="bg-green-600 px-3 py-2 rounded"
            >
              WhatsApp
            </button>
          </div>

        </div>
      ))}

    </div>
  );
}