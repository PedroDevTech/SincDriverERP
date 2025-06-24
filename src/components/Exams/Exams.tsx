import React, { useState } from 'react';
import { Plus, Calendar, Clock, User, FileText, Award, AlertCircle } from 'lucide-react';
import { mockExams, mockStudents } from '../../utils/mockData';
import { Exam } from '../../types';

export function Exams() {
  const [exams] = useState<Exam[]>(mockExams);

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student?.name || 'Aluno não encontrado';
  };

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    'no-show': 'bg-yellow-100 text-yellow-800',
  };

  const statusLabels = {
    scheduled: 'Agendado',
    approved: 'Aprovado',
    failed: 'Reprovado',
    'no-show': 'Falta',
  };

  const typeColors = {
    theoretical: 'bg-purple-100 text-purple-800',
    practical: 'bg-orange-100 text-orange-800',
  };

  const typeLabels = {
    theoretical: 'Teórico',
    practical: 'Prático',
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Exames</h3>
          <p className="text-sm text-gray-600">Gerencie os exames teóricos e práticos</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Agendar Exame
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-600 text-sm font-medium">Agendados</p>
          <p className="text-2xl font-bold text-blue-900">
            {exams.filter(e => e.status === 'scheduled').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-600 text-sm font-medium">Aprovados</p>
          <p className="text-2xl font-bold text-green-900">
            {exams.filter(e => e.status === 'approved').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 text-sm font-medium">Reprovados</p>
          <p className="text-2xl font-bold text-red-900">
            {exams.filter(e => e.status === 'failed').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-600 text-sm font-medium">Taxa de Aprovação</p>
          <p className="text-2xl font-bold text-purple-900">
            {Math.round((exams.filter(e => e.status === 'approved').length / (exams.length || 1)) * 100)}%
          </p>
        </div>
      </div>

      {/* Exams List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Exames</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {exams.map((exam) => (
            <div key={exam.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    exam.type === 'theoretical' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    {exam.type === 'theoretical' ? (
                      <FileText className="w-6 h-6 text-purple-600" />
                    ) : (
                      <Award className="w-6 h-6 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{getStudentName(exam.studentId)}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(exam.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {exam.time}
                      </div>
                      {exam.attempts > 1 && (
                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                          <AlertCircle className="w-4 h-4" />
                          {exam.attempts}ª tentativa
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[exam.type]}`}>
                    {typeLabels[exam.type]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[exam.status]}`}>
                    {statusLabels[exam.status]}
                  </span>
                  {exam.score && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Nota: {exam.score}</p>
                    </div>
                  )}
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Exams Today */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Exames de Hoje</h3>
            <p className="text-sm text-gray-600">Próximos exames agendados</p>
          </div>
        </div>
        
        {exams.filter(e => e.date === new Date().toISOString().split('T')[0] && e.status === 'scheduled').length > 0 ? (
          <div className="space-y-3">
            {exams
              .filter(e => e.date === new Date().toISOString().split('T')[0] && e.status === 'scheduled')
              .map((exam) => (
                <div key={exam.id} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{getStudentName(exam.studentId)}</p>
                      <p className="text-sm text-gray-600">
                        {typeLabels[exam.type]} às {exam.time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[exam.type]}`}>
                      {typeLabels[exam.type]}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-600">Nenhum exame agendado para hoje</p>
        )}
      </div>
    </div>
  );
}