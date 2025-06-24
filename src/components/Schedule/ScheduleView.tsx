import React, { useState } from 'react';
import { Calendar, Clock, User, Car, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockInstructors, mockVehicles, mockLessons } from '../../utils/mockData';
import { Instructor, Vehicle, Lesson } from '../../types';

type ViewType = 'instructor' | 'vehicle';

export function ScheduleView() {
  const [viewType, setViewType] = useState<ViewType>('instructor');
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00'
  ];

  const weekDays = [];
  const startDate = new Date(selectedDate);
  const startOfWeek = new Date(startDate);
  startOfWeek.setDate(startDate.getDate() - startDate.getDay());

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDays.push(date);
  }

  const getResourceName = (resourceId: string) => {
    if (viewType === 'instructor') {
      const instructor = mockInstructors.find(i => i.id === resourceId);
      return instructor?.name || 'Instrutor não encontrado';
    } else {
      const vehicle = mockVehicles.find(v => v.id === resourceId);
      return vehicle ? `${vehicle.brand} ${vehicle.model} - ${vehicle.plate}` : 'Veículo não encontrado';
    }
  };

  const getStudentName = (studentId: string) => {
    // Simulando busca de aluno - em um sistema real, viria dos dados
    const studentNames = ['Maria Silva', 'João Costa', 'Ana Lima', 'Carlos Santos'];
    return studentNames[parseInt(studentId) % studentNames.length];
  };

  const getLessonForSlot = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockLessons.find(lesson => 
      lesson.date === dateStr && 
      lesson.time === time && 
      lesson.status === 'scheduled' &&
      (viewType === 'instructor' ? lesson.instructorId === selectedResource : lesson.vehicleId === selectedResource)
    );
  };

  const isResourceAvailable = (date: Date, time: string) => {
    if (!selectedResource) return false;
    
    if (viewType === 'instructor') {
      const instructor = mockInstructors.find(i => i.id === selectedResource);
      if (!instructor) return false;
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
      if (!instructor.workingHours.days.includes(dayOfWeek)) return false;
      
      const timeHour = parseInt(time.split(':')[0]);
      const startHour = parseInt(instructor.workingHours.start.split(':')[0]);
      const endHour = parseInt(instructor.workingHours.end.split(':')[0]);
      
      return timeHour >= startHour && timeHour < endHour;
    } else {
      const vehicle = mockVehicles.find(v => v.id === selectedResource);
      return vehicle?.status === 'available';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const formatDateHeader = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    return (
      <div className={`text-center p-3 ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
        <div className={`font-medium ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
          {date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}
        </div>
        <div className={`text-sm ${isToday ? 'text-blue-700' : 'text-gray-600'}`}>
          {date.getDate().toString().padStart(2, '0')}
        </div>
        {isToday && (
          <div className="text-xs text-blue-600 font-medium mt-1">HOJE</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* View Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewType('instructor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                viewType === 'instructor'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4" />
              Instrutores
            </button>
            <button
              onClick={() => setViewType('vehicle')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                viewType === 'vehicle'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Car className="w-4 h-4" />
              Veículos
            </button>
          </div>

          {/* Resource Selection */}
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[250px]"
            >
              <option value="">
                Selecione {viewType === 'instructor' ? 'um instrutor' : 'um veículo'}
              </option>
              {viewType === 'instructor' 
                ? mockInstructors.filter(i => i.status === 'active').map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </option>
                  ))
                : mockVehicles.filter(v => v.status === 'available').map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.plate}
                    </option>
                  ))
              }
            </select>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <div className="font-medium text-gray-900">
              {weekDays[0].toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </div>
            <div className="text-sm text-gray-600">
              {weekDays[0].getDate()} - {weekDays[6].getDate()}
            </div>
          </div>

          <button
            onClick={() => navigateWeek('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Schedule Grid */}
      {selectedResource ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Agenda - {getResourceName(selectedResource)}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header with days */}
              <div className="grid grid-cols-8 border-b border-gray-200">
                <div className="p-3 bg-gray-50 border-r border-gray-200">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Clock className="w-4 h-4" />
                    Horário
                  </div>
                </div>
                {weekDays.map((date, index) => (
                  <div key={index} className="border-r border-gray-200 last:border-r-0">
                    {formatDateHeader(date)}
                  </div>
                ))}
              </div>

              {/* Time slots */}
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 border-b border-gray-200 last:border-b-0">
                  <div className="p-3 bg-gray-50 border-r border-gray-200 flex items-center">
                    <span className="text-sm font-medium text-gray-700">{time}</span>
                  </div>
                  {weekDays.map((date, dayIndex) => {
                    const lesson = getLessonForSlot(date, time);
                    const isAvailable = isResourceAvailable(date, time);
                    const isPast = date < new Date() || (date.toDateString() === new Date().toDateString() && parseInt(time.split(':')[0]) < new Date().getHours());

                    return (
                      <div
                        key={dayIndex}
                        className={`p-2 border-r border-gray-200 last:border-r-0 min-h-[60px] ${
                          isPast 
                            ? 'bg-gray-50' 
                            : isAvailable 
                              ? 'bg-white hover:bg-blue-50 cursor-pointer' 
                              : 'bg-gray-100'
                        }`}
                      >
                        {lesson ? (
                          <div className={`p-2 rounded-lg text-xs ${
                            lesson.type === 'theoretical' 
                              ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                              : 'bg-green-100 text-green-800 border border-green-200'
                          }`}>
                            <div className="font-medium truncate">
                              {getStudentName(lesson.studentId)}
                            </div>
                            <div className="text-xs opacity-75">
                              {lesson.type === 'theoretical' ? 'Teórica' : 'Prática'}
                            </div>
                            <div className="text-xs opacity-75">
                              {lesson.duration}min
                            </div>
                          </div>
                        ) : isAvailable && !isPast ? (
                          <div className="h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full opacity-50"></div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-600">Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
                <span className="text-gray-600">Aula Teórica</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span className="text-gray-600">Aula Prática</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <span className="text-gray-600">Indisponível</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione um recurso</h3>
          <p className="text-gray-600">
            Escolha {viewType === 'instructor' ? 'um instrutor' : 'um veículo'} para visualizar a agenda
          </p>
        </div>
      )}
    </div>
  );
}