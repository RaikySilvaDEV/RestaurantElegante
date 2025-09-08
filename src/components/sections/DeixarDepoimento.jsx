import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../config/hooks/useAuth';
import { Star } from 'lucide-react';
import { supabase } from '../../config/SupabaseClient';
import { Container } from '../ui/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { Button } from '../ui/Button';
import  StatusAlert  from '../ui/StatusAlert';
import Navbar from '../Navbar';
import Footer from '../Footer';


const DeixarDepoimento = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [depoimentoExistente, setDepoimentoExistente] = useState(null);

  const fetchDepoimento = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('depoimentos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setDepoimentoExistente(data);
      setTexto(data.texto);
      setRating(data.nota);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchDepoimento();
    }
  }, [user, authLoading, fetchDepoimento]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || texto.trim() === '') {
      setAlert({ message: 'Por favor, preencha a nota e o depoimento.', type: 'error' });
      return;
    }
    setLoading(true);

    const depoimentoData = {
      user_id: user.id,
      nome: user.user_metadata?.full_name || 'Anônimo',
      texto: texto,
      nota: rating,
      avatar_url: user.user_metadata?.avatar_url || null,
    };

    let error;
    if (depoimentoExistente) {
      // Atualiza depoimento
      const { user_id, ...updateData } = depoimentoData; // Remove user_id para a atualização
      const { error: updateError } = await supabase.from('depoimentos').update(updateData).eq('id', depoimentoExistente.id);
      error = updateError;
    } else {
      // Insere novo depoimento
      const { error: insertError } = await supabase.from('depoimentos').insert(depoimentoData);
      error = insertError;
    }

    if (error) {
      setAlert({ message: 'Ocorreu um erro ao enviar seu depoimento.', type: 'error' });
      console.error(error);
    } else {
      setAlert({ message: 'Depoimento enviado com sucesso! Obrigado!', type: 'success' });
      setTimeout(() => navigate('/#depoimentos'), 2000);
    }
    setLoading(false);
  };

  if (authLoading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/reservas" />;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <StatusAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
      <main className="flex-grow">
        <Container className="py-24 sm:py-32">
          <SectionTitle title={depoimentoExistente ? "Editar seu Depoimento" : "Deixe seu Depoimento"} subtitle="Sua opinião é muito importante para nós!" />
          <form onSubmit={handleSubmit} className="mx-auto grid max-w-2xl gap-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-8">
            <div className="text-center">
              <label className="text-lg text-zinc-800 dark:text-zinc-200">Sua nota:</label>
              <div className="flex justify-center gap-2 mt-2">
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <Star key={starValue} size={32} className={`cursor-pointer transition-colors ${starValue <= (hover || rating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-400'}`} onClick={() => setRating(starValue)} onMouseEnter={() => setHover(starValue)} onMouseLeave={() => setHover(0)} />
                  );
                })}
              </div>
            </div>
            <div>
              <label htmlFor="texto" className="text-sm text-zinc-600 dark:text-zinc-300">Seu depoimento:</label>
              <textarea id="texto" name="texto" value={texto} onChange={(e) => setTexto(e.target.value)} required rows="5" className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" placeholder="Conte-nos como foi sua experiência..."></textarea>
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar Depoimento'}</Button>
          </form>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default DeixarDepoimento;