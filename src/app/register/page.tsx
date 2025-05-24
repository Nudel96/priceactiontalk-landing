"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Working...");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the confirmation link!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1b2a]">
      <form onSubmit={handleRegister} className="bg-[#1b9aaa] p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl mb-4 font-bold text-white">Register after Payment</h1>
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
          placeholder="Create Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="bg-[#7cfc00] px-4 py-2 rounded font-bold text-[#0d1b2a] hover:bg-[#1b9aaa] hover:text-white transition">
          Register
        </button>
        <p className="mt-4 text-white">{message}</p>
      </form>
    </div>
  );
}
