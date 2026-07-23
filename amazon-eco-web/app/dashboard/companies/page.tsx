'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';
import { toast } from 'sonner';
import { 
  Search, 
  RefreshCw,
  Loader2,
  ShieldAlert,
  Trash2,
  Edit3,
  X,
  PlusCircle,
  FileCheck
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  type: string;
  address: string;
  licenseNumber?: string;
}

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'GENERATOR' | 'TRANSPORTER' | 'DESTINATOR'>('ALL');
  
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    type: 'GENERATOR',
    address: '',
    licenseNumber: ''
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    cnpj: '',
    type: 'GENERATOR',
    address: '',
    licenseNumber: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('@AmazonEco:token');
    if (!token) {
      router.push('/');
    } else {
      setEstaAutenticado(true);
      fetchCompanies();
    }
  }, []);

  function formatCNPJ(value: string) {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  }

  function isValidCNPJ(cnpj: string): boolean {
    const cleaned = cnpj.replace(/\D/g, '');

    if (cleaned.length !== 14) return false;
    if (/^(\d)\1+$/.test(cleaned)) return false; 

    let size = cleaned.length - 2;
    let numbers = cleaned.substring(0, size);
    const digits = cleaned.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += Number(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number(digits.charAt(0))) return false;

    size = size + 1;
    numbers = cleaned.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += Number(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number(digits.charAt(1))) return false;

    return true;
  }

  async function fetchCompanies() {
    try {
      setLoading(true);
      const token = localStorage.getItem('@AmazonEco:token');
      const response = await api.get('/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setCompanies(response.data);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCnpj = formData.cnpj.replace(/\D/g, '');
    if (!isValidCNPJ(cleanCnpj)) {
      toast.error('CNPJ inválido! Verifique os dígitos digitados.');
      return;
    }

    const token = localStorage.getItem('@AmazonEco:token');
    const toastId = toast.loading('Processando dados da empresa...');
    try {
      const cleanData = {
        ...formData,
        cnpj: cleanCnpj
      };

      await api.post('/companies', cleanData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      setFormData({ name: '', cnpj: '', type: 'GENERATOR', address: '', licenseNumber: '' });
      fetchCompanies(); 
      toast.success('Empresa cadastrada com sucesso!', { id: toastId });
    } catch (error: any) {
      console.error('Erro ao cadastrar empresa:', error);
      const errorMessage = error.response?.data?.message;
      const finalMessage = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage || 'Erro ao cadastrar empresa.';
      toast.error(finalMessage, { id: toastId });
    }
  };

  const handleOpenEditModal = (company: Company) => {
    setSelectedCompanyId(company.id);
    setEditFormData({
      name: company.name,
      cnpj: formatCNPJ(company.cnpj),
      type: company.type,
      address: company.address,
      licenseNumber: company.licenseNumber || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompanyId) return;

    const cleanCnpj = editFormData.cnpj.replace(/\D/g, '');
    if (!isValidCNPJ(cleanCnpj)) {
      toast.error('CNPJ inválido! Verifique os dígitos digitados.');
      return;
    }

    const token = localStorage.getItem('@AmazonEco:token');
    const toastId = toast.loading('Atualizando dados da empresa...');
    try {
      const cleanData = {
        ...editFormData,
        cnpj: cleanCnpj
      };

      await api.patch(`/companies/${selectedCompanyId}`, cleanData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditModalOpen(false);
      fetchCompanies();
      toast.success('Empresa atualizada com sucesso!', { id: toastId });
    } catch (error: any) {
      console.error('Erro ao atualizar empresa:', error);
      const errorMessage = error.response?.data?.message;
      const finalMessage = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage || 'Erro ao atualizar empresa.';
      toast.error(finalMessage, { id: toastId });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja remover a empresa "${name}" do sistema?`)) {
      return;
    }

    const token = localStorage.getItem('@AmazonEco:token');
    const toastId = toast.loading('Removendo empresa...');
    try {
      await api.delete(`/companies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCompanies();
      toast.success('Empresa removida com sucesso!', { id: toastId });
    } catch (error: any) {
      console.error('Erro ao deletar empresa:', error);
      toast.error('Erro ao remover empresa do sistema.', { id: toastId });
    }
  };

  if (!estaAutenticado) {
    return (
      <div className="min-h-screen bg-[#07080d] flex flex-col items-center justify-center gap-3 text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-xs font-mono font-bold tracking-widest uppercase animate-pulse">Verificando Credenciais...</span>
      </div>
    );
  }

  const companiesFiltradas = companies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.cnpj.includes(search.replace(/\D/g, ''));
    const matchesFilter = filter === 'ALL' || c.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-6">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Console &gt; Cadastro</span>
            <h1 className="text-xl font-black text-white tracking-tight mt-0.5">Credenciamento de Clientes / PIM</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Gerenciamento de empresas geradoras, transportadoras e destinadoras da Zona Franca.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={fetchCompanies}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 transition-all active:scale-95"
              title="Atualizar Tabela"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/10 transition-all w-full sm:w-auto"
            >
              <PlusCircle className="w-4 h-4" />
              Credenciar Nova Empresa
            </button>
          </div>
        </div>

        <div className="bg-[#12141c] p-4 rounded-2xl border border-zinc-800/60 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
          <div className="relative w-full md:max-w-md group">
            <Search className="w-4 h-4 text-zinc-600 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text" placeholder="Buscar por nome ou CNPJ..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#07080d] text-xs text-zinc-300 pl-11 pr-4 py-3 rounded-xl border border-zinc-800/80 focus:border-emerald-500/50 focus:outline-none transition-all placeholder-zinc-700 font-medium"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#07080d] p-1 rounded-xl border border-zinc-900 w-full md:w-auto overflow-x-auto select-none no-scrollbar">
            {([
              { id: 'ALL', label: 'Todos' },
              { id: 'GENERATOR', label: 'Geradora' },
              { id: 'TRANSPORTER', label: 'Transportadora' },
              { id: 'DESTINATOR', label: 'Destinadora' }
            ] as const).map((aba) => (
              <button
                key={aba.id} onClick={() => setFilter(aba.id)}
                className={`px-3.5 py-2 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                  filter === aba.id 
                    ? 'bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700/50' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#12141c] rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden relative">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-3 text-zinc-500">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase animate-pulse">Buscando indústrias no ledger...</span>
            </div>
          ) : companiesFiltradas.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center gap-2 text-zinc-600 border border-dashed border-zinc-900 m-4 rounded-xl">
              <ShieldAlert className="w-7 h-7 text-zinc-700" />
              <span className="text-xs font-semibold text-zinc-400">Nenhuma organização localizada</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/10 text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500">
                    <th className="px-6 py-4.5">Razão / Nome Fantasia</th>
                    <th className="px-6 py-4.5">CNPJ</th>
                    <th className="px-6 py-4.5">Perfil Atuação</th>
                    <th className="px-6 py-4.5">Endereço Operacional</th>
                    <th className="px-6 py-4.5">Nº Licença IPAAM</th>
                    <th className="px-6 py-4.5 text-center">Ações de Gestão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60 text-xs font-medium text-zinc-300">
                  {companiesFiltradas.map((company) => (
                    <tr key={company.id} className="hover:bg-zinc-900/20 transition-colors group">
                      <td className="px-6 py-4 font-semibold text-white group-hover:text-emerald-300 transition-colors">{company.name}</td>
                      <td className="px-6 py-4 font-mono text-zinc-400">
                        {company.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase border ${
                          company.type === 'GENERATOR' ? 'bg-blue-500/5 text-blue-400 border-blue-500/10' :
                          company.type === 'TRANSPORTER' ? 'bg-purple-500/5 text-purple-400 border-purple-500/10' :
                          'bg-amber-500/5 text-amber-400 border-amber-500/10'
                        }`}>
                          {company.type === 'GENERATOR' ? 'Geradora' : 
                           company.type === 'TRANSPORTER' ? 'Transportadora' : 'Destinadora'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 max-w-xs truncate">{company.address}</td>
                      <td className="px-6 py-4 font-mono text-zinc-500">{company.licenseNumber || '-'}</td>
                      
                      <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEditModal(company)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 border border-zinc-800/80 transition-all inline-flex items-center shadow-md"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id, company.name)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 border border-zinc-800/80 transition-all inline-flex items-center shadow-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 border-t border-zinc-900 bg-zinc-900/10 flex justify-between items-center text-[10px] text-zinc-600 font-mono font-bold uppercase tracking-wider">
            <span>Organizações Indexadas: {companiesFiltradas.length}</span>
            <span className="text-emerald-500/40 flex items-center gap-1"></span>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#12141c] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-800/80">
            <div className="p-5 border-b border-zinc-900 bg-[#0b0c10] flex justify-between items-center">
              <h2 className="text-sm font-black text-white font-mono flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" /> CREDENCIAR NOVA EMPRESA
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800/60"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Nome Fantasia / Razão Social</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#07080d] border border-zinc-800 px-3 py-2 rounded-xl text-zinc-200 focus:border-emerald-500/40 outline-none" placeholder="Ex: Samsung Manaus" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">CNPJ</label>
                <input type="text" required value={formData.cnpj} onChange={(e) => setFormData({...formData, cnpj: formatCNPJ(e.target.value)})} className="w-full bg-[#07080d] border border-zinc-800 px-3 py-2 rounded-xl text-zinc-200 focus:border-emerald-500/40 outline-none font-mono" placeholder="00.000.000/0000-00" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Perfil de Atuação</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-[#07080d] border border-zinc-800 px-3 py-2 rounded-xl text-zinc-300 focus:border-emerald-500/40 outline-none">
                  <option value="GENERATOR">Geradora (Indústria PIM)</option>
                  <option value="TRANSPORTER">Transportadora Logística</option>
                  <option value="DESTINATOR">Destinadora / Tratamento Final</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Endereço Operacional</label>
                <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-[#07080d] border border-zinc-800 px-3 py-2 rounded-xl text-zinc-200 focus:border-emerald-500/40 outline-none" placeholder="Av. Buriti, Distrito Industrial" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Nº da Licença Ambiental IPAAM (Opcional)</label>
                <input type="text" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} className="w-full bg-[#07080d] border border-zinc-800 px-3 py-2 rounded-xl text-zinc-200 focus:border-emerald-500/40 outline-none font-mono" placeholder="Ex: 123/2026" />
              </div>
              <div className="flex gap-3 pt-3 border-t border-zinc-900">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 text-zinc-500 font-bold border border-zinc-800/40 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-lg">Salvar Empresa</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#12141c] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-zinc-800/80">
            <div className="p-5 border-b border-zinc-900 bg-[#0b0c10] flex justify-between items-center">
              <h2 className="text-sm font-black text-white font-mono flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-400" /> ATUALIZAR CADASTRO
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 rounded-lg bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800/60"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Nome Fantasia / Razão Social</label>
                <input type="text" required value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-[#07080d] border border-zinc-800 px-3 py-2 rounded-xl text-zinc-200 focus:border-emerald-500/40 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">CNPJ</label>
                <input type="text" required value={editFormData.cnpj} onChange={(e) => setEditFormData({...editFormData, cnpj: formatCNPJ(e.target.value)})} className="w-full bg-[#07080d] border border-zinc-800 px-3 py-2 rounded-xl text-zinc-200 focus:border-emerald-500/40 outline-none font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Perfil de Atuação</label>
                <select value={editFormData.type} onChange={(e) => setEditFormData({...editFormData, type: e.target.value})} className="w-full bg-[#07080d] border border-zinc-800 px-3 py-2 rounded-xl text-zinc-300 focus:border-emerald-500/40 outline-none">
                  <option value="GENERATOR">Geradora (Indústria PIM)</option>
                  <option value="TRANSPORTER">Transportadora Logística</option>
                  <option value="DESTINATOR">Destinadora / Tratamento Final</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Endereço Operacional</label>
                <input type="text" required value={editFormData.address} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} className="w-full bg-[#07080d] border border-zinc-800 px-3 py-2 rounded-xl text-zinc-200 focus:border-emerald-500/40 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Nº da Licença Ambiental IPAAM</label>
                <input type="text" value={editFormData.licenseNumber} onChange={(e) => setEditFormData({...editFormData, licenseNumber: e.target.value})} className="w-full bg-[#07080d] border border-zinc-800 px-3 py-2 rounded-xl text-zinc-200 focus:border-emerald-500/40 outline-none font-mono" />
              </div>
              <div className="flex gap-3 pt-3 border-t border-zinc-900">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 text-zinc-500 font-bold border border-zinc-800/40 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-colors shadow-lg">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}