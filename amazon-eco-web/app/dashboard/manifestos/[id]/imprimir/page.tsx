'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../../services/api';
import { 
  Printer, 
  ArrowLeft, 
  Loader2, 
  ShieldCheck, 
  AlertCircle 
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

export default function ImprimirManifestoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [manifesto, setManifesto] = useState<Manifesto | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('@AmazonEco:token');
    if (!token) {
      router.push('/');
      return;
    }

    if (id) {
      carregarManifesto(id, token);
    }
  }, [id]);

  async function carregarManifesto(manifestoId: string, token: string) {
    try {
      setLoading(true);
      const response = await api.get('/manifestos', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(response.data)) {
        const item = response.data.find((m: Manifesto) => m.id === manifestoId);
        if (item) {
          setManifesto(item);
        } else {
          setErro('Manifesto não localizado no registro operacional.');
        }
      }
    } catch (err) {
      console.error('Erro ao buscar dados do manifesto:', err);
      setErro('Falha ao carregar os dados para emissão do documento.');
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  const authHash = manifesto 
    ? `AE-${manifesto.id.substring(0, 8).toUpperCase()}-${new Date(manifesto.createdAt).getTime().toString(16).toUpperCase()}`
    : 'AE-VALIDATION-KEY';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080d] flex flex-col items-center justify-center gap-3 text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-xs font-mono font-bold tracking-widest uppercase animate-pulse">
          Gerando Espelho do Manifesto...
        </span>
      </div>
    );
  }

  if (erro || !manifesto) {
    return (
      <div className="min-h-screen bg-[#07080d] flex flex-col items-center justify-center gap-4 text-zinc-400 p-6">
        <AlertCircle className="w-10 h-10 text-rose-500" />
        <p className="text-sm font-semibold">{erro || 'Manifesto não encontrado.'}</p>
        <Link 
          href="/dashboard/manifestos"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Retornar à Central de Manifestos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8 print:p-0 print:bg-white print:text-black">
      
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <Link 
          href="/dashboard/manifestos"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Central
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/10 transition-all w-full sm:w-auto cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white text-black p-8 sm:p-12 rounded-2xl shadow-2xl border border-zinc-200 print:border-none print:shadow-none print:p-6 print:max-w-none text-xs font-sans">
        
        <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-lg font-black tracking-tight uppercase">Manifesto de Transporte de Resíduos (MTR)</h1>
            <p className="text-[11px] font-semibold text-zinc-700">Sistema Integrado de Rastreabilidade Ambiental — Polo Industrial de Manaus</p>
            <p className="text-[10px] text-zinc-500 font-mono">Conforme Diretrizes de Controle de Resíduos Industriais (IPAAM / SINIR)</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-zinc-500 uppercase block">Número do Manifesto</span>
            <span className="text-base font-black font-mono tracking-wider">{manifesto.numeroMtr}</span>
            <span className="text-[9px] font-semibold text-zinc-600 block mt-0.5">
              Emissão: {new Date(manifesto.createdAt).toLocaleDateString('pt-BR')} às {new Date(manifesto.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-wider bg-zinc-100 p-2 border-l-4 border-black mb-3">
            1. Identificação da Empresa Geradora (Origem)
          </h2>
          <div className="grid grid-cols-2 gap-4 px-2">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 block">Razão Social / Nome Fantasia:</span>
              <span className="font-bold text-xs">{manifesto.empresa}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-500 block">Município / UF:</span>
              <span className="font-medium">Manaus / AM — Polo Industrial de Manaus</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-wider bg-zinc-100 p-2 border-l-4 border-black mb-3">
            2. Especificação e Quantitativo da Carga
          </h2>
          <div className="grid grid-cols-3 gap-4 px-2">
            <div className="col-span-2">
              <span className="text-[10px] font-bold text-zinc-500 block">Descrição do Material / Resíduo:</span>
              <span className="font-bold text-xs">{manifesto.tipoResiduo}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-500 block">Massa Declarada:</span>
              <span className="font-mono font-black text-sm">{manifesto.quantidade.toFixed(2)} Toneladas</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-[11px] font-black uppercase tracking-wider bg-zinc-100 p-2 border-l-4 border-black mb-3">
            3. Situação e Rastreamento Operacional
          </h2>
          <div className="grid grid-cols-2 gap-4 px-2">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 block">Status Operacional no Ledger:</span>
              <span className="font-mono font-bold uppercase inline-block mt-0.5 px-2 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-[10px]">
                {manifesto.status}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-500 block">Chave de Homologação Digital:</span>
              <span className="font-mono font-bold text-[11px] text-zinc-800 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-black" /> {authHash}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-300">
          <h2 className="text-[11px] font-black uppercase tracking-wider mb-8 text-center text-zinc-700">
            Declaração de Responsabilidade e Conformidade de Transporte
          </h2>

          <div className="grid grid-cols-3 gap-6 text-center pt-6">
            <div className="border-t border-black pt-2">
              <span className="font-bold block text-[10px] uppercase">Responsável Gerador</span>
              <span className="text-[9px] text-zinc-500 block mt-0.5">Assinatura / Carimbo</span>
            </div>
            <div className="border-t border-black pt-2">
              <span className="font-bold block text-[10px] uppercase">Transportador Autorizado</span>
              <span className="text-[9px] text-zinc-500 block mt-0.5">Assinatura / Carimbo</span>
            </div>
            <div className="border-t border-black pt-2">
              <span className="font-bold block text-[10px] uppercase">Receptor / Destinação Final</span>
              <span className="text-[9px] text-zinc-500 block mt-0.5">Assinatura / Carimbo</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-3 border-t border-zinc-200 flex justify-between items-center text-[9px] text-zinc-400 font-mono">
          <span>AMAZON ECO PIM MONITOR — DOCUMENTO HOMOLOGADO</span>
          <span>AUTENTICIDADE: {authHash}</span>
        </div>

      </div>
    </div>
  );
}