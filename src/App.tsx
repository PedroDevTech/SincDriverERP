import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Students } from './components/Students/Students';
import { Lessons } from './components/Lessons/Lessons';
import { ScheduleView } from './components/Schedule/ScheduleView';
import { Exams } from './components/Exams/Exams';
import { Instructors } from './components/Instructors/Instructors';
import { Vehicles } from './components/Vehicles/Vehicles';
import { SalesManagement } from './components/Financial/SalesManagement';
import { Financial } from './components/Financial/Financial';
import { UserManagement } from './components/Users/UserManagement';
import { SupplierManagement } from './components/Suppliers/SupplierManagement';
import { CompanyManagement } from './components/Companies/CompanyManagement';

const viewTitles = {
  dashboard: 'Dashboard',
  students: 'Gerenciar Alunos',
  lessons: 'Gerenciar Aulas',
  schedule: 'Agendas',
  exams: 'Gerenciar Exames',
  instructors: 'Gerenciar Instrutores',
  vehicles: 'Gerenciar Veículos',
  sales: 'Gerenciar Vendas',
  payments: 'Controle Financeiro',
  suppliers: 'Gerenciar Fornecedores',
  reports: 'Relatórios',
  users: 'Gerenciar Usuários',
  companies: 'Gerenciar Empresas',
  settings: 'Configurações',
};

function AppContent() {
  const [activeView, setActiveView] = useState('dashboard');
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Students />;
      case 'lessons':
        return <Lessons />;
      case 'schedule':
        return <ScheduleView />;
      case 'exams':
        return <Exams />;
      case 'instructors':
        return <Instructors />;
      case 'vehicles':
        return <Vehicles />;
      case 'sales':
        return <SalesManagement />;
      case 'payments':
        return <Financial />;
      case 'suppliers':
        return <SupplierManagement />;
      case 'users':
        return <UserManagement />;
      case 'companies':
        return <CompanyManagement />;
      case 'reports':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios</h3>
            <p className="text-gray-600">Esta seção está em desenvolvimento</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Configurações</h3>
            <p className="text-gray-600">Esta seção está em desenvolvimento</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={viewTitles[activeView as keyof typeof viewTitles]} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;