'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/services/api';

interface Manifesto {
  id: string;
  numeroMtr: string;
  empresa: string;
  tipoResiduo: string; 
  quantidade: number;
  status: 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO'; 
  createdAt: string; 
}

export default function DashboardPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'ALL' | 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO'>('ALL');
  const [manifestos, setManifestos] = useState<Manifesto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const token = localStorage.getItem('@amazon-eco:token');

        const response = await api.get('/manifestos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setManifestos(response.data);
      } catch (error) {
        console.error('Erro ao buscar manifestos da API:', error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('@amazon-eco:token');
    router.push('/login');
  };

  const manifestosFiltrados = manifestos.filter((m) => {
    if (filter === 'ALL') return true;
    return m.status === filter;
  });

  const totalGerenciadoKg = manifestos.reduce((acc, m) => acc + m.quantidade, 0);
  const totalGerenciadoToneladas = totalGerenciadoKg / 1000; 
  const pendentesColeta = manifestos.filter((m) => m.status === 'EMITIDO' || m.status === 'EM_TRANSITO').length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 animate-pulse">Carregando painel Amazon Eco...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex">
      {/* Barra Lateral / Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold text-green-600 dark:text-green-500 tracking-tight">Amazon Eco ERP</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Gestão Ambiental e Resíduos</p>
          </div>
          <nav className="space-y-1">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 font-medium text-sm">
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50 text-sm">
              <span>Manifestos (MTR)</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50 text-sm">
              <span>Clientes / PIM</span>
            </a>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2 w-full px-4 py-2 border border-zinc-200 hover:bg-red-50 hover:text-red-600 dark:border-zinc-800 dark:hover:bg-red-950/20 dark:hover:text-red-400 rounded-lg text-sm font-medium transition-colors"
        >
          <span>Sair do Sistema</span>
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Visão Geral</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Acompanhe as coletas e destinações de resíduos na região de Manaus.</p>
          </div>
          <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
            ● Licença IPAAM Ativa
          </div>
        </header>

        {/* Cards de Métricas Rápidas Dinâmicas */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Gerenciado</p>
            <p className="text-2xl font-bold mt-2 text-green-600 dark:text-green-500">{totalGerenciadoToneladas.toFixed(2)} t</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Pendentes de Coleta</p>
            <p className="text-2xl font-bold mt-2 text-amber-500">{pendentesColeta} MTRs</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Taxa de Reciclagem</p>
            <p className="text-2xl font-bold mt-2 text-blue-500">75.5%</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Empresas Atendidas</p>
            <p className="text-2xl font-bold mt-2">{manifestos.length}</p>
          </div>
        </section>

        {/* Filtros e Tabela */}
        <section className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Manifestos Recentes</h3>
            <div className="flex space-x-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg text-xs">
              <button onClick={() => setFilter('ALL')} className={`px-3 py-1.5 rounded-md font-medium transition-colors ${filter === 'ALL' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}>Todos</button>
              <button onClick={() => setFilter('EMITIDO')} className={`px-3 py-1.5 rounded-md font-medium transition-colors ${filter === 'EMITIDO' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}>Emitidos</button>
              <button onClick={() => setFilter('EM_TRANSITO')} className={`px-3 py-1.5 rounded-md font-medium transition-colors ${filter === 'EM_TRANSITO' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}>Em Trânsito</button>
              <button onClick={() => setFilter('RECEBIDO')} className={`px-3 py-1.5 rounded-md font-medium transition-colors ${filter === 'RECEBIDO' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}>Recebidos</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50/70 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium">
                  <th className="p-4">Número MTR</th>
                  <th className="p-4">Empresa (PIM)</th>
                  <th className="p-4">Resíduo Destinado</th>
                  <th className="p-4 text-right">Qtd. (Toneladas)</th>
                  <th className="p-4">Data de Emissão</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {manifestosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 font-mono text-xs text-green-600 dark:text-green-400 font-semibold">{item.numeroMtr}</td>
                    <td className="p-4 font-medium">{item.empresa}</td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">{item.tipoResiduo}</td>
                    <td className="p-4 text-right font-mono font-medium">{(item.quantidade / 1000).toFixed(2)} t</td>
                    <td className="p-4 text-zinc-500 dark:text-zinc-400">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${
                        item.status === 'RECEBIDO' 
                          ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-900/50 dark:text-green-400' 
                          : item.status === 'EM_TRANSITO'
                          ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-400'
                          : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-400'
                      }`}>
                        {item.status === 'RECEBIDO' ? 'Recebido' : item.status === 'EM_TRANSITO' ? 'Em Trânsito' : 'Emitido'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}