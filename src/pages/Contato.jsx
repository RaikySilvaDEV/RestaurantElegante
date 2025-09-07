import React, { useState } from "react";
import { Container } from "../components/ui/Container";
import { SectionTitle } from "../components/SectionTitle";
import { Phone, Clock, Instagram, Facebook, Mail } from "lucide-react";
import { Button } from "../components/ui/Button";

const Contato = () => {
  const [formStatus, setFormStatus] = useState('');

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormStatus('Mensagem enviada com sucesso!');
    e.target.reset();
    setTimeout(() => setFormStatus(''), 5000);
  };

  return (
    <section id="contato" className="bg-zinc-50 dark:bg-zinc-900">
      <Container className="py-20">
        <SectionTitle title="Contato" subtitle="Estamos à disposição para tirar dúvidas e receber sugestões." />
        <div className="grid gap-12 md:grid-cols-2">
          {/* Coluna da Esquerda: Informações e Mapa */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Endereço</h4>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Av. Central, 123 - Centro<br />Sua Cidade / Estado</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Telefone e WhatsApp</h4>
              <a href="tel:+5511999999999" className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white"><Phone className="h-4 w-4" /> (11) 99999-9999</a>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white"><Phone className="h-4 w-4" /> Chamar no WhatsApp</a>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Horário</h4>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 space-y-1">
                <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> Segunda a Domingo (Almoço): 11h — 14h</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> Segunda a Domingo (Jantar): 19h — 22h</p>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Redes Sociais</h4>
              <div className="mt-2 flex items-center gap-4">
                <a href="#" aria-label="Instagram" className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"><Instagram className="h-5 w-5" /></a>
                <a href="#" aria-label="Facebook" className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"><Facebook className="h-5 w-5" /></a>
                <a href="mailto:contato@restauranteelegante.com" aria-label="E-mail" className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"><Mail className="h-5 w-5" /></a>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Formulário e Mapa */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Formulário de Contato</h4>
              <form onSubmit={handleContactSubmit} className="grid gap-4">
                {formStatus && <p className="text-green-500 text-center text-sm">{formStatus}</p>}
                <input name="nome" type="text" placeholder="Seu nome" required className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
                <input name="email" type="email" placeholder="Seu e-mail" required className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
                <textarea name="mensagem" placeholder="Sua mensagem" required rows="4" className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200"></textarea>
                <Button type="submit">Enviar Mensagem</Button>
              </form>
            </div>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Localização</h4>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019889856338!2d-122.4209796846817!3d37.7833993797579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4baf%3A0x4388b0c641505523!2sRestaurante%20Franc%C3%AAs!5e0!3m2!1spt-BR!2sbr!4v1678886400000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização do Restaurante Elegante"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Contato;