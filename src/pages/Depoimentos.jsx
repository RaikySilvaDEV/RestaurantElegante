import React, { useState, useEffect } from "react";
import { Container } from "../components/ui/Container.jsx";
import { SectionTitle } from "../components/SectionTitle.jsx";
import { Star } from "lucide-react";
import { supabase } from "../config/SupabaseClient.js";

const Depoimentos = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase.from("depoimentos").select("*");
      if (error) console.error("Erro ao buscar depoimentos:", error);
      else setTestimonials(data);
    };
    fetchTestimonials();
  }, []);

  return (
    <section id="depoimentos" className="bg-zinc-50 dark:bg-zinc-900">
      <Container className="py-20">
        <SectionTitle title="Depoimentos" subtitle="A opinião de quem já viveu a experiência." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
              <div className="flex items-center gap-2 text-amber-500" aria-label={`${t.nota} estrelas`}>
                {Array.from({ length: t.nota }).map((_, s) => <Star key={s} className="h-5 w-5 fill-current" />)}
              </div>
              <p className="mt-3 text-zinc-700 dark:text-zinc-300">“{t.texto}”</p>
              <p className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">{t.nome}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Depoimentos;