import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Package, Receipt, Users, Calendar } from 'lucide-react';
import { PackageManagement } from './PackageManagement';
import { SalesManagement } from './SalesManagement';
import { AccountsReceivableManagement } from './AccountsReceivableManagement';
import { AccountsPayableManagement } from './AccountsPayableManagement';
import { mockSales, mockAccountsReceivable, mockAccountsPayable, mockPackages } from '../../utils/mockData';

type FinancialView = 'overview' | 'packages' | 'sales' | 'receivable' | 'payable';

export function Financial() {
  const [activeView, setActiveView] = useState<FinancialView>('overview');

  // Cálculos para o overview
  const totalReceivable = mockAccountsReceivable
    .filter(ar => ar.status === 'pending')
    .reduce((sum, ar) => sum + ar.amount, 0);

  const totalPayable = mockAccountsPayable
    .filter(ap => ap.status === 'pending')
    .reduce((sum, ap) => sum + ap.amount, 0);

  const monthlyRevenue = mockAccountsReceivable
    .filter(ar => ar.status === 'paid' && new Date(ar.paymentDate!).getMonth() === new Date().getMonth())
    .reduce((sum, ar) => sum + ar.amount, 0);

  const monthlyExpenses = mockAccountsPayable
    .filter(ap => ap.status === 'paid' && new Date(ap.paymentDate!).getMonth() === new Date().getMonth())
    .reduce((sum, ap) => sum + ap.amount, 0);

  const netProfit = monthlyRevenue - monthlyExpenses;

  const overdueBills = mockAccountsPayable.filter(ap => 
    ap.status === 'overdue' || 
    (ap.status === 'pending' && new Date(ap.dueDate) < new Date())
  ).length;

  const overdueReceivables = mockAccountsReceivable.filter(ar => 
    ar.status === 'overdue' || 
    (ar.status === 'pending' && new Date(ar.dueDate) < new Date())
  ).length;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Receita Mensal</p>
              <p className="text-2xl font-bold text-green-900">
                R$ {monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Despesas Mensais</p>
              <p className="text-2xl font-bold text-red-900">
                R$ {monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-r ${netProfit >= 0 ? 'from-blue-50 to-blue-100' : 'from-orange-50 to-orange-100'} p-6 rounded-xl border ${netProfit >= 0 ? 'border-blue-200' : 'border-orange-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'} text-sm font-medium`}>Lucro Líquido</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`w-12 h-12 ${netProfit >= 0 ? 'bg-blue-600' : 'bg-orange-600'} rounded-lg flex items-center justify-center`}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Pacotes Ativos</p>
              <p className="text-2xl font-bold text-purple-900">
                {mockPackages.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Contas a Receber e Pagar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Contas a Receber</h3>
            <div className="flex items-center gap-2 text-green-600">
              <Receipt className="w-5 h-5" />
              <span className="font-medium">
                R$ {totalReceivable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">Pendentes</span>
              <span className="font-medium text-green-700">
                {mockAccountsReceivable.filter(ar => ar.status === 'pending').length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-700">Em Atraso</span>
              <span className="font-medium text-red-700">{overdueReceivables}</span>
            </div>
            <button 
              onClick={() => setActiveView('receivable')}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              Gerenciar Recebimentos
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Contas a Pagar</h3>
            <div className="flex items-center gap-2 text-red-600">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">
                R$ {totalPayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">Pendentes</span>
              <span className="font-medium text-blue-700">
                {mockAccountsPayable.filter(ap => ap.status === 'pending').length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-700">Em Atraso</span>
              <span className="font-medium text-red-700">{overdueBills}</span>
            </div>
            <button 
              onClick={() => setActiveView('payable')}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              Gerenciar Pagamentos
            </button>
          </div>
        </div>
      </div>

      {/* Vendas Recentes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Vendas Recentes</h3>
          <button 
            onClick={() => setActiveView('sales')}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Ver Todas
          </button>
        </div>
        <div className="space-y-3">
          {mockSales.slice(0, 5).map((sale) => (
            <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Venda #{sale.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(sale.saleDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  R$ {sale.finalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-green-600">Concluída</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'packages':
        return <PackageManagement />;
      case 'sales':
        return <SalesManagement />;
      case 'receivable':
        return <AccountsReceivableManagement />;
      case 'payable':
        return <AccountsPayableManagement />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Visão Geral', icon: DollarSign },
            { id: 'packages', label: 'Pacotes', icon: Package },
            { id: 'sales', label: 'Vendas', icon: Receipt },
            { id: 'receivable', label: 'Contas a Receber', icon: TrendingUp },
            { id: 'payable', label: 'Contas a Pagar', icon: TrendingDown },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as FinancialView)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}