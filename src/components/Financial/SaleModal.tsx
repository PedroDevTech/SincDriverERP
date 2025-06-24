import React, { useState, useEffect } from 'react';
import { X, User, Package, DollarSign, CreditCard, Receipt } from 'lucide-react';
import { mockStudents, mockPackages } from '../../utils/mockData';
import { Sale } from '../../types';

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: Omit<Sale, 'id'>) => void;
  sale?: Sale | null;
}

export function SaleModal({ isOpen, onClose, onSave, sale }: SaleModalProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    packageId: '',
    totalAmount: 0,
    discount: 0,
    paymentMethod: 'pix' as 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'installments',
    installments: 1,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sale) {
      setFormData({
        studentId: sale.studentId,
        packageId: sale.packageId,
        totalAmount: sale.totalAmount,
        discount: sale.discount,
        paymentMethod: sale.paymentMethod,
        installments: sale.installments || 1,
        notes: sale.notes || '',
      });
    } else {
      setFormData({
        studentId: '',
        packageId: '',
        totalAmount: 0,
        discount: 0,
        paymentMethod: 'pix',
        installments: 1,
        notes: '',
      });
    }
    setErrors({});
  }, [sale, isOpen]);

  useEffect(() => {
    if (formData.packageId) {
      const selectedPackage = mockPackages.find(p => p.id === formData.packageId);
      if (selectedPackage) {
        setFormData(prev => ({ ...prev, totalAmount: selectedPackage.price }));
      }
    }
  }, [formData.packageId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentId) {
      newErrors.studentId = 'Selecione um aluno';
    }

    if (!formData.packageId) {
      newErrors.packageId = 'Selecione um pacote';
    }

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = 'Valor total deve ser maior que zero';
    }

    if (formData.discount < 0) {
      newErrors.discount = 'Desconto não pode ser negativo';
    }

    if (formData.discount >= formData.totalAmount) {
      newErrors.discount = 'Desconto não pode ser maior ou igual ao valor total';
    }

    if (formData.paymentMethod === 'installments' && formData.installments < 2) {
      newErrors.installments = 'Parcelamento deve ter pelo menos 2 parcelas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const finalAmount = formData.totalAmount - formData.discount;
      const saleData = {
        ...formData,
        saleDate: sale?.saleDate || new Date().toISOString().split('T')[0],
        finalAmount,
        status: 'completed' as const,
        installments: formData.paymentMethod === 'installments' ? formData.installments : undefined,
      };
      
      onSave(saleData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const finalAmount = formData.totalAmount - formData.discount;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {sale ? 'Editar Venda' : 'Nova Venda'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seleção de Aluno e Pacote */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-600" />
              Informações da Venda
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aluno *
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.studentId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione um aluno</option>
                    {mockStudents.filter(s => s.status === 'active').map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} - Cat. {student.category}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.studentId && <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pacote *
                </label>
                <div className="relative">
                  <Package className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.packageId}
                    onChange={(e) => handleInputChange('packageId', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.packageId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione um pacote</option>
                    {mockPackages.filter(p => p.status === 'active').map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - R$ {pkg.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.packageId && <p className="text-red-500 text-sm mt-1">{errors.packageId}</p>}
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Valores
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Total *
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => handleInputChange('totalAmount', parseFloat(e.target.value) || 0)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.totalAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.totalAmount && <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desconto
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.discount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount}</p>}
              </div>
            </div>

            {/* Valor Final */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-blue-900">Valor Final:</span>
                <span className="text-2xl font-bold text-blue-900">
                  R$ {finalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              Forma de Pagamento
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pagamento *
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cash">Dinheiro</option>
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="debit_card">Cartão de Débito</option>
                  <option value="pix">PIX</option>
                  <option value="bank_transfer">Transferência Bancária</option>
                  <option value="installments">Parcelado</option>
                </select>
              </div>

              {formData.paymentMethod === 'installments' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Parcelas *
                  </label>
                  <input
                    type="number"
                    value={formData.installments}
                    onChange={(e) => handleInputChange('installments', parseInt(e.target.value) || 1)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.installments ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="2"
                    max="12"
                  />
                  {errors.installments && <p className="text-red-500 text-sm mt-1">{errors.installments}</p>}
                  {formData.installments > 1 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.installments}x de R$ {(finalAmount / formData.installments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Observações sobre a venda..."
            />
          </div>

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
              {sale ? 'Salvar Alterações' : 'Registrar Venda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}