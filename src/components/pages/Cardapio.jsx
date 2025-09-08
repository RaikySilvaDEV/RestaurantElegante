import React, { useState, useEffect } from "react";
import { supabase } from "../../config/SupabaseClient.js";
import { Container } from "../ui/Container.jsx";
import { SectionTitle } from "../ui/SectionTitle.jsx";
import { Button } from "../ui/Button.jsx";

const Cardapio = ({ isPage = false }) => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      // 1. Buscar itens e categorias simultaneamente
      const { data: itens, error: itensError } = await supabase.from("itens_cardapio").select("*").order("categoria_id");
      const { data: categorias, error: categoriasError } = await supabase.from("categorias").select("*");

      if (itensError) console.error("Erro ao buscar itens do cardápio:", itensError);
      if (categoriasError) console.error("Erro ao buscar categorias:", categoriasError);
      
      if (itens && categorias) {
        // 2. Agrupar itens por categoria usando o nome da categoria
        const groupedMenu = itens.reduce((acc, item) => {
          const categoriaDoItem = categorias.find(c => c.id === item.categoria_id);
          const nomeCategoria = categoriaDoItem ? categoriaDoItem.nome : 'Sem Categoria';
          const category = acc.find(c => c.categoria === nomeCategoria);
          if (category) {
            category.itens.push(item);
          } else {
            acc.push({ categoria: nomeCategoria, itens: [item] });
          }
          return acc;
        }, []);
        setMenu(groupedMenu);
      }
    };
    fetchMenu();
  }, []);

  return (
    <section id="cardapio" className="bg-zinc-50 dark:bg-zinc-900">
      <Container className={isPage ? "py-24 sm:py-32" : "py-20"}>
        {isPage ? (
          <SectionTitle title="Nosso Cardápio" subtitle="Explore nossa seleção completa de pratos e bebidas." />
        ) : (
          <SectionTitle title="Cardápio" subtitle="Seleção enxuta e elegante, com ingredientes frescos e execução precisa." />
        )}
        <div className="space-y-12">
          {menu.map((sec) => (
            <div key={sec.categoria}>
              <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">{sec.categoria}</h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {sec.itens.map((it) => (
                  <div key={it.id} className="bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <img src={it.imagem} alt={it.nome} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <h4 className="font-semibold text-lg text-zinc-800 dark:text-zinc-200">{it.nome}</h4>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">R$ {Number(it.preco).toFixed(2).replace('.', ',')}</p> 
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{it.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {!isPage && (
          <div className="mt-10 text-center">
            <Button href="/reservas">Fazer reserva</Button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Cardapio;