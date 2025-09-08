import React, { useState } from 'react';
import { useAuth } from '../../config/hooks/useAuth';
import  Modal  from './Modal';
import { Button } from './Button';
import { X } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithPassword, signUp, signInWithGoogle } = useAuth();

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let authError;
      if (isLoginView) {
        const { error } = await signInWithPassword(email, password);
        authError = error;
      } else {
        const { error } = await signUp(email, password, nome);
        authError = error;
      }

      if (authError) {
        setError(authError.message);
      } else {
        onClose(); // Fecha o modal em caso de sucesso
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
    } else {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isLoginView ? 'Entrar na sua conta' : 'Criar uma conta'}>
      <div className="flex border-b border-zinc-200 dark:border-zinc-700 mb-6">
        <button onClick={() => setIsLoginView(true)} className={`flex-1 py-2 text-sm font-medium ${isLoginView ? 'border-b-2 border-blue-600 text-blue-600' : 'text-zinc-500'}`}>Entrar</button>
        <button onClick={() => setIsLoginView(false)} className={`flex-1 py-2 text-sm font-medium ${!isLoginView ? 'border-b-2 border-blue-600 text-blue-600' : 'text-zinc-500'}`}>Criar Conta</button>
      </div>

      <form onSubmit={handleAuthAction} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {!isLoginView && (
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nome</label>
            <input type="text" name="nome" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
          <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
        </div>
        <div>
          <label htmlFor="password"  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Senha</label>
          <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200" />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-200">
          {loading ? 'Processando...' : (isLoginView ? 'Entrar' : 'Criar Conta')}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-zinc-300 dark:border-zinc-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-zinc-900 px-2 text-sm text-zinc-500">OU</span>
        </div>
      </div>

      <Button onClick={handleGoogleSignIn} className="w-full bg-white dark:bg-zinc-800 text-zinc-200 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700">
        <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
          <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
        <span>Continuar com Google</span>
      </Button>
    </Modal>
  );
};

export default AuthModal;