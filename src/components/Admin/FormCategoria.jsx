import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

const FormCategoria = ({ categoria, onSave, onCancel }) => {
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (categoria && categoria.nome) {
      setNome(categoria.nome);
    } else {
      setNome('');
    }
  }, [categoria]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nome.trim()) {
      onSave({ ...categoria, nome });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome-categoria" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nome da Categoria</label>
        <input type="text" name="nome" id="nome-categoria" value={nome} onChange={(e) => setNome(e.target.value)} required className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" onClick={onCancel} className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600">Cancelar</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Salvar</Button>
      </div>
    </form>
  );
};

export default FormCategoria;
