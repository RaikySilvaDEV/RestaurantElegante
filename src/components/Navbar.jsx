import React from 'react'
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChefHat } from "lucide-react";

import { Container } from "./ui/Container";
import { Button } from "./ui/Button";
import { useAuth } from "../config/hooks/useAuth";
import ProfileDropdown from "./ui/ProfileDropdown";
import AuthModal from "./ui/AuthModal";
import { supabase } from "../config/SupabaseClient";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const [nav, setNav] = useState([]);

  useEffect(() => {
    const fetchNav = async () => {
      const { data, error } = await supabase.from("navegacao").select("*").order("ordem");
      if (error) console.error("Erro ao buscar navegação:", error);
      else setNav(data);
    };
    fetchNav();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
      scrolled || open
        ? "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-zinc-900/80"
        : "bg-transparent"
    }`}>
      <Container className="flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-semibold">
          <ChefHat className="h-6 w-6" />
          <span className="hidden sm:inline">Restaurante Elegante</span>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {nav && nav.map((item) => (
            item.href.startsWith('#') ? (
              <a key={item.nome} href={`/${item.href}`} className="text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                {item.nome}
              </a>
            ) : (
              <Link key={item.nome} to={item.href} className="text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
                {item.nome}
              </Link>
            )
          ))}
          {user 
            ? <ProfileDropdown user={user} />
            : <Button onClick={() => setAuthModalOpen(true)}>Reservar</Button>}
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
          aria-label="Abrir menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            {open ? (
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75z" clipRule="evenodd" />
            )}
          </svg>
        </button>
      </Container>
      {open && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800">
          <Container className="py-4 flex flex-col gap-4">
            {nav.map((item) => {
              if (item.href.startsWith('#')) {
                return <a key={item.nome} href={`/${item.href}`} className="hover:underline" onClick={() => setOpen(false)}>{item.nome}</a>
              }
              // Para links que não são âncoras, o Link do react-router-dom funciona bem
              return <Link key={item.nome} to={item.href} className="hover:underline" onClick={() => setOpen(false)}>
                {item.nome}
              </Link>
            })}
            {user ? (
              <ProfileDropdown user={user} isMobile={true} closeMobileMenu={() => setOpen(false)} />
            ) : (
              <Button onClick={() => { setAuthModalOpen(true); setOpen(false); }}>Reservar</Button>
            )}
          </Container>
        </div>
      )}
      {!user && (
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      )}
    </header>
  );
};