'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../services/api';
import { toast } from 'sonner';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Info,
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

interface NotificacaoConformidade {
  id: string;
  manifestoId: string;
  numeroMtr: string;
  empresa: string;
  tipo: 'CRITICO' | 'ALERTA' | 'INFO';
  titulo: string;
  descricao: string;
  data: string;
}

export default function NotificacoesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [notificacoes, setNotificacoes] = useState<NotificacaoConformidade[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<'TODOS' | 'CRITICO' | 'ALERTA' | 'INFO'>('TODOS');

  useEffect(() => {
    const token = localStorage.getItem('@AmazonEco:token');
    if (!token) {
      router.push('/');
    } else {
      setEstaAutenticado(true);
      gerarAuditoriaConformidade(token);
    }
  }, []);

  async function gerarAuditoriaConformidade(token: string) {
    try {
      setLoading(true);
      const response = await api.get('/manifestos', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(response.data)) {
        const manifestos: Manifesto[] = response.data;
        const listaCalculada: NotificacaoConformidade[] = [];
        const agora = new Date().getTime();

        manifestos.forEach((mtr) => {
          const dataCriacao = new Date(mtr.createdAt).getTime();
          const horasDecorridas = (agora - dataCriacao) / (1000 * 60 * 60);

          if (mtr.status === 'EM_TRANSITO' && horasDecorridas > 48) {
            listaCalculada.push({
              id: `critico-${mtr.id}`,
              manifestoId: mtr.id,
              numeroMtr: mtr.numeroMtr,
              empresa: mtr.empresa,
              tipo: 'CRITICO',
              titulo: 'SLA de Transporte Excedido (> 48h)',
              descricao: `A carga de ${mtr.tipoResiduo} (${mtr.quantidade.toFixed(2)} t) está em rota há mais tempo que o limite regulamentar sem confirmação de destinação.`,
              data: mtr.createdAt
            });
          }

          if (mtr.status === 'EMITIDO' && horasDecorridas > 120) {
            listaCalculada.push({
              id: `alerta-${mtr.id}`,
              manifestoId: mtr.id,
              numeroMtr: mtr.numeroMtr,
              empresa: mtr.empresa,
              tipo: 'ALERTA',
              titulo: 'Manifesto Estagnado sem Coleta (> 5 dias)',
              descricao: `Guia emitida pela empresa ${mtr.empresa} sem início de carregamento. Verifique se o resíduo permanece estocado no pátio.`,
              data: mtr.createdAt
            });
          }

          if (mtr.quantidade >= 50 && mtr.status !== 'DESTINADO') {
            listaCalculada.push({
              id: `info-${mtr.id}`,
              manifestoId: mtr.id,
              numeroMtr: mtr.numeroMtr,
              empresa: mtr.empresa,
              tipo: 'INFO',
              titulo: 'Movimentação Volumétrica Elevada',
              descricao: `Carga de grande porte registrada (${mtr.quantidade.toFixed(2)} toneladas). Acompanhamento prioritário recomendado.`,
              data: mtr.createdAt
            });
          }
        });

        setNotificacoes(listaCalculada);
      }
    } catch (error) {
      console.error('Erro ao auditar conformidade:', error);
      toast.error('Falha ao processar regras de auditoria operacional.');
    } finally {
      setLoading(false);
    }
  }

  if (!estaAutenticado) {
    return (
      <div className="min-h-screen bg-[#07080d] flex flex-col items-center justify-center gap-3 text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-xs font-mono font-bold tracking-widest uppercase animate-pulse">Verificando Credenciais...</span>
      </div>
    );
  }

  const totalCriticos = notificacoes.filter(n => n.tipo === 'CRITICO').length;
  const totalAlertas = notificacoes.filter(n => n.tipo === 'ALERTA').length;
  const totalInfos = notificacoes.filter(n => n.tipo === 'INFO').length;

  const notificacoesFiltradas = notificacoes.filter(item => {
    if (filtroTipo === 'TODOS') return true;
    return item.tipo === filtroTipo;
  });

  return (
    <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-6">
        <div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Auditoria &gt; Conformidade</span>
          <h1 className="text-xl font-black text-white tracking-tight mt-0.5 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" /> Central de Alertas e Conformidade
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Monitoramento proativo de inconsistências operacionais e regras regulatórias do PIM.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#12141c] p-4 rounded-2xl border border-rose-950/40 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest font-mono block">Inconformidades Críticas</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">{totalCriticos}</span>
            <span className="text-[9px] text-zinc-500 font-mono">Prazos de transporte estourados</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#12141c] p-4 rounded-2xl border border-amber-950/40 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono block">Alertas de Estagnação</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">{totalAlertas}</span>
            <span className="text-[9px] text-zinc-500 font-mono">Guias sem movimentação</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#12141c] p-4 rounded-2xl border border-blue-950/40 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono block">Avisos Operacionais</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">{totalInfos}</span>
            <span className="text-[9px] text-zinc-500 font-mono">Cargas de grande porte</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Info className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-[#07080d] p-1 rounded-xl border border-zinc-900 w-full sm:w-auto overflow-x-auto select-none no-scrollbar">
        {[
          { id: 'TODOS', label: `Todas (${notificacoes.length})` },
          { id: 'CRITICO', label: `Críticas (${totalCriticos})` },
          { id: 'ALERTA', label: `Alertas (${totalAlertas})` },
          { id: 'INFO', label: `Informativas (${totalInfos})` }
        ].map((aba) => (
          <button
            key={aba.id}
            onClick={() => setFiltroTipo(aba.id as any)}
            className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
              filtroTipo === aba.id 
                ? 'bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700/50' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {aba.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="bg-[#12141c] p-16 rounded-2xl border border-zinc-800/80 flex flex-col items-center justify-center gap-3 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase animate-pulse">Auditando Regras de Rastreabilidade...</span>
          </div>
        ) : notificacoesFiltradas.length === 0 ? (
          <div className="bg-[#12141c] p-16 rounded-2xl border border-zinc-800/80 flex flex-col items-center justify-center gap-3 text-zinc-500 text-center">
            <ShieldCheck className="w-10 h-10 text-emerald-500/80" />
            <span className="text-sm font-bold text-zinc-300">Nenhuma irregularidade detectada</span>
            <span className="text-xs text-zinc-600 max-w-sm">Todos os manifestos em trânsito e operações industriais estão em plena conformidade com as regras operacionais.</span>
          </div>
        ) : (
          notificacoesFiltradas.map((notif) => {
            const configVisual = {
              CRITICO: {
                border: 'border-rose-900/40 hover:border-rose-700/60',
                badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                icon: <AlertTriangle className="w-4 h-4 text-rose-400" />
              },
              ALERTA: {
                border: 'border-amber-900/40 hover:border-amber-700/60',
                badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                icon: <Clock className="w-4 h-4 text-amber-400" />
              },
              INFO: {
                border: 'border-blue-900/40 hover:border-blue-700/60',
                badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                icon: <Info className="w-4 h-4 text-blue-400" />
              }
            }[notif.tipo];

            return (
              <div 
                key={notif.id}
                className={`bg-[#12141c] p-5 rounded-2xl border ${configVisual.border} shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all group`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border ${configVisual.badgeBg}`}>
                      {configVisual.icon}
                      {notif.tipo}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400">{notif.numeroMtr}</span>
                    <span className="text-[11px] text-zinc-500 font-semibold">• {notif.empresa}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-zinc-100 transition-colors">{notif.titulo}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{notif.descricao}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-900">
                  <Link
                    href={`/dashboard/manifestos/${notif.manifestoId}/imprimir`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold border border-zinc-800 transition-all"
                  >
                    Auditar MTR <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}