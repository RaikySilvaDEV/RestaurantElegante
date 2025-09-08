import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../config/hooks/useAuth';
import { supabase } from '../config/SupabaseClient';
import { Container } from '../components/ui/Container';
import { SectionTitle } from '../components/ui/SectionTitle.jsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatusAlert from '../components/ui/StatusAlert.jsx';

const MinhasReservas = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [updatingId, setUpdatingId] = useState(null);

  const fetchReservas = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('cliente_id', user.id)
        .order('data_reserva', { ascending: false });

      if (error) throw error;

      setReservas(data);
    } catch (err) {
      console.error('Erro ao buscar reservas:', err);
      setStatus({ message: 'Não foi possível carregar suas reservas.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchReservas();
    }

    // Verifica se há um alerta vindo do state do react-router
    if (location.state?.alert) {
      setStatus(location.state.alert);
      // Limpa o state para não mostrar o alerta novamente ao recarregar
      navigate(location.pathname, { replace: true, state: {} });
    }

    // Configura a 'escuta' por mudanças em tempo real na tabela de reservas
    if (user) {
      const channel = supabase
        .channel(`reservas_usuario_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'reservas',
            filter: `cliente_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Mudança na reserva recebida!', payload);
            // Atualiza a lista de reservas para refletir a mudança
            fetchReservas();
          }
        )
        .subscribe();

      // Limpa a inscrição ao desmontar o componente
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, authLoading, fetchReservas, navigate, location.pathname, location.state]);

  const handleCancel = async (reservaId) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      setUpdatingId(reservaId);
      const { error } = await supabase
        .from('reservas')
        .update({ status: 'cancelada' })
        .eq('id', reservaId);

      if (error) {
        setStatus({ message: 'Erro ao cancelar a reserva.', type: 'error' });
        console.error(error);
      } else {
        // Atualiza o estado local para refletir a mudança imediatamente
        setReservas(reservas.map(r => r.id === reservaId ? { ...r, status: 'cancelada' } : r));
        setStatus({ message: 'Reserva cancelada com sucesso!', type: 'success' });
      }
      setUpdatingId(null);
    }
  };

  const handleDelete = async (reservaId) => {
    if (window.confirm('Esta ação é irreversível. Deseja apagar permanentemente esta reserva?')) {
      setUpdatingId(reservaId);
      const { error } = await supabase
        .from('reservas')
        .delete()
        .eq('id', reservaId);

      if (error) {
        setStatus({ message: 'Erro ao apagar a reserva.', type: 'error' });
      } else {
        setReservas(reservas.filter(r => r.id !== reservaId));
        setStatus({ message: 'Reserva apagada com sucesso!', type: 'success' });
      }
      setUpdatingId(null);
    }
  };

  if (authLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <StatusAlert message={status.message} type={status.type} onClose={() => setStatus({ message: '', type: '' })} />
      <main className="flex-grow">
        <Container className="py-24 sm:py-32">
          <SectionTitle title="Minhas Reservas" subtitle="Acompanhe o status das suas solicitações de reserva." />
          {loading && <p>Carregando reservas...</p>}
          {status.type === 'error' && !loading && <p className="text-red-500 text-center">{status.message}</p>}
          {!loading && status.type !== 'error' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {reservas.length === 0 ? (
                <p className="text-center text-zinc-500">Você ainda não fez nenhuma reserva.</p>
              ) : (
                reservas.map((reserva) => (
                  <div key={reserva.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-grow">
                      <p className="font-semibold text-lg">Reserva para {formatDate(reserva.data_reserva)} às {reserva.hora_reserva}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{reserva.pessoas} pessoas. {reserva.observacoes && `Observações: ${reserva.observacoes}`}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${reserva.status === 'confirmada' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : reserva.status === 'cancelada' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>{reserva.status}</span>
                    </div>
                    {reserva.status === 'pendente' && (
                      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                        <button onClick={() => navigate('/reservas', { state: { reservaParaAlterar: reserva } })} className="text-sm text-blue-600 hover:underline">Alterar</button>
                        <span className="text-zinc-300 dark:text-zinc-600">|</span>
                        <button onClick={() => handleCancel(reserva.id)} disabled={updatingId === reserva.id} className="text-sm text-red-600 hover:underline disabled:opacity-50">{updatingId === reserva.id ? 'Cancelando...' : 'Cancelar'}</button>
                      </div>
                    )}
                    {reserva.status === 'confirmada' && (
                      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400">
                        Para alterar ou cancelar uma reserva confirmada, por favor, <a href="/#contato" className="text-blue-600 hover:underline">entre em contato</a> conosco.
                      </div>
                    )}
                    {reserva.status === 'cancelada' && (
                      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 flex justify-end">
                        <button onClick={() => handleDelete(reserva.id)} disabled={updatingId === reserva.id} className="text-sm text-zinc-500 hover:underline disabled:opacity-50">{updatingId === reserva.id ? 'Apagando...' : 'Apagar'}</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default MinhasReservas;
