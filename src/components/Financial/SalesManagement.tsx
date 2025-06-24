import React, { useState } from 'react';
import { Plus, Receipt, Search, Filter, CheckCircle, AlertCircle, User, Package, DollarSign } from 'lucide-react';
import { SaleModal } from './SaleModal';
import { mockSales, mockStudents, mockPackages } from '../../utils/mockData';
import { Sale } from '../../types';

export function SalesManagement() {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student?.name || 'Aluno não encontrado';
  };

  const getPackageName = (packageId: string) => {
    const pkg = mockPackages.find(p => p.id === packageId);
    return pkg?.name || 'Pacote não encontrado';
  };

  const filteredSales = sales.filter(sale => {
    const studentName = getStudentName(sale.studentId).toLowerCase();
    const packageName = getPackageName(sale.packageId).toLowerCase();
    const matchesSearch = studentName.includes(searchTerm.toLowerCase()) ||
                         packageName.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
    const matchesPaymentMethod = filterPaymentMethod === 'all' || sale.paymentMethod === filterPaymentMethod;
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddSale = () => {
    setEditingSale(null);
    setIsModalOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const handleSaveSale = (saleData: Omit<Sale, 'id'>) => {
    try {
      if (editingSale) {
        setSales(prev => prev.map(sale => 
          sale.id === editingSale.id 
            ? { ...saleData, id: editingSale.id }
            : sale
        ));
        showNotification('success', 'Venda atualizada com sucesso!');
      } else {
        const newSale: Sale = {
          ...saleData,
          id: Date.now().toString(),
        };
        setSales(prev => [...prev, newSale]);
        showNotification('success', 'Venda registrada com sucesso!');
      }
    } catch (error) {
      showNotification('error', 'Erro ao salvar venda. Tente novamente.');
    }
  };

  const handleCancelSale = (saleId: string) => {
    if (window.confirm('Tem certeza que deseja cancelar esta venda?')) {
      setSales(prev => prev.map(sale => 
        sale.id === saleId 
          ? { ...sale, status: 'cancelled' as const }
          : sale
      ));
      showNotification('success', 'Venda cancelada com sucesso!');
    }
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    completed: 'Concluída',
    cancelled: 'Cancelada',
  };

  const paymentMethodLabels = {
    cash: 'Dinheiro',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    pix: 'PIX',
    bank_transfer: 'Transferência',
    installments: 'Parcelado',
  };

  const totalSales = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.finalAmount, 0);
  const monthlySales = sales.filter(s => 
    s.status === 'completed' && 
    new Date(s.saleDate).getMonth() === new Date().getMonth()
  ).reduce((sum, s) => sum + s.finalAmount, 0);

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
              placeholder="Buscar vendas..."
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
              <option value="completed">Concluída</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Todas Formas</option>
              <option value="cash">Dinheiro</option>
              <option value="credit_card">Cartão de Crédito</option>
              <option value="debit_card">Cartão de Débito</option>
              <option value="pix">PIX</option>
              <option value="bank_transfer">Transferência</option>
              <option value="installments">Parcelado</option>
            </select>
          </div>
        </div>
        <button 
          onClick={handleAddSale}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Nova Venda
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 text-sm font-medium">Total de Vendas</p>
          <p className="text-2xl font-bold text-blue-900">{sales.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Vendas Concluídas</p>
          <p className="text-2xl font-bold text-green-900">
            {sales.filter(s => s.status === 'completed').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-600 text-sm font-medium">Faturamento Total</p>
          <p className="text-2xl font-bold text-purple-900">
            R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-orange-600 text-sm font-medium">Faturamento Mensal</p>
          <p className="text-2xl font-bold text-orange-900">
            R$ {monthlySales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Vendas</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredSales.map((sale) => (
            <div key={sale.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Venda #{sale.id}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        {getStudentName(sale.studentId)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Package className="w-4 h-4" />
                        {getPackageName(sale.packageId)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">
                        {new Date(sale.saleDate).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-sm text-gray-600">
                        {paymentMethodLabels[sale.paymentMethod]}
                        {sale.installments && ` (${sale.installments}x)`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    {sale.discount > 0 && (
                      <p className="text-sm text-gray-500 line-through">
                        R$ {sale.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                    <p className="font-medium text-gray-900">
                      R$ {sale.finalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    {sale.discount > 0 && (
                      <p className="text-sm text-green-600">
                        Desconto: R$ {sale.discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[sale.status]}`}>
                    {statusLabels[sale.status]}
                  </span>
                  {sale.status === 'completed' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditSale(sale)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleCancelSale(sale.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {sale.notes && (
                <div className="mt-3 ml-16">
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Observações:</strong> {sale.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredSales.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma venda encontrada</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou registrar uma nova venda</p>
        </div>
      )}

      {/* Sale Modal */}
      <SaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSale}
        sale={editingSale}
      />
    </div>
  );
}