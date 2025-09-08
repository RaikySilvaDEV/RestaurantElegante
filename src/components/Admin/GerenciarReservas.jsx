import React from 'react';
import { SectionTitle } from '../SectionTitle';
import { Button } from '../ui/Button';

const GerenciarReservas = ({ reservas, onUpdateStatus }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
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
            {reservas.length === 0 && (
              <tr><td colSpan="6" className="p-4 text-center text-zinc-500">Nenhuma reserva encontrada.</td></tr>
            )}
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
                      <Button onClick={() => onUpdateStatus(r.id, "confirmada")} className="bg-green-500 hover:bg-green-600 text-white text-xs py-1 px-2">Confirmar</Button>
                      <Button onClick={() => onUpdateStatus(r.id, "cancelada")} className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2">Cancelar</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GerenciarReservas;