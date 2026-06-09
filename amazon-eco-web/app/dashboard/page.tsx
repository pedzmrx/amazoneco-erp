'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../services/api';
import { toast } from 'sonner';

interface Manifesto {
  id: string;
  numeroMtr: string;
  empresa: string;
  tipoResiduo: string; 
  quantidade: number;
  status: 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO' | 'DESTINADO'; 
  createdAt: string; 
}

interface Company {
  id: string;
  name: string;
  cnpj: string;
  type: string;
}

export default function ManifestosPage() {
  const router = useRouter();
  const [manifestos, setManifestos] = useState<Manifesto[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO' | 'DESTINADO'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [numeroMtr, setNumeroMtr] = useState('');
  const [empresaId, setEmpresaId] = useState('');
  const [tipoResiduo, setTipoResiduo] = useState('');
  const [quantidadeToneladas, setQuantidadeToneladas] = useState('');
  const [statusForm, setStatusForm] = useState<'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO' | 'DESTINADO'>('EMITIDO');

  async function carregarDados() {
    try {
      setLoading(true);
      const token = localStorage.getItem('@AmazonEco:token');
      
      const [responseManifestos, responseCompanies] = await Promise.all([
        api.get('/manifestos', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/companies')
      ]);
      
      if (Array.isArray(responseManifestos.data)) {
        setManifestos(responseManifestos.data);
      }
      if (Array.isArray(responseCompanies.data)) {
        setCompanies(responseCompanies.data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error('Erro ao carregar dados do servidor.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCreateManifesto = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const toastId = toast.loading('Emitindo manifesto e registrando no IPAAM...');

    try {
      await api.post('/manifestos', {
        numeroMtr,
        empresaPim: empresaId,
        residuoDestinado: tipoResiduo,
        quantidadeToneladas: Number(quantidadeToneladas),
        status: statusForm,
      });

      setNumeroMtr('');
      setEmpresaId('');
      setTipoResiduo('');
      setQuantidadeToneladas('');
      setStatusForm('EMITIDO');
      setIsModalOpen(false);

      await carregarDados();
      toast.success('MTR emitido com sucesso!', { id: toastId });
    } catch (err: any) {
      console.error('Erro ao emitir manifesto:', err);
      const message = err.response?.data?.message || 'Erro ao salvar o manifesto.';
      toast.error(message, { id: toastId });
    } finally {
      setFormLoading(false);
    }
  };

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
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            + Emitir Novo MTR
          </button>
          <Link 
            href="/dashboard"
            className="bg-zinc-200 hover:bg-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Voltar ao Painel
          </Link>
        </div>
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
                      <select
                        value={item.status}
                        onChange={async (e) => {
                          const novoStatus = e.target.value as 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO' | 'DESTINADO';
                          const toastId = toast.loading('Atualizando status do manifesto...');
                          
                          try {
                            const token = localStorage.getItem('@AmazonEco:token');
                            await api.patch(
                              `/manifestos/${item.id}/status`, 
                              { status: novoStatus }, 
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            
                            setManifestos((prev) =>
                              prev.map((m) => (m.id === item.id ? { ...m, status: novoStatus } : m))
                            );
                            
                            toast.success('Status do MTR atualizado!', { id: toastId });
                          } catch (error) {
                            console.error('Erro ao atualizar status:', error);
                            toast.error('Erro ao mudar o status da carga.', { id: toastId });
                          }
                        }}
                        className={`px-2.5 py-1 text-xs font-medium rounded-full border outline-none cursor-pointer bg-transparent transition-colors ${
                          item.status === 'RECEBIDO' || item.status === 'DESTINADO'
                            ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-950/20 dark:border-green-900/50 dark:text-green-400' 
                            : item.status === 'EM_TRANSITO'
                            ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-400'
                            : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-400'
                        }`}
                      >
                        <option value="EMITIDO" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Emitido</option>
                        <option value="EM_TRANSITO" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Em Trânsito</option>
                        <option value="RECEBIDO" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Recebido</option>
                        <option value="DESTINADO" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Destinado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL PARA EMISSÃO DE MTR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Emitir Novo Manifesto (MTR)</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Insira as informações ambientais regulamentadas pelo IPAAM.</p>
            </div>

            <form onSubmit={handleCreateManifesto} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Número do MTR</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: MTR-2026-88419"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-transparent focus:ring-1 focus:ring-green-500 outline-none"
                  value={numeroMtr}
                  onChange={(e) => setNumeroMtr(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  Empresa Geradora (PIM)
                </label>
                <select
                  required
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-white dark:bg-zinc-800 focus:ring-1 focus:ring-green-500 outline-none text-zinc-900 dark:text-zinc-100"
                  value={empresaId}
                  onChange={(e) => setEmpresaId(e.target.value)}
                >
                  <option value="">Selecione uma empresa cadastrada...</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Resíduo Destinado</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Baterias de Lítio e Circuitos"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-transparent focus:ring-1 focus:ring-green-500 outline-none"
                  value={tipoResiduo}
                  onChange={(e) => setTipoResiduo(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Qtd. (Toneladas)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    placeholder="Ex: 1.25"
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-transparent focus:ring-1 focus:ring-green-500 outline-none"
                    value={quantidadeToneladas}
                    onChange={(e) => setQuantidadeToneladas(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Status Inicial</label>
                  <select 
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-white dark:bg-zinc-800 focus:ring-1 focus:ring-green-500 outline-none"
                    value={statusForm}
                    onChange={(e) => setStatusForm(e.target.value as any)}
                  >
                    <option value="EMITIDO">Emitido</option>
                    <option value="EM_TRANSITO">Em Trânsito</option>
                    <option value="RECEBIDO">Recebido</option>
                    <option value="DESTINADO">Destinado</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:bg-green-800 shadow-sm"
                >
                  {formLoading ? 'Emitindo...' : 'Emitir MTR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}