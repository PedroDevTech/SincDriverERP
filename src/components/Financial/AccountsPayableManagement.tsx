import React, { useState } from 'react';
import { Plus, TrendingDown, Search, Filter, CheckCircle, AlertCircle, Building, Calendar, DollarSign } from 'lucide-react';
import { AccountsPayableModal } from './AccountsPayableModal';
import { mockAccountsPayable, mockSuppliers } from '../../utils/mockData';
import { AccountsPayable } from '../../types';

export function AccountsPayableManagement() {
  const [payables, setPayables] = useState<AccountsPayable[]>(mockAccountsPayable);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayable, setEditingPayable] = useState<AccountsPayable | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const getSupplierName = (supplierId?: string) => {
    if (!supplierId) return 'Sem fornecedor';
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    return supplier?.name || 'Fornecedor não encontrado';
  };

  const filteredPayables = payables.filter(payable => {
    const supplierName = getSupplierName(payable.supplierId).toLowerCase();
    const matchesSearch = supplierName.includes(searchTerm.toLowerCase()) ||
                         payable.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payable.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || payable.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddPayable = () => {
    setEditingPayable(null);
    setIsModalOpen(true);
  };

  const handleEditPayable = (payable: AccountsPayable) => {
    setEditingPayable(payable);
    setIsModalOpen(true);
  };

  const handleSavePayable = (payableData: Omit<AccountsPayable, 'id'>) => {
    try {
      if (editingPayable) {
        setPayables(prev => prev.map(payable => 
          payable.id === editingPayable.id 
            ? { ...payableData, id: editingPayable.id }
            : payable
        ));
        showNotification('success', 'Conta atualizada com sucesso!');
      } else {
        const newPayable: AccountsPayable = {
          ...payableData,
          id: Date.now().toString(),
        };
        setPayables(prev => [...prev, newPayable]);
        showNotification('success', 'Conta cadastrada com sucesso!');
      }
    } catch (error) {
      showNotification('error', 'Erro ao salvar conta. Tente novamente.');
    }
  };

  const handleMarkAsPaid = (payableId: string, paymentMethod: string) => {
    setPayables(prev => prev.map(payable => 
      payable.id === payableId 
        ? { 
            ...payable, 
            status: 'paid' as const,
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod: paymentMethod as any
          }
        : payable
    ));
    showNotification('success', 'Pagamento registrado com sucesso!');
  };

  const handleMarkAsOverdue = (payableId: string) => {
    setPayables(prev => prev.map(payable => 
      payable.id === payableId 
        ? { ...payable, status: 'overdue' as const }
        : payable
    ));
    showNotification('success', 'Status atualizado para em atraso!');
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    pending: 'Pendente',
    paid: 'Pago',
    overdue: 'Em Atraso',
    cancelled: 'Cancelado',
  };

  const categoryLabels = {
    salary: 'Salário',
    fuel: 'Combustível',
    maintenance: 'Manutenção',
    rent: 'Aluguel',
    utilities: 'Utilidades',
    insurance: 'Seguro',
    taxes: 'Impostos',
    supplies: 'Suprimentos',
    other: 'Outros',
  };

  const paymentMethodLabels = {
    cash: 'Dinheiro',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    pix: 'PIX',
    bank_transfer: 'Transferência',
    check: 'Cheque',
  };

  const totalPending = payables.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payables.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payables.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

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
              placeholder="Buscar contas a pagar..."
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
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
              <option value="overdue">Em Atraso</option>
              <option value="cancelled">Cancelado</option>
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
              <option value="salary">Salário</option>
              <option value="fuel">Combustível</option>
              <option value="maintenance">Manutenção</option>
              <option value="rent">Aluguel</option>
              <option value="utilities">Utilidades</option>
              <option value="insurance">Seguro</option>
              <option value="taxes">Impostos</option>
              <option value="supplies">Suprimentos</option>
              <option value="other">Outros</option>
            </select>
          </div>
        </div>
        <button 
          onClick={handleAddPayable}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Nova Conta
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-600 text-sm font-medium">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-900">
            R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-yellow-700">
            {payables.filter(p => p.status === 'pending').length} contas
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 text-sm font-medium">Em Atraso</p>
          <p className="text-2xl font-bold text-red-900">
            R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-red-700">
            {payables.filter(p => p.status === 'overdue').length} contas
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Pago</p>
          <p className="text-2xl font-bold text-green-900">
            R$ {totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-green-700">
            {payables.filter(p => p.status === 'paid').length} contas
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 text-sm font-medium">Total</p>
          <p className="text-2xl font-bold text-blue-900">
            R$ {payables.reduce((sum, p) => sum + p.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-blue-700">{payables.length} contas</p>
        </div>
      </div>

      {/* Payables List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Contas a Pagar</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredPayables.map((payable) => (
            <div key={payable.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{payable.description}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Building className="w-4 h-4" />
                        {getSupplierName(payable.supplierId)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Venc: {new Date(payable.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                      <span className="text-sm text-purple-600">
                        {categoryLabels[payable.category]}
                      </span>
                      {payable.recurring && (
                        <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          Recorrente
                        </span>
                      )}
                    </div>
                    {payable.paymentDate && (
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-green-600">
                          Pago em: {new Date(payable.paymentDate).toLocaleDateString('pt-BR')}
                        </span>
                        {payable.paymentMethod && (
                          <span className="text-sm text-gray-600">
                            via {paymentMethodLabels[payable.paymentMethod]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      R$ {payable.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    {payable.status === 'overdue' && (
                      <p className="text-sm text-red-600">
                        {Math.floor((new Date().getTime() - new Date(payable.dueDate).getTime()) / (1000 * 60 * 60 * 24))} dias em atraso
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[payable.status]}`}>
                    {statusLabels[payable.status]}
                  </span>
                  {payable.status === 'pending' && (
                    <div className="flex gap-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleMarkAsPaid(payable.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="text-sm border border-green-300 rounded px-2 py-1 text-green-700"
                      >
                        <option value="">Marcar como Pago</option>
                        <option value="cash">Dinheiro</option>
                        <option value="credit_card">Cartão de Crédito</option>
                        <option value="debit_card">Cartão de Débito</option>
                        <option value="pix">PIX</option>
                        <option value="bank_transfer">Transferência</option>
                        <option value="check">Cheque</option>
                      </select>
                      <button 
                        onClick={() => handleEditPayable(payable)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Editar
                      </button>
                      {new Date(payable.dueDate) < new Date() && (
                        <button 
                          onClick={() => handleMarkAsOverdue(payable.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          Marcar Atraso
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {payable.notes && (
                <div className="mt-3 ml-16">
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Observações:</strong> {payable.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredPayables.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingDown className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conta a pagar encontrada</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou cadastrar uma nova conta</p>
        </div>
      )}

      {/* Payable Modal */}
      <AccountsPayableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePayable}
        payable={editingPayable}
      />
    </div>
  );
}