import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  GraduationCap,
  DollarSign,
  BarChart3,
  Settings,
  Car,
  Shield,
  LogOut,
  CalendarDays,
  Receipt,
  Building
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard' },
  { id: 'students', label: 'Alunos', icon: Users, permission: 'students' },
  { id: 'lessons', label: 'Aulas', icon: Calendar, permission: 'lessons' },
  { id: 'schedule', label: 'Agendas', icon: CalendarDays, permission: 'schedule' },
  { id: 'exams', label: 'Exames', icon: FileText, permission: 'exams' },
  { id: 'instructors', label: 'Instrutores', icon: GraduationCap, permission: 'instructors' },
  { id: 'vehicles', label: 'Veículos', icon: Car, permission: 'vehicles' },
  { id: 'sales', label: 'Vendas', icon: Receipt, permission: 'sales' },
  { id: 'payments', label: 'Financeiro', icon: DollarSign, permission: 'financial' },
  { id: 'suppliers', label: 'Fornecedores', icon: Building, permission: 'financial' },
  { id: 'reports', label: 'Relatórios', icon: BarChart3, permission: 'reports' },
  { id: 'users', label: 'Usuários', icon: Shield, permission: 'users' },
  { id: 'companies', label: 'Empresas', icon: Building, permission: 'settings' },
  { id: 'settings', label: 'Configurações', icon: Settings, permission: 'settings' },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { user, logout, hasPermission } = useAuth();

  const visibleMenuItems = menuItems.filter(item => 
    hasPermission(item.permission, 'view')
  );

  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Sinc Driver</h1>
            <p className="text-slate-400 text-sm">Gestão Completa</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="mt-8 p-4 bg-slate-800 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{user?.name}</p>
            <p className="text-slate-400 text-xs">{user?.role_id}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 text-slate-300 hover:text-white text-sm py-2 px-3 rounded hover:bg-slate-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>

      <div className="mt-4 p-4 bg-slate-800 rounded-lg">
        <p className="text-slate-400 text-sm mb-2">Status do Sistema</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-300">Online</span>
        </div>
      </div>
    </div>
  );
}