'use client';

import { useState, useEffect } from 'react';
import { api } from '../../services/api';

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
  
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    type: 'GENERATOR',
    address: '',
    licenseNumber: ''
  });

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
    try {
      await api.post('/companies', formData);
      setIsModalOpen(false);
      setFormData({ name: '', cnpj: '', type: 'GENERATOR', address: '', licenseNumber: '' });
      fetchCompanies(); 
      alert('Empresa cadastrada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao cadastrar empresa:', error);
      alert(error.response?.data?.message || 'Erro ao cadastrar empresa. Verifique o CNPJ.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Clientes / PIM</h1>
          <p className="text-sm text-gray-500">Gerenciamento de empresas geradoras, transportadoras e destinadoras.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Novo Cliente
        </button>
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando empresas...</div>
        ) : companies.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Nenhuma empresa cadastrada ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="p-4">Razão / Nome Fantasia</th>
                  <th className="p-4">CNPJ</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Endereço</th>
                  <th className="p-4">Nº Licença</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{company.name}</td>
                    <td className="p-4 text-gray-500">{company.cnpj}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        company.type === 'GENERATOR' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        company.type === 'TRANSPORTER' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        'bg-orange-50 text-orange-700 border-orange-100'
                      }`}>
                        {company.type === 'GENERATOR' ? 'Geradora' : 
                         company.type === 'TRANSPORTER' ? 'Transportadora' : 'Destinadora'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 max-w-xs truncate">{company.address}</td>
                    <td className="p-4 text-gray-500">{company.licenseNumber || '-'}</td>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Cadastrar Nova Empresa</h2>
              <p className="text-sm text-gray-500">Preencha os dados da empresa do PIM.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia / Razão Social</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Ex: Samsung Manaus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input 
                  type="text" required
                  value={formData.cnpj}
                  onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Empresa</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                >
                  <option value="GENERATOR">Geradora (PIM)</option>
                  <option value="TRANSPORTER">Transportadora</option>
                  <option value="DESTINATOR">Destinadora / Tratamento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                <input 
                  type="text" required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Av. Buriti, Distrito Industrial..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nº da Licença Ambiental (Opcional)</label>
                <input 
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Ex: IPAAM 123/2024"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Salvar Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}