import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../config/hooks/useAuth';
import { supabase } from '../config/SupabaseClient';
import { Container } from '../components/ui/Container';
import { SectionTitle } from '../components/ui/SectionTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/Button';

const MeusDados = () => {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUserData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('nome, telefone')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        setFormData({
          nome: data.nome || user.user_metadata?.full_name || '',
          telefone: data.telefone || '',
        });
      } else {
        // Se não houver dados na tabela 'clientes', usa os metadados do auth
        setFormData({
          nome: user.user_metadata?.full_name || '',
          telefone: '',
        });
      }
    } catch (err) {
      console.error('Erro ao buscar dados do usuário:', err);
      setError('Não foi possível carregar seus dados.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchUserData();
    }
  }, [user, authLoading, fetchUserData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { error: updateError } = await supabase
      .from('clientes')
      .update({ nome: formData.nome, telefone: formData.telefone })
      .eq('id', user.id);

    if (updateError) {
      setError('Ocorreu um erro ao atualizar seus dados.');
      console.error(updateError);
    } else {
      setSuccess('Dados atualizados com sucesso!');
    }
    setLoading(false);
  };

  if (authLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Container className="py-24 sm:py-32">
          <SectionTitle title="Meus Dados" subtitle="Atualize suas informações pessoais." />
          <form onSubmit={handleSubmit} className="mx-auto grid max-w-2xl gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-6">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
            <div>
              <label htmlFor="nome" className="text-sm text-zinc-600 dark:text-zinc-300">Nome Completo</label>
              <input id="nome" name="nome" type="text" value={formData.nome} onChange={handleChange} required className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
            </div>
            <div>
              <label htmlFor="telefone" className="text-sm text-zinc-600 dark:text-zinc-300">Telefone</label>
              <input id="telefone" name="telefone" type="tel" value={formData.telefone} onChange={handleChange} className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Alterações'}</Button>
          </form>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default MeusDados;
