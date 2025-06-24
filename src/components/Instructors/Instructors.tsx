import React, { useState } from 'react';
import { Plus, User, Phone, Mail, Award, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { InstructorModal } from './InstructorModal';
import { mockInstructors } from '../../utils/mockData';
import { Instructor } from '../../types';

export function Instructors() {
  const [instructors, setInstructors] = useState<Instructor[]>(mockInstructors);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddInstructor = () => {
    setEditingInstructor(null);
    setIsModalOpen(true);
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setIsModalOpen(true);
  };

  const handleSaveInstructor = (instructorData: Omit<Instructor, 'id'>) => {
    try {
      if (editingInstructor) {
        setInstructors(prev => prev.map(instructor => 
          instructor.id === editingInstructor.id 
            ? { ...instructorData, id: editingInstructor.id }
            : instructor
        ));
        showNotification('success', 'Instrutor atualizado com sucesso!');
      } else {
        const newInstructor: Instructor = {
          ...instructorData,
          id: Date.now().toString(),
        };
        setInstructors(prev => [...prev, newInstructor]);
        showNotification('success', 'Instrutor cadastrado com sucesso!');
      }
    } catch (error) {
      showNotification('error', 'Erro ao salvar instrutor. Tente novamente.');
    }
  };

  const handleDeleteInstructor = (instructorId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este instrutor?')) {
      setInstructors(prev => prev.filter(instructor => instructor.id !== instructorId));
      showNotification('success', 'Instrutor excluído com sucesso!');
    }
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    active: 'Ativo',
    inactive: 'Inativo',
  };

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
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar instrutores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button 
          onClick={handleAddInstructor}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Instrutor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 text-sm font-medium">Total de Instrutores</p>
          <p className="text-2xl font-bold text-blue-900">{instructors.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Ativos</p>
          <p className="text-2xl font-bold text-green-900">
            {instructors.filter(i => i.status === 'active').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-600 text-sm font-medium">Categoria A</p>
          <p className="text-2xl font-bold text-purple-900">
            {instructors.filter(i => i.specialties.some(s => s.includes('A'))).length}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-orange-600 text-sm font-medium">Categoria B</p>
          <p className="text-2xl font-bold text-orange-900">
            {instructors.filter(i => i.specialties.some(s => s.includes('B'))).length}
          </p>
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.map((instructor) => (
          <div key={instructor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                  <p className="text-sm text-gray-600">Instrutor</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[instructor.status]}`}>
                {statusLabels[instructor.status]}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="truncate">{instructor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{instructor.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="w-4 h-4" />
                <span>CNH: {instructor.license}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 font-medium mb-2">Especialidades:</p>
              <div className="flex flex-wrap gap-2">
                {instructor.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 font-medium mb-1">Horário:</p>
              <p className="text-sm text-gray-600">
                {instructor.workingHours.start} - {instructor.workingHours.end}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditInstructor(instructor)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteInstructor(instructor.id)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors font-medium"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredInstructors.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum instrutor encontrado</h3>
          <p className="text-gray-600">Tente ajustar os termos de busca</p>
        </div>
      )}

      {/* Instructor Modal */}
      <InstructorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInstructor}
        instructor={editingInstructor}
      />
    </div>
  );
}