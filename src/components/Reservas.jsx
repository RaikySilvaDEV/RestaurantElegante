import React, { useState, useEffect } from "react";
import { Container } from "./ui/Container.jsx";
import { SectionTitle } from "./SectionTitle.jsx";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../config/hooks/useAuth.jsx";
import { supabase } from "../config/SupabaseClient.js";
import { Button } from "./ui/Button.jsx";

const Reservas = () => {
  const { user, signInWithGoogle } = useAuth();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    data: '',
    horario: '',
    pessoas: 10,
    observacoes: '',
  });
  const [status, setStatus] = useState({ message: "", type: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const reservaParaAlterar = location.state?.reservaParaAlterar;
  
  // Preenche o formulário quando o usuário loga
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        nome: user.user_metadata?.full_name || user.user_metadata?.name || '',
        email: user.email || '',
        telefone: user.phone || ''
      }));
    }
  }, [user]);

  // Preenche o formulário se estiver alterando uma reserva
  useEffect(() => {
    if (reservaParaAlterar) {
      setForm(f => ({
        ...f,
        ...reservaParaAlterar
      }));
    }
  }, [location.state]);

  // Efeito para Realtime
  useEffect(() => {
    if (user && reservaParaAlterar) {
      const channel = supabase
        .channel(`reserva_check_${reservaParaAlterar.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'reservas',
            filter: `id=eq.${reservaParaAlterar.id}`,
          },
          (payload) => {
            // A reserva foi alterada (ex: confirmada pelo admin)
            // Redireciona o usuário para a lista de reservas com um aviso.
            navigate('/minhas-reservas', { state: { alert: { message: 'O status desta reserva foi atualizado. Verifique suas reservas.', type: 'info' } } });
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    }
  }, [user, reservaParaAlterar, navigate, supabase]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const reservar = async (e) => {
    e.preventDefault();
    setStatus({ message: "Processando sua reserva...", type: "info" });

    // 1. Verifica se o cliente já existe ou o cria.
    const { data: cliente, error: clienteError } = await supabase
      .from("clientes")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!cliente) {
      // Cliente não encontrado, vamos criá-lo.
      const { error: insertError } = await supabase.from("clientes").insert({
        id: user.id,
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
      });

      if (insertError) {
        setStatus({ message: `Erro ao registrar cliente: ${insertError.message}`, type: "error" });
        return;
      }
    }

    // 2. Agora que o cliente existe, cria a reserva.
    const { error } = await supabase.from("reservas").insert({
      cliente_id: user.id,
      data_reserva: form.data,
      hora_reserva: form.horario,
      pessoas: form.pessoas,
      observacoes: form.observacoes,
      status: "pendente",
    });

    if (error) {
      setStatus({ message: `Erro ao solicitar reserva: ${error.message}`, type: "error" });
    } else {
      // Redireciona para a home com os dados da reserva para o alerta
      navigate('/', { 
        state: { 
          reservaConfirmada: true, 
          data: form.data, 
          horario: form.horario,
          pessoas: form.pessoas
        } 
      });
    }
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="text-center max-w-md mx-auto">
          <p className="mb-6 text-zinc-600 dark:text-zinc-300">
            Para fazer uma reserva, por favor, faça login ou crie uma conta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={signInWithGoogle} className="w-full sm:w-auto">
              Login com Google
            </Button>
          </div>
        </div>
      );
    }
    

    // Usuário logado ou autenticação desativada
    return (
      <form onSubmit={reservar} className="mx-auto grid max-w-2xl gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-6">
        {status.message && (
          <p className={`text-center mb-4 ${status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
            {status.message}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm text-zinc-600 dark:text-zinc-300">Nome (como na sua conta)</label>
            <input name="nome" value={form.nome} onChange={onChange} required className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
          </div>
          <div>
            <label className="text-sm text-zinc-600 dark:text-zinc-300">E-mail (como na sua conta)</label>
            <input type="email" name="email" value={form.email} onChange={onChange} required className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
          </div>
          <div>
            <label className="text-sm text-zinc-600 dark:text-zinc-300">Telefone (opcional)</label>
            <input name="telefone" value={form.telefone} onChange={onChange} className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
          </div>
          <div>
            <label className="text-sm text-zinc-600 dark:text-zinc-300">Pessoas</label>
            <input type="number" name="pessoas" min={10} max={800} value={form.pessoas} onChange={onChange} className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
          </div>
          <div>
            <label className="text-sm text-zinc-600 dark:text-zinc-300">Data</label>
            <input type="date" name="data" value={form.data} onChange={onChange} required className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
          </div>
          <div>
            <label className="text-sm text-zinc-600 dark:text-zinc-300">Horário</label>
            <input type="time" name="horario" value={form.horario} onChange={onChange} required className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
          </div>
        </div>
        <div>
          <label className="text-sm text-zinc-600 dark:text-zinc-300">Observações (opcional)</label>
          <textarea name="observacoes" value={form.observacoes} onChange={onChange} rows="3" placeholder="Ex: Alergia a camarão, comemoração de aniversário." className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200"></textarea>
        </div>
        <div className="pt-2">
          <Button type="submit" className="w-full">
            {reservaParaAlterar ? 'Confirmar Alteração' : 'Solicitar Reserva'}
          </Button>
          {reservaParaAlterar && (
            <Link to="/minhas-reservas" className="mt-2 block text-center text-sm text-zinc-600 dark:text-zinc-400 hover:underline">Cancelar alteração</Link>
          )}
        </div>
      </form>
    );
  };

  return (
    <section id="reservas" className="bg-white dark:bg-zinc-950">
      <Container className="py-20">
        <SectionTitle 
          title={reservaParaAlterar ? "Alterar Reserva" : "Reservas"} 
          subtitle={reservaParaAlterar ? "Modifique os dados e envie sua solicitação. Entraremos em contato para confirmar." : "Garanta sua experiência. Entraremos em contato para confirmar."} 
        />
        {renderContent()}
      </Container>
    </section>
  );
};

export default Reservas;