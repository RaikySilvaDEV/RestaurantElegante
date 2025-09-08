import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';

const FormCardapio = ({ item, onSave, onCancel, categorias }) => {
  const [formData, setFormData] = useState({
    id: null,
    nome: '',
    descricao: '',
    preco: '',
    categoria_id: '',
    imagem: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id || null,
        nome: item.nome || '',
        descricao: item.descricao || '',
        preco: item.preco || '',
        categoria_id: item.categoria_id || '',
        imagem: item.imagem || '',
      });
    } else {
      // Reset para um novo item
      setFormData({ id: null, nome: '', descricao: '', preco: '', categoria_id: '', imagem: '' });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Remove o campo 'id' antes de enviar, pois ele não deve ser inserido/atualizado diretamente no corpo da requisição.
    // O ID é usado no 'eq' do Supabase para a atualização.
    const { id, ...dataToSave } = formData;
    if (id === null) {
      delete dataToSave.id;
    }
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nome do Prato</label>
        <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
      </div>
      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Descrição</label>
        <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} rows="3" className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200"></textarea>
      </div>
      <div>
        <label htmlFor="preco" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Preço</label>
        <input type="number" step="0.01" name="preco" id="preco" value={formData.preco} onChange={handleChange} required className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
      </div>
      <div>
        <label htmlFor="categoria_id" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Categoria</label>
        <select name="categoria_id" id="categoria_id" value={formData.categoria_id} onChange={handleChange} required className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200">
          <option value="">Selecione uma categoria</option>
          {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="imagem" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">URL da Imagem</label>
        <input type="url" name="imagem" id="imagem" value={formData.imagem} onChange={handleChange} required className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
        {formData.imagem && (
          <div className="mt-4">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Pré-visualização:</p>
            <img src={formData.imagem} alt="Pré-visualização do prato" className="rounded-lg w-full h-48 object-cover border border-zinc-200 dark:border-zinc-700" />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" onClick={onCancel} className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600">Cancelar</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Salvar</Button>
      </div>
    </form>
  );
};

export default FormCardapio;
