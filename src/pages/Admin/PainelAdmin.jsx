import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseAdmin } from "../../config/SupabaseClient";
import { LayoutDashboard, Calendar, Utensils, LayoutList, LogOut, X, Menu } from "lucide-react";
import { Button } from "../../components/ui/Button";
import  TableSkeleton  from "../../components/ui/TableSkeleton";
import { Container } from "../../components/ui/Container";
import  Modal from "../../components/ui/Modal";
import FormCardapio from "../../components/Admin/FormCardapio";
import FormCategoria from "../../components/Admin/FormCategoria";
import AdminAlert from "../../components/Admin/AdminAlert";
import Dashboard from "../Admin/Dashboard";
import GerenciarReservas from "../../components/Admin/GerenciarReservas";
import GerenciarCardapio from "../../components/Admin/GerenciarCardapio";
import GerenciarCategorias from "../../components/Admin/GerenciarCategorias";
import Footer from "../../components/Footer";


export default function PainelAdmin({ onLogout }) {
 
  const [reservas, setReservas] = useState([]);
  const [itensCardapio, setItensCardapio] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    stats: { reservasHoje: 0, pessoasHoje: 0, reservasPendentes: 0 },
    proximasReservas: [],
    reservasPorDia: [],
    statusDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [itemParaDeletar, setItemParaDeletar] = useState({ id: null, tipo: '' }); 
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State for the new item form can be added here

  const fetchReservas = useCallback(async () => {
    const { data, error } = await supabaseAdmin
      .from("reservas")
      .select(`id, data_reserva, hora_reserva, pessoas, status, clientes(nome, email)`)
      .order("data_reserva", { ascending: false });

    if (error) {
      console.error("Erro ao buscar reservas:", error);
      setAlert({ message: "Não foi possível carregar as reservas.", type: 'error' });
    } else {
      setReservas(data);
    }
  }, [supabaseAdmin]);

  const fetchItensCardapio = useCallback(async () => {
    const { data, error } = await supabaseAdmin
      .from("itens_cardapio")
      .select(`*, categorias(nome)`)
      .order("nome", { ascending: true });

    if (error) {
      console.error("Erro ao buscar itens do cardápio:", error);
      setAlert({ message: "Não foi possível carregar o cardápio.", type: 'error' });
    } else {
      setItensCardapio(data);
    }
  }, [supabaseAdmin]);

  const fetchCategorias = useCallback(async () => {
    const { data, error } = await supabaseAdmin.from("categorias").select("*");
    if (error) {
      console.error("Erro ao buscar categorias:", error);
    } else {
      setCategorias(data);
    }
  }, [supabaseAdmin]);

  const fetchDashboardData = useCallback(async () => {
    const hoje = new Date().toISOString().split('T')[0];

    // Busca estatísticas
    const { data: statsData, error: statsError } = await supabaseAdmin.rpc('get_dashboard_stats', { data_hoje: hoje });

    // Busca dados para os gráficos
    const { data: reservasDiaData, error: reservasDiaError } = await supabaseAdmin.rpc('get_reservas_por_dia');
    const { data: statusData, error: statusError } = await supabaseAdmin.rpc('get_dashboard_stats', { data_hoje: hoje });

    // Busca próximas 5 reservas pendentes
    const { data: proximasData, error: proximasError } = await supabaseAdmin
      .from('reservas')
      .select('id, data_reserva, hora_reserva, pessoas, clientes(nome)')
      .eq('status', 'pendente')
      .order('data_reserva', { ascending: true })
      .order('hora_reserva', { ascending: true })
      .limit(5);

    if (statsError || proximasError || reservasDiaError || statusError) {
      console.error("Erro ao buscar dados do dashboard:", statsError || proximasError || reservasDiaError || statusError);
      setAlert({ message: "Não foi possível carregar os dados do dashboard.", type: 'error' });
      // Do not set partial data if there's an error to avoid crashes
    } else {
      setDashboardData({
        stats: {
          reservasHoje: statsData[0]?.reservas_hoje || 0,
          pessoasHoje: statsData[0]?.total_pessoas_hoje || 0,
          reservasPendentes: statsData[0]?.reservas_pendentes || 0
        },
        proximasReservas: proximasData || [],
        reservasPorDia: reservasDiaData || [],
        statusDistribution: statusData || [],
      });
    }
  }, [supabaseAdmin]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDashboardData(), fetchReservas(), fetchItensCardapio(), fetchCategorias()])
      .finally(() => setLoading(false));
  }, [fetchDashboardData, fetchReservas, fetchItensCardapio, fetchCategorias]);

  const showRealtimeAlert = (message) => {
    setAlert({ message, type: 'info' });
  };

  // Efeito para Realtime Subscriptions
  useEffect(() => {
    // Canal para monitorar todas as mudanças no schema 'public'
    const channel = supabaseAdmin.channel('admin-db-changes');

    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'reservas' }, (payload) => {
      showRealtimeAlert(`Novas atualizações em 'Reservas' recebidas.`);
      fetchDashboardData();
      fetchReservas();
    }).on('postgres_changes', { event: '*', schema: 'public', table: 'itens_cardapio' }, (payload) => {
      showRealtimeAlert(`O cardápio foi atualizado.`);
      fetchItensCardapio();
    }).on('postgres_changes', { event: '*', schema: 'public', table: 'categorias' }, (payload) => {
      showRealtimeAlert(`As categorias foram atualizadas.`);
      fetchCategorias();
      fetchItensCardapio(); // Atualiza o cardápio também, pois a categoria pode ter mudado
    }).subscribe();

    // Limpa a inscrição ao desmontar o componente
    return () => {
      supabaseAdmin.removeChannel(channel);
    };
  }, [supabaseAdmin, fetchDashboardData, fetchReservas, fetchItensCardapio, fetchCategorias]);

  const updateStatus = async (id, status) => {
    const { error } = await supabaseAdmin
      .from("reservas")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar status:", error);
      setAlert({ message: `Erro ao atualizar status: ${error.message}`, type: 'error' });
    } else {
      // Atualiza a lista localmente para uma resposta mais rápida na UI
      setReservas(reservas.map(r => r.id === id ? { ...r, status: status } : r));
    }
  };

  const handleSaveItem = async (formData) => {
    let error;
    let successMessage = '';
    if (itemSelecionado && itemSelecionado.id) {
      // Modo de Edição: Atualiza o item existente
      const { error: updateError } = await supabaseAdmin
        .from('itens_cardapio')
        .update(formData)
        .eq('id', itemSelecionado.id);
      error = updateError;
      successMessage = 'Item atualizado com sucesso!';
    } else {
      // Modo de Adição: Insere um novo item
      const { error: insertError } = await supabaseAdmin
        .from('itens_cardapio')
        .insert([formData]);
      error = insertError;
      successMessage = 'Item adicionado com sucesso!';
    }

    if (error) {
      console.error("Erro ao salvar item:", error);
      setAlert({ message: `Erro ao salvar item: ${error.message}`, type: 'error' });
    } else {
      // Fecha o modal e atualiza a lista
      handleCloseModal();
      fetchItensCardapio();
      setAlert({ message: successMessage, type: 'success' });
    }
  };

  const handleSaveCategoria = async (formData) => {
    let error;
    let successMessage = '';
    const dataToSave = { nome: formData.nome };

    if (formData && formData.id) {
      // Edição
      const { error: updateError } = await supabaseAdmin
        .from('categorias')
        .update(dataToSave)
        .eq('id', formData.id);
      error = updateError;
      successMessage = 'Categoria atualizada com sucesso!';
    } else {
      // Criação
      const { error: insertError } = await supabaseAdmin
        .from('categorias')
        .insert([dataToSave]);
      error = insertError;
      successMessage = 'Categoria criada com sucesso!';
    }

    if (error) {
      console.error("Erro ao salvar categoria:", error);
      setAlert({ message: `Erro ao salvar categoria: ${error.message}`, type: 'error' });
    } else {
      handleCloseCategoriaModal();
      fetchCategorias();
      setAlert({ message: successMessage, type: 'success' });
    }
  };

  const handleRemoveItem = async (id) => {
    setItemParaDeletar({ id, tipo: 'item' });
  };

  const handleRemoveCategoria = async (id) => {
    setItemParaDeletar({ id, tipo: 'categoria' });
  };

  const confirmarRemocao = async () => {
    if (!itemParaDeletar.id) return;

    const { tipo, id } = itemParaDeletar;
    const tabela = tipo === 'item' ? 'itens_cardapio' : 'categorias';

    const { error } = await supabaseAdmin.from(tabela).delete().eq('id', id);
    
    if (error) {
      console.error(`Erro ao remover ${tipo}:`, error);
      setAlert({ message: `Erro ao remover ${tipo}: ${error.message}`, type: 'error' });
    } else {
      setAlert({ message: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} removido(a) com sucesso!`, type: 'success' });
      if (tipo === 'item') fetchItensCardapio();
      else fetchCategorias();
    }
    setItemParaDeletar({ id: null, tipo: '' }); // Fecha o modal
  };

  const handleNewItem = () => {
    setItemSelecionado(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setItemSelecionado(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setItemSelecionado(null);
  };

  const handleNovaCategoria = () => {
    setCategoriaSelecionada(null);
    setIsCategoriaModalOpen(true);
  };

  const handleEditarCategoria = (categoria) => {
    setCategoriaSelecionada(categoria);
    setIsCategoriaModalOpen(true);
  };
  const handleCloseCategoriaModal = () => {
    setIsCategoriaModalOpen(false);
    setCategoriaSelecionada(null);
  };

  const NavLinks = ({ isMobile = false }) => (
    <nav className={`flex flex-col ${isMobile ? 'space-y-4 p-4' : 'space-y-2'}`}>
      <Button onClick={() => { setActiveView('dashboard'); isMobile && setIsMobileMenuOpen(false); }} className={`w-full justify-start ${activeView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}><LayoutDashboard className="h-4 w-4 mr-3" /> Dashboard</Button>
      <Button onClick={() => { setActiveView('reservas'); isMobile && setIsMobileMenuOpen(false); }} className={`w-full justify-start ${activeView === 'reservas' ? 'bg-blue-600 text-white' : 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}><Calendar className="h-4 w-4 mr-3" /> Reservas</Button>
      <Button onClick={() => { setActiveView('cardapio'); isMobile && setIsMobileMenuOpen(false); }} className={`w-full justify-start ${activeView === 'cardapio' ? 'bg-blue-600 text-white' : 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}><Utensils className="h-4 w-4 mr-3" /> Cardápio</Button>
      <Button onClick={() => { setActiveView('categorias'); isMobile && setIsMobileMenuOpen(false); }} className={`w-full justify-start ${activeView === 'categorias' ? 'bg-blue-600 text-white' : 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}><LayoutList className="h-4 w-4 mr-3" /> Categorias</Button>
    </nav>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <AdminAlert alert={alert} onDismiss={() => setAlert({ message: "", type: "" })} />
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar para telas grandes (md e acima) */}
        <aside className="hidden md:flex md:w-64 bg-zinc-100 dark:bg-zinc-900 p-6 flex-col justify-between border-r border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold mb-8">Painel Admin</h1>
            <NavLinks />
          </div>
          <Button onClick={onLogout} className="w-full bg-red-600 hover:bg-red-700"><LogOut className="h-4 w-4 mr-3" /> Sair</Button> 
        </aside>

        {/* Conteúdo principal que ocupa o restante do espaço */}
        <div className="flex-1 flex flex-col">
          {/* Header para telas pequenas (até md) com menu hambúrguer */}
          <header className="md:hidden sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-zinc-950/80 backdrop-blur dark:border-zinc-800">
            <Container className="flex h-16 items-center justify-between">
              <h1 className="text-xl font-bold">Painel Admin</h1>
              <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="!p-2">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </Container>
          </header>

          {/* Menu Mobile Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="fixed top-0 left-0 h-full w-64 bg-zinc-100 dark:bg-zinc-900 p-6 flex flex-col justify-between border-r border-zinc-200 dark:border-zinc-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div>
                    <h1 className="text-2xl font-bold mb-8">Menu</h1>
                    <NavLinks isMobile={true} />
                  </div>
                  <Button onClick={onLogout} className="w-full bg-red-600 hover:bg-red-700"><LogOut className="h-4 w-4 mr-3" /> Sair</Button> 
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conteúdo principal */}
          <main className="flex-grow">
            <Container className="py-12 relative">
              {loading ? (
                <TableSkeleton rows={8} cols={activeView === 'reservas' ? 6 : 4} />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeView === 'dashboard' && <Dashboard data={dashboardData} />}
                    {activeView === 'reservas' && <GerenciarReservas reservas={reservas} onUpdateStatus={updateStatus} />}
                    {activeView === 'cardapio' && <GerenciarCardapio itens={itensCardapio} onNew={handleNewItem} onEdit={handleEditItem} onRemove={handleRemoveItem} />}
                    {activeView === 'categorias' && <GerenciarCategorias categorias={categorias} onNew={handleNovaCategoria} onEdit={handleEditarCategoria} onRemove={handleRemoveCategoria} />}
                  </motion.div>
                </AnimatePresence>
              )}
            </Container>
          </main>
        </div>
      </div>

        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          title={itemSelecionado ? "Editar Item" : "Adicionar Novo Item"}
        >
          <FormCardapio item={itemSelecionado} onSave={handleSaveItem} onCancel={handleCloseModal} categorias={categorias} />
        </Modal>
        <Modal
          isOpen={isCategoriaModalOpen}
          onClose={handleCloseCategoriaModal}
          title={categoriaSelecionada ? "Editar Categoria" : "Adicionar Nova Categoria"}
        >
          <FormCategoria categoria={categoriaSelecionada} onSave={handleSaveCategoria} onCancel={handleCloseCategoriaModal} />
        </Modal>
        <Modal 
          isOpen={!!itemParaDeletar.id}
          onClose={() => setItemParaDeletar({ id: null, tipo: '' })}
          title="Confirmar Remoção"
        >
          <div>
            <p className="text-zinc-700 dark:text-zinc-300 mb-6">Tem certeza que deseja remover? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-4">
              <Button type="button" onClick={() => setItemParaDeletar({ id: null, tipo: '' })} className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600">
                Cancelar
              </Button>
              <Button type="button" onClick={confirmarRemocao} className="bg-red-600 hover:bg-red-700">Confirmar Remoção</Button>
            </div>
          </div>
        </Modal>
      <Footer showNav={false} />
    </div>
  );
}
