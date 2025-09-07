import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../config/SupabaseClient";
import Footer from "../../components/Footer";
import { Container } from "../../components/ui/Container";
import { SectionTitle } from "../../components/SectionTitle";
import { Button } from "../../components/ui/Button";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function PainelAdmin({ onLogout }) {
  const [reservas, setReservas] = useState([]);
  const [itensCardapio, setItensCardapio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for the new item form can be added here

  const fetchReservas = useCallback(async () => {
    const { data, error } = await supabase
      .from("reservas")
      .select(`id, data_reserva, hora_reserva, pessoas, status, clientes(nome, email)`)
      .order("data_reserva", { ascending: false });

    if (error) {
      console.error("Erro ao buscar reservas:", error);
      setError("Não foi possível carregar as reservas.");
    } else {
      setReservas(data);
    }
  }, []);

  const fetchItensCardapio = useCallback(async () => {
    // Logic to fetch menu items
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchReservas(), fetchItensCardapio()]).finally(() => setLoading(false));
  }, [fetchReservas, fetchItensCardapio]);

  const updateStatus = async (id, status) => {
    await supabase
      .from("reservas")
      .update({ status })
      .eq("id", id);
    fetchReservas();
  };

  const handleRemoveItem = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este item?")) {
      // Logic to remove item
    }
  };

  // Dummy handlers for new/edit product
  const handleNewProduct = () => alert("Funcionalidade de adicionar novo produto a ser implementada.");
  const handleEditProduct = (id) => alert(`Funcionalidade de editar produto ${id} a ser implementada.`);

  const formatDate = (dateString) => {
    // Using UTC to avoid timezone issues with 'YYYY-MM-DD'
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-zinc-950 dark:border-zinc-800">
        <Container className="flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Painel do Administrador</h1>
          <Button onClick={onLogout} className="bg-red-600 hover:bg-red-700">Sair</Button>
        </Container>
      </header>

      <main className="flex-grow">
        <Container className="py-12">
          {loading && <p>Carregando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="space-y-16">
              {/* Seção de Reservas */}
              <div>
                <SectionTitle title="Gerenciar Reservas" subtitle="Confirme ou cancele as solicitações de reserva." />
                <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-100 dark:bg-zinc-900">
                      <tr>
                        <th className="p-4 font-semibold">Cliente</th>
                        <th className="p-4 font-semibold">Data</th>
                        <th className="p-4 font-semibold">Hora</th>
                        <th className="p-4 font-semibold">Pessoas</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {reservas.map((r) => (
                        <tr key={r.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                          <td className="p-4 whitespace-nowrap">{r.clientes?.nome || 'Cliente não encontrado'}</td>
                          <td className="p-4 whitespace-nowrap">{formatDate(r.data_reserva)}</td>
                          <td className="p-4 whitespace-nowrap">{r.hora_reserva}</td>
                          <td className="p-4">{r.pessoas}</td>
                          <td className="p-4 capitalize">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              r.status === 'confirmada' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              r.status === 'cancelada' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>{r.status}</span>
                          </td>
                          <td className="p-4 text-right space-x-2 whitespace-nowrap">
                            {r.status === 'pendente' && (
                              <>
                                <Button onClick={() => updateStatus(r.id, "confirmada")} className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-2">Confirmar</Button>
                                <Button onClick={() => updateStatus(r.id, "cancelada")} className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2">Cancelar</Button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Seção de Gerenciamento do Cardápio */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <SectionTitle title="Gerenciar Cardápio" subtitle="Adicione, edite ou remova itens do cardápio." />
                  <Button onClick={handleNewProduct} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    Novo Item
                  </Button>
                </div>
                 <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-100 dark:bg-zinc-900">
                      <tr>
                        <th className="p-4 font-semibold">Nome</th>
                        <th className="p-4 font-semibold">Preço</th>
                        <th className="p-4 font-semibold">Categoria</th>
                        <th className="p-4 font-semibold text-right">Ações</th>
                      </tr>
                    </thead>
                     <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {/* Dummy data for now */}
                      {[{id: 1, nome: 'Prato Exemplo', preco: '55.00', categoria: 'Principais'}].map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                          <td className="p-4 font-medium">{item.nome}</td>
                          <td className="p-4">R$ {item.preco}</td>
                          <td className="p-4">{item.categoria}</td>
                          <td className="p-4 text-right space-x-2">
                            <Button onClick={() => handleEditProduct(item.id)} className="bg-zinc-500 hover:bg-zinc-600 text-white text-xs py-1 px-2"><Edit className="h-3 w-3"/></Button>
                            <Button onClick={() => handleRemoveItem(item.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2"><Trash2 className="h-3 w-3"/></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
