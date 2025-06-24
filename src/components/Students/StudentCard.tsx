import React from 'react';
import { User, Phone, Mail, Calendar, BookOpen, Car, Edit, Trash2 } from 'lucide-react';
import { Student } from '../../types';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  graduated: 'bg-blue-100 text-blue-800',
  inactive: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  active: 'Ativo',
  suspended: 'Suspenso',
  graduated: 'Formado',
  inactive: 'Inativo',
};

export function StudentCard({ student, onEdit, onDelete }: StudentCardProps) {
  const progressPercentage = Math.round(((student.theoreticalHours + student.practicalHours) / 65) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-600">Categoria {student.category}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[student.status]}`}>
          {statusLabels[student.status]}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span className="truncate">{student.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{student.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Matrícula: {new Date(student.registrationDate).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">Aulas Teóricas</span>
          </div>
          <span className="text-sm font-medium">{student.theoreticalHours}/45h</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-700">Aulas Práticas</span>
          </div>
          <span className="text-sm font-medium">{student.practicalHours}/20h</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-700">Progresso Geral</span>
          <span className="text-sm font-medium text-blue-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(student)}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
        <button
          onClick={() => onDelete(student.id)}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors font-medium"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}