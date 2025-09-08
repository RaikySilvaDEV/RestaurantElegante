import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { motion, AnimatePresence, wrap } from "framer-motion";
import { supabase } from "../../config/SupabaseClient.js";
import { Container } from "../ui/Container.jsx";
import { SectionTitle } from "../ui/SectionTitle.jsx";

const Depoimentos = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [[page, direction], setPage] = useState([0, 0]); // page, direction

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("depoimentos").select("*").order('created_at', { ascending: false });
      if (error) {
        console.error("Erro ao buscar depoimentos:", error);
      } else {
        setTestimonials(data);
      }
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  // Autoplay
  useEffect(() => {
    if (testimonials.length > 1 && !loading) {
      const timer = setTimeout(() => {
        paginate(1);
      }, 5000); // Muda a cada 5 segundos
      return () => clearTimeout(timer);
    }
  }, [page, testimonials.length, loading]);

  const testimonialIndex = wrap(0, testimonials.length, page);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.8
    }),
  };

  return (
    <section id="depoimentos" className="bg-white dark:bg-zinc-950">
      <Container className="py-20">
        <SectionTitle title="Depoimentos" subtitle="A opinião de quem já viveu a experiência." />
        {loading ? (
          <p className="text-center">Carregando depoimentos...</p>
        ) : testimonials.length > 0 ? (
          <div className="relative flex items-center justify-center h-96 overflow-hidden group">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  if (Math.abs(offset.x) > 20) {
                    paginate(offset.x < 0 ? 1 : -1);
                  }
                }}
                className="absolute w-[90%] sm:w-[70%] md:w-[50%] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-8 flex flex-col justify-center items-center text-center shadow-lg"
              >
                {testimonials[testimonialIndex].avatar_url && (
                  <img src={testimonials[testimonialIndex].avatar_url} alt={`Foto de ${testimonials[testimonialIndex].nome}`} className="w-20 h-20 rounded-full mb-4 object-cover border-2 border-amber-400" />
                )}
                <div className="flex items-center gap-1 text-amber-400" aria-label={`${testimonials[testimonialIndex].nota} de 5 estrelas`}>
                  {[...Array(5)].map((_, s) => <Star key={s} className={`h-5 w-5 ${s < testimonials[testimonialIndex].nota ? 'fill-current' : 'text-zinc-300 dark:text-zinc-600'}`} />)}
                </div>
                <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300 before:content-['“'] after:content-['”']">{testimonials[testimonialIndex].texto}</p>
                <p className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">— {testimonials[testimonialIndex].nome}</p>
              </motion.div>
            </AnimatePresence>
            <div className="absolute left-0 w-1/4 h-full cursor-pointer z-10" onClick={() => paginate(-1)}></div>
            <div className="absolute right-0 w-1/4 h-full cursor-pointer z-10" onClick={() => paginate(1)}></div>
          </div>
        ) : (
          <p className="text-center text-zinc-500">Ainda não há depoimentos. Seja o primeiro a deixar o seu!</p>
        )}
      </Container>
    </section>
  );
};

export default Depoimentos;