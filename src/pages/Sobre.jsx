import React from "react";
import { motion } from "framer-motion";
import { Star, Clock } from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionTitle } from "../components/SectionTitle";

const Sobre = () => (
  <section id="sobre" className="bg-white dark:bg-zinc-950">
    <Container className="py-20 grid gap-10 lg:grid-cols-2 lg:items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="order-2 lg:order-1"
      >
        <SectionTitle
          title="Sobre nós"
          subtitle="Inspirados pela alta gastronomia, buscamos surpreender com receitas autorais e uma hospitalidade calorosa."
        />
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
          Nossa cozinha valoriza a sazonalidade e os produtores locais. Cada prato é construído com técnica e
          criatividade, resgatando memórias afetivas sem abrir mão de elegância.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300"><Star className="h-5 w-5" /> 4.8 no GourmetApp</div>
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300"><Clock className="h-5 w-5" /> Desde 2015</div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="order-1 lg:order-2"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
          <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1800&auto=format&fit=crop" alt="Chef preparando prato" className="h-full w-full object-cover" />
        </div>
      </motion.div>
    </Container>
  </section>
);

export default Sobre;