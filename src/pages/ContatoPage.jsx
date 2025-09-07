import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Contato from './Contato';

const ContatoPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <Contato />
      </main>
      <Footer />
    </div>
  );
};

export default ContatoPage;
