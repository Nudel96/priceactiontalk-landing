"use client";

import { useState } from "react";
import { supabase } from '../utils/supabaseClient';
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Logging in...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Login successful! Redirecting...");
      // Nach Login auf die Community-Seite weiterleiten
      router.push("/community");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1b2a]">
      <form onSubmit={handleLogin} className="bg-[#1b9aaa] p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl mb-4 font-bold text-white">Login</h1>
        <input
          className="mb-2 p-2 rounded w-full"
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="mb-2 p-2 rounded w-full"
          type="password"
          placeholder="Your Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-[#7fcfc0] px-4 py-2 rounded font-bold text-[#0d1b2a] hover:bg-[#1b9aaa] hover:text-white transition"
          type="submit"
        >
          Login
        </button>
        {message && <p className="mt-2 text-white">{message}</p>}
      </form>
    </div>
  );
}
