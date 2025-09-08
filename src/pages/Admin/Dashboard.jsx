import React from 'react';
import { Users, CalendarCheck, CalendarClock } from 'lucide-react';

import ReservasChart from '../../components/ui/ReservasChart.jsx';
import StatusChart from '../../components/ui/StatusChart.jsx';
import { SectionTitle } from '../../components/ui/SectionTitle';

const StatCard = ({ icon, title, value, description }) => (
  <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 flex items-start gap-4">
    <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 p-3 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
      {description && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>}
    </div>
  </div>
);

const defaultDashboardData = {
  stats: { reservasHoje: 0, pessoasHoje: 0, reservasPendentes: 0 },
  proximasReservas: [],
  reservasPorDia: [],
  statusDistribution: [],
};

const Dashboard = ({ data = defaultDashboardData }) => {
  const stats = data?.stats || defaultDashboardData.stats;

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div className="space-y-12">
      <SectionTitle title="Dashboard" subtitle="Visão geral das suas reservas e atividades." />

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<CalendarCheck size={24} />}
          title="Reservas Confirmadas Hoje"
          value={stats.reservasHoje}
        />
        <StatCard
          icon={<Users size={24} />}
          title="Total de Pessoas Hoje"
          value={stats.pessoasHoje}
          description="Soma de todas as reservas confirmadas"
        />
        <StatCard
          icon={<CalendarClock size={24} />}
          title="Reservas Pendentes"
          value={stats.reservasPendentes}
          description="Aguardando sua confirmação"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        <div className="lg:col-span-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Reservas na Última Semana</h3>
          <ReservasChart data={data.reservasPorDia} />
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Distribuição de Status</h3>
          <StatusChart data={data.statusDistribution} />
        </div>
      </div>

      {/* Próximas Reservas Pendentes */}
      <div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Próximas Reservas a Confirmar</h3>
        <div className="space-y-4">
          {data.proximasReservas.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">Nenhuma reserva pendente no momento.</p>
          ) : (
            data.proximasReservas.map(reserva => (
              <div key={reserva.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{reserva.clientes.nome}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {formatDate(reserva.data_reserva)} às {reserva.hora_reserva} - {reserva.pessoas} pessoas
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Pendente
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;