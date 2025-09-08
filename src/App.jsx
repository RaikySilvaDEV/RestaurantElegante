import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Admin/Login.jsx";
import PainelAdmin from "./pages/Admin/PainelAdmin.jsx";
import MinhasReservas from "./pages/MinhasReservas.jsx";
import MeusDados from "./pages/MeusDados.jsx";
import ReservasPage from "./pages/ReservasPage.jsx";
import CardapioPage from "./pages/CardapioPage.jsx";
import ContatoPage from "./pages/ContatoPage.jsx";
import DeixarDepoimento from "./components/sections/DeixarDepoimento.jsx";


import { AuthProvider } from "./config/hooks/useAuth.jsx";

export default function App() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const loggedInAdmin = localStorage.getItem('admin');
    if (loggedInAdmin) {
      setAdmin(JSON.parse(loggedInAdmin));
    }
  }, []);

  return (
    <div className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 antialiased">
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <LandingPage />
          } />
          <Route path="/admin" element={
            admin ? 
              <PainelAdmin onLogout={() => {
                setAdmin(null);
                localStorage.removeItem('admin');
              }} />
             : 
              <Login onLogin={(adminData) => {
                setAdmin(adminData);
                localStorage.setItem('admin', JSON.stringify(adminData));
              }} />
          } />
          <Route path="/minhas-reservas" element={<MinhasReservas />} />
          <Route path="/meus-dados" element={<MeusDados />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/cardapio" element={<CardapioPage />} />
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="/deixar-depoimento" element={<DeixarDepoimento />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}
