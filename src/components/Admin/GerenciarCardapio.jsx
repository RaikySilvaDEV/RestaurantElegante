import React from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import { Button } from '../ui/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';

const GerenciarCardapio = ({ itens, onNew, onEdit, onRemove }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <SectionTitle title="Gerenciar Cardápio" subtitle="Adicione, edite ou remova itens do cardápio." />
        <Button onClick={onNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Novo Item
        </Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-900">
            <tr>
              <th className="p-4 font-semibold">Nome</th>
              <th className="p-4 font-semibold">Preço</th>
              <th className="p-4 font-semibold">Categoria</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {itens.length === 0 && (
              <tr><td colSpan="4" className="p-4 text-center text-zinc-500">Nenhum item no cardápio.</td></tr>
            )}
            {itens.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="p-4 font-medium">{item.nome}</td>
                <td className="p-4">R$ {Number(item.preco).toFixed(2).replace('.', ',')}</td>
                <td className="p-4">{item.categorias?.nome || 'Sem categoria'}</td>
                <td className="p-4 text-right space-x-2">
                  <Button onClick={() => onEdit(item)} className="bg-zinc-500 hover:bg-zinc-600 text-white text-xs py-1 px-2"><Edit className="h-3 w-3"/></Button>
                  <Button onClick={() => onRemove(item.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2"><Trash2 className="h-3 w-3"/></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GerenciarCardapio;