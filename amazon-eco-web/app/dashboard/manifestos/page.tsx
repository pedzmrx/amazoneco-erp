'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../services/api';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  LogOut, 
  Plus, 
  Search, 
  RefreshCw,
  Loader2,
  ShieldAlert,
  ArrowRightLeft,
  Bell,
  Settings,
  Eye,
  X,
  Printer,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  Truck
  ,Scale
} from 'lucide-react';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
  const [manifestos, setManifestos] = useState<Manifesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusAtivo, setStatusAtivo] = useState('TODOS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMtr, setSelectedMtr] = useState<Manifesto | null>(null);

  async function carregarManifestos() {
    try {
      setLoading(true);
      const token = localStorage.getItem('@AmazonEco:token');
      
      const response = await api.get('/manifestos', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: searchTerm.trim() || undefined,
          status: statusAtivo
        }
      });

      setManifestos(response.data);
    } catch (error) {
      console.error('Erro ao buscar manifestos:', error);
      toast.error('Não foi possível atualizar a grade de manifestos.');
    } finally {
      setLoading(false);
    }
  }

  async function handleMudarStatus(id: string, novoStatus: 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO' | 'DESTINADO') {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem('@AmazonEco:token');

      await api.patch(`/manifestos/${id}/status`, 
        { status: novoStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Status do Manifesto atualizado.');
      
      if (selectedMtr && selectedMtr.id === id) {
        setSelectedMtr(prev => prev ? { ...prev, status: novoStatus } : null);
      }

      await carregarManifestos();
    } catch (error: any) {
      console.error('Erro ao alterar status do MTR:', error);
      const msg = error.response?.data?.message || 'Falha ao atualizar status.';
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  }

  function handleAbrirDetalhes(mtr: Manifesto) {
    setSelectedMtr(mtr);
    setIsModalOpen(true);
  }

  function handleSimularImpressao() {
    toast.info('Gerando espelho de impressão do MTR homologado pelo IPAAM...');
    setTimeout(() => {
      window.print();
    }, 500);
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      carregarManifestos();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusAtivo]);

  const totalGrade = manifestos.length;
  const emitidosGrade = manifestos.filter(m => m.status === 'EMITIDO').length;
  const transitoGrade = manifestos.filter(m => m.status === 'EM_TRANSITO').length;
  const concluidosGrade = manifestos.filter(m => m.status === 'RECEBIDO' || m.status === 'DESTINADO').length;
  const tonelagemTotalGrade = manifestos.reduce((acc, curr) => acc + curr.quantidade, 0);

  const pctEmitido = totalGrade > 0 ? ((emitidosGrade / totalGrade) * 100).toFixed(0) : '0';
  const pctTransito = totalGrade > 0 ? ((transitoGrade / totalGrade) * 100).toFixed(0) : '0';
  const pctConcluido = totalGrade > 0 ? ((concluidosGrade / totalGrade) * 100).toFixed(0) : '0';

  const dadosGraficoMtr = [
    { name: 'Aguardando Coleta', value: emitidosGrade, color: '#f59e0b' },
    { name: 'Em Transporte', value: transitoGrade, color: '#3b82f6' },
    { name: 'Destinação Final', value: concluidosGrade, color: '#10b981' }
  ].filter(item => item.value > 0);

  function renderBadgeStatus(status: string) {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      EMITIDO: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', label: 'Emitido' },
      EM_TRANSITO: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', label: 'Em Trânsito' },
      RECEBIDO: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', label: 'Recebido' },
      DESTINADO: { bg: 'bg-emerald-500/20 border-emerald-500/30', text: 'text-emerald-300', label: 'Destinado' },
    };

    const atual = config[status] || config.EMITIDO;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${atual.bg} ${atual.text}`}>
        <span className="w-1 h-1 rounded-full bg-current" />
        {atual.label}
      </span>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#07080d] text-zinc-100 font-sans antialiased">
      
      {/* SIDEBAR LATERAL UNIFICADA */}
      <aside className="w-64 bg-[#0b0c10] text-zinc-400 flex flex-col justify-between p-6 border-r border-zinc-900/80 shrink-0 hidden lg:flex relative z-20">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-md shadow-lg shadow-emerald-500/20">
              Æ
            </div>
            <div>
              <span className="text-white font-black tracking-tight text-sm block">AMAZON ECO</span>
              <span className="text-[9px] font-bold text-emerald-400 tracking-widest block uppercase font-mono">PIM MONITOR</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">Navegação</span>
              <Link href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group border border-transparent">
                <LayoutDashboard className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                Visão Geral
              </Link>
              <Link href="/dashboard/manifestos" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-900 text-emerald-400 font-bold text-xs border border-zinc-800 shadow-inner transition-all">
                <FileText className="w-4 h-4" />
                Manifestos MTR
              </Link>
              <Link href="/dashboard/companies" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group border border-transparent">
                <Building2 className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                Empresas do PIM
              </Link>
            </div>

            <div className="space-y-1 pt-4 border-t border-zinc-900/50">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">Segurança</span>
              <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group border border-transparent">
                <Bell className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                Notificações
              </Link>
              <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group border border-transparent">
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

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-6">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Console &gt; Manifestos</span>
            <h1 className="text-xl font-black text-white tracking-tight mt-0.5">Controle de Manifestos (MTR)</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Listagem geral e acompanhamento de cargas regulamentadas pelo IPAAM.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={carregarManifestos}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 transition-all active:scale-95"
              title="Atualizar Tabela"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
            
            <Link 
              href="/dashboard/manifestos/novo"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/10 transition-all w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Emitir Novo MTR
            </Link>
          </div>
        </div>

        {/* Painel Analítico Integrado */}
        {totalGrade > 0 && !loading && (
          <div className="bg-[#12141c] p-6 rounded-2xl border border-zinc-800/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative">
            <div className="flex flex-col sm:flex-row items-center gap-10 w-full md:w-auto">
              <div className="w-32 h-32 relative flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosGraficoMtr}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {dadosGraficoMtr.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="outline-none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-white font-mono tracking-tight">{totalGrade}</span>
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Mtrs</span>
                </div>
              </div>

              <div className="space-y-3 min-w-[160px] w-full sm:w-auto text-xs font-medium text-zinc-400">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" /> Emitidos:
                  </span>
                  <span className="font-mono font-black text-white">{emitidosGrade} <span className="text-[10px] text-zinc-600 font-normal">({pctEmitido}%)</span></span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" /> Em Trânsito:
                  </span>
                  <span className="font-mono font-black text-white">{transitoGrade} <span className="text-[10px] text-zinc-600 font-normal">({pctTransito}%)</span></span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Concluídos:
                  </span>
                  <span className="font-mono font-black text-white">{concluidosGrade} <span className="text-[10px] text-zinc-600 font-normal">({pctConcluido}%)</span></span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center md:items-end text-center md:text-right shrink-0 border-t md:border-t-0 md:border-l border-zinc-900/80 pt-4 md:pt-0 md:pl-10 w-full md:w-auto">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono flex items-center gap-1.5 mb-0.5">
                <Scale className="w-3 h-3 text-zinc-600" /> Carga Indexada
              </span>
              <div className="text-4xl font-black text-white font-mono tracking-tight">
                {tonelagemTotalGrade.toFixed(2)}
                <span className="text-xs font-bold text-zinc-500 tracking-wider ml-1 uppercase">Tons</span>
              </div>
              <span className="text-[9px] text-zinc-600 font-medium mt-1 font-mono uppercase tracking-tight">Soma da volumetria visível na grade.</span>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-[#12141c] p-4 rounded-2xl border border-zinc-800/60 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
          <div className="relative w-full md:max-w-md group">
            <Search className="w-4 h-4 text-zinc-600 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text"
              placeholder="Buscar por número MTR ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#07080d] text-xs text-zinc-300 pl-11 pr-4 py-3 rounded-xl border border-zinc-800/80 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/10 transition-all placeholder-zinc-700 font-medium"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#07080d] p-1 rounded-xl border border-zinc-900 w-full md:w-auto overflow-x-auto select-none no-scrollbar">
            {[
              { id: 'TODOS', label: 'Todos' },
              { id: 'EMITIDO', label: 'Emitidos' },
              { id: 'EM_TRANSITO', label: 'Em Trânsito' },
              { id: 'RECEBIDO', label: 'Recebidos' },
              { id: 'DESTINADO', label: 'Destinados' }
            ].map((aba) => (
              <button
                key={aba.id}
                onClick={() => setStatusAtivo(aba.id)}
                className={`px-3.5 py-2 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                  statusAtivo === aba.id 
                    ? 'bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700/50' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-[#12141c] rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden relative">
          {loading && manifestos.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center gap-3 text-zinc-500">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase animate-pulse">Sincronizando com o IPAAM...</span>
            </div>
          ) : manifestos.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center gap-2 text-zinc-600 border border-dashed border-zinc-900 m-4 rounded-xl">
              <ShieldAlert className="w-7 h-7 text-zinc-700" />
              <span className="text-xs font-semibold text-zinc-400">Nenhum manifesto localizado</span>
              <span className="text-[10px] font-medium max-w-xs text-center">Tente refinar sua busca ou mude a aba de status operacional selecionada.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/10 text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500">
                    <th className="px-6 py-4.5">Identificador MTR</th>
                    <th className="px-6 py-4.5">Empresa (PIM)</th>
                    <th className="px-6 py-4.5">Resíduo Destinado</th>
                    <th className="px-6 py-4.5 text-right">Massa Líquida</th>
                    <th className="px-6 py-4.5 text-center">Status Operacional</th>
                    <th className="px-6 py-4.5 text-center">Atualizar Status</th>
                    <th className="px-6 py-4.5 text-center">Gestão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60 text-xs font-medium text-zinc-300">
                  {manifestos.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-900/20 transition-colors group">
                      <td className="px-6 py-4 font-mono font-bold text-emerald-400 select-all">
                        {item.numeroMtr}
                      </td>
                      <td className="px-6 py-4 text-white font-semibold group-hover:text-emerald-300 transition-colors">
                        {item.empresa}
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {item.tipoResiduo}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-white tracking-tight">
                        {item.quantidade.toFixed(2)} <span className="text-zinc-600 text-[10px] font-normal ml-0.5">t</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {renderBadgeStatus(item.status)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {updatingId === item.id ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 bg-[#07080d] border border-zinc-800 rounded-xl px-2 py-1 max-w-[140px] mx-auto group-focus-within:border-emerald-500/30 transition-all">
                            <ArrowRightLeft className="w-3 h-3 text-zinc-600 shrink-0" />
                            <select
                              value={item.status}
                              onChange={(e) => handleMudarStatus(item.id, e.target.value as any)}
                              className="bg-transparent text-[10px] font-bold text-zinc-400 focus:outline-none cursor-pointer uppercase font-mono w-full"
                            >
                              <option value="EMITIDO" className="bg-[#0b0c10] text-amber-400">Emitido</option>
                              <option value="EM_TRANSITO" className="bg-[#0b0c10] text-blue-400">Trânsito</option>
                              <option value="RECEBIDO" className="bg-[#0b0c10] text-emerald-400">Recebido</option>
                              <option value="DESTINADO" className="bg-[#0b0c10] text-zinc-400">Destinado</option>
                            </select>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleAbrirDetalhes(item)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-800/80 transition-all shadow-md active:scale-95"
                          title="Visualizar Espelho do MTR"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 border-t border-zinc-900 bg-zinc-900/10 flex justify-between items-center text-[10px] text-zinc-600 font-mono font-bold uppercase tracking-wider">
            <span>Resultados: {manifestos.length} indexados</span>
            <span className="text-emerald-500/40 flex items-center gap-1">🛡️ SECURE_LEDGER</span>
          </div>
        </div>
      </main>

      {/* MODAL: ESPELHO DO MTR COM TIMELINE */}
      {isModalOpen && selectedMtr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#12141c] border border-zinc-800/80 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#0b0c10] p-4 border-b border-zinc-900 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[8px] font-black font-mono tracking-widest text-zinc-500 block uppercase">AUTENTICAÇÃO_SINAL_IPAAM</span>
                  <h3 className="text-sm font-black text-white font-mono tracking-tight">{selectedMtr.numeroMtr}</h3>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg bg-zinc-900 text-zinc-500 border border-zinc-800/60"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6">
              <div className="bg-[#07080d] p-4 rounded-xl border border-zinc-900 text-[11px] space-y-2">
                <div className="flex justify-between border-b border-zinc-900/50 pb-1.5">
                  <span className="text-zinc-500 font-medium">Empresa Origem (PIM):</span>
                  <span className="font-bold text-white">{selectedMtr.empresa}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/50 pb-1.5">
                  <span className="text-zinc-500 font-medium">Material Destinado:</span>
                  <span className="font-semibold text-zinc-300">{selectedMtr.tipoResiduo}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900/50 pb-1.5">
                  <span className="text-zinc-500 font-medium">Massa Líquida Registrada:</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedMtr.quantidade.toFixed(2)} t</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-zinc-500 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> Data de Emissão:</span>
                  <span className="font-mono text-zinc-400">{new Date(selectedMtr.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" /> Linha do Tempo da Carga
                </div>
                <div className="relative pl-6 space-y-5 border-l border-zinc-800/80 ml-2.5 pt-1">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center border-4 border-[#12141c]"><CheckCircle2 className="w-2 h-2 text-zinc-950" /></span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">Manifesto Emitido no Sistema</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Aguardando a chegada da transportadora para carregamento.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border-4 border-[#12141c] ${selectedMtr.status !== 'EMITIDO' ? 'bg-blue-500' : 'bg-zinc-800'}`}>{selectedMtr.status !== 'EMITIDO' && <Truck className="w-2 h-2 text-white" />}</span>
                    <div className={selectedMtr.status === 'EMITIDO' ? 'opacity-40' : ''}>
                      <h4 className="text-xs font-bold text-zinc-200">Carga em Transporte Rodoviário</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Resíduo em deslocamento vigiado pelas rotas do Distrito Industrial.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border-4 border-[#12141c] ${selectedMtr.status === 'RECEBIDO' || selectedMtr.status === 'DESTINADO' ? 'bg-emerald-500' : 'bg-zinc-800'}`}>{ (selectedMtr.status === 'RECEBIDO' || selectedMtr.status === 'DESTINADO') && <Clock className="w-2 h-2 text-zinc-950" />}</span>
                    <div className={(selectedMtr.status === 'EMITIDO' || selectedMtr.status === 'EM_TRANSITO') ? 'opacity-40' : ''}>
                      <h4 className="text-xs font-bold text-zinc-200">Baixa e Destinação Final Homologada</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Material recebido pelo destinador ambiental em conformidade.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0b0c10] p-3.5 border-t border-zinc-900 flex justify-between items-center">
              <span className="text-[9px] font-mono text-emerald-500/50 uppercase tracking-widest">Digital_Signed_Ledger</span>
              <button onClick={handleSimularImpressao} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-bold border border-zinc-800 shadow-inner"><Printer className="w-3.5 h-3.5" /> Imprimir Guia MTR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}