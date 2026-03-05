"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import AdminDashboardPage from "./dashboard/page";

export default function AdminPage() {
  const { user, loading, supabase } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoginLoading(false);
    if (error) {
      setLoginError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#232946] via-[#393e5c] to-[#232946]">
        <form
          onSubmit={handleLogin}
          className="bg-[#232946]/90 p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col gap-4 border border-[#393e5c]"
        >
          <h2 className="text-2xl font-bold mb-2 text-center text-[#eebbc3]">
            Login Admin
          </h2>
          <input
            type="email"
            placeholder="E-mail"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="border border-[#b8c1ec] bg-[#393e5c] text-[#eebbc3] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eebbc3] placeholder-[#b8c1ec]"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="border border-[#b8c1ec] bg-[#393e5c] text-[#eebbc3] rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eebbc3] placeholder-[#b8c1ec]"
            required
          />
          {loginError && (
            <div className="text-[#eebbc3] bg-[#b8c1ec]/20 rounded p-2 text-sm text-center">
              {loginError}
            </div>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-[#eebbc3] text-[#232946] rounded-lg font-bold hover:bg-[#b8c1ec] transition disabled:opacity-60"
            disabled={loginLoading}
          >
            {loginLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden py-1 px-4">
      <AdminDashboardPage />
    </div>
  );
}
