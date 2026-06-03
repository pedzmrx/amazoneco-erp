'use client';

import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { toast } from 'sonner';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  type: string;
  address: string;
  licenseNumber?: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
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

  function formatCNPJ(value: string) {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  }

  async function fetchCompanies() {
    try {
      setLoading(true);
      const response = await api.get('/companies');
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('Processando dados da empresa...');
    try {
      const cleanData = {
        ...formData,
        cnpj: formData.cnpj.replace(/\D/g, '')
      };

      await api.post('/companies', cleanData);
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

    const toastId = toast.loading('Atualizando dados da empresa...');
    try {
      const cleanData = {
        ...editFormData,
        cnpj: editFormData.cnpj.replace(/\D/g, '')
      };

      await api.patch(`/companies/${selectedCompanyId}`, cleanData);
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

    const toastId = toast.loading('Removendo empresa...');
    try {
      await api.delete(`/companies/${id}`);
      fetchCompanies();
      toast.success('Empresa removida com sucesso!', { id: toastId });
    } catch (error: any) {
      console.error('Erro ao deletar empresa:', error);
      toast.error('Erro ao remover empresa do sistema.', { id: toastId });
    }
  };

  const companiesFiltradas = companies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.cnpj.includes(search.replace(/\D/g, ''));
    const matchesFilter = filter === 'ALL' || c.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">Clientes / PIM</h1>
          <p className="text-sm text-gray-500">Gerenciamento de empresas geradoras, transportadoras e destinadoras.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Novo Cliente
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border shadow-sm">
        <input 
          type="text"
          placeholder="Buscar por nome ou CNPJ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-lg border border-gray-300 dark:border-zinc-700 px-3 py-2 bg-transparent text-sm focus:ring-2 focus:ring-green-500 outline-none"
        />

        <div className="flex flex-wrap gap-2 text-xs">
          {(['ALL', 'GENERATOR', 'TRANSPORTER', 'DESTINATOR'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                filter === type 
                  ? 'bg-green-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              {type === 'ALL' ? 'Todos' : type === 'GENERATOR' ? 'Geradora' : type === 'TRANSPORTER' ? 'Transportadora' : 'Destinadora'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando empresas...</div>
        ) : companiesFiltradas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nenhuma empresa encontrada com os filtros selecionados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider">
                  <th className="p-4">Razão / Nome Fantasia</th>
                  <th className="p-4">CNPJ</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Endereço</th>
                  <th className="p-4">Nº Licença</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-sm text-gray-700 dark:text-zinc-300">
                {companiesFiltradas.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-zinc-100">{company.name}</td>
                    <td className="p-4 text-gray-500 dark:text-zinc-400">
                      {company.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        company.type === 'GENERATOR' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30' :
                        company.type === 'TRANSPORTER' ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30' :
                        'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30'
                      }`}>
                        {company.type === 'GENERATOR' ? 'Geradora' : 
                         company.type === 'TRANSPORTER' ? 'Transportadora' : 'Destinadora'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 dark:text-zinc-400 max-w-xs truncate">{company.address}</td>
                    <td className="p-4 text-gray-500 dark:text-zinc-400">{company.licenseNumber || '-'}</td>
                    
                    <td className="p-4 text-center space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditModal(company)}
                        className="text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 px-2.5 py-1 rounded font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(company.id, company.name)}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-950/60 dark:text-red-400 px-2.5 py-1 rounded font-medium transition-colors"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border dark:border-zinc-800">
            <div className="p-6 border-b dark:border-zinc-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">Cadastrar Nova Empresa</h2>
              <p className="text-sm text-gray-500">Preencha os dados da empresa do PIM.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-1">Nome Fantasia / Razão Social</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-zinc-700 rounded-lg bg-transparent focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Ex: Samsung Manaus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-1">CNPJ</label>
                <input 
                  type="text" required
                  value={formData.cnpj}
                  onChange={(e) => setFormData({...formData, cnpj: formatCNPJ(e.target.value)})}
                  className="w-full px-3 py-2 border dark:border-zinc-700 rounded-lg bg-transparent focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-1">Tipo de Empresa</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-zinc-800"
                >
                  <option value="GENERATOR">Geradora (PIM)</option>
                  <option value="TRANSPORTER">Transportadora</option>
                  <option value="DESTINATOR">Destinadora / Tratamento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-1">Endereço Completo</label>
                <input 
                  type="text" required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-zinc-700 rounded-lg bg-transparent focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Av. Buriti, Distrito Industrial..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-1">Nº da Licença Ambiental (Opcional)</label>
                <input 
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-zinc-700 rounded-lg bg-transparent focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Ex: IPAAM 123/2024"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t dark:border-zinc-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border dark:border-zinc-800 rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                >
                  Salvar Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border dark:border-zinc-800">
            <div className="p-6 border-b dark:border-zinc-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">Editar Empresa</h2>
              <p className="text-sm text-gray-500">Altere as informações necessárias do cliente.</p>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-1">Nome Fantasia / Razão Social</label>
                <input 
                  type="text" required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-zinc-700 rounded-lg bg-transparent focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-1">CNPJ</label>
                <input 
                  type="text" required
                  value={editFormData.cnpj}
                  onChange={(e) => setEditFormData({...editFormData, cnpj: formatCNPJ(e.target.value)})}
                  className="w-full px-3 py-2 border dark:border-zinc-700 rounded-lg bg-transparent focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-1">Tipo de Empresa</label>
                <select 
                  value={editFormData.type}
                  onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-zinc-800"
                >
                  <option value="GENERATOR">Geradora (PIM)</option>
                  <option value="TRANSPORTER">Transportadora</option>
                  <option value="DESTINATOR">Destinadora / Tratamento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-1">Endereço Completo</label>
                <input 
                  type="text" required
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-zinc-700 rounded-lg bg-transparent focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400 mb-1">Nº da Licença Ambiental</label>
                <input 
                  type="text"
                  value={editFormData.licenseNumber}
                  onChange={(e) => setEditFormData({...editFormData, licenseNumber: e.target.value})}
                  className="w-full px-3 py-2 border dark:border-zinc-700 rounded-lg bg-transparent focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t dark:border-zinc-800">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 border dark:border-zinc-800 rounded-lg text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}