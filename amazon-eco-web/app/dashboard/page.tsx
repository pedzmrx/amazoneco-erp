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
  ShieldCheck,
  Zap,
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
    <div className="flex min-h-screen bg-[#07080d] text-zinc-100 font-sans antialiased relative selection:bg-emerald-500/30">
      
      {/* Luzes de Fundo (Glow Estilo Linear/Supabase) */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* 1. SIDEBAR LATERAL FIXA - BLACK MATRIX */}
      <aside className="w-64 bg-[#0b0c10] text-zinc-400 flex flex-col justify-between p-6 border-r border-zinc-900/80 shrink-0 hidden lg:flex relative z-10">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-md shadow-lg shadow-emerald-500/20">
              Æ
            </div>
            <div>
              <span className="text-white font-black tracking-tight text-sm block">AMAZON ECO</span>
              <span className="text-[9px] font-bold text-emerald-400 tracking-widest block uppercase font-mono">PIM MONITOR</span>
            </div>
          </div>

          {/* Menus Otimizados */}
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">Navegação</span>
              <Link href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-900 text-emerald-400 font-bold text-xs border border-zinc-800 shadow-inner transition-all">
                <LayoutDashboard className="w-4 h-4" />
                Visão Geral
              </Link>
              <Link href="/dashboard/manifestos" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group border border-transparent hover:border-zinc-800/40">
                <FileText className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
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

      {/* 2. CANVAS CENTRAL DE CONTEÚDO */}
      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto w-full max-w-7xl mx-auto relative z-10">
        
        {/* Top Header Simplificado e Integrado */}
        <div className="flex justify-between items-center border-b border-zinc-900 pb-5">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/20" /> Console de Monitoramento
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">Métricas de conformidade ambiental integradas.</p>
          </div>
          <div className="flex items-center gap-2 bg-[#11131c] border border-zinc-800 px-3 py-1.5 rounded-xl text-[10px] font-mono text-zinc-400 shadow-inner">
            <Globe className="w-3 h-3 text-emerald-400 animate-spin-[spin_3s_linear_infinite]" /> CLOUD_CONNECTED
          </div>
        </div>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-44 bg-zinc-900 rounded-2xl" />
            <div className="h-40 bg-zinc-900 rounded-2xl" />
          </div>
        ) : (
          <>
            {/* COMPOSIÇÃO BENTO GRID HIGH-TECH (Inspirado em image_fed7be.png) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Card Principal: Volume Acumulado */}
              <div className="lg:col-span-2 bg-gradient-to-br from-[#12141c] to-[#0e1017] rounded-2xl p-6 border border-zinc-800/80 shadow-2xl flex flex-col justify-between relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/[0.02] rounded-full blur-2xl" />
                
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      Massa Líquida
                    </span>
                    <h2 className="text-xs font-bold text-zinc-500 pt-3 uppercase tracking-wider">Volume Total Destinado no PIM</h2>
                  </div>
                  <Link 
                    href="/dashboard/manifestos"
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 transition-all shadow-md"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="my-5">
                  <div className="text-5xl font-black tracking-tight text-white font-mono flex items-baseline gap-2">
                    {metricas.pesoTotal.toFixed(2)}
                    <span className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Tons</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-900/60 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-zinc-600" /> Sincronismo ativo</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                    <TrendingUp className="w-3 h-3" /> +14.2%
                  </span>
                </div>
              </div>

              {/* Mini Cards Verticais de Alta Densidade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                
                {/* Mini Card 1 */}
                <div className="bg-[#12141c] p-5 rounded-2xl border border-zinc-800/80 shadow-md flex items-center justify-between hover:border-zinc-700 transition-all">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-mono">Manifestos MTR</span>
                    <span className="text-3xl font-black text-white font-mono">{metricas.total}</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 text-zinc-500 flex items-center justify-center border border-zinc-800">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>

                {/* Mini Card 2 */}
                <div className="bg-[#12141c] p-5 rounded-2xl border border-zinc-800/80 shadow-md flex items-center justify-between border-l-2 border-l-blue-500 hover:border-zinc-700 transition-all">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-mono">Cargas em Trânsito</span>
                    <span className="text-3xl font-black text-blue-400 font-mono">{metricas.emTransito}</span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 text-blue-500 flex items-center justify-center border border-zinc-800">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>

              </div>
            </div>

            {/* ESTEIRA LOGÍSTICA COMPACTA DE MTR (Inspirada em image_fed499.png) */}
            <div className="bg-[#12141c] p-6 rounded-2xl border border-zinc-800/80 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">Status da Esteira Logística</h3>
                </div>
                <span className="text-[9px] font-mono bg-zinc-900 px-2.5 py-1 rounded-md text-zinc-500 border border-zinc-800 font-bold">ANALYTICS_VIEW</span>
              </div>

              <div className="space-y-4">
                {/* Linha de Distribuição Estilizada */}
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden flex p-0.5 border border-zinc-800">
                  <div style={{ width: `${pctEmitido}%` }} className="bg-amber-500 h-full rounded-l transition-all shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                  <div style={{ width: `${pctTransito}%` }} className="bg-blue-500 h-full transition-all shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                  <div style={{ width: `${pctConcluido}%` }} className="bg-emerald-500 h-full rounded-r transition-all shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                </div>

                {/* Métricas Individuais com Estilo Flat Premium */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/60 flex items-center justify-between group">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">Aguardando Coleta</span>
                      <span className="text-lg font-bold text-white font-mono">{metricas.emitido} <span className="text-xs font-normal text-zinc-600">({pctEmitido}%)</span></span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
                  </div>

                  <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/60 flex items-center justify-between border-t border-t-blue-500">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">Em Transporte</span>
                      <span className="text-lg font-bold text-white font-mono">{metricas.emTransito} <span className="text-xs font-normal text-zinc-600">({pctTransito}%)</span></span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
                  </div>

                  <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/60 flex items-center justify-between border-t border-t-emerald-500">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">Destinação Final</span>
                      <span className="text-lg font-bold text-white font-mono">{metricas.recebido + metricas.destinado} <span className="text-xs font-normal text-zinc-600">({pctConcluido}%)</span></span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                  </div>

                </div>
              </div>
            </div>

            {/* FEED DE LOGS CORPORATIVO (Inspirado nas linhas pretas limpas de image_fed81c.png) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-600" />
                  <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Registros de Auditoria Recente</h2>
                </div>
                <Link href="/dashboard/manifestos" className="text-xs text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-0.5 group">
                  Abrir Console Operacional
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="bg-[#12141c] rounded-2xl border border-zinc-800/80 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-900/50 border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                        <th className="p-4">MTR_ID</th>
                        <th className="p-4">Indústria Emissora</th>
                        <th className="p-4">Material de Descarte</th>
                        <th className="p-4 text-right">Volume</th>
                        <th className="p-4 text-center">Status Interno</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-xs text-zinc-400 font-medium">
                      {manifestosRecentes.map((item) => (
                        <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="p-4 font-mono text-emerald-400 font-bold tracking-tight">{item.numeroMtr}</td>
                          <td className="p-4 font-semibold text-zinc-200">{item.empresa}</td>
                          <td className="p-4 text-zinc-500">{item.tipoResiduo}</td>
                          <td className="p-4 text-right font-mono font-bold text-zinc-100">{item.quantidade.toFixed(2)} t</td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold rounded-md border ${
                              item.status === 'RECEBIDO' || item.status === 'DESTINADO'
                                ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' 
                                : item.status === 'EM_TRANSITO'
                                ? 'bg-blue-500/5 text-blue-400 border-blue-500/10'
                                : 'bg-amber-500/5 text-amber-400 border-amber-500/10'
                            }`}>
                              {item.status === 'RECEBIDO' || item.status === 'DESTINADO' ? 'Concluído' : item.status === 'EM_TRANSITO' ? 'Trânsito' : 'Emitido'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}