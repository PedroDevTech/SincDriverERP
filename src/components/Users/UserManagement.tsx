import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle, AlertCircle, User, Shield, Mail, Calendar } from 'lucide-react';
import { UserModal } from './UserModal';
import { mockUsers, mockRoles } from '../../utils/mockData';
import { User as UserType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export function UserManagement() {
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { hasPermission } = useAuth();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddUser = () => {
    if (!hasPermission('users', 'create')) {
      showNotification('error', 'Você não tem permissão para criar usuários');
      return;
    }
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserType) => {
    if (!hasPermission('users', 'edit')) {
      showNotification('error', 'Você não tem permissão para editar usuários');
      return;
    }
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData: Omit<UserType, 'id'>) => {
    try {
      if (editingUser) {
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id 
            ? { ...userData, id: editingUser.id }
            : user
        ));
        showNotification('success', 'Usuário atualizado com sucesso!');
      } else {
        const newUser: UserType = {
          ...userData,
          id: Date.now().toString(),
        };
        setUsers(prev => [...prev, newUser]);
        showNotification('success', 'Usuário criado com sucesso!');
      }
    } catch (error) {
      showNotification('error', 'Erro ao salvar usuário. Tente novamente.');
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (!hasPermission('users', 'delete')) {
      showNotification('error', 'Você não tem permissão para excluir usuários');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
      showNotification('success', 'Usuário excluído com sucesso!');
    }
  };

  const handleToggleStatus = (userId: string) => {
    if (!hasPermission('users', 'edit')) {
      showNotification('error', 'Você não tem permissão para alterar status de usuários');
      return;
    }

    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    showNotification('success', 'Status do usuário atualizado!');
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    active: 'Ativo',
    inactive: 'Inativo',
  };

  const roleColors = {
    admin: 'bg-purple-100 text-purple-800',
    manager: 'bg-blue-100 text-blue-800',
    seller: 'bg-green-100 text-green-800',
    financial: 'bg-yellow-100 text-yellow-800',
    instructor: 'bg-orange-100 text-orange-800',
    receptionist: 'bg-pink-100 text-pink-800',
  };

  const roleLabels = {
    admin: 'Administrador',
    manager: 'Gerente',
    seller: 'Vendedor',
    financial: 'Financeiro',
    instructor: 'Instrutor',
    receptionist: 'Recepcionista',
  };

  if (!hasPermission('users', 'view')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Negado</h3>
          <p className="text-gray-600">Você não tem permissão para visualizar usuários</p>
        </div>
      </div>
    );
  }

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
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Todos os Perfis</option>
              <option value="admin">Administrador</option>
              <option value="manager">Gerente</option>
              <option value="seller">Vendedor</option>
              <option value="financial">Financeiro</option>
              <option value="instructor">Instrutor</option>
              <option value="receptionist">Recepcionista</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Todos Status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>
        {hasPermission('users', 'create') && (
          <button 
            onClick={handleAddUser}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Novo Usuário
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 text-sm font-medium">Total de Usuários</p>
          <p className="text-2xl font-bold text-blue-900">{users.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Ativos</p>
          <p className="text-2xl font-bold text-green-900">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-600 text-sm font-medium">Administradores</p>
          <p className="text-2xl font-bold text-purple-900">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-orange-600 text-sm font-medium">Vendedores</p>
          <p className="text-2xl font-bold text-orange-900">
            {users.filter(u => u.role === 'seller').length}
          </p>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Usuários</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Criado em {new Date(user.createdDate).toLocaleDateString('pt-BR')}
                      </div>
                      {user.lastLogin && (
                        <div className="text-sm text-gray-600">
                          Último acesso: {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                    {statusLabels[user.status]}
                  </span>
                  <div className="flex gap-2">
                    {hasPermission('users', 'edit') && (
                      <>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(user.id)}
                          className={`font-medium text-sm ${
                            user.status === 'active' 
                              ? 'text-yellow-600 hover:text-yellow-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                        >
                          {user.status === 'active' ? 'Desativar' : 'Ativar'}
                        </button>
                      </>
                    )}
                    {hasPermission('users', 'delete') && (
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou criar um novo usuário</p>
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={editingUser}
      />
    </div>
  );
}