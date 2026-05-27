'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

interface Company {
  id: string;
  name: string;
  cnpj: string;
  type: string;
  address: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'ALL' | 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO'>('ALL');
  const [manifestos, setManifestos] = useState<Manifesto[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [numeroMtr, setNumeroMtr] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [tipoResiduo, setTipoResiduo] = useState('');
  const [quantidadeToneladas, setQuantidadeToneladas] = useState('');
  const [statusForm, setStatusForm] = useState<'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO'>('EMITIDO');

  async function carregarDados() {
    try {
      setLoading(true);
      const token = localStorage.getItem('@AmazonEco:token');
      
      const [responseManifestos, responseCompanies] = await Promise.all([
        api.get('/manifestos', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/companies')
      ]);

      setManifestos(responseManifestos.data);
      
      if (Array.isArray(responseCompanies.data)) {
        setCompanies(responseCompanies.data); 
      }
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('@AmazonEco:token');
    router.push('/login');
  };

  const handleCreateManifesto = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      const quantidadeKg = Number(quantidadeToneladas) * 1000;

      await api.post('/manifestos', {
        numeroMtr,
        empresaPim: empresa,
        residuoDestinado: tipoResiduo,
        quantidadeToneladas: quantidadeKg, 
        status: statusForm,
      });

      setNumeroMtr('');
      setEmpresa('');
      setTipoResiduo('');
      setQuantidadeToneladas('');
      setStatusForm('EMITIDO');
      setIsModalOpen(false);

      await carregarDados();
    } catch (err: any) {
      console.error('Erro ao emitir manifesto:', err);
      setFormError(err.response?.data?.message || 'Erro ao salvar o manifesto. Verifique as informações.');
    } finally {
      setFormLoading(false);
    }
  };

  const manifestosFiltrados = manifestos.filter((m) => {
    if (filter === 'ALL') return true;
    return m.status === filter;
  });

  const totalGerenciadoKg = manifestos.reduce((acc, m) => acc + m.quantidade, 0);
  const totalGerenciadoToneladas = totalGerenciadoKg / 1000; 
  const pendentesColeta = manifestos.filter((m) => m.status === 'EMITIDO' || m.status === 'EM_TRANSITO').length;

  const empresasRecentes = companies.slice(0, 4);

  if (loading && manifestos.length === 0) {
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
            <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 font-medium text-sm">
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50 text-sm">
              <span>Manifestos (MTR)</span>
            </Link>
            <Link href="/dashboard/companies" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50 text-sm">
              <span>Clientes / PIM</span>
            </Link>
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors"
            >
              + Emitir Novo MTR
            </button>
            <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
              ● Licença IPAAM Ativa
            </div>
          </div>
        </header>

        {/* Cards de Métricas */}
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
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Empresas no PIM</p>
              <p className="text-2xl font-bold mt-2 text-zinc-900 dark:text-zinc-100">{companies.length}</p>
            </div>
            <div className="mt-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
              <Link href="/dashboard/companies" className="text-xs font-medium text-green-600 dark:text-green-500 hover:underline inline-flex items-center">
                Gerenciar clientes →
              </Link>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna da Esquerda */}
          <section className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
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
                      <th className="p-4 text-right">Qtd. (t)</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {manifestosFiltrados.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="p-4 font-mono text-xs text-green-600 dark:text-green-400 font-semibold">{item.numeroMtr}</td>
                        <td className="p-4 font-medium max-w-[140px] truncate">{item.empresa}</td>
                        <td className="p-4 text-zinc-600 dark:text-zinc-400 max-w-[120px] truncate">{item.tipoResiduo}</td>
                        <td className="p-4 text-right font-mono font-medium">{(item.quantidade / 1000).toFixed(2)} t</td>
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
            </div>
          </section>

          {/* Coluna da Direita */}
          <section className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <h3 className="font-semibold text-lg">Clientes Recentes</h3>
                <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded-md font-medium">PIM</span>
              </div>

              {empresasRecentes.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">Nenhum cliente cadastrado.</p>
              ) : (
                <div className="space-y-3">
                  {empresasRecentes.map((company) => (
                    <div key={company.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-800/10 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-sm font-semibold truncate text-zinc-800 dark:text-zinc-200">{company.name}</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">{company.cnpj}</p>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full border shrink-0 ${
                        company.type === 'GENERATOR' ? 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400' :
                        company.type === 'TRANSPORTER' ? 'bg-purple-50 border-purple-100 text-purple-700 dark:bg-purple-950/30 dark:border-purple-900/50 dark:text-purple-400' :
                        'bg-orange-50 border-orange-100 text-orange-700 dark:bg-orange-950/30 dark:border-orange-900/50 dark:text-orange-400'
                      }`}>
                        {company.type === 'GENERATOR' ? 'Geradora' : company.type === 'TRANSPORTER' ? 'Transp.' : 'Destin.'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <Link href="/dashboard/companies" className="text-xs font-semibold text-green-600 dark:text-green-500 hover:underline block text-center w-full">
                Ver Todos os Clientes →
              </Link>
            </div>
          </section>

        </div>
      </main>

      {/* Modal para Emissão DE MTR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Emitir Novo Manifesto (MTR)</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Insira as informações ambientais regulamentadas pelo IPAAM.</p>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateManifesto} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Número do MTR</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: MTR-2026-88419"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-transparent focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
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
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-white dark:bg-zinc-800 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none text-zinc-900 dark:text-zinc-100"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                >
                  <option value="" className="text-zinc-500">Selecione uma empresa cadastrada...</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.name} className="text-zinc-900 dark:text-zinc-100">
                      {company.name} ({company.cnpj})
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
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-transparent focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
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
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-transparent focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                    value={quantidadeToneladas}
                    onChange={(e) => setQuantidadeToneladas(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Status Inicial</label>
                  <select 
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-white dark:bg-zinc-800 focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                    value={statusForm}
                    onChange={(e) => setStatusForm(e.target.value as any)}
                  >
                    <option value="EMITIDO">Emitido</option>
                    <option value="EM_TRANSITO">Em Trânsito</option>
                    <option value="RECEBIDO">Recebido</option>
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
                  {formLoading ? 'Salvando...' : 'Emitir MTR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}