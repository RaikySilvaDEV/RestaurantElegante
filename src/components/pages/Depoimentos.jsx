import React, { useState, useEffect } from "react";
import { supabase } from "../../config/SupabaseClient.js";
import { Star } from "lucide-react";
import { Container } from "../ui/Container.jsx";
import { SectionTitle } from "../ui/SectionTitle.jsx";

const Depoimentos = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("depoimentos").select("*");
      if (error) {
        console.error("Erro ao buscar depoimentos:", error);
      } else {
        setTestimonials(data);
      }
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  return (
    <section id="depoimentos" className="bg-white dark:bg-zinc-950">
      <Container className="py-20">
        <SectionTitle title="Depoimentos" subtitle="A opinião de quem já viveu a experiência." />
        {loading ? (
          <p className="text-center">Carregando depoimentos...</p>
        ) : testimonials.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-6">
                <div className="flex items-center gap-1 text-amber-400" aria-label={`${t.nota} de 5 estrelas`}>
                  {[...Array(5)].map((_, s) => <Star key={s} className={`h-5 w-5 ${s < t.nota ? 'fill-current' : 'text-zinc-300 dark:text-zinc-600'}`} />)}
                </div>
                <p className="mt-4 text-zinc-700 dark:text-zinc-300 before:content-['“'] after:content-['”']">{t.texto}</p>
                <p className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">— {t.nome}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-zinc-500">Ainda não há depoimentos. Seja o primeiro a deixar o seu!</p>
        )}
      </Container>
    </section>
  );
};

export default Depoimentos;