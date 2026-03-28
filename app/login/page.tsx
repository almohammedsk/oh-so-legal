"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (data) {
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-lg w-full max-w-sm">

        <h2 className="text-2xl text-white mb-6 text-center">
          Advocate Login
        </h2>

        {/* EMAIL */}
        <input
          placeholder="Email"
          className="w-full p-3 mb-4 bg-white text-black rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div className="relative mb-4">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 bg-white text-black rounded border border-gray-300 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3 text-gray-700"
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-white text-black py-3 rounded-lg hover:bg-gray-200 transition"
        >
          Login
        </button>

      </div>
    </div>
  );
}