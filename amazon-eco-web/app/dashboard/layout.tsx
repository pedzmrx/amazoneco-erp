'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  Building2,
  LogOut, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  Loader2 
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('@AmazonEco:token');
    if (!token) {
      router.push('/');
    } else {
      setEstaAutenticado(true);
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('@AmazonEco:token');
    router.push('/');
  }

  if (!estaAutenticado) {
    return (
      <div className="min-h-screen bg-[#07080d] flex flex-col items-center justify-center gap-3 text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-xs font-mono font-bold tracking-widest uppercase animate-pulse">
          Verificando Credenciais...
        </span>
      </div>
    );
  }

  const isVisaoGeral = pathname === '/dashboard';
  const isManifestos = pathname === '/dashboard/manifestos';
  const isEmpresas = pathname === '/dashboard/companies';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#07090e] text-zinc-100 font-sans antialiased w-full">
      
      <header className="lg:hidden bg-[#0b0c10] border-b border-zinc-900/80 px-4 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-sm shadow-md">Æ</div>
          <div>
            <span className="text-white font-black tracking-tight text-xs block">AMAZON ECO</span>
            <span className="text-[8px] font-bold text-emerald-400 tracking-widest block uppercase font-mono">PIM MONITOR</span>
          </div>
        </div>

        <button 
          onClick={() => setMenuAberto(!menuAberto)} 
          className="p-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 transition-all active:scale-95"
          aria-label="Alternar Menu"
        >
          {menuAberto ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {menuAberto && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setMenuAberto(false)}
          />

          <aside className="relative w-72 bg-[#0b0c10] text-zinc-400 flex flex-col justify-between p-6 border-r border-zinc-800/80 z-10 shadow-2xl h-full">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-black text-sm">Æ</div>
                  <div>
                    <span className="text-white font-black text-xs block">AMAZON ECO</span>
                    <span className="text-[8px] font-bold text-emerald-400 uppercase font-mono">Navegação</span>
                  </div>
                </div>
                <button onClick={() => setMenuAberto(false)} className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-1">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">Painel</span>
                <Link 
                  href="/dashboard" 
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                    isVisaoGeral 
                      ? 'bg-zinc-900 text-emerald-400 font-bold border-zinc-800' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border-transparent font-semibold'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Visão Geral
                </Link>
                <Link 
                  href="/dashboard/manifestos" 
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                    isManifestos 
                      ? 'bg-zinc-900 text-emerald-400 font-bold border-zinc-800' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border-transparent font-semibold'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Manifestos MTR
                </Link>
                <Link 
                  href="/dashboard/companies" 
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                    isEmpresas 
                      ? 'bg-zinc-900 text-emerald-400 font-bold border-zinc-800' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border-transparent font-semibold'
                  }`}
                >
                  <Building2 className="w-4 h-4" /> Empresas do PIM
                </Link>
              </nav>

              <div className="space-y-1 pt-4 border-t border-zinc-900">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">Sistema</span>
                <button onClick={() => alert('Módulo em homologação.')} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 text-xs font-semibold text-left"><Bell className="w-4 h-4 text-zinc-600" /> Notificações</button>
                <button onClick={() => alert('Configurações gerenciadas pelo IPAAM.')} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 text-xs font-semibold text-left"><Settings className="w-4 h-4 text-zinc-600" /> Configurações</button>
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/50 text-zinc-400 hover:text-rose-400 text-xs font-bold border border-zinc-900 transition-all text-left w-full mt-6"
            >
              <LogOut className="w-4 h-4" /> Sair do Painel
            </button>
          </aside>
        </div>
      )}

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
              <Link 
                href="/dashboard" 
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                  isVisaoGeral 
                    ? 'bg-zinc-900 text-emerald-400 font-bold border-zinc-800 shadow-inner' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border-transparent font-semibold'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Visão Geral
              </Link>
              <Link 
                href="/dashboard/manifestos" 
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                  isManifestos 
                    ? 'bg-zinc-900 text-emerald-400 font-bold border-zinc-800 shadow-inner' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border-transparent font-semibold'
                }`}
              >
                <FileText className="w-4 h-4" /> Manifestos MTR
              </Link>
              <Link 
                href="/dashboard/companies" 
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs border transition-all ${
                  isEmpresas 
                    ? 'bg-zinc-900 text-emerald-400 font-bold border-zinc-800 shadow-inner' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border-transparent font-semibold'
                }`}
              >
                <Building2 className="w-4 h-4" /> Empresas do PIM
              </Link>
            </div>

            <div className="space-y-1 pt-4 border-t border-zinc-900/50">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">Segurança</span>
              <button onClick={() => alert('Módulo em homologação.')} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold border border-transparent text-left"><Bell className="w-4 h-4 text-zinc-600" /> Notificações</button>
              <button onClick={() => alert('Configurações gerenciadas pelo IPAAM.')} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold border border-transparent text-left"><Settings className="w-4 h-4 text-zinc-600" /> Configurações</button>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/30 hover:bg-zinc-900 text-zinc-500 hover:text-rose-400 text-xs font-bold border border-zinc-900 transition-all text-left"><LogOut className="w-4 h-4" /> Sair do Painel</button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}