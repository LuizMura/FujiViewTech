"use client";
import { useAuth } from "@/app/context/AuthContext";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  const { user, loading, supabase } = useAuth();

  const handleLogin = async () => {
    const email = prompt("Digite seu e‑mail para receber o link de login:");
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) {
      alert(error.message);
    } else {
      alert(
        "Um link de login foi enviado para seu e‑mail. Verifique a caixa de entrada."
      );
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Login via Email Magic Link
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden py-1 px-4">
      <AdminDashboard />
    </div>
  );
}
