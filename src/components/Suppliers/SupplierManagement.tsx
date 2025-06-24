import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle, AlertCircle, Building, Mail, Phone, MapPin } from 'lucide-react';
import { SupplierModal } from './SupplierModal';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { useAuth } from '../../contexts/AuthContext';

export function SupplierManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { hasPermission } = useAuth();
  const { 
    data: suppliers, 
    loading, 
    error, 
    insert, 
    update, 
    remove 
  } = useSupabaseData('suppliers', {
    orderBy: { column: 'created_at', ascending: false }
  });

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (supplier.cnpj && supplier.cnpj.includes(searchTerm)) ||
                         (supplier.cpf && supplier.cpf.includes(searchTerm));
    const matchesCategory = filterCategory === 'all' || supplier.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || supplier.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddSupplier = () => {
    if (!hasPermission('financial', 'create')) {
      showNotification('error', 'Você não tem permissão para criar fornecedores');
      return;
    }
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleEditSupplier = (supplier: any) => {
    if (!hasPermission('financial', 'edit')) {
      showNotification('error', 'Você não tem permissão para editar fornecedores');
      return;
    }
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleSaveSupplier = async (supplierData: any) => {
    try {
      if (editingSupplier) {
        const { error } = await update(editingSupplier.id, supplierData);
        if (error) {
          showNotification('error', error);
          return;
        }
        showNotification('success', 'Fornecedor atualizado com sucesso!');
      } else {
        const { error } = await insert(supplierData);
        if (error) {
          showNotification('error', error);
          return;
        }
        showNotification('success', 'Fornecedor cadastrado com sucesso!');
      }
    } catch (error) {
      showNotification('error', 'Erro ao salvar fornecedor. Tente novamente.');
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    if (!hasPermission('financial', 'delete')) {
      showNotification('error', 'Você não tem permissão para excluir fornecedores');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      const { error } = await remove(supplierId);
      if (error) {
        showNotification('error', error);
        return;
      }
      showNotification('success', 'Fornecedor excluído com sucesso!');
    }
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    active: 'Ativo',
    inactive: 'Inativo',
  };

  const categoryLabels = {
    fuel: 'Combustível',
    maintenance: 'Manutenção',
    supplies: 'Suprimentos',
    services: 'Serviços',
    other: 'Outros',
  };

  const categoryColors = {
    fuel: 'bg-red-100 text-red-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    supplies: 'bg-blue-100 text-blue-800',
    services: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800',
  };

  if (!hasPermission('financial', 'view')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Negado</h3>
          <p className="text-gray-600">Você não tem permissão para visualizar fornecedores</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando fornecedores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao Carregar</h3>
          <p className="text-gray-600">{error}</p>
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
              placeholder="Buscar por nome, email, CNPJ ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Todas Categorias</option>
              <option value="fuel">Combustível</option>
              <option value="maintenance">Manutenção</option>
              <option value="supplies">Suprimentos</option>
              <option value="services">Serviços</option>
              <option value="other">Outros</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Todos Status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>
        {hasPermission('financial', 'create') && (
          <button 
            onClick={handleAddSupplier}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Novo Fornecedor
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 text-sm font-medium">Total</p>
          <p className="text-2xl font-bold text-blue-900">{suppliers.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Ativos</p>
          <p className="text-2xl font-bold text-green-900">
            {suppliers.filter(s => s.status === 'active').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 text-sm font-medium">Combustível</p>
          <p className="text-2xl font-bold text-red-900">
            {suppliers.filter(s => s.category === 'fuel').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-600 text-sm font-medium">Manutenção</p>
          <p className="text-2xl font-bold text-yellow-900">
            {suppliers.filter(s => s.category === 'maintenance').length}
          </p>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                  <p className="text-sm text-gray-600">
                    {supplier.cnpj ? `CNPJ: ${supplier.cnpj}` : `CPF: ${supplier.cpf}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[supplier.category]}`}>
                  {categoryLabels[supplier.category]}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[supplier.status]}`}>
                  {statusLabels[supplier.status]}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span className="line-clamp-2">{supplier.address}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {hasPermission('financial', 'edit') && (
                <button
                  onClick={() => handleEditSupplier(supplier)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                >
                  Editar
                </button>
              )}
              {hasPermission('financial', 'delete') && (
                <button
                  onClick={() => handleDeleteSupplier(supplier.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors font-medium"
                >
                  Excluir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum fornecedor encontrado</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou cadastrar um novo fornecedor</p>
        </div>
      )}

      {/* Supplier Modal */}
      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSupplier}
        supplier={editingSupplier}
      />
    </div>
  );
}