import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import Highlights from "./Highlights";
import Sobre from "./Sobre";
import Cardapio from "./Cardapio";
import Galeria from "./Galeria";
import Depoimentos from "./Depoimentos"; // Note: This was already correct, but I'm showing the file for context.
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ReservationAlert from "../pages/ReservationAlert";

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
      </main>
      {alertData && <ReservationAlert data={alertData} onClose={() => setAlertData(null)} />}
      <Footer />
    </div>
  );
}