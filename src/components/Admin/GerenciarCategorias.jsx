import React from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import { Button } from '../ui/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';

const GerenciarCategorias = ({ categorias, onNew, onEdit, onRemove }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <SectionTitle title="Gerenciar Categorias" subtitle="Adicione, edite ou remova categorias de pratos." />
        <Button onClick={onNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-900">
            <tr>
              <th className="p-4 font-semibold">Nome da Categoria</th>
              <th className="p-4 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {categorias.length === 0 && (
              <tr><td colSpan="2" className="p-4 text-center text-zinc-500">Nenhuma categoria encontrada.</td></tr>
            )}
            {categorias.map((cat) => (
              <tr key={cat.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <td className="p-4 font-medium">{cat.nome}</td>
                <td className="p-4 text-right space-x-2">
                  <Button onClick={() => onEdit(cat)} className="bg-zinc-500 hover:bg-zinc-600 text-white text-xs py-1 px-2"><Edit className="h-3 w-3"/></Button>
                  <Button onClick={() => onRemove(cat.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2"><Trash2 className="h-3 w-3"/></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GerenciarCategorias;