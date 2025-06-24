import React, { useState } from 'react';
import { Plus, Package, Edit, Trash2, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { PackageModal } from './PackageModal';
import { mockPackages } from '../../utils/mockData';
import { Package as PackageType } from '../../types';

export function PackageManagement() {
  const [packages, setPackages] = useState<PackageType[]>(mockPackages);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || pkg.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || pkg.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddPackage = () => {
    setEditingPackage(null);
    setIsModalOpen(true);
  };

  const handleEditPackage = (pkg: PackageType) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleSavePackage = (packageData: Omit<PackageType, 'id'>) => {
    try {
      if (editingPackage) {
        setPackages(prev => prev.map(pkg => 
          pkg.id === editingPackage.id 
            ? { ...packageData, id: editingPackage.id }
            : pkg
        ));
        showNotification('success', 'Pacote atualizado com sucesso!');
      } else {
        const newPackage: PackageType = {
          ...packageData,
          id: Date.now().toString(),
        };
        setPackages(prev => [...prev, newPackage]);
        showNotification('success', 'Pacote criado com sucesso!');
      }
    } catch (error) {
      showNotification('error', 'Erro ao salvar pacote. Tente novamente.');
    }
  };

  const handleDeletePackage = (packageId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pacote?')) {
      setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
      showNotification('success', 'Pacote excluído com sucesso!');
    }
  };

  const handleToggleStatus = (packageId: string) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === packageId 
        ? { ...pkg, status: pkg.status === 'active' ? 'inactive' : 'active' }
        : pkg
    ));
    showNotification('success', 'Status do pacote atualizado!');
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    active: 'Ativo',
    inactive: 'Inativo',
  };

  const categoryColors = {
    A: 'bg-purple-100 text-purple-800',
    B: 'bg-blue-100 text-blue-800',
    C: 'bg-green-100 text-green-800',
    D: 'bg-orange-100 text-orange-800',
    E: 'bg-red-100 text-red-800',
  };

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
              placeholder="Buscar pacotes..."
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
              <option value="A">Categoria A</option>
              <option value="B">Categoria B</option>
              <option value="C">Categoria C</option>
              <option value="D">Categoria D</option>
              <option value="E">Categoria E</option>
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
        <button 
          onClick={handleAddPackage}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Pacote
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 text-sm font-medium">Total de Pacotes</p>
          <p className="text-2xl font-bold text-blue-900">{packages.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Ativos</p>
          <p className="text-2xl font-bold text-green-900">
            {packages.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-600 text-sm font-medium">Categoria B</p>
          <p className="text-2xl font-bold text-purple-900">
            {packages.filter(p => p.category === 'B').length}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-orange-600 text-sm font-medium">Preço Médio</p>
          <p className="text-2xl font-bold text-orange-900">
            R$ {Math.round(packages.reduce((sum, p) => sum + p.price, 0) / packages.length).toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                  <p className="text-sm text-gray-600">Categoria {pkg.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[pkg.category]}`}>
                  Cat. {pkg.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[pkg.status]}`}>
                  {statusLabels[pkg.status]}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Aulas Teóricas:</span>
                <span className="font-medium">{pkg.theoreticalHours}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Aulas Práticas:</span>
                <span className="font-medium">{pkg.practicalHours}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tentativas de Exame:</span>
                <span className="font-medium">{pkg.examAttempts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Validade:</span>
                <span className="font-medium">{pkg.validityDays} dias</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  R$ {pkg.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditPackage(pkg)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleToggleStatus(pkg.id)}
                className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                  pkg.status === 'active' 
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {pkg.status === 'active' ? 'Desativar' : 'Ativar'}
              </button>
              <button
                onClick={() => handleDeletePackage(pkg.id)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pacote encontrado</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou criar um novo pacote</p>
        </div>
      )}

      {/* Package Modal */}
      <PackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePackage}
        package={editingPackage}
      />
    </div>
  );
}