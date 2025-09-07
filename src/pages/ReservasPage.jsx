import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reservas from '../components/Reservas';

const ReservasPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <Reservas />
      </main>
      <Footer />
    </div>
  );
};

export default ReservasPage;
