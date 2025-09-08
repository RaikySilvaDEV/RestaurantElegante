import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as icons from "lucide-react";
import { Container } from "../ui/Container.jsx";
import { supabase } from "../../config/SupabaseClient.js";
const Highlights = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = (await supabase.from("features").select("*"));
      if (error) console.error("Erro ao buscar destaques:", error);
      else setFeatured(data);
    };
    fetchFeatured();
  }, []);

  return (
    <section className="bg-white dark:bg-zinc-950 border-y border-zinc-100 dark:border-zinc-800">
      <Container className="py-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((f, i) => {
          const Icon = icons[f.icone] || icons.ChefHat; // Fallback icon
          return (
            <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{f.titulo}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{f.descricao}</p>
            </motion.div>
          );
        })}
      </Container>
    </section>
  );
};

export default Highlights;