import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/sections/Hero.jsx";
import Highlights from "../components/sections/Highlights.jsx";
import Sobre from "../components/sections/Sobre.jsx";
import Cardapio from "../components/pages/Cardapio.jsx";
import Galeria from "../components/sections/Galeria.jsx";
import Depoimentos from "../components/sections/Depoimentos.jsx";
import Contato from "../components/pages/Contato.jsx";
import ReservationAlert from "../components/ui/ReservationAlert.jsx";


export default function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [alertData, setAlertData] = useState(null);

  useEffect(() => {
    if (location.state?.reservaConfirmada) {
      setAlertData(location.state);
      // Limpa o state do histórico para não mostrar o alerta ao recarregar
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className=" text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Navbar />
      <main>
        <Hero />
        <Highlights />
        <Sobre />
        <Cardapio />
        <Galeria />
        <Depoimentos />
        <Contato />
      </main>
      {alertData && <ReservationAlert data={alertData} onClose={() => setAlertData(null)} />}
      <Footer />
    </div>
  );
}