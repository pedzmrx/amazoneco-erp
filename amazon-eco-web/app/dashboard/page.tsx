'use client';

import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'sonner';
import { 
  FileText, 
  Scale, 
  Truck, 
  CheckCircle2, 
  Layers, 
  ChevronRight, 
  Download, 
  TrendingUp, 
  ArrowUpRight,
  Navigation,
  Anchor,
  Compass
} from 'lucide-react';
import Link from 'next/link';

import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

interface StatsData {
  totalMtrs: number;
  tonelagemTotal: number;
  emitidos: number;
  emTransito: number;
  concluidos: number;
  taxaConformidade: number;
  porResiduo: { tipoResiduo: string; quantidade: number }[];
}

interface Manifesto {
  id: string;
  numeroMtr: string;
  empresa: string;
  tipoResiduo: string;
  quantidade: number;
  status: 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO' | 'DESTINADO';
  createdAt: string;
}

export default function DashboardOverviewPage() {
  const [manifestos, setManifestos] = useState<Manifesto[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodoAtivo, setPeriodoAtivo] = useState<'7D' | '30D' | 'ANO' | 'TOTAL'>('30D');

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  async function carregarDadosDashboard() {
    try {
      setLoading(true);
      const token = localStorage.getItem('@AmazonEco:token');
      const headers = { Authorization: `Bearer ${token}` };

      const [responseStats, responseRecent] = await Promise.all([
        api.get('/manifestos/stats', { headers }).catch(() => null),
        api.get('/manifestos', { headers })
      ]);

      if (responseStats?.data) {
        setStats(responseStats.data);
      }

      if (Array.isArray(responseRecent?.data)) {
        setManifestos(responseRecent.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Não foi possível atualizar os indicadores analíticos.');
    } finally {
      setLoading(false);
    }
  }

  function exportarParaCSV() {
    if (manifestos.length === 0) {
      toast.warning('Não há dados disponíveis para exportação.');
      return;
    }

    const cabecalho = ['ID MTR', 'Empresa Geradora', 'Residuo Destinado', 'Massa (Tons)', 'Status', 'Data Emissao'];
    
    const linhas = manifestos.map(m => [
      `"${m.numeroMtr}"`,
      `"${m.empresa}"`,
      `"${m.tipoResiduo}"`,
      m.quantidade.toFixed(2),
      m.status,
      `"${new Date(m.createdAt).toLocaleDateString('pt-BR')}"`
    ]);

    const conteudoCsv = [cabecalho.join(','), ...linhas.map(row => row.join(','))].join('\n');
    
    const blob = new Blob(['\uFEFF' + conteudoCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `relatorio_manifestos_pim_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Relatório CSV exportado com sucesso!');
  }

  const totalMtrs = stats?.totalMtrs ?? manifestos.length;
  const tonelagemTotal = stats?.tonelagemTotal ?? manifestos.reduce((acc, curr) => acc + curr.quantidade, 0);
  const emitidosGrade = stats?.emitidos ?? manifestos.filter(m => m.status === 'EMITIDO').length;
  const emTransito = stats?.emTransito ?? manifestos.filter(m => m.status === 'EM_TRANSITO').length;
  const concluidos = stats?.concluidos ?? manifestos.filter(m => m.status === 'RECEBIDO' || m.status === 'DESTINADO').length;
  const taxaConformidade = stats?.taxaConformidade ?? (totalMtrs > 0 ? ((concluidos / totalMtrs) * 100).toFixed(0) : '0');

  const pctEmitido = totalMtrs > 0 ? ((emitidosGrade / totalMtrs) * 100).toFixed(0) : '0';
  const pctTransito = totalMtrs > 0 ? ((emTransito / totalMtrs) * 100).toFixed(0) : '0';
  const pctConcluido = totalMtrs > 0 ? ((concluidos / totalMtrs) * 100).toFixed(0) : '0';

  const dadosRoscaStatus = [
    { name: 'Coleta Pendente', value: emitidosGrade, color: '#f59e0b' },
    { name: 'Em Transporte', value: emTransito, color: '#3b82f6' },
    { name: 'Destinado', value: concluidos, color: '#10b981' }
  ].filter(item => item.value > 0);

  const dadosGraficoBarras = stats?.porResiduo 
    ? stats.porResiduo.map(item => ({
        name: item.tipoResiduo.length > 14 ? item.tipoResiduo.substring(0, 14) + '...' : item.tipoResiduo,
        toneladas: item.quantidade
      }))
    : Object.entries(manifestos.reduce((acc: Record<string, number>, curr) => {
        acc[curr.tipoResiduo] = (acc[curr.tipoResiduo] || 0) + curr.quantidade;
        return acc;
      }, {}))
      .map(([name, value]) => ({
        name: name.length > 14 ? name.substring(0, 14) + '...' : name,
        toneladas: Number(value.toFixed(2))
      }))
      .slice(0, 4);

  if (loading) {
    return (
      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-5">
          <div className="space-y-2">
            <div className="h-3 w-28 bg-zinc-900 rounded-md animate-pulse" />
            <div className="h-7 w-64 bg-zinc-900 rounded-lg animate-pulse" />
          </div>
          <div className="h-9 w-32 bg-zinc-900 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-64 bg-[#111218] rounded-2xl border border-zinc-900 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            <div className="h-16 bg-[#111218] rounded-xl border border-zinc-900 animate-pulse" />
            <div className="h-16 bg-[#111218] rounded-xl border border-zinc-900 animate-pulse" />
            <div className="h-16 bg-[#111218] rounded-xl border border-zinc-900 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 h-72 bg-[#111218] rounded-2xl border border-zinc-900 animate-pulse" />
          <div className="lg:col-span-7 h-72 bg-[#111218] rounded-2xl border border-zinc-900 animate-pulse" />
        </div>

        <div className="h-64 bg-[#111218] rounded-2xl border border-zinc-900 animate-pulse" />
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto relative z-10 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Monitoramento Ambiental • Polo Industrial de Manaus</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-[#090b10] p-1 rounded-xl border border-zinc-800/80">
            {[
              { id: '7D', label: '7D' },
              { id: '30D', label: '30D' },
              { id: 'ANO', label: '2026' },
              { id: 'TOTAL', label: 'Total' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriodoAtivo(p.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  periodoAtivo === p.id 
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button 
            onClick={exportarParaCSV}
            className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-800 shadow-sm transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#0c0e14] rounded-2xl border border-zinc-800/80 shadow-2xl relative overflow-hidden flex flex-col justify-between p-6 min-h-[260px]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="absolute inset-0 pointer-events-none opacity-85 overflow-hidden">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 800 320" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="riverGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
                </linearGradient>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <line x1="160" y1="0" x2="160" y2="320" stroke="#27272a" strokeWidth="0.5" strokeDasharray="4 4" strokeOpacity="0.4" />
              <line x1="380" y1="0" x2="380" y2="320" stroke="#27272a" strokeWidth="0.5" strokeDasharray="4 4" strokeOpacity="0.4" />
              <line x1="600" y1="0" x2="600" y2="320" stroke="#27272a" strokeWidth="0.5" strokeDasharray="4 4" strokeOpacity="0.4" />
              <line x1="0" y1="160" x2="800" y2="160" stroke="#27272a" strokeWidth="0.5" strokeDasharray="4 4" strokeOpacity="0.4" />

              <text x="165" y="25" fill="#52525b" fontSize="8" fontFamily="monospace">110°W</text>
              <text x="385" y="25" fill="#52525b" fontSize="8" fontFamily="monospace">53°O</text>
              <text x="605" y="25" fill="#52525b" fontSize="8" fontFamily="monospace">36°O</text>
              <text x="20" y="155" fill="#52525b" fontSize="8" fontFamily="monospace">11°00&apos;&apos;</text>
              <text x="740" y="155" fill="#52525b" fontSize="8" fontFamily="monospace">25°30&apos;&apos;</text>

              <path d="M 120 70 Q 180 120 250 145" stroke="#10b981" strokeWidth="1" strokeOpacity="0.25" fill="none" />
              <path d="M 310 80 Q 360 130 420 160" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" fill="none" />
              <path d="M 490 240 Q 540 190 580 170" stroke="#10b981" strokeWidth="1" strokeOpacity="0.25" fill="none" />
              <path d="M 660 120 Q 700 140 760 150" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" fill="none" />

              <path 
                d="M 50 140 Q 150 130 220 160 T 380 200 T 540 150 T 680 130 T 780 160" 
                stroke="url(#riverGlow)" 
                strokeWidth="7" 
                strokeLinecap="round" 
                fill="none" 
                filter="url(#glowEffect)"
              />
              <path 
                d="M 50 140 Q 150 130 220 160 T 380 200 T 540 150 T 680 130 T 780 160" 
                stroke="#a7f3d0" 
                strokeWidth="2" 
                strokeLinecap="round" 
                fill="none" 
              />

              <text x="310" y="145" fill="#34d399" fontSize="10" fontWeight="bold" opacity="0.6" letterSpacing="2">
                Rio Negro • Eixo Fluvial PIM
              </text>
            </svg>
          </div>

          <div className="absolute inset-0 pointer-events-auto">
            <div className="absolute top-[48%] left-[22%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 group cursor-pointer">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-[#07090e]"></span>
              </span>
              <div className="bg-[#090b10]/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-emerald-500/30 text-[10px] font-semibold text-emerald-300 shadow-lg flex items-center gap-1">
                <Anchor className="w-2.5 h-2.5 text-emerald-400" />
                <span>Samsung PIM</span>
              </div>
            </div>

            <div className="absolute top-[60%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 group cursor-pointer">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500 border border-[#07090e]"></span>
              </span>
              <div className="bg-[#090b10]/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-teal-500/30 text-[10px] font-semibold text-teal-300 shadow-lg flex items-center gap-1">
                <Navigation className="w-2.5 h-2.5 text-teal-400" />
                <span>Honda</span>
              </div>
            </div>

            <div className="absolute top-[45%] left-[68%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 group cursor-pointer">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-[#07090e]"></span>
              </span>
              <div className="bg-[#090b10]/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-emerald-500/30 text-[10px] font-semibold text-emerald-300 shadow-lg flex items-center gap-1">
                <Anchor className="w-2.5 h-2.5 text-emerald-400" />
                <span>Yamaha</span>
              </div>
            </div>

            <div className="absolute top-[38%] left-[86%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 group cursor-pointer">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border border-[#07090e]"></span>
              </span>
              <div className="bg-[#090b10]/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-cyan-500/30 text-[10px] font-semibold text-cyan-300 shadow-lg flex items-center gap-1">
                <Navigation className="w-2.5 h-2.5 text-cyan-400" />
                <span>Panasonic</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-400" /> Balanço de Resíduos do Polo
              </span>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-4xl lg:text-5xl font-black text-white font-mono tracking-tight drop-shadow-md">
                  {Number(tonelagemTotal).toFixed(2)}
                </span>
                <span className="text-sm font-bold text-zinc-400 uppercase font-mono">t</span>
                <div className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold font-mono">
                  <TrendingUp className="w-3 h-3" />
                  <span>+14.8%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-1.5 pt-12">
            <div className="flex justify-between text-[10px] font-mono text-zinc-400 font-bold">
              <span>Eficiência Operacional {taxaConformidade}%</span>
              <span className="text-emerald-400">{concluidos} de {totalMtrs} manifestos concluídos</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-900/90 overflow-hidden border border-zinc-800/90">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${Math.min(Number(taxaConformidade), 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          <div className="bg-[#0c0e14] p-4 rounded-xl border border-zinc-800/80 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono block">Manifestos Emitidos</span>
              <span className="text-2xl font-black text-white font-mono mt-0.5 block tracking-tight">{totalMtrs}</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center">
              <FileText className="w-4 h-4 text-zinc-300" />
            </div>
          </div>

          <div className="bg-[#0c0e14] p-4 rounded-xl border border-zinc-800/80 border-l-2 border-l-blue-500 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono block">Fluxo em Trânsito</span>
              <span className="text-2xl font-black text-blue-400 font-mono mt-0.5 block tracking-tight">{emTransito}</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-[#0c0e14] p-4 rounded-xl border border-zinc-800/80 border-l-2 border-l-emerald-500 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono block">Conformidade Legal</span>
              <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 block tracking-tight">{taxaConformidade}%</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-[#0c0e14] p-5 rounded-2xl border border-zinc-800/80 shadow-2xl flex flex-col justify-between min-h-[280px]">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Status da Esteira Logística</span>
            <span className="text-[9px] font-mono text-zinc-500 font-semibold">{totalMtrs} Guias</span>
          </div>

          <div className="flex items-center justify-between gap-4 h-full py-4">
            <div className="w-32 h-32 relative flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dadosRoscaStatus} cx="50%" cy="50%" innerRadius={38} outerRadius={50} paddingAngle={4} dataKey="value">
                    {dadosRoscaStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-white font-mono">{totalMtrs}</span>
                <span className="text-[8px] font-bold text-zinc-500 uppercase font-mono">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 text-[11px] font-medium text-zinc-400">
              <div className="flex items-center justify-between bg-[#07080d] px-3 py-2 rounded-xl border border-zinc-900">
                <span className="flex items-center gap-2 text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Emitidos
                </span>
                <span className="font-mono text-zinc-200 font-bold">{pctEmitido}%</span>
              </div>

              <div className="flex items-center justify-between bg-[#07080d] px-3 py-2 rounded-xl border border-zinc-900">
                <span className="flex items-center gap-2 text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Em Trânsito
                </span>
                <span className="font-mono text-zinc-200 font-bold">{pctTransito}%</span>
              </div>

              <div className="flex items-center justify-between bg-[#07080d] px-3 py-2 rounded-xl border border-zinc-900">
                <span className="flex items-center gap-2 text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Destinados
                </span>
                <span className="font-mono text-zinc-200 font-bold">{pctConcluido}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#0c0e14] p-5 rounded-2xl border border-zinc-800/80 shadow-2xl flex flex-col justify-between min-h-[280px]">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Volumetria por Tipologia de Resíduo</span>
            <span className="text-[9px] font-mono text-zinc-500 font-semibold">Em Toneladas (t)</span>
          </div>

          <div className="w-full h-52 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGraficoBarras} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.25} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#27272a" strokeOpacity={0.4} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#ffffff', fillOpacity: 0.03 }}
                  contentStyle={{ backgroundColor: '#07080d', borderColor: '#27272a', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }} 
                  labelStyle={{ color: '#a1a1aa', fontSize: '11px', fontWeight: 'bold' }} 
                  itemStyle={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }} 
                />
                <Bar dataKey="toneladas" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Últimas Movimentações Auditadas</h2>
          </div>
          <Link href="/dashboard/manifestos" className="text-xs text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-0.5 group">
            Ver Todos <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="bg-[#0c0e14] rounded-2xl border border-zinc-800/80 shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/40 border-b border-zinc-800/80 text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                <th className="p-4">Identificador MTR</th>
                <th className="p-4">Indústria Geradora</th>
                <th className="p-4">Resíduo Declarado</th>
                <th className="p-4 text-right">Volume</th>
                <th className="p-4 text-center">Status Operacional</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60 text-xs text-zinc-400 font-medium">
              {manifestos.slice(0, 5).map((item) => (
                <tr key={item.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="p-4 font-mono text-emerald-400 font-bold">{item.numeroMtr}</td>
                  <td className="p-4 font-semibold text-zinc-200">{item.empresa}</td>
                  <td className="p-4 text-zinc-400">{item.tipoResiduo}</td>
                  <td className="p-4 text-right font-mono font-bold text-zinc-100">{item.quantidade.toFixed(2)} t</td>
                  <td className="p-4 text-center">
                    {item.status === 'EM_TRANSITO' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border bg-blue-500/10 text-blue-400 border-blue-500/20">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                        </span>
                        Em Trânsito
                      </span>
                    ) : item.status === 'EMITIDO' ? (
                      <span className="inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20">
                        Emitido
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        Concluído
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/dashboard/manifestos/${item.id}/imprimir`}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-800 inline-flex items-center justify-center transition-all"
                      title="Auditar Documento"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}