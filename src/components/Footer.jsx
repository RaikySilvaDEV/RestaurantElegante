import React, { useState, useEffect } from "react";
import { Container } from "./ui/Container";
import { useLocation } from "react-router-dom";
import { supabase } from "../config/SupabaseClient";

const Footer = () => {
  const [nav, setNav] = useState([]);

  useEffect(() => {
    const fetchNav = async () => {
      const { data, error } = await supabase.from("navegacao").select("nome, href").order("ordem");
      if (error) console.error("Erro ao buscar navegação para o rodapé:", error);
      else setNav(data);
    };
    fetchNav();
  }, []);

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800">
      <Container className="py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-zinc-600 dark:text-zinc-300">
        <p>© {new Date().getFullYear()} Restaurante Elegante. Todos os direitos reservados.</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {nav.map((item) => {
            const isHomePage = window.location.pathname === '/';
            const finalHref = isHomePage && item.href.startsWith('#') ? item.href : `/${item.href.replace('#', '')}`;
            return <a key={item.nome} href={finalHref} className="hover:underline">{item.nome}</a>
          })}
        </div>
      </Container>
    </footer>
  );
};

export default Footer;