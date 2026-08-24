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
  Loader2,
  ChevronLeft,
  ChevronRight
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
  const [recolhida, setRecolhida] = useState(false);

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
  const isManifestos = pathname.startsWith('/dashboard/manifestos');
  const isEmpresas = pathname.startsWith('/dashboard/companies');
  const isNotificacoes = pathname.startsWith('/dashboard/notificacoes');

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#07090e] text-zinc-100 font-sans antialiased w-full">
      
      <header className="lg:hidden bg-[#0a0c12] border-b border-zinc-900 px-4 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <span className="text-white font-bold tracking-tight text-xs block leading-none">AMAZON ECO</span>
            <span className="text-[8px] font-bold text-emerald-400 tracking-widest block uppercase font-mono mt-0.5">PIM MONITOR</span>
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

          <aside className="relative w-72 bg-[#090b10] text-zinc-400 flex flex-col justify-between p-6 border-r border-zinc-800/80 z-10 shadow-2xl h-full overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white font-bold text-xs block">AMAZON ECO</span>
                    <span className="text-[8px] font-bold text-emerald-400 uppercase font-mono">Navegação</span>
                  </div>
                </div>
                <button onClick={() => setMenuAberto(false)} className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-1">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">Operação</span>
                
                <Link 
                  href="/dashboard" 
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isVisaoGeral 
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold border-l-2 border-emerald-400' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 font-semibold'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Visão Geral
                </Link>

                <Link 
                  href="/dashboard/manifestos" 
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isManifestos 
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold border-l-2 border-emerald-400' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 font-semibold'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Manifestos MTR
                </Link>

                <Link 
                  href="/dashboard/companies" 
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isEmpresas 
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold border-l-2 border-emerald-400' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 font-semibold'
                  }`}
                >
                  <Building2 className="w-4 h-4" /> Empresas do PIM
                </Link>
              </nav>

              <div className="space-y-1 pt-4 border-t border-zinc-900">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">Sistema</span>
                
                <Link 
                  href="/dashboard/notificacoes" 
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isNotificacoes 
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold border-l-2 border-emerald-400' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4" /> Notificações
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                    3
                  </span>
                </Link>

                <button 
                  onClick={() => alert('Configurações gerenciadas pelo IPAAM.')} 
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-semibold text-left"
                >
                  <Settings className="w-4 h-4 text-zinc-600" /> Configurações
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-900">
              <div className="flex items-center justify-between bg-[#0e1017] p-2.5 rounded-xl border border-zinc-800/80 mb-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-xs font-bold text-zinc-200">
                      PL
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0e1017]" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-zinc-200 block truncate">Pedro Lucas</span>
                    <span className="text-[9px] text-zinc-500 block truncate font-mono uppercase">Auditor PIM</span>
                  </div>
                </div>

                <button 
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition-all active:scale-95"
                  title="Encerrar Sessão"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <aside className={`h-screen sticky top-0 bg-[#090b10] text-zinc-400 flex flex-col justify-between border-r border-zinc-900/90 shrink-0 hidden lg:flex z-20 transition-all duration-300 ease-in-out ${
        recolhida ? 'w-20 p-3.5 items-center' : 'w-64 p-5'
      }`}>
        <div className="space-y-6 w-full">
          <div className={`flex items-center ${recolhida ? 'flex-col gap-3 justify-center' : 'justify-between'} px-1`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div 
                onClick={() => setRecolhida(!recolhida)}
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 shadow-sm cursor-pointer hover:border-emerald-500/40 transition-colors"
                title={recolhida ? "Expandir menu lateral" : "Recolher menu lateral"}
              >
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              
              {!recolhida && (
                <div className="space-y-0.5 overflow-hidden">
                  <span className="text-white font-bold tracking-tight text-xs block leading-none">AMAZON ECO</span>
                  <span className="text-[9px] font-semibold text-zinc-500 tracking-wider block uppercase font-mono">PIM MONITOR</span>
                </div>
              )}
            </div>

            {recolhida ? (
              <button 
                onClick={() => setRecolhida(false)}
                className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors shadow-sm"
                title="Expandir barra lateral"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => setRecolhida(true)}
                className="w-7 h-7 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 flex items-center justify-center text-zinc-400 hover:text-emerald-400 transition-colors"
                title="Recolher barra lateral"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-6 w-full">
            <div className="space-y-1 w-full">
              {!recolhida && (
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">
                  Operação
                </span>
              )}

              <Link 
                href="/dashboard" 
                title="Visão Geral"
                className={`flex items-center gap-3 rounded-xl text-xs transition-all ${
                  recolhida 
                    ? 'justify-center p-2.5' 
                    : 'px-3.5 py-2.5'
                } ${
                  isVisaoGeral 
                    ? recolhida
                      ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                      : 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent text-emerald-400 font-bold border-l-2 border-emerald-400 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 font-medium'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${isVisaoGeral ? 'text-emerald-400' : 'text-zinc-500'}`} />
                {!recolhida && <span>Visão Geral</span>}
              </Link>

              <Link 
                href="/dashboard/manifestos" 
                title="Manifestos MTR"
                className={`flex items-center gap-3 rounded-xl text-xs transition-all ${
                  recolhida 
                    ? 'justify-center p-2.5' 
                    : 'px-3.5 py-2.5'
                } ${
                  isManifestos 
                    ? recolhida
                      ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                      : 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent text-emerald-400 font-bold border-l-2 border-emerald-400 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 font-medium'
                }`}
              >
                <FileText className={`w-4 h-4 shrink-0 ${isManifestos ? 'text-emerald-400' : 'text-zinc-500'}`} />
                {!recolhida && <span>Manifestos MTR</span>}
              </Link>

              <Link 
                href="/dashboard/companies" 
                title="Empresas do PIM"
                className={`flex items-center gap-3 rounded-xl text-xs transition-all ${
                  recolhida 
                    ? 'justify-center p-2.5' 
                    : 'px-3.5 py-2.5'
                } ${
                  isEmpresas 
                    ? recolhida
                      ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                      : 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent text-emerald-400 font-bold border-l-2 border-emerald-400 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 font-medium'
                }`}
              >
                <Building2 className={`w-4 h-4 shrink-0 ${isEmpresas ? 'text-emerald-400' : 'text-zinc-500'}`} />
                {!recolhida && <span>Empresas do PIM</span>}
              </Link>
            </div>

            <div className="space-y-1 pt-3 border-t border-zinc-900/60 w-full">
              {!recolhida && (
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">
                  Sistema
                </span>
              )}

              <Link 
                href="/dashboard/notificacoes" 
                title="Notificações"
                className={`flex items-center rounded-xl text-xs transition-all ${
                  recolhida 
                    ? 'justify-center p-2.5 relative' 
                    : 'justify-between px-3.5 py-2.5'
                } ${
                  isNotificacoes 
                    ? recolhida
                      ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                      : 'bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent text-emerald-400 font-bold border-l-2 border-emerald-400 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className={`w-4 h-4 shrink-0 ${isNotificacoes ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  {!recolhida && <span>Notificações</span>}
                </div>

                {recolhida ? (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#090b10]" />
                ) : (
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/20">
                    3
                  </span>
                )}
              </Link>

              <button 
                onClick={() => alert('Configurações e parâmetros regulatórios gerenciados pelo IPAAM.')} 
                title="Configurações"
                className={`w-full flex items-center rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 text-xs font-medium transition-all ${
                  recolhida ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5 text-left'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0 text-zinc-500" />
                {!recolhida && <span>Configurações</span>}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-900/70 w-full">
          {recolhida ? (
            <div className="flex flex-col items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-xs font-bold text-zinc-200 relative"
                title="Pedro Lucas - Auditor PIM"
              >
                PL
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-[#090b10]" />
              </div>

              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition-all active:scale-95"
                title="Encerrar Sessão"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-[#0e1017] p-2.5 rounded-xl border border-zinc-800/80">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-xs font-bold text-zinc-200">
                    PL
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0e1017]" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-zinc-200 block truncate">Pedro Lucas</span>
                  <span className="text-[9px] text-zinc-500 block truncate font-mono uppercase">Auditor PIM</span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border border-zinc-800 transition-all active:scale-95 shrink-0"
                title="Encerrar Sessão"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}