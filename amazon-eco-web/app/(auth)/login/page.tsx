'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

async function handleLogin(e: React.FormEvent) {
  e.preventDefault(); 

  setLoading(true);
  setError('');

  try {
    console.log('Enviando dados para o servidor...');
    const response = await api.post('https://cautious-carnival-975r67g755x62977v-3333.app.github.dev/auth/login', { 
      email, 
      password 
    });

    console.log('Resposta bruta do servidor:', response.data);

    const token = response.data.token || response.data.access_token;
    
    if (!token) {
      console.error('Atenção: O back-end não retornou nenhuma propriedade "token" ou "access_token".');
      setError('Erro na estrutura de autenticação do servidor.');
      setLoading(false);
      return;
    }

    console.log('Token obtido com sucesso! Salvando no localStorage...');
    localStorage.setItem('@AmazonEco:token', token);
    document.cookie = `@AmazonEco:token=${token}; path=/; max-age=86400; SameSite=Lax`;
    
    console.log('Redirecionando para /dashboard...');
    
    router.push('/dashboard');

    setTimeout(() => {
      if (window.location.pathname !== '/dashboard') {
        console.log('Router falhou ou demorou. Forçando redirecionamento nativo...');
        window.location.href = '/dashboard';
      }
    }, 1000);

  } catch (err: any) {
    console.error('Erro detalhado na autenticação:', err);
    
    setError(
      err.response?.data?.message || 
      'Erro ao conectar com o servidor. Verifique suas credenciais.'
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm space-y-8 rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Amazon Eco ERP
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Acesse sua conta para gerenciar resíduos
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/50">
              {error}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                E-mail
              </label>
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-green-500 focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white disabled:opacity-50"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Senha
              </label>
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-green-500 focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-green-800 disabled:cursor-not-allowed"
        >
          {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}