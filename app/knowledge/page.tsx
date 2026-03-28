"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";

export default function KnowledgePage() {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    setArticles(data || []);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24">

      <h1 className="text-4xl mb-10 text-center">
        Legal Awareness
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">

        {articles.map((a) => (
          <Link key={a.id} href={`/knowledge/${a.id}`}>
            <div className="bg-white/10 p-6 rounded-xl hover:scale-105 transition cursor-pointer">
              <h2 className="text-xl mb-2">{a.title}</h2>
              <p className="text-gray-300 text-sm line-clamp-3">
                {a.content}
              </p>
            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}