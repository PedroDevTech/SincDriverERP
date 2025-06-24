import React, { useState } from 'react';
import { ShoppingCart, User, Package, DollarSign, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { mockStudents, mockPackages } from '../../utils/mockData';
import { Sale } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface QuickSaleProps {
  onSaleComplete: (sale: Omit<Sale, 'id'>) => void;
}

export function QuickSale({ onSaleComplete }: QuickSaleProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    packageId: '',
    discount: 0,
    paymentMethod: 'pix' as 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'installments',
    installments: 1,
  });

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { user } = useAuth();

  const selectedPackage = mockPackages.find(p => p.id === formData.packageId);
  const totalAmount = selectedPackage?.price || 0;
  const finalAmount = totalAmount - formData.discount;

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.packageId) {
      showNotification('error', 'Selecione um aluno e um pacote');
      return;
    }

    if (formData.discount >= totalAmount) {
      showNotification('error', 'Desconto não pode ser maior ou igual ao valor total');
      return;
    }

    const saleData = {
      studentId: formData.studentId,
      packageId: formData.packageId,
      saleDate: new Date().toISOString().split('T')[0],
      totalAmount,
      discount: formData.discount,
      finalAmount,
      paymentMethod: formData.paymentMethod,
      installments: formData.paymentMethod === 'installments' ? formData.installments : undefined,
      status: 'completed' as const,
      sellerId: user?.id || '1',
    };

    onSaleComplete(saleData);
    showNotification('success', 'Venda realizada com sucesso!');
    
    // Reset form
    setFormData({
      studentId: '',
      packageId: '',
      discount: 0,
      paymentMethod: 'pix',
      installments: 1,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
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

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Venda Rápida</h3>
          <p className="text-sm text-gray-600">Registre uma nova venda de pacote</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aluno *
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={formData.studentId}
                onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um aluno</option>
                {mockStudents.filter(s => s.status === 'active').map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} - Cat. {student.category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pacote *
            </label>
            <div className="relative">
              <Package className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={formData.packageId}
                onChange={(e) => setFormData(prev => ({ ...prev, packageId: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um pacote</option>
                {mockPackages.filter(p => p.status === 'active').map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - R$ {pkg.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
            </div>
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
                onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Forma de Pagamento *
            </label>
            <div className="relative">
              <CreditCard className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cash">Dinheiro</option>
                <option value="credit_card">Cartão de Crédito</option>
                <option value="debit_card">Cartão de Débito</option>
                <option value="pix">PIX</option>
                <option value="bank_transfer">Transferência</option>
                <option value="installments">Parcelado</option>
              </select>
            </div>
          </div>

          {formData.paymentMethod === 'installments' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Parcelas
              </label>
              <input
                type="number"
                value={formData.installments}
                onChange={(e) => setFormData(prev => ({ ...prev, installments: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="2"
                max="12"
              />
              {formData.installments > 1 && (
                <p className="text-sm text-gray-600 mt-1">
                  {formData.installments}x de R$ {(finalAmount / formData.installments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Resumo da Venda */}
        {selectedPackage && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Resumo da Venda</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Valor do Pacote:</span>
                <span className="font-medium text-blue-900">
                  R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              {formData.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Desconto:</span>
                  <span className="font-medium text-red-600">
                    - R$ {formData.discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-blue-200 pt-2">
                <span className="text-blue-700 font-medium">Valor Final:</span>
                <span className="font-bold text-blue-900 text-lg">
                  R$ {finalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Finalizar Venda
        </button>
      </form>
    </div>
  );
}