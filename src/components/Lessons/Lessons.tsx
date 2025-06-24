import React, { useState } from 'react';
import { Plus, Calendar, Clock, User, Car, BookOpen, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import { LessonScheduler } from './LessonScheduler';
import { mockLessons, mockStudents, mockInstructors, mockVehicles } from '../../utils/mockData';
import { Lesson } from '../../types';

export function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student?.name || 'Aluno não encontrado';
  };

  const getInstructorName = (instructorId: string) => {
    const instructor = mockInstructors.find(i => i.id === instructorId);
    return instructor?.name || 'Instrutor não encontrado';
  };

  const getVehicleInfo = (vehicleId?: string) => {
    if (!vehicleId) return null;
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.plate}` : 'Veículo não encontrado';
  };

  const filteredLessons = lessons.filter(lesson => {
    const matchesType = filterType === 'all' || lesson.type === filterType;
    const matchesStatus = filterStatus === 'all' || lesson.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddLesson = () => {
    setEditingLesson(null);
    setIsSchedulerOpen(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsSchedulerOpen(true);
  };

  const handleSaveLesson = (lessonData: Omit<Lesson, 'id'>) => {
    try {
      if (editingLesson) {
        setLessons(prev => prev.map(lesson => 
          lesson.id === editingLesson.id 
            ? { ...lessonData, id: editingLesson.id }
            : lesson
        ));
        showNotification('success', 'Aula atualizada com sucesso!');
      } else {
        const newLesson: Lesson = {
          ...lessonData,
          id: Date.now().toString(),
        };
        setLessons(prev => [...prev, newLesson]);
        showNotification('success', 'Aula agendada com sucesso!');
      }
    } catch (error) {
      showNotification('error', 'Erro ao salvar aula. Tente novamente.');
    }
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (window.confirm('Tem certeza que deseja cancelar esta aula?')) {
      setLessons(prev => prev.map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, status: 'cancelled' as const }
          : lesson
      ));
      showNotification('success', 'Aula cancelada com sucesso!');
    }
  };

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    'no-show': 'bg-yellow-100 text-yellow-800',
  };

  const statusLabels = {
    scheduled: 'Agendada',
    completed: 'Concluída',
    cancelled: 'Cancelada',
    'no-show': 'Falta',
  };

  const typeColors = {
    theoretical: 'bg-purple-100 text-purple-800',
    practical: 'bg-green-100 text-green-800',
  };

  const typeLabels = {
    theoretical: 'Teórica',
    practical: 'Prática',
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
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Todos os Tipos</option>
              <option value="theoretical">Teóricas</option>
              <option value="practical">Práticas</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Todos os Status</option>
              <option value="scheduled">Agendadas</option>
              <option value="completed">Concluídas</option>
              <option value="cancelled">Canceladas</option>
              <option value="no-show">Faltas</option>
            </select>
          </div>
        </div>
        <button 
          onClick={handleAddLesson}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Agendar Aula
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 text-sm font-medium">Agendadas Hoje</p>
          <p className="text-2xl font-bold text-blue-900">
            {lessons.filter(l => l.status === 'scheduled' && l.date === new Date().toISOString().split('T')[0]).length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Concluídas</p>
          <p className="text-2xl font-bold text-green-900">
            {lessons.filter(l => l.status === 'completed').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-600 text-sm font-medium">Teóricas</p>
          <p className="text-2xl font-bold text-purple-900">
            {lessons.filter(l => l.type === 'theoretical').length}
          </p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-orange-600 text-sm font-medium">Práticas</p>
          <p className="text-2xl font-bold text-orange-900">
            {lessons.filter(l => l.type === 'practical').length}
          </p>
        </div>
      </div>

      {/* Lessons List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Aulas</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredLessons.map((lesson) => (
            <div key={lesson.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    lesson.type === 'theoretical' ? 'bg-purple-100' : 'bg-green-100'
                  }`}>
                    {lesson.type === 'theoretical' ? (
                      <BookOpen className={`w-6 h-6 ${lesson.type === 'theoretical' ? 'text-purple-600' : 'text-green-600'}`} />
                    ) : (
                      <Car className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{getStudentName(lesson.studentId)}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        {getInstructorName(lesson.instructorId)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(lesson.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {lesson.time} ({lesson.duration}min)
                      </div>
                    </div>
                    {lesson.vehicleId && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Car className="w-4 h-4" />
                        {getVehicleInfo(lesson.vehicleId)}
                      </div>
                    )}
                    {lesson.location && (
                      <div className="text-sm text-gray-600 mt-1">
                        📍 {lesson.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[lesson.type]}`}>
                    {typeLabels[lesson.type]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lesson.status]}`}>
                    {statusLabels[lesson.status]}
                  </span>
                  {lesson.status === 'scheduled' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditLesson(lesson)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma aula encontrada</h3>
          <p className="text-gray-600">Tente ajustar os filtros ou agende uma nova aula</p>
        </div>
      )}

      {/* Lesson Scheduler Modal */}
      <LessonScheduler
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        onSave={handleSaveLesson}
        lesson={editingLesson}
      />
    </div>
  );
}