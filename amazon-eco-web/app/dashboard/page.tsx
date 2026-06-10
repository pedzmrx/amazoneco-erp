'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../services/api';
import { toast } from 'sonner';
import { 
  BarChart3, 
  Truck, 
  CheckCircle2, 
  Scale, 
  ArrowUpRight, 
  LayoutDashboard,
  FileText,
  Building2,
  Settings,
  Bell,
  LogOut,
  TrendingUp,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck
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

interface Metricas {
  total: number;
  emitido: number;
  emTransito: number;
  recebido: number;
  destinado: number;
  pesoTotal: number;
}

export default function DashboardOverviewPage() {
  const [manifestosRecentes, setManifestosRecentes] = useState<Manifesto[]>([]);
  const [metricas, setMetricas] = useState<Metricas>({
    total: 0,
    emitido: 0,
    emTransito: 0,
    recebido: 0,
    destinado: 0,
    pesoTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  async function carregarDadosDashboard() {
    try {
      setLoading(true);
      const token = localStorage.getItem('@AmazonEco:token');
      
      const [responseManifestos, responseMetricas] = await Promise.all([
        api.get('/manifestos', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/manifestos/metricas', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (Array.isArray(responseManifestos.data)) {
        setManifestosRecentes(responseManifestos.data.slice(0, 5));
      }
      if (responseMetricas.data) {
        setMetricas(responseMetricas.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao atualizar os indicadores do painel.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  const totalMtrs = metricas.total || 1;
  const pctEmitido = ((metricas.emitido / totalMtrs) * 100).toFixed(0);
  const pctTransito = ((metricas.emTransito / totalMtrs) * 100).toFixed(0);
  const pctConcluido = (((metricas.recebido + metricas.destinado) / totalMtrs) * 100).toFixed(0);

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans antialiased">
      
      {/* SIDEBAR LATERAL FIXA - MÁXIMO CONTRASTE (Inspirado em image_fed81c.png) */}
      <aside className="w-64 bg-[#0e0f11] text-zinc-400 flex flex-col justify-between p-6 border-r border-zinc-900 shrink-0 hidden lg:flex">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-md shadow-lg shadow-emerald-500/20">
              Æ
            </div>
            <div>
              <span className="text-white font-black tracking-tight text-sm block">AMAZON ECO</span>
              <span className="text-[9px] font-bold text-emerald-500/60 tracking-widest block uppercase font-mono">PIM MONITOR</span>
            </div>
          </div>

          {/* Menus */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2">Menu Principal</span>
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all">
                <LayoutDashboard className="w-4 h-4" />
                Visão Geral
              </Link>
              <Link href="/dashboard/manifestos" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:text-white hover:bg-zinc-900 text-xs font-semibold transition-all group">
                <FileText className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                Manifestos MTR
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 text-xs font-semibold transition-all group">
                <Building2 className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                Empresas do PIM
              </Link>
            </div>

            <div className="space-y-1.5 pt-4 border-t border-zinc-900">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2">Auditoria</span>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 text-xs font-semibold transition-all group">
                <Bell className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                Notificações
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 text-xs font-semibold transition-all group">
                <Settings className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                Configurações
              </Link>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 text-zinc-500 hover:text-rose-400 text-xs font-bold border border-zinc-900 transition-all text-left">
          <LogOut className="w-4 h-4" />
          Sair do Sistema
        </button>
      </aside>

      {/* CANVAS CENTRAL DE CONTEÚDO */}
      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto w-full max-w-7xl mx-auto">
        
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-56 bg-white dark:bg-zinc-900 rounded-3xl" />
            <div className="h-40 bg-white dark:bg-zinc-900 rounded-3xl" />
          </div>
        ) : (
          <>
            {/* COMPOSIÇÃO ASSIMÉTRICA: HERO BANNER + QUICK METRICS (Inspirado em image_fed4d5.png) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* O Hero Banner de Destaque Absoluto (Volume Total) */}
              <div className="lg:col-span-2 bg-gradient-to-br from-[#18191c] via-[#1c1d22] to-[#121315] rounded-3xl p-6 text-white border border-zinc-800 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                {/* Detalhe estético de fundo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider font-mono">
                      <ShieldCheck className="w-3 h-3" /> Monitoramento IPAAM Ativo
                    </div>
                    <h2 className="text-sm font-bold text-zinc-400 pt-3">Massa Total Movimentada no Polo</h2>
                  </div>
                  <Link 
                    href="/dashboard/manifestos"
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/50 transition-all shadow-md group-hover:scale-105"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="my-6 relative z-10">
                  <div className="text-5xl font-black tracking-tight flex items-baseline gap-2 font-sans">
                    {metricas.pesoTotal.toFixed(2)}
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent uppercase">Toneladas</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 relative z-10">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-zinc-500" /> Atualizado em tempo real</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +14.2% este mês
                  </span>
                </div>
              </div>

              {/* Coluna Lateral de Mini-Cards (Quebra a simetria de caixas iguais) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                
                {/* Card Manifestos Totais */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Manifestos Gerados</span>
                    <span className="text-3xl font-black text-zinc-950 dark:text-white font-mono">{metricas.total}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center border border-zinc-200/40 dark:border-zinc-700">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>

                {/* Card Rotas Ativas */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex items-center justify-between border-l-4 border-l-blue-500 hover:shadow-md transition-all">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Cargas em Trânsito</span>
                    <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">{metricas.emTransito}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-500 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>

              </div>
            </div>

            {/* SEÇÃO DA ESTEIRA LOGÍSTICA PREMIUM (Inspirado nas barras de image_fed499.png) */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Fluxo Analítico da Carga</h3>
                </div>
                <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md font-bold text-zinc-500">MTR Distribuição</span>
              </div>

              <div className="space-y-4">
                {/* Barra Segmentada de Alta Definição */}
                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden flex p-0.5 shadow-inner border border-zinc-200/30 dark:border-zinc-700/30">
                  <div style={{ width: `${pctEmitido}%` }} className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-l-md transition-all" />
                  <div style={{ width: `${pctTransito}%` }} className="bg-gradient-to-r from-blue-400 to-blue-500 h-full transition-all" />
                  <div style={{ width: `${pctConcluido}%` }} className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-r-md transition-all" />
                </div>

                {/* Grid das Métricas com Layout Moderno */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Aguardando Coleta</span>
                      <span className="text-xl font-black text-zinc-900 dark:text-white">{metricas.emitido} <span className="text-xs font-normal text-zinc-400">({pctEmitido}%)</span></span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  </div>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between border-t-2 border-t-blue-500">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Em Transporte</span>
                      <span className="text-xl font-black text-zinc-900 dark:text-white">{metricas.emTransito} <span className="text-xs font-normal text-zinc-400">({pctTransito}%)</span></span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  </div>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between border-t-2 border-t-emerald-500">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Destinação Final</span>
                      <span className="text-xl font-black text-zinc-900 dark:text-white">{metricas.recebido + metricas.destinado} <span className="text-xs font-normal text-zinc-400">({pctConcluido}%)</span></span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* TABELA - LOGS OPERACIONAIS DE ALTO PADRÃO (Inspirado nas linhas de image_fed81c.png) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-400" />
                  <h2 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Últimas Movimentações Registradas</h2>
                </div>
                <Link href="/dashboard/manifestos" className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5 group">
                  Ver histórico operacional complete
                  <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
                {manifestosRecentes.length === 0 ? (
                  <div className="p-8 text-center text-zinc-400 text-xs">Nenhum manifesto ativo.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50/60 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                          <th className="p-4">Identificador MTR</th>
                          <th className="p-4">Indústria Geradora</th>
                          <th className="p-4">Classe de Resíduo</th>
                          <th className="p-4 text-right">Massa</th>
                          <th className="p-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50 text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                        {manifestosRecentes.map((item) => (
                          <tr key={item.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/10 transition-colors">
                            <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold tracking-tight">{item.numeroMtr}</td>
                            <td className="p-4 font-semibold text-zinc-900 dark:text-white">{item.empresa}</td>
                            <td className="p-4 text-zinc-400 dark:text-zinc-500">{item.tipoResiduo}</td>
                            <td className="p-4 text-right font-mono font-bold text-zinc-900 dark:text-white">{item.quantidade.toFixed(2)} t</td>
                            <td className="p-4 text-center">
                              <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-xl border ${
                                item.status === 'RECEBIDO' || item.status === 'DESTINADO'
                                  ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400' 
                                  : item.status === 'EM_TRANSITO'
                                  ? 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400'
                                  : 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  item.status === 'RECEBIDO' || item.status === 'DESTINADO' ? 'bg-emerald-500' : item.status === 'EM_TRANSITO' ? 'bg-blue-500' : 'bg-amber-500'
                                }`} />
                                {item.status === 'RECEBIDO' || item.status === 'DESTINADO' ? 'Concluído' : item.status === 'EM_TRANSITO' ? 'Em Trânsito' : 'Emitido'}
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
          </>
        )}

      </main>
    </div>
  );
}