'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../services/api';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  LogOut, 
  RefreshCw,
  Loader2,
  Scale,
  Truck,
  Zap,
  Globe,
  CheckCircle2,
  Layers,
  ChevronRight,
  Bell,
  Settings
} from 'lucide-react';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

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
  const router = useRouter();
  const [manifestos, setManifestos] = useState<Manifesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [estaAutenticado, setEstaAutenticado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('@AmazonEco:token');
    if (!token) {
      router.push('/');
    } else {
      setEstaAutenticado(true);
      carregarDadosDashboard();
    }
  }, []);

  async function carregarDadosDashboard() {
    try {
      setLoading(true);
      const token = localStorage.getItem('@AmazonEco:token');
      const response = await api.get('/manifestos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setManifestos(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Não foi possível atualizar os indicadores analíticos.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('@AmazonEco:token');
    router.push('/');
  }

  if (!estaAutenticado) {
    return (
      <div className="min-h-screen bg-[#07080d] flex flex-col items-center justify-center gap-3 text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-xs font-mono font-bold tracking-widest uppercase animate-pulse">Verificando Credenciais...</span>
      </div>
    );
  }

  const totalMtrs = manifestos.length;
  const emitidosGrade = manifestos.filter(m => m.status === 'EMITIDO').length;
  const emTransito = manifestos.filter(m => m.status === 'EM_TRANSITO').length;
  const concluidos = manifestos.filter(m => m.status === 'RECEBIDO' || m.status === 'DESTINADO').length;
  const tonelagemTotal = manifestos.reduce((acc, curr) => acc + curr.quantidade, 0);
  
  const taxaConformidade = totalMtrs > 0 ? ((concluidos / totalMtrs) * 100).toFixed(0) : '0';
  const pctEmitido = totalMtrs > 0 ? ((emitidosGrade / totalMtrs) * 100).toFixed(0) : '0';
  const pctTransito = totalMtrs > 0 ? ((emTransito / totalMtrs) * 100).toFixed(0) : '0';
  const pctConcluido = totalMtrs > 0 ? ((concluidos / totalMtrs) * 100).toFixed(0) : '0';

  const dadosRoscaStatus = [
    { name: 'Coleta Pendente', value: emitidosGrade, color: '#f59e0b' },
    { name: 'Em Transporte', value: emTransito, color: '#3b82f6' },
    { name: 'Destinado', value: concluidos, color: '#10b981' }
  ].filter(item => item.value > 0);

  const agrupamentoResiduos = manifestos.reduce((acc: Record<string, number>, curr) => {
    acc[curr.tipoResiduo] = (acc[curr.tipoResiduo] || 0) + curr.quantidade;
    return acc;
  }, {});

  const dadosGraficoBarras = Object.entries(agrupamentoResiduos)
    .map(([name, value]) => ({
      name: name.length > 12 ? name.substring(0, 12) + '...' : name,
      toneladas: Number(value.toFixed(2))
    }))
    .slice(0, 4);

  return (
    <div className="flex min-h-screen bg-[#07090e] text-zinc-100 font-sans antialiased w-full">
      
      <aside className="w-64 bg-[#0b0c10] text-zinc-400 flex flex-col justify-between p-6 border-r border-zinc-900/80 shrink-0 hidden lg:flex relative z-20">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-md shadow-lg shadow-emerald-500/20">Æ</div>
            <div>
              <span className="text-white font-black tracking-tight text-sm block">AMAZON ECO</span>
              <span className="text-[9px] font-bold text-emerald-400 tracking-widest block uppercase font-mono">PIM MONITOR</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">Navegação</span>
              <Link href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-900 text-emerald-400 font-bold text-xs border border-zinc-800 shadow-inner transition-all">
                <LayoutDashboard className="w-4 h-4" /> Visão Geral
              </Link>
              <Link href="/dashboard/manifestos" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group border border-transparent">
                <FileText className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" /> Manifestos MTR
              </Link>
              <Link href="/dashboard/companies" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group border border-transparent">
                <Building2 className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" /> Empresas do PIM
              </Link>
            </div>

            <div className="space-y-1 pt-4 border-t border-zinc-900/50">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">Segurança</span>
              <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group border border-transparent"><Bell className="w-4 h-4 text-zinc-600" /> Notificações</Link>
              <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group border border-transparent"><Settings className="w-4 h-4 text-zinc-600" /> Configurações</Link>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/30 hover:bg-zinc-900 text-zinc-500 hover:text-rose-400 text-xs font-bold border border-zinc-900 transition-all text-left"><LogOut className="w-4 h-4" /> Sair do Painel</button>
      </aside>

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto relative z-10">
        <div className="flex justify-between items-center border-b border-zinc-900/60 pb-5">
          <div>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Console &gt; Visão Geral</span>
            <h1 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/10" /> Painel de Controle Analítico
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-[#11131c] border border-zinc-800 px-3 py-1.5 rounded-xl text-[10px] font-mono text-zinc-400 shadow-inner">
            <Globe className="w-3 h-3 text-emerald-400" /> SYSTEM_INTEGRATED
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111218] p-5 rounded-2xl border border-zinc-800/40 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Volume Total</span>
              <span className="text-2xl font-black text-white font-mono block tracking-tight">{tonelagemTotal.toFixed(1)} <span className="text-xs text-zinc-500 font-sans font-normal">t</span></span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 flex items-center justify-center"><Scale className="w-4 h-4" /></div>
          </div>

          <div className="bg-[#111218] p-5 rounded-2xl border border-zinc-800/40 shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Manifestos Emitidos</span>
              <span className="text-2xl font-black text-white font-mono block tracking-tight">{totalMtrs}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
          </div>

          <div className="bg-[#111218] p-5 rounded-2xl border border-zinc-800/40 shadow-xl flex items-center justify-between border-l-2 border-l-blue-500">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Fluxo em Trânsito</span>
              <span className="text-2xl font-black text-blue-400 font-mono block tracking-tight">{emTransito}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-400 flex items-center justify-center"><Truck className="w-4 h-4" /></div>
          </div>

          <div className="bg-[#111218] p-5 rounded-2xl border border-zinc-800/40 shadow-xl flex items-center justify-between border-l-2 border-l-emerald-500">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Taxa de Conformidade</span>
              <span className="text-2xl font-black text-emerald-400 font-mono block tracking-tight">{taxaConformidade}%</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 bg-[#111218] p-5 rounded-2xl border border-zinc-800/40 shadow-2xl flex flex-col justify-between h-64">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Logística de Carga</span>
              <span className="text-[8px] font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-600 font-bold">STATUS_RATIO</span>
            </div>
            <div className="flex items-center justify-between gap-4 h-full">
              <div className="w-28 h-28 relative flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dadosRoscaStatus} cx="50%" cy="50%" innerRadius={36} outerRadius={46} paddingAngle={3} dataKey="value">
                      {dadosRoscaStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-black text-white font-mono">{totalMtrs}</span>
                  <span className="text-[7px] font-bold text-zinc-500 uppercase font-mono">Guias</span>
                </div>
              </div>
              <div className="flex-1 space-y-2 text-[11px] font-medium text-zinc-400">
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-zinc-500"><span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" /> Emitidos</span><span className="font-mono text-zinc-300 font-bold">{pctEmitido}%</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-zinc-500"><span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" /> Trânsito</span><span className="font-mono text-zinc-300 font-bold">{pctTransito}%</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-zinc-500"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Concluídos</span><span className="font-mono text-zinc-300 font-bold">{pctConcluido}%</span></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#111218] p-5 rounded-2xl border border-zinc-800/40 shadow-2xl flex flex-col justify-between h-64">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Volumetria por Categoria</span>
              <span className="text-[8px] font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-600 font-bold">TOP_MATERIALS</span>
            </div>
            <div className="w-full h-44 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosGraficoBarras} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#07080d', borderColor: '#27272a', borderRadius: '10px' }} labelStyle={{ color: '#a1a1aa' }} itemStyle={{ color: '#10b981' }} />
                  <Bar dataKey="toneladas" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32}>
                    {dadosGraficoBarras.map((entry, index) => <Cell key={`cell-${index}`} fill="#10b981" fillOpacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1"><Layers className="w-4 h-4 text-zinc-600" /><h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Histórico de Auditoria Recente</h2></div>
          <div className="bg-[#111218] rounded-2xl border border-zinc-800/40 shadow-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/30 border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                  <th className="p-4">Identificador MTR</th>
                  <th className="p-4">Indústria Cadastrada</th>
                  <th className="p-4">Material Transportado</th>
                  <th className="p-4 text-right">Volume</th>
                  <th className="p-4 text-center">Status Global</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/50 text-xs text-zinc-400 font-medium">
                {manifestos.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-[#13141f]/30 transition-colors">
                    <td className="p-4 font-mono text-emerald-400 font-bold">{item.numeroMtr}</td>
                    <td className="p-4 font-semibold text-zinc-200">{item.empresa}</td>
                    <td className="p-4 text-zinc-500">{item.tipoResiduo}</td>
                    <td className="p-4 text-right font-mono font-bold text-zinc-100">{item.quantidade.toFixed(2)} t</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md border bg-emerald-500/5 text-emerald-400 border-emerald-500/10">Concluído</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end pt-1">
            <Link href="/dashboard/manifestos" className="text-xs text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-0.5 group">
              Abrir Central de Operações Completa <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}