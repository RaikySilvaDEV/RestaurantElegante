import React from "react";
import { useState } from "react";
import { supabase } from "../../config/SupabaseClient.js";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";
import { SectionTitle } from "../../components/SectionTitle";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("senha", senha)
      .single();

    if (error || !data) {
      setError("Email ou senha incorretos");
    } else {
      setError("");
      onLogin(data);
    }
  };

  return (
    <>
      <main>
        <Container className="flex items-center justify-center min-h-screen pt-16 pb-20">
          <form onSubmit={handleLogin} className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-8 shadow-lg">
            <SectionTitle title="Login do Administrador" subtitle="Acesse o painel para gerenciar as reservas." />
            {error && <p className="mb-4 text-center text-red-500">{error}</p>}
            <div className="space-y-4">
              <input type="email" placeholder="Email" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Senha" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2.5 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" value={senha} onChange={(e) => setSenha(e.target.value)} required />
              <Button type="submit" onClick={handleLogin} className="w-full">Entrar</Button>
            </div>
          </form>
        </Container>
      </main>
      <Footer />
    </>
  );
}
