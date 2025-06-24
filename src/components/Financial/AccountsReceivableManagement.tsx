import React, { useState } from 'react';
import { Plus, TrendingUp, Search, Filter, CheckCircle, AlertCircle, User, Calendar, DollarSign } from 'lucide-react';
import { mockAccountsReceivable, mockStudents } from '../../utils/mockData';
import { AccountsReceivable } from '../../types';

export function AccountsReceivableManagement() {
  const [receivables, setReceivables] = useState<AccountsReceivable[]>(mockAccountsReceivable);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student?.name || 'Aluno não encontrado';
  };

  const filteredReceivables = receivables.filter(receivable => {
    const studentName = getStudentName(receivable.studentId).toLowerCase();
    const matchesSearch = studentName.includes(searchTerm.toLowerCase()) ||
                         receivable.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || receivable.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleMarkAsPaid = (receivableId: string, paymentMethod: string) => {
    setReceivables(prev => prev.map(receivable => 
      receivable.id === receivableId 
        ? { 
            ...receivable, 
            status: 'paid' as const,
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod: paymentMethod as any
          }
        : receivable
    ));
    showNotification('success', 'Pagamento registrado com sucesso!');
  };

  const handleMarkAsOverdue = (receivableId: string) => {
    setReceivables(prev => prev.map(receivable => 
      receivable.id === receivableId 
        ? { ...receivable, status: 'overdue' as const }
        : receivable
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

  const paymentMethodLabels = {
    cash: 'Dinheiro',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    pix: 'PIX',
    bank_transfer: 'Transferência',
  };

  const totalPending = receivables.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
  const totalOverdue = receivables.filter(r => r.status === 'overdue').reduce((sum, r) => sum + r.amount, 0);
  const totalReceived = receivables.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);

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
              placeholder="Buscar contas a receber..."
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
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-600 text-sm font-medium">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-900">
            R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-yellow-700">
            {receivables.filter(r => r.status === 'pending').length} contas
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 text-sm font-medium">Em Atraso</p>
          <p className="text-2xl font-bold text-red-900">
            R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-red-700">
            {receivables.filter(r => r.status === 'overdue').length} contas
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Recebido</p>
          <p className="text-2xl font-bold text-green-900">
            R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-green-700">
            {receivables.filter(r => r.status === 'paid').length} contas
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 text-sm font-medium">Total</p>
          <p className="text-2xl font-bold text-blue-900">
            R$ {receivables.reduce((sum, r) => sum + r.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-blue-700">{receivables.length} contas</p>
        </div>
      </div>

      {/* Receivables List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Contas a Receber</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReceivables.map((receivable) => (
            <div key={receivable.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{receivable.description}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        {getStudentName(receivable.studentId)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Venc: {new Date(receivable.dueDate).toLocaleDateString('pt-BR')}
                      </div>
                      {receivable.installmentNumber && (
                        <span className="text-sm text-blue-600">
                          {receivable.installmentNumber}/{receivable.totalInstallments}
                        </span>
                      )}
                    </div>
                    {receivable.paymentDate && (
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-green-600">
                          Pago em: {new Date(receivable.paymentDate).toLocaleDateString('pt-BR')}
                        </span>
                        {receivable.paymentMethod && (
                          <span className="text-sm text-gray-600">
                            via {paymentMethodLabels[receivable.paymentMethod]}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      R$ {receivable.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    {receivable.status === 'overdue' && (
                      <p className="text-sm text-red-600">
                        {Math.floor((new Date().getTime() - new Date(receivable.dueDate).getTime()) / (1000 * 60 * 60 * 24))} dias em atraso
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[receivable.status]}`}>
                    {statusLabels[receivable.status]}
                  </span>
                  {receivable.status === 'pending' && (
                    <div className="flex gap-2">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleMarkAsPaid(receivable.id, e.target.value);
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
                      </select>
                      {new Date(receivable.dueDate) < new Date() && (
                        <button 
                          onClick={() => handleMarkAsOverdue(receivable.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          Marcar Atraso
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {receivable.notes && (
                <div className="mt-3 ml-16">
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Observações:</strong> {receivable.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredReceivables.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conta a receber encontrada</h3>
          <p className="text-gray-600">Tente ajustar os filtros de busca</p>
        </div>
      )}
    </div>
  );
}