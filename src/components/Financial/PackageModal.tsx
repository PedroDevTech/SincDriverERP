import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Clock, Award, Calendar } from 'lucide-react';
import { Package as PackageType } from '../../types';

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (packageData: Omit<PackageType, 'id'>) => void;
  package?: PackageType | null;
}

export function PackageModal({ isOpen, onClose, onSave, package: pkg }: PackageModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'B' as 'A' | 'B' | 'C' | 'D' | 'E',
    price: 0,
    theoreticalHours: 45,
    practicalHours: 20,
    examAttempts: 2,
    validityDays: 365,
    status: 'active' as 'active' | 'inactive',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name,
        description: pkg.description,
        category: pkg.category,
        price: pkg.price,
        theoreticalHours: pkg.theoreticalHours,
        practicalHours: pkg.practicalHours,
        examAttempts: pkg.examAttempts,
        validityDays: pkg.validityDays,
        status: pkg.status,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'B',
        price: 0,
        theoreticalHours: 45,
        practicalHours: 20,
        examAttempts: 2,
        validityDays: 365,
        status: 'active',
      });
    }
    setErrors({});
  }, [pkg, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero';
    }

    if (formData.theoreticalHours <= 0) {
      newErrors.theoreticalHours = 'Horas teóricas devem ser maior que zero';
    }

    if (formData.practicalHours <= 0) {
      newErrors.practicalHours = 'Horas práticas devem ser maior que zero';
    }

    if (formData.examAttempts <= 0) {
      newErrors.examAttempts = 'Tentativas de exame devem ser maior que zero';
    }

    if (formData.validityDays <= 0) {
      newErrors.validityDays = 'Validade deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const packageData = {
        ...formData,
        createdDate: pkg?.createdDate || new Date().toISOString().split('T')[0],
      };
      
      onSave(packageData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {pkg ? 'Editar Pacote' : 'Novo Pacote'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Informações do Pacote
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Pacote *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Pacote Categoria B - Básico"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descreva o que está incluído no pacote"
                  rows={3}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria CNH *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="A">Categoria A - Motocicleta</option>
                  <option value="B">Categoria B - Automóvel</option>
                  <option value="C">Categoria C - Caminhão</option>
                  <option value="D">Categoria D - Ônibus</option>
                  <option value="E">Categoria E - Carreta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço *
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
            </div>
          </div>

          {/* Conteúdo do Pacote */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Conteúdo do Pacote
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aulas Teóricas (horas) *
                </label>
                <input
                  type="number"
                  value={formData.theoreticalHours}
                  onChange={(e) => handleInputChange('theoreticalHours', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.theoreticalHours ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="1"
                />
                {errors.theoreticalHours && <p className="text-red-500 text-sm mt-1">{errors.theoreticalHours}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aulas Práticas (horas) *
                </label>
                <input
                  type="number"
                  value={formData.practicalHours}
                  onChange={(e) => handleInputChange('practicalHours', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.practicalHours ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min="1"
                />
                {errors.practicalHours && <p className="text-red-500 text-sm mt-1">{errors.practicalHours}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tentativas de Exame *
                </label>
                <div className="relative">
                  <Award className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.examAttempts}
                    onChange={(e) => handleInputChange('examAttempts', parseInt(e.target.value) || 0)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.examAttempts ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="1"
                  />
                </div>
                {errors.examAttempts && <p className="text-red-500 text-sm mt-1">{errors.examAttempts}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validade (dias) *
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.validityDays}
                    onChange={(e) => handleInputChange('validityDays', parseInt(e.target.value) || 0)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.validityDays ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="1"
                  />
                </div>
                {errors.validityDays && <p className="text-red-500 text-sm mt-1">{errors.validityDays}</p>}
              </div>
            </div>
          </div>

          {/* Status */}
          {pkg && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Status do Pacote</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Atual
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {pkg ? 'Salvar Alterações' : 'Criar Pacote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}