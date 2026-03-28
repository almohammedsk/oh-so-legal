"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import Link from "next/link";

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    setArticle(data);
  };

  if (!article) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24">

      <div className="max-w-3xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl mb-6 font-[var(--font-playfair)] leading-tight">
          {article.title}
        </h1>

        {/* CONTENT */}
        <p className="text-gray-300 whitespace-pre-line leading-relaxed text-lg">
          {article.content}
        </p>

        {/* DISCLAIMER */}
        <p className="text-sm text-gray-500 mt-10">
          This content is provided for general legal awareness based on limited information and does not constitute legal advice or create any advocate-client relationship.
        </p>

        {/* 🚀 CTA SECTION (MOST IMPORTANT ADDITION) */}
        <div className="mt-16 text-center">

          <p className="text-gray-400 mb-4 text-lg">
            Still unsure about your legal position?
          </p>

          <Link href="/ask-query">
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-3 rounded-full hover:scale-105 transition shadow-xl">
              Ask Your Legal Question
            </button>
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            An advocate will review your query and respond within 36 hours.
          </p>

        </div>

      </div>

    </div>
  );
}