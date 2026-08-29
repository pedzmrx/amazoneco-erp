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
  ChevronRight,
  Search,
  Plus
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
      router.push('/login');
    } else {
      setEstaAutenticado(true);
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('@AmazonEco:token');
    document.cookie = '@AmazonEco:token=; path=/; max-age=0; SameSite=Lax';
    router.push('/login');
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

  let pageTitle = 'Visão Geral';
  if (isManifestos) pageTitle = 'Manifestos MTR';
  if (isEmpresas) pageTitle = 'Empresas do PIM';
  if (isNotificacoes) pageTitle = 'Notificações';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#07090e] text-zinc-100 font-sans antialiased w-full">
      <header className="lg:hidden bg-[#090b10] border-b border-zinc-900 px-4 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-white font-bold tracking-tight text-sm">AMAZON ECO</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/manifestos/novo"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo MTR
          </Link>
          <button 
            onClick={() => setMenuAberto(!menuAberto)} 
            className="p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 transition-all active:scale-95"
            aria-label="Alternar Menu"
          >
            {menuAberto ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
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
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="text-white font-bold text-sm tracking-tight">AMAZON ECO</span>
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
                      ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 font-medium'
                  }`}
                >
                  <LayoutDashboard className={`w-4 h-4 ${isVisaoGeral ? 'text-zinc-950' : 'text-zinc-400'}`} /> Visão Geral
                </Link>

                <Link 
                  href="/dashboard/manifestos" 
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isManifestos 
                      ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 font-medium'
                  }`}
                >
                  <FileText className={`w-4 h-4 ${isManifestos ? 'text-zinc-950' : 'text-zinc-400'}`} /> Manifestos MTR
                </Link>

                <Link 
                  href="/dashboard/companies" 
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isEmpresas 
                      ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 font-medium'
                  }`}
                >
                  <Building2 className={`w-4 h-4 ${isEmpresas ? 'text-zinc-950' : 'text-zinc-400'}`} /> Empresas do PIM
                </Link>
              </nav>

              <div className="space-y-1 pt-4 border-t border-zinc-900">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-3 block mb-2 font-mono">Sistema</span>
                
                <Link 
                  href="/dashboard/notificacoes" 
                  onClick={() => setMenuAberto(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isNotificacoes 
                      ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bell className={`w-4 h-4 ${isNotificacoes ? 'text-zinc-950' : 'text-zinc-400'}`} /> Notificações
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                    isNotificacoes 
                      ? 'bg-zinc-950/20 text-zinc-950' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    3
                  </span>
                </Link>

                <button 
                  onClick={() => alert('Configurações gerenciadas pelo IPAAM.')} 
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 text-xs font-medium text-left"
                >
                  <Settings className="w-4 h-4 text-zinc-500" /> Configurações
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-900">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                      PL
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#090b10]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">Pedro Lucas</span>
                    <span className="text-[9px] text-zinc-500 block font-mono">Auditor PIM</span>
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
        recolhida ? 'w-20 p-3.5 items-center' : 'w-60 p-5'
      }`}>
        <div className="space-y-6 w-full">
          <div className={`flex items-center ${recolhida ? 'flex-col gap-3 justify-center' : 'justify-between'} px-1`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div 
                onClick={() => setRecolhida(!recolhida)}
                className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-sm cursor-pointer hover:border-emerald-500/50 transition-colors"
                title={recolhida ? "Expandir menu lateral" : "Recolher menu lateral"}
              >
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              
              {!recolhida && (
                <span className="text-white font-bold tracking-tight text-sm block leading-none">AMAZON ECO</span>
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
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 font-medium'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${isVisaoGeral ? 'text-zinc-950' : 'text-zinc-500'}`} />
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
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 font-medium'
                }`}
              >
                <FileText className={`w-4 h-4 shrink-0 ${isManifestos ? 'text-zinc-950' : 'text-zinc-500'}`} />
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
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 font-medium'
                }`}
              >
                <Building2 className={`w-4 h-4 shrink-0 ${isEmpresas ? 'text-zinc-950' : 'text-zinc-500'}`} />
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
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-500/20' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className={`w-4 h-4 shrink-0 ${isNotificacoes ? 'text-zinc-950' : 'text-zinc-500'}`} />
                  {!recolhida && <span>Notificações</span>}
                </div>

                {recolhida ? (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#090b10]" />
                ) : (
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                    isNotificacoes 
                      ? 'bg-zinc-950/20 text-zinc-950' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
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
                className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400 relative"
                title="Pedro Lucas - Auditor PIM"
              >
                PL
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#090b10]" />
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
            <div className="flex items-center justify-between px-1 py-1">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                    PL
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#090b10]" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-zinc-200 block truncate">Pedro Lucas</span>
                  <span className="text-[9px] text-zinc-500 block truncate font-mono">Auditor PIM</span>
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
        <header className="hidden lg:flex items-center justify-between h-16 px-8 border-b border-zinc-900 bg-[#07090e]/80 backdrop-blur-md sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Buscar manifesto, empresa..."
                className="bg-zinc-900/70 text-xs text-zinc-200 placeholder-zinc-500 pl-8 pr-12 py-1.5 rounded-full border border-zinc-800 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 w-56 transition-all"
              />
              <span className="absolute right-2 px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] font-mono text-zinc-400 border border-zinc-700">
                ⌘K
              </span>
            </div>

            <Link 
              href="/dashboard/notificacoes" 
              className="relative p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all"
              title="Notificações"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#07090e]" />
            </Link>

            <Link 
              href="/dashboard/manifestos/novo"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Novo MTR
            </Link>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}