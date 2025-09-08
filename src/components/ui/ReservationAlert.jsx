import React, { useState, useEffect } from 'react';
import { CheckCircle, X, MessageSquare, CalendarPlus } from 'lucide-react';

const ReservationAlert = ({ data, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animação de entrada
    const timer = setTimeout(() => setVisible(true), 100);
    // O alerta some sozinho após 15 segundos
    const autoClose = setTimeout(() => handleClose(), 15000);
    return () => {
      clearTimeout(timer);
      clearTimeout(autoClose);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // Espera a animação de saída para remover o componente
  };

  const formatDateForCalendar = (date, time) => {
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Adiciona 2 horas de duração
    return `${startDate.toISOString().replace(/-|:|\.\d+/g, '')}/${endDate.toISOString().replace(/-|:|\.\d+/g, '')}`;
  };

  const formattedDate = new Date(data.data + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  const whatsappMessage = encodeURIComponent(`Olá! Gostaria de confirmar minha solicitação de reserva para ${data.pessoas} pessoa(s) no dia ${formattedDate} às ${data.horario}.`);
  const whatsappLink = `https://wa.me/5516991821069?text=${whatsappMessage}`; // Substitua pelo seu número

  const calendarDates = formatDateForCalendar(data.data, data.horario);
  const calendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=Reserva%20no%20Restaurante%20Elegante&dates=${calendarDates}&details=Reserva%20para%20${data.pessoas}%20pessoas.&location=Av.%20Central,%20123%20-%20Centro`;

  return (
    <div className={`fixed top-6 right-6 w-full max-w-sm bg-white dark:bg-zinc-800 shadow-2xl rounded-xl p-4 z-[100] transition-all duration-300 ease-in-out ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
      <div className="flex items-start gap-3">
        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-zinc-900 dark:text-white">Solicitação Recebida!</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
            Sua reserva para o dia {formattedDate} às {data.horario} foi solicitada. Entraremos em contato para confirmar.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-sm bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
              <MessageSquare className="h-4 w-4" /> Confirmar via WhatsApp
            </a>
            <a href={calendarLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-sm bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 px-3 py-2 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 flex items-center justify-center gap-2">
              <CalendarPlus className="h-4 w-4" /> Add na Agenda
            </a>
          </div>
        </div>
        <button onClick={handleClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"><X className="h-5 w-5" /></button>
      </div>
    </div>
  );
};

export default ReservationAlert;
