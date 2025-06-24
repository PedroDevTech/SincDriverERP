export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  birthDate: string;
  address: string;
  category: 'A' | 'B' | 'C' | 'D' | 'E';
  status: 'active' | 'suspended' | 'graduated' | 'inactive';
  registrationDate: string;
  theoreticalHours: number;
  practicalHours: number;
  avatar?: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  license: string;
  specialties: string[];
  status: 'active' | 'inactive';
  avatar?: string;
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  category: 'A' | 'B' | 'C' | 'D' | 'E';
  status: 'available' | 'maintenance' | 'unavailable';
  fuelType: 'gasoline' | 'ethanol' | 'diesel' | 'flex';
  transmission: 'manual' | 'automatic';
  color: string;
  registrationDate: string;
}

export interface Lesson {
  id: string;
  studentId: string;
  instructorId: string;
  vehicleId?: string;
  type: 'theoretical' | 'practical';
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  location?: string;
}

export interface Exam {
  id: string;
  studentId: string;
  type: 'theoretical' | 'practical';
  date: string;
  time: string;
  status: 'scheduled' | 'approved' | 'failed' | 'no-show';
  score?: number;
  attempts: number;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  category: 'A' | 'B' | 'C' | 'D' | 'E';
  price: number;
  theoreticalHours: number;
  practicalHours: number;
  examAttempts: number;
  validityDays: number;
  status: 'active' | 'inactive';
  createdDate: string;
}

export interface Sale {
  id: string;
  studentId: string;
  packageId: string;
  saleDate: string;
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'installments';
  installments?: number;
  status: 'completed' | 'cancelled';
  notes?: string;
  sellerId: string;
}

export interface AccountsReceivable {
  id: string;
  saleId?: string;
  studentId: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentDate?: string;
  paymentMethod?: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer';
  installmentNumber?: number;
  totalInstallments?: number;
  notes?: string;
}

export interface AccountsPayable {
  id: string;
  supplierId?: string;
  category: 'salary' | 'fuel' | 'maintenance' | 'rent' | 'utilities' | 'insurance' | 'taxes' | 'supplies' | 'other';
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentDate?: string;
  paymentMethod?: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'check';
  recurring: boolean;
  recurringFrequency?: 'monthly' | 'quarterly' | 'yearly';
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj?: string;
  cpf?: string;
  email: string;
  phone: string;
  address: string;
  category: 'fuel' | 'maintenance' | 'supplies' | 'services' | 'other';
  status: 'active' | 'inactive';
  registrationDate: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  type: 'enrollment' | 'monthly' | 'exam' | 'extra';
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  paidDate?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  lessonId?: string;
}

export interface ScheduleDay {
  date: string;
  timeSlots: TimeSlot[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'seller' | 'financial' | 'instructor' | 'receptionist';
  status: 'active' | 'inactive';
  avatar?: string;
  createdDate: string;
  lastLogin?: string;
  permissions: Permission[];
}

export interface Permission {
  module: string;
  actions: ('view' | 'create' | 'edit' | 'delete')[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  color: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (module: string, action: 'view' | 'create' | 'edit' | 'delete') => boolean;
  isLoading: boolean;
}