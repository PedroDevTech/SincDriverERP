import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import { StudentCard } from './StudentCard';
import { StudentModal } from './StudentModal';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { useAuth } from '../../contexts/AuthContext';

export function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { hasPermission } = useAuth();
  const { 
    data: students, 
    loading, 
    error, 
    insert, 
    update, 
    remove 
  } = useSupabaseData('students', {
    orderBy: { column: 'created_at', ascending: false }
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddStudent = () => {
    if (!hasPermission('students', 'create')) {
      showNotification('error', 'Você não tem permissão para criar alunos');
      return;
    }
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: any) => {
    if (!hasPermission('students', 'edit')) {
      showNotification('error', 'Você não tem permissão para editar alunos');
      return;
    }
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (studentData: any) => {
    try {
      if (editingStudent) {
        const { error } = await update(editingStudent.id, studentData);
        if (error) {
          showNotification('error', error);
          return;
        }
        showNotification('success', 'Aluno atualizado com sucesso!');
      } else {
        const { error } = await insert(studentData);
        if (error) {
          showNotification('error', error);
          return;
        }
        showNotification('success', 'Aluno cadastrado com sucesso!');
      }
    } catch (error) {
      showNotification('error', 'Erro ao salvar aluno. Tente novamente.');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!hasPermission('students', 'delete')) {
      showNotification('error', 'Você não tem permissão para excluir alunos');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      const { error } = await remove(studentId);
      if (error) {
        showNotification('error', error);
        return;
      }
      showNotification('success', 'Aluno excluído com sucesso!');
    }
  };

  if (!hasPermission('students', 'view')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Negado</h3>
          <p className="text-gray-600">Você não tem permissão para visualizar alunos</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando alunos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao Carregar</h3>
          <p className="text-gray-600">{error}</p>
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

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar alunos..."
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
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="suspended">Suspensos</option>
              <option value="graduated">Formados</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
        {hasPermission('students', 'create') && (
          <button 
            onClick={handleAddStudent}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Novo Aluno
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 text-sm font-medium">Total de Alunos</p>
          <p className="text-2xl font-bold text-blue-900">{students.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Ativos</p>
          <p className="text-2xl font-bold text-green-900">
            {students.filter(s => s.status === 'active').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-600 text-sm font-medium">Formados</p>
          <p className="text-2xl font-bold text-purple-900">
            {students.filter(s => s.status === 'graduated').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-600 text-sm font-medium">Suspensos</p>
          <p className="text-2xl font-bold text-yellow-900">
            {students.filter(s => s.status === 'suspended').length}
          </p>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
          />
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum aluno encontrado</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou termos de busca</p>
        </div>
      )}

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        student={editingStudent}
      />
    </div>
  );
}