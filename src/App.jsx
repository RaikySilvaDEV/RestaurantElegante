import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Admin/Login";
import PainelAdmin from "./pages/Admin/PainelAdmin";
import MinhasReservas from "./pages/MinhasReservas.jsx";
import MeusDados from "./pages/MeusDados.jsx";
import ReservasPage from "./pages/ReservasPage.jsx";
import CardapioPage from "./pages/CardapioPage.jsx";
import ContatoPage from "./pages/ContatoPage.jsx";
import { AuthProvider } from "./config/hooks/useAuth.jsx";

export default function App() {
  const [admin, setAdmin] = useState(null);

  return (
    <div className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 antialiased">
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <LandingPage />
          } />
          <Route path="/admin" element={
            admin ? (
              <PainelAdmin onLogout={() => setAdmin(null)} />
            ) : (
              <Login onLogin={setAdmin} />
            )
          } />
          <Route path="/minhas-reservas" element={<MinhasReservas />} />
          <Route path="/meus-dados" element={<MeusDados />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/cardapio" element={<CardapioPage />} />
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}
