import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import { VehicleCard } from './VehicleCard';
import { VehicleModal } from './VehicleModal';
import { mockVehicles } from '../../utils/mockData';
import { Vehicle } from '../../types';

export function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || vehicle.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || vehicle.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleSaveVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      if (editingVehicle) {
        setVehicles(prev => prev.map(vehicle => 
          vehicle.id === editingVehicle.id 
            ? { ...vehicleData, id: editingVehicle.id }
            : vehicle
        ));
        showNotification('success', 'Veículo atualizado com sucesso!');
      } else {
        const newVehicle: Vehicle = {
          ...vehicleData,
          id: Date.now().toString(),
        };
        setVehicles(prev => [...prev, newVehicle]);
        showNotification('success', 'Veículo cadastrado com sucesso!');
      }
    } catch (error) {
      showNotification('error', 'Erro ao salvar veículo. Tente novamente.');
    }
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId));
      showNotification('success', 'Veículo excluído com sucesso!');
    }
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

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar veículos..."
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
              <option value="available">Disponível</option>
              <option value="maintenance">Manutenção</option>
              <option value="unavailable">Indisponível</option>
            </select>
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
        </div>
        <button 
          onClick={handleAddVehicle}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Veículo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 text-sm font-medium">Total de Veículos</p>
          <p className="text-2xl font-bold text-blue-900">{vehicles.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Disponíveis</p>
          <p className="text-2xl font-bold text-green-900">
            {vehicles.filter(v => v.status === 'available').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-600 text-sm font-medium">Em Manutenção</p>
          <p className="text-2xl font-bold text-yellow-900">
            {vehicles.filter(v => v.status === 'maintenance').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-600 text-sm font-medium">Categoria B</p>
          <p className="text-2xl font-bold text-purple-900">
            {vehicles.filter(v => v.category === 'B').length}
          </p>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteVehicle}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum veículo encontrado</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou termos de busca</p>
        </div>
      )}

      {/* Vehicle Modal */}
      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVehicle}
        vehicle={editingVehicle}
      />
    </div>
  );
}