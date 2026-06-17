'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../services/api';
import { 
  LayoutDashboard,
  FileText,
  Building2,
  Settings,
  Bell,
  LogOut,
  Search,
  Plus,
  ArrowLeft,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Globe
} from 'lucide-react';

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
    <div className="flex min-h-screen bg-[#07080d] text-zinc-100 font-sans antialiased relative selection:bg-emerald-500/30">
      
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/[0.02] rounded-full blur-[130px] pointer-events-none" />

      <aside className="w-64 bg-[#0b0c10] text-zinc-400 flex flex-col justify-between p-6 border-r border-zinc-900/80 shrink-0 hidden lg:flex relative z-10">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-md shadow-lg shadow-emerald-500/20">
              AÆ
            </div>
            <div>
              <span className="text-white font-black tracking-tight text-sm block">AMAZON ECO</span>
              <span className="text-[9px] font-bold text-emerald-400 tracking-widest block uppercase font-mono">PIM MONITOR</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">Navegação</span>
              <Link href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group border border-transparent hover:border-zinc-800/40">
                <LayoutDashboard className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                Visão Geral
              </Link>
              <Link href="/dashboard/manifestos" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-900 text-emerald-400 font-bold text-xs border border-zinc-800 shadow-inner transition-all">
                <FileText className="w-4 h-4" />
                Manifestos MTR
              </Link>
              <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group border border-transparent hover:border-zinc-800/40">
                <Building2 className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                Empresas do PIM
              </Link>
            </div>

            <div className="space-y-1 pt-4 border-t border-zinc-900/50">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">Segurança</span>
              <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group">
                <Bell className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                Notificações
              </Link>
              <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group">
                <Settings className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                Configurações
              </Link>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/30 hover:bg-zinc-900 text-zinc-500 hover:text-rose-400 text-xs font-bold border border-zinc-900 transition-all text-left">
          <LogOut className="w-4 h-4" />
          Sair do Painel
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto w-full max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">
              <Link href="/dashboard" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Console
              </Link>
              <ChevronRight className="w-3 h-3 text-zinc-800" />
              <span className="text-zinc-400">Manifestos</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">Controle de Manifestos (MTR)</h1>
            <p className="text-xs text-zinc-500">Listagem geral e acompanhamento de cargas regulamentadas pelo IPAAM.</p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button 
              onClick={fetchManifestos}
              className="p-2.5 rounded-xl bg-[#12141c] hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200 border border-zinc-800/80 transition-all"
              title="Sincronizar base"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
            
            <Link 
              href="/dashboard/manifestos/novo" 
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/10 transition-all w-full sm:w-auto group"
            >
              <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
              Emitir Novo MTR
            </Link>
          </div>
        </div>

        <div className="bg-[#12141c] p-4 rounded-2xl border border-zinc-800/80 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full lg:w-96 group">
            <Search className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text"
              placeholder="Buscar por número MTR ou empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#07080d] text-xs text-zinc-200 pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800/80 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/10 transition-all placeholder-zinc-600 font-medium"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#07080d] p-1 rounded-xl border border-zinc-800/60 w-full lg:w-auto overflow-x-auto scrollbar-none">
            {([
              { id: 'ALL', label: 'Todos' },
              { id: 'EMITIDO', label: 'Emitidos' },
              { id: 'EM_TRANSITO', label: 'Em Trânsito' },
              { id: 'RECEBIDO', label: 'Recebidos' },
              { id: 'DESTINADO', label: 'Destinados' }
            ] as const).map((statusType) => (
              <button
                key={statusType.id}
                onClick={() => setFilter(statusType.id)}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono transition-all whitespace-nowrap ${
                  filter === statusType.id 
                    ? 'bg-zinc-900 text-emerald-400 border border-zinc-800/80 shadow-inner' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {statusType.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#12141c] rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-zinc-500 text-xs font-mono flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
              Carregando manifesto de dados ativos...
            </div>
          ) : manifestosFiltrados.length === 0 ? (
            <div className="p-20 text-center text-zinc-600 text-xs font-medium">
              Nenhum registro de manifesto encontrado para os critérios informados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/40 border-b border-zinc-900 text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                    <th className="p-4">Identificador MTR</th>
                    <th className="p-4">Empresa (PIM)</th>
                    <th className="p-4">Resíduo Destinado</th>
                    <th className="p-4 text-right">Massa Líquida</th>
                    <th className="p-4 text-center">Status Operacional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-xs text-zinc-400 font-medium">
                  {manifestosFiltrados.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-900/30 transition-colors group">
                      <td className="p-4 font-mono text-emerald-400 font-bold tracking-tight group-hover:text-emerald-300">
                        {item.numeroMtr}
                      </td>
                      <td className="p-4 font-semibold text-zinc-200">
                        {item.empresa}
                      </td>
                      <td className="p-4 text-zinc-500">
                        {item.tipoResiduo}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-zinc-100">
                        {item.quantidade.toFixed(2)} t
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-[9px] font-bold rounded-md border ${
                          item.status === 'RECEBIDO' || item.status === 'DESTINADO'
                            ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' 
                            : item.status === 'EM_TRANSITO'
                            ? 'bg-blue-500/5 text-blue-400 border-blue-500/10'
                            : 'bg-amber-500/5 text-amber-400 border-amber-500/10'
                        }`}>
                          <span className={`w-1 h-1 rounded-full mr-1.5 ${
                            item.status === 'RECEBIDO' || item.status === 'DESTINADO' ? 'bg-emerald-500' : item.status === 'EM_TRANSITO' ? 'bg-blue-500' : 'bg-amber-500'
                          }`} />
                          {item.status === 'RECEBIDO' || item.status === 'DESTINADO' ? 'Recebido' : item.status === 'EM_TRANSITO' ? 'Em Trânsito' : 'Emitido'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="bg-[#0b0c10]/40 p-4 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <span>Resultados: {manifestosFiltrados.length} de {manifestos.length} indexados</span>
            <span className="flex items-center gap-1 text-emerald-500/80"><ShieldCheck className="w-3.5 h-3.5" /> SECURE_LEDGER</span>
          </div>
        </div>

      </main>
    </div>
  );
}