'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../services/api';

interface Manifesto {
  id: string;
  numeroMtr: string;
  empresa: string;
  tipoResiduo: string; 
  quantidade: number;
  status: 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO' | 'DESTINADO'; 
  createdAt: string; 
}

export default function ManifestosPage() {
  const router = useRouter();
  const [manifestos, setManifestos] = useState<Manifesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO' | 'DESTINADO'>('ALL');

  async function fetchManifestos() {
    try {
      setLoading(true);
      const token = localStorage.getItem('@AmazonEco:token');
      const response = await api.get('/manifestos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (Array.isArray(response.data)) {
        setManifestos(response.data);
      } else {
        setManifestos([]);
      }
    } catch (error) {
      console.error('Erro ao buscar manifestos:', error);
      setManifestos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchManifestos();
  }, []);

  const manifestosFiltrados = manifestos.filter((m) => {
    const matchesSearch = m.numeroMtr.toLowerCase().includes(search.toLowerCase()) || 
                          m.empresa.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || m.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Controle de Manifestos (MTR)</h1>
          <p className="text-sm text-gray-500">Listagem geral e acompanhamento de cargas regulamentadas pelo IPAAM.</p>
        </div>
        <Link 
          href="/dashboard"
          className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Voltar ao Painel
        </Link>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border shadow-sm">
        <input 
          type="text"
          placeholder="Buscar por número MTR ou empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 bg-transparent text-sm focus:ring-2 focus:ring-green-500 outline-none"
        />

        <div className="flex flex-wrap gap-2 text-xs">
          {(['ALL', 'EMITIDO', 'EM_TRANSITO', 'RECEBIDO', 'DESTINADO'] as const).map((statusType) => (
            <button
              key={statusType}
              onClick={() => setFilter(statusType)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                filter === statusType 
                  ? 'bg-green-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              {statusType === 'ALL' ? 'Todos' : statusType === 'EM_TRANSITO' ? 'Em Trânsito' : statusType.charAt(0) + statusType.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Manifestos */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando dados dos manifestos...</div>
        ) : manifestosFiltrados.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nenhum manifesto encontrado para os critérios selecionados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="p-4">Número MTR</th>
                  <th className="p-4">Empresa (PIM)</th>
                  <th className="p-4">Resíduo Destinado</th>
                  <th className="p-4 text-right">Qtd (t)</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-sm text-gray-700 dark:text-zinc-300">
                {manifestosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 font-mono text-xs text-green-600 dark:text-green-400 font-semibold">{item.numeroMtr}</td>
                    <td className="p-4 font-medium text-gray-900 dark:text-zinc-100">{item.empresa}</td>
                    <td className="p-4 text-gray-500 dark:text-zinc-400">{item.tipoResiduo}</td>
                    <td className="p-4 text-right font-mono font-medium">{item.quantidade.toFixed(2)} t</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                        item.status === 'RECEBIDO' || item.status === 'DESTINADO'
                          ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/20 dark:border-green-900/50 dark:text-green-400' 
                          : item.status === 'EM_TRANSITO'
                          ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-400'
                          : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-400'
                      }`}>
                        {item.status === 'RECEBIDO' || item.status === 'DESTINADO' ? 'Recebido' : item.status === 'EM_TRANSITO' ? 'Em Trânsito' : 'Emitido'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}