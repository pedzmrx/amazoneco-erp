'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../services/api';
import { toast } from 'sonner';
import { 
  LayoutDashboard,
  FileText,
  Building2,
  LogOut,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Send,
  Scale,
  FileDigit,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface EmpresaPim {
  id: string;
  name: string;
}

export default function NovoManifestoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  
  const [empresasCadastradas, setEmpresasCadastradas] = useState<EmpresaPim[]>([]);

  const [numeroMtr, setNumeroMtr] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [tipoResiduo, setTipoResiduo] = useState('');
  const [quantidade, setQuantidade] = useState('');

  useEffect(() => { 
    async function carregarEmpresas() {
      try {
        setLoadingEmpresas(true);
        const token = localStorage.getItem('@AmazonEco:token');
        
        const response = await api.get('/companies', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("RETORNO DA API /companies:", response.data);

        if (Array.isArray(response.data)) {
          setEmpresasCadastradas(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar indústrias do banco:', error);
        toast.error('Não foi possível carregar o catálogo de indústrias homologadas.');
      } finally {
        setLoadingEmpresas(false);
      }
    }

    carregarEmpresas();
  }, []);

  async function handleEmitirMtr(e: React.FormEvent) {
    e.preventDefault();

    if (!numeroMtr.trim() || !empresaSelecionada || !tipoResiduo.trim() || !quantidade) {
      toast.error('Por favor, preencha todos os campos do manifesto.');
      return;
    }

    const pesoNumerico = Number(quantidade);
    if (isNaN(pesoNumerico) || pesoNumerico <= 0) {
      toast.error('A quantidade informada precisa ser um número maior que zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('@AmazonEco:token');

      await api.post('/manifestos', {
        numeroMtr: numeroMtr.trim(),
        empresaPim: empresaSelecionada, 
        residuoDestinado: tipoResiduo.trim(),
        quantidadeToneladas: pesoNumerico,
        status: 'EMITIDO' 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Manifesto MTR emitido e registrado no IPAAM com sucesso!');
      
      router.push('/dashboard/manifestos');
      router.refresh();
    } catch (error: any) {
      console.error('Erro ao emitir MTR:', error);
      const mensagemErro = error.response?.data?.message || 'Falha ao registrar manifesto.';
      toast.error(mensagemErro);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#07080d] text-zinc-100 font-sans antialiased relative selection:bg-emerald-500/30">
      
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-500/[0.015] rounded-full blur-[140px] pointer-events-none" />

      <aside className="w-64 bg-[#0b0c10] text-zinc-400 flex flex-col justify-between p-6 border-r border-zinc-900/80 shrink-0 hidden lg:flex relative z-10">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-md">
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
              <Link href="#" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold transition-all group border border-transparent">
                <Building2 className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                Empresas do PIM
              </Link>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/30 hover:bg-zinc-900 text-zinc-500 hover:text-rose-400 text-xs font-bold border border-zinc-900 transition-all text-left">
          <LogOut className="w-4 h-4" />
          Sair do Painel
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto w-full max-w-3xl mx-auto relative z-10">
        
        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono border-b border-zinc-900 pb-5">
          <Link href="/dashboard/manifestos" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Manifestos
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-800" />
          <span className="text-zinc-400">Emissão</span>
        </div>

        <div className="bg-[#12141c] rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-900 bg-zinc-900/20">
            <h1 className="text-lg font-black text-white tracking-tight">Emitir Manifesto de Transporte de Resíduos</h1>
            <p className="text-xs text-zinc-500 mt-1">Insira os dados da carga regulamentada para gerar o registro de rastreabilidade.</p>
          </div>

          <form onSubmit={handleEmitirMtr} className="p-6 space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <FileDigit className="w-3.5 h-3.5 text-zinc-600" /> Identificador do Manifesto (Número MTR)
              </label>
              <input 
                type="text"
                placeholder="Ex: MTR-2026-9999"
                value={numeroMtr}
                onChange={(e) => setNumeroMtr(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-[#07080d] text-xs text-zinc-200 px-4 py-3 rounded-xl border border-zinc-800/80 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/10 transition-all placeholder-zinc-700 font-medium disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-zinc-600" /> Indústria Geradora (Polo Industrial)
              </label>
              <div className="relative">
                <select
                  value={empresaSelecionada}
                  onChange={(e) => setEmpresaSelecionada(e.target.value)}
                  disabled={isSubmitting || loadingEmpresas}
                  className="w-full bg-[#07080d] text-xs text-zinc-200 px-4 py-3 rounded-xl border border-zinc-800/80 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/10 transition-all font-medium disabled:opacity-50 appearance-none cursor-pointer"
                >
                  {loadingEmpresas ? (
                    <option value="">Carregando indústrias homologadas...</option>
                  ) : (
                    <>
                      <option value="">Selecione uma indústria cadastrada no PIM...</option>
                      {empresasCadastradas.map((emp) => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {loadingEmpresas && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500 absolute right-4 top-1/2 -translate-y-1/2" />
                )}
              </div>            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-zinc-600" /> Classe / Tipo de Resíduo
                </label>
                <input 
                  type="text"
                  placeholder="Ex: Sucata Eletrônica (Placas/Circuitos)"
                  value={tipoResiduo}
                  onChange={(e) => setTipoResiduo(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-[#07080d] text-xs text-zinc-200 px-4 py-3 rounded-xl border border-zinc-800/80 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/10 transition-all placeholder-zinc-700 font-medium disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-zinc-600" /> Peso (t)
                </label>
                <input 
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-[#07080d] text-xs text-zinc-200 px-4 py-3 rounded-xl border border-zinc-800/80 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/10 transition-all placeholder-zinc-700 font-mono font-bold disabled:opacity-50"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1 text-emerald-500/60"><ShieldCheck className="w-4 h-4" /> Emissão em ambiente seguro</span>
              
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Link 
                  href="/dashboard/manifestos"
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold transition-all text-center text-xs border border-zinc-800 w-full sm:w-auto"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting || loadingEmpresas}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/10 transition-all w-full sm:w-auto disabled:opacity-50 group"
                >
                  <Send className={`w-3.5 h-3.5 transition-transform ${isSubmitting ? 'animate-pulse' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`} />
                  {isSubmitting ? 'Processando...' : 'Transmitir Manifesto'}
                </button>
              </div>
            </div>

          </form>
        </div>

      </main>
    </div>
  );
}