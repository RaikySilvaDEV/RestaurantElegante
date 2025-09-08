import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cardapio from '../components/pages/Cardapio';

const CardapioPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <Cardapio isPage={true} />
      </main>
      <Footer />
    </div>
  );
};

export default CardapioPage;