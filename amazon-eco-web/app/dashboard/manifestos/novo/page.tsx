'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../services/api';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Save, 
  Loader2,
  FilePlus2
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

export default function NovoManifestoPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estaAutenticado, setEstaAutenticado] = useState(false);

  const [numeroMtr, setNumeroMtr] = useState('');
  const [empresaPim, setEmpresaPim] = useState('');
  const [residuoDestinado, setResiduoDestinado] = useState('');
  const [quantidadeToneladas, setQuantidadeToneladas] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('@AmazonEco:token');
    if (!token) {
      router.push('/');
    } else {
      setEstaAutenticado(true);
      carregarEmpresas();
    }
  }, []);

  async function carregarEmpresas() {
    try {
      setLoadingCompanies(true);
      const token = localStorage.getItem('@AmazonEco:token');
      
      const response = await api.get('/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(response.data)) {
        setCompanies(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar empresas do PIM:', error);
      toast.error('Falha ao conectar com o catálogo de indústrias.');
      setCompanies([
        { id: '1', name: 'Samsung Eletrônicos da Amazônia' },
        { id: '2', name: 'Moto Honda da Amazônia' },
        { id: '3', name: 'Panasonic do Brasil' }
      ]);
    } finally {
      setLoadingCompanies(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!numeroMtr || !empresaPim || !residuoDestinado || !quantidadeToneladas) {
      toast.warning('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('@AmazonEco:token');

      const payload = {
        numeroMtr: numeroMtr.trim(),
        empresaPim, 
        residuoDestinado: residuoDestinado.trim(),
        quantidadeToneladas: Number(quantidadeToneladas),
        status: 'EMITIDO'
      };

      await api.post('/manifestos', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Manifesto MTR emitido e registrado com sucesso!');
      router.push('/dashboard/manifestos');
    } catch (error: any) {
      console.error('Erro ao emitir manifesto:', error);
      const msg = error.response?.data?.message || 'Falha ao registrar manifesto no servidor.';
      toast.error(msg);
    } finally { 
      setIsSubmitting(false);
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

  return (
    <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto relative z-10 w-full max-w-[900px] mx-auto">
      <div className="flex justify-between items-center border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <Link 
            href="/dashboard/manifestos" 
            className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-emerald-400 uppercase tracking-wider font-mono transition-colors group mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" /> Voltar para Grade Operacional
          </Link>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <FilePlus2 className="w-4 h-4 text-emerald-400" /> Emitir Novo Manifesto (MTR)
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#12141c] p-6 rounded-2xl border border-zinc-800/60 shadow-2xl space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">
              Identificador MTR <span className="text-emerald-500">*</span>
            </label>
            <input 
              type="text" required placeholder="Ex: MTR-2026-015" value={numeroMtr}
              onChange={(e) => setNumeroMtr(e.target.value)}
              className="w-full bg-[#07080d] text-xs text-zinc-200 px-4 py-3 rounded-xl border border-zinc-800/80 focus:border-emerald-500/50 focus:outline-none transition-all placeholder-zinc-700 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">
              Indústria Origem (PIM) <span className="text-emerald-500">*</span>
            </label>
            <div className="relative">
              <select
                required value={empresaPim} onChange={(e) => setEmpresaPim(e.target.value)}
                className="w-full bg-[#07080d] text-xs text-zinc-300 px-4 py-3 rounded-xl border border-zinc-800/80 focus:border-emerald-500/50 focus:outline-none transition-all cursor-pointer font-medium appearance-none"
              >
                <option value="" disabled className="text-zinc-700">Selecione a empresa geradora...</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id} className="bg-[#12141c] text-zinc-300">
                    {company.name}
                  </option>
                ))}
              </select>
              {loadingCompanies && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400 absolute right-4 top-1/2 -translate-y-1/2" />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">
              Material / Resíduo Destinado <span className="text-emerald-500">*</span>
            </label>
            <input 
              type="text" required placeholder="Ex: Sucata de Placas/Circuitos Eletrônicos" value={residuoDestinado}
              onChange={(e) => setResiduoDestinado(e.target.value)}
              className="w-full bg-[#07080d] text-xs text-zinc-200 px-4 py-3 rounded-xl border border-zinc-800/80 focus:border-emerald-500/50 focus:outline-none transition-all placeholder-zinc-700 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">
              Massa Líquida Estimada (Tons) <span className="text-emerald-500">*</span>
            </label>
            <input 
              type="number" step="0.01" required placeholder="Ex: 12.50" value={quantidadeToneladas}
              onChange={(e) => setQuantidadeToneladas(e.target.value)}
              className="w-full bg-[#07080d] text-xs text-zinc-200 px-4 py-3 rounded-xl border border-zinc-800/80 focus:border-emerald-500/50 focus:outline-none transition-all placeholder-zinc-700 font-mono font-bold"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-900/60">
          <Link href="/dashboard/manifestos" className="px-4 py-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 text-xs font-bold transition-all">
            Cancelar
          </Link>
          <button
            type="submit" disabled={isSubmitting || loadingCompanies}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Registrando no Servidor...</>
            ) : (
              <><Save className="w-4 h-4" /> Emitir Guia MTR</>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}