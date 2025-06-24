import React from 'react';
import { Car, Calendar, Fuel, Settings, Edit, Trash2, Wrench } from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string) => void;
}

const statusColors = {
  available: 'bg-green-100 text-green-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  unavailable: 'bg-red-100 text-red-800',
};

const statusLabels = {
  available: 'Disponível',
  maintenance: 'Manutenção',
  unavailable: 'Indisponível',
};

const categoryColors = {
  A: 'bg-purple-100 text-purple-800',
  B: 'bg-blue-100 text-blue-800',
  C: 'bg-green-100 text-green-800',
  D: 'bg-orange-100 text-orange-800',
  E: 'bg-red-100 text-red-800',
};

export function VehicleCard({ vehicle, onEdit, onDelete }: VehicleCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Car className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{vehicle.brand} {vehicle.model}</h3>
            <p className="text-sm text-gray-600">{vehicle.year} • {vehicle.plate}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[vehicle.category]}`}>
            Cat. {vehicle.category}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[vehicle.status]}`}>
            {statusLabels[vehicle.status]}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Fuel className="w-4 h-4" />
          <span className="capitalize">{vehicle.fuelType}</span>
          <span className="text-gray-400">•</span>
          <Settings className="w-4 h-4" />
          <span className="capitalize">{vehicle.transmission}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: vehicle.color.toLowerCase() }}></div>
          <span>{vehicle.color}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Cadastrado em {new Date(vehicle.registrationDate).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {vehicle.status === 'maintenance' && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <Wrench className="w-4 h-4" />
            <span className="text-sm font-medium">Em manutenção</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(vehicle)}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
        <button
          onClick={() => onDelete(vehicle.id)}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors font-medium"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}