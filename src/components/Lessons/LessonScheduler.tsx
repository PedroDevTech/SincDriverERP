import React, { useState } from 'react';
import { Calendar, Clock, User, Car, MapPin, X, CheckCircle, AlertCircle } from 'lucide-react';
import { mockStudents, mockInstructors, mockVehicles, mockLessons } from '../../utils/mockData';
import { Student, Instructor, Vehicle, Lesson } from '../../types';

interface LessonSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Omit<Lesson, 'id'>) => void;
  lesson?: Lesson | null;
}

export function LessonScheduler({ isOpen, onClose, onSave, lesson }: LessonSchedulerProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    instructorId: '',
    vehicleId: '',
    type: 'practical' as 'theoretical' | 'practical',
    date: '',
    time: '',
    duration: 50,
    location: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  React.useEffect(() => {
    if (lesson) {
      setFormData({
        studentId: lesson.studentId,
        instructorId: lesson.instructorId,
        vehicleId: lesson.vehicleId || '',
        type: lesson.type,
        date: lesson.date,
        time: lesson.time,
        duration: lesson.duration,
        location: lesson.location || '',
        notes: lesson.notes || '',
      });
    } else {
      setFormData({
        studentId: '',
        instructorId: '',
        vehicleId: '',
        type: 'practical',
        date: '',
        time: '',
        duration: 50,
        location: '',
        notes: '',
      });
    }
    setErrors({});
  }, [lesson, isOpen]);

  React.useEffect(() => {
    if (formData.instructorId && formData.date) {
      generateAvailableSlots();
    }
  }, [formData.instructorId, formData.date]);

  const generateAvailableSlots = () => {
    const instructor = mockInstructors.find(i => i.id === formData.instructorId);
    if (!instructor) return;

    const selectedDate = new Date(formData.date);
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    if (!instructor.workingHours.days.includes(dayOfWeek)) {
      setAvailableSlots([]);
      return;
    }

    const startHour = parseInt(instructor.workingHours.start.split(':')[0]);
    const endHour = parseInt(instructor.workingHours.end.split(':')[0]);
    
    const slots: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      
      // Check if slot is already booked
      const isBooked = mockLessons.some(l => 
        l.instructorId === formData.instructorId &&
        l.date === formData.date &&
        l.time === timeSlot &&
        l.status === 'scheduled' &&
        l.id !== lesson?.id
      );
      
      if (!isBooked) {
        slots.push(timeSlot);
      }
    }
    
    setAvailableSlots(slots);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentId) {
      newErrors.studentId = 'Selecione um aluno';
    }

    if (!formData.instructorId) {
      newErrors.instructorId = 'Selecione um instrutor';
    }

    if (formData.type === 'practical' && !formData.vehicleId) {
      newErrors.vehicleId = 'Selecione um veículo para aula prática';
    }

    if (!formData.date) {
      newErrors.date = 'Selecione uma data';
    }

    if (!formData.time) {
      newErrors.time = 'Selecione um horário';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Local é obrigatório';
    }

    // Validate instructor availability
    if (formData.instructorId && formData.date) {
      const instructor = mockInstructors.find(i => i.id === formData.instructorId);
      const selectedDate = new Date(formData.date);
      const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
      
      if (instructor && !instructor.workingHours.days.includes(dayOfWeek)) {
        newErrors.date = 'Instrutor não trabalha neste dia';
      }
    }

    // Validate student category matches vehicle category
    if (formData.studentId && formData.vehicleId) {
      const student = mockStudents.find(s => s.id === formData.studentId);
      const vehicle = mockVehicles.find(v => v.id === formData.vehicleId);
      
      if (student && vehicle && student.category !== vehicle.category) {
        newErrors.vehicleId = 'Categoria do veículo não compatível com o aluno';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const lessonData = {
        ...formData,
        status: 'scheduled' as const,
        vehicleId: formData.type === 'theoretical' ? undefined : formData.vehicleId,
      };
      
      onSave(lessonData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getAvailableVehicles = () => {
    if (!formData.studentId) return [];
    
    const student = mockStudents.find(s => s.id === formData.studentId);
    if (!student) return [];
    
    return mockVehicles.filter(v => 
      v.category === student.category && 
      v.status === 'available'
    );
  };

  const getCompatibleInstructors = () => {
    if (!formData.studentId) return mockInstructors.filter(i => i.status === 'active');
    
    const student = mockStudents.find(s => s.id === formData.studentId);
    if (!student) return mockInstructors.filter(i => i.status === 'active');
    
    return mockInstructors.filter(i => 
      i.status === 'active' && 
      i.specialties.some(s => s.includes(student.category))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {lesson ? 'Editar Aula' : 'Agendar Nova Aula'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de Aula */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tipo de Aula</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="theoretical"
                  checked={formData.type === 'theoretical'}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Teórica</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="practical"
                  checked={formData.type === 'practical'}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Prática</span>
              </label>
            </div>
          </div>

          {/* Seleção de Aluno e Instrutor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aluno *
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.studentId}
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.studentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione um aluno</option>
                  {mockStudents.filter(s => s.status === 'active').map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - Cat. {student.category}
                    </option>
                  ))}
                </select>
              </div>
              {errors.studentId && <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrutor *
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.instructorId}
                  onChange={(e) => handleInputChange('instructorId', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.instructorId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione um instrutor</option>
                  {getCompatibleInstructors().map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name} - {instructor.specialties.join(', ')}
                    </option>
                  ))}
                </select>
              </div>
              {errors.instructorId && <p className="text-red-500 text-sm mt-1">{errors.instructorId}</p>}
            </div>
          </div>

          {/* Veículo (apenas para aulas práticas) */}
          {formData.type === 'practical' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Veículo *
              </label>
              <div className="relative">
                <Car className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.vehicleId}
                  onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.vehicleId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione um veículo</option>
                  {getAvailableVehicles().map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.plate} (Cat. {vehicle.category})
                    </option>
                  ))}
                </select>
              </div>
              {errors.vehicleId && <p className="text-red-500 text-sm mt-1">{errors.vehicleId}</p>}
            </div>
          )}

          {/* Data e Horário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data *
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário *
              </label>
              <div className="relative">
                <Clock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={!formData.instructorId || !formData.date}
                >
                  <option value="">Selecione um horário</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              {availableSlots.length === 0 && formData.instructorId && formData.date && (
                <p className="text-yellow-600 text-sm mt-1">Nenhum horário disponível para esta data</p>
              )}
            </div>
          </div>

          {/* Duração e Local */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração (minutos)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={50}>50 minutos</option>
                <option value={100}>100 minutos (2 aulas)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Local *
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={formData.type === 'theoretical' ? 'Sala de Aula 1' : 'Centro de Treinamento'}
                />
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Observações adicionais sobre a aula..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {lesson ? 'Salvar Alterações' : 'Agendar Aula'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}