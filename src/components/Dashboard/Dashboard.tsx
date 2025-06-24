import React, { useState } from 'react';
import { Users, Calendar, FileText, DollarSign, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { mockStudents, mockLessons, mockExams, mockPayments, mockSales, mockAccountsReceivable } from '../../utils/mockData';
import { Sale } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export function Dashboard() {
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { hasPermission } = useAuth();

  const activeStudents = mockStudents.filter(s => s.status === 'active').length;
  const scheduledLessons = mockLessons.filter(l => l.status === 'scheduled').length;
  const pendingExams = mockExams.filter(e => e.status === 'scheduled').length;
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;

  const recentActivities = [
    { id: 1, action: 'Nova matrícula', student: 'Maria Silva Santos', time: '2 horas atrás', type: 'enrollment' },
    { id: 2, action: 'Aula concluída', student: 'João Pedro Costa', time: '4 horas atrás', type: 'lesson' },
    { id: 3, action: 'Exame aprovado', student: 'Ana Carolina Lima', time: '1 dia atrás', type: 'exam' },
    { id: 4, action: 'Pagamento recebido', student: 'Carlos Santos', time: '2 dias atrás', type: 'payment' },
  ];

  const upcomingLessons = [
    { id: 1, student: 'Maria Silva', instructor: 'Carlos Mendes', time: '14:00', type: 'Prática' },
    { id: 2, student: 'João Costa', instructor: 'Patrícia Santos', time: '15:30', type: 'Teórica' },
    { id: 3, student: 'Ana Lima', instructor: 'Carlos Mendes', time: '16:00', type: 'Prática' },
  ];

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Alunos Ativos"
          value={activeStudents}
          icon={Users}
          color="blue"
          change="+12% este mês"
          changeType="positive"
        />
        <StatsCard
          title="Aulas Agendadas"
          value={scheduledLessons}
          icon={Calendar}
          color="green"
          change="+5% esta semana"
          changeType="positive"
        />
        <StatsCard
          title="Exames Pendentes"
          value={pendingExams}
          icon={FileText}
          color="yellow"
        />
        <StatsCard
          title="Pagamentos Pendentes"
          value={pendingPayments}
          icon={DollarSign}
          color="red"
          change="R$ 800,00"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Aulas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Próximas Aulas</h3>
            <span className="text-sm text-gray-600">Hoje</span>
          </div>
          <div className="space-y-4">
            {upcomingLessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{lesson.student}</p>
                  <p className="text-sm text-gray-600">Instrutor: {lesson.instructor}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{lesson.time}</p>
                  <p className="text-sm text-gray-600">{lesson.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Atividades Recentes</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'enrollment' ? 'bg-blue-100' :
                  activity.type === 'lesson' ? 'bg-green-100' :
                  activity.type === 'exam' ? 'bg-purple-100' :
                  'bg-yellow-100'
                }`}>
                  {activity.type === 'enrollment' && <Users className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'lesson' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {activity.type === 'exam' && <FileText className="w-4 h-4 text-purple-600" />}
                  {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-yellow-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.student}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Desempenho Mensal</h3>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+15% vs mês anterior</span>
          </div>
        </div>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-600">Gráfico de desempenho seria exibido aqui</p>
            <p className="text-sm text-gray-500 mt-2">Integração com biblioteca de charts</p>
          </div>
        </div>
      </div>
    </div>
  );
}