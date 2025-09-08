import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../config/SupabaseClient.js";
import { Container } from "../ui/Container.jsx";
import { SectionTitle } from "../ui/SectionTitle.jsx";

const Galeria = () => {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase.from("galeria").select("*");
      if (error) console.error("Erro ao buscar galeria:", error);
      else setGallery(data);
    };
    fetchGallery();
  }, []);

  return (
    <section id="galeria" className="bg-white dark:bg-zinc-950">
      <Container className="py-20">
        <SectionTitle title="Galeria" subtitle="Um pouco da nossa atmosfera e dos pratos mais pedidos." />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((image, i) => (
            <motion.div key={image.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.1 }}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Galeria;