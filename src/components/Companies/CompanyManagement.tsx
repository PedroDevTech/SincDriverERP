import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle, AlertCircle, Building, Mail, Phone, MapPin, Users } from 'lucide-react';
import { CompanyModal } from './CompanyModal';
import { BranchModal } from './BranchModal';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { useAuth } from '../../contexts/AuthContext';

export function CompanyManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { hasPermission } = useAuth();
  const { 
    data: companies, 
    loading: companiesLoading, 
    error: companiesError, 
    insert: insertCompany, 
    update: updateCompany, 
    remove: removeCompany 
  } = useSupabaseData('companies', {
    orderBy: { column: 'created_at', ascending: false }
  });

  const { 
    data: branches, 
    loading: branchesLoading, 
    insert: insertBranch, 
    update: updateBranch, 
    remove: removeBranch 
  } = useSupabaseData('branches', {
    orderBy: { column: 'created_at', ascending: false }
  });

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.cnpj.includes(searchTerm) ||
                         company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || company.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddCompany = () => {
    if (!hasPermission('settings', 'edit')) {
      showNotification('error', 'Você não tem permissão para criar empresas');
      return;
    }
    setEditingCompany(null);
    setIsCompanyModalOpen(true);
  };

  const handleEditCompany = (company: any) => {
    if (!hasPermission('settings', 'edit')) {
      showNotification('error', 'Você não tem permissão para editar empresas');
      return;
    }
    setEditingCompany(company);
    setIsCompanyModalOpen(true);
  };

  const handleSaveCompany = async (companyData: any) => {
    try {
      if (editingCompany) {
        const { error } = await updateCompany(editingCompany.id, companyData);
        if (error) {
          showNotification('error', error);
          return;
        }
        showNotification('success', 'Empresa atualizada com sucesso!');
      } else {
        const { error } = await insertCompany(companyData);
        if (error) {
          showNotification('error', error);
          return;
        }
        showNotification('success', 'Empresa cadastrada com sucesso!');
      }
    } catch (error) {
      showNotification('error', 'Erro ao salvar empresa. Tente novamente.');
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!hasPermission('settings', 'edit')) {
      showNotification('error', 'Você não tem permissão para excluir empresas');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja excluir esta empresa? Todos os dados relacionados serão perdidos.')) {
      const { error } = await removeCompany(companyId);
      if (error) {
        showNotification('error', error);
        return;
      }
      showNotification('success', 'Empresa excluída com sucesso!');
    }
  };

  const handleAddBranch = (companyId: string) => {
    if (!hasPermission('settings', 'edit')) {
      showNotification('error', 'Você não tem permissão para criar filiais');
      return;
    }
    setSelectedCompanyId(companyId);
    setEditingBranch(null);
    setIsBranchModalOpen(true);
  };

  const handleEditBranch = (branch: any) => {
    if (!hasPermission('settings', 'edit')) {
      showNotification('error', 'Você não tem permissão para editar filiais');
      return;
    }
    setSelectedCompanyId(branch.company_id);
    setEditingBranch(branch);
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = async (branchData: any) => {
    try {
      const dataWithCompany = { ...branchData, company_id: selectedCompanyId };
      
      if (editingBranch) {
        const { error } = await updateBranch(editingBranch.id, dataWithCompany);
        if (error) {
          showNotification('error', error);
          return;
        }
        showNotification('success', 'Filial atualizada com sucesso!');
      } else {
        const { error } = await insertBranch(dataWithCompany);
        if (error) {
          showNotification('error', error);
          return;
        }
        showNotification('success', 'Filial cadastrada com sucesso!');
      }
    } catch (error) {
      showNotification('error', 'Erro ao salvar filial. Tente novamente.');
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!hasPermission('settings', 'edit')) {
      showNotification('error', 'Você não tem permissão para excluir filiais');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja excluir esta filial?')) {
      const { error } = await removeBranch(branchId);
      if (error) {
        showNotification('error', error);
        return;
      }
      showNotification('success', 'Filial excluída com sucesso!');
    }
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    suspended: 'bg-yellow-100 text-yellow-800',
  };

  const statusLabels = {
    active: 'Ativa',
    inactive: 'Inativa',
    suspended: 'Suspensa',
  };

  const planColors = {
    basic: 'bg-blue-100 text-blue-800',
    premium: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-orange-100 text-orange-800',
  };

  const planLabels = {
    basic: 'Básico',
    premium: 'Premium',
    enterprise: 'Enterprise',
  };

  if (!hasPermission('settings', 'view')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Negado</h3>
          <p className="text-gray-600">Você não tem permissão para visualizar empresas</p>
        </div>
      </div>
    );
  }

  if (companiesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando empresas...</p>
        </div>
      </div>
    );
  }

  if (companiesError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao Carregar</h3>
          <p className="text-gray-600">{companiesError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar empresas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Todos Status</option>
              <option value="active">Ativa</option>
              <option value="inactive">Inativa</option>
              <option value="suspended">Suspensa</option>
            </select>
          </div>
        </div>
        {hasPermission('settings', 'edit') && (
          <button 
            onClick={handleAddCompany}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Nova Empresa
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 text-sm font-medium">Total</p>
          <p className="text-2xl font-bold text-blue-900">{companies.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Ativas</p>
          <p className="text-2xl font-bold text-green-900">
            {companies.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-600 text-sm font-medium">Premium</p>
          <p className="text-2xl font-bold text-purple-900">
            {companies.filter(c => c.subscription_plan === 'premium').length}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-orange-600 text-sm font-medium">Filiais</p>
          <p className="text-2xl font-bold text-orange-900">{branches.length}</p>
        </div>
      </div>

      {/* Companies List */}
      <div className="space-y-6">
        {filteredCompanies.map((company) => {
          const companyBranches = branches.filter(b => b.company_id === company.id);
          
          return (
            <div key={company.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Company Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                    <p className="text-sm text-gray-600">CNPJ: {company.cnpj}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {company.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {company.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${planColors[company.subscription_plan]}`}>
                    {planLabels[company.subscription_plan]}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[company.status]}`}>
                    {statusLabels[company.status]}
                  </span>
                  {hasPermission('settings', 'edit') && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditCompany(company)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteCompany(company.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Address */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                {company.address}
              </div>

              {/* Branches Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Filiais ({companyBranches.length})
                  </h4>
                  {hasPermission('settings', 'edit') && (
                    <button 
                      onClick={() => handleAddBranch(company.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      + Adicionar Filial
                    </button>
                  )}
                </div>

                {companyBranches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {companyBranches.map((branch) => (
                      <div key={branch.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">{branch.name}</h5>
                            <p className="text-sm text-gray-600">Código: {branch.code}</p>
                            <p className="text-sm text-gray-600 mt-1">{branch.address}</p>
                            {branch.phone && (
                              <p className="text-sm text-gray-600">{branch.phone}</p>
                            )}
                          </div>
                          {hasPermission('settings', 'edit') && (
                            <div className="flex gap-1">
                              <button 
                                onClick={() => handleEditBranch(branch)}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                Editar
                              </button>
                              <button 
                                onClick={() => handleDeleteBranch(branch.id)}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Nenhuma filial cadastrada</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma empresa encontrada</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou cadastrar uma nova empresa</p>
        </div>
      )}

      {/* Modals */}
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSave={handleSaveCompany}
        company={editingCompany}
      />

      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        onSave={handleSaveBranch}
        branch={editingBranch}
      />
    </div>
  );
}