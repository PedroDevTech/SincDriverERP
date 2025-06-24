import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          role_id: string
          status: 'active' | 'inactive'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role_id?: string
          status?: 'active' | 'inactive'
          avatar_url?: string | null
        }
        Update: {
          name?: string
          role_id?: string
          status?: 'active' | 'inactive'
          avatar_url?: string | null
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          created_at: string
          updated_at: string
        }
      }
      permissions: {
        Row: {
          id: string
          module: string
          action: string
          description: string | null
          created_at: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          cpf: string
          birth_date: string
          address: string
          category: 'A' | 'B' | 'C' | 'D' | 'E'
          status: 'active' | 'suspended' | 'graduated' | 'inactive'
          theoretical_hours: number
          practical_hours: number
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          email: string
          phone: string
          cpf: string
          birth_date: string
          address: string
          category: 'A' | 'B' | 'C' | 'D' | 'E'
          status?: 'active' | 'suspended' | 'graduated' | 'inactive'
          theoretical_hours?: number
          practical_hours?: number
          avatar_url?: string | null
        }
        Update: {
          name?: string
          email?: string
          phone?: string
          cpf?: string
          birth_date?: string
          address?: string
          category?: 'A' | 'B' | 'C' | 'D' | 'E'
          status?: 'active' | 'suspended' | 'graduated' | 'inactive'
          theoretical_hours?: number
          practical_hours?: number
          avatar_url?: string | null
        }
      }
      instructors: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          cpf: string
          license: string
          specialties: string[]
          status: 'active' | 'inactive'
          working_hours: {
            start: string
            end: string
            days: string[]
          }
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          email: string
          phone: string
          cpf: string
          license: string
          specialties?: string[]
          status?: 'active' | 'inactive'
          working_hours?: {
            start: string
            end: string
            days: string[]
          }
          avatar_url?: string | null
        }
        Update: {
          name?: string
          email?: string
          phone?: string
          cpf?: string
          license?: string
          specialties?: string[]
          status?: 'active' | 'inactive'
          working_hours?: {
            start: string
            end: string
            days: string[]
          }
          avatar_url?: string | null
        }
      }
      vehicles: {
        Row: {
          id: string
          brand: string
          model: string
          year: number
          plate: string
          category: 'A' | 'B' | 'C' | 'D' | 'E'
          status: 'available' | 'maintenance' | 'unavailable'
          fuel_type: 'gasoline' | 'ethanol' | 'diesel' | 'flex'
          transmission: 'manual' | 'automatic'
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          brand: string
          model: string
          year: number
          plate: string
          category: 'A' | 'B' | 'C' | 'D' | 'E'
          status?: 'available' | 'maintenance' | 'unavailable'
          fuel_type?: 'gasoline' | 'ethanol' | 'diesel' | 'flex'
          transmission?: 'manual' | 'automatic'
          color: string
        }
        Update: {
          brand?: string
          model?: string
          year?: number
          plate?: string
          category?: 'A' | 'B' | 'C' | 'D' | 'E'
          status?: 'available' | 'maintenance' | 'unavailable'
          fuel_type?: 'gasoline' | 'ethanol' | 'diesel' | 'flex'
          transmission?: 'manual' | 'automatic'
          color?: string
        }
      }
      packages: {
        Row: {
          id: string
          name: string
          description: string
          category: 'A' | 'B' | 'C' | 'D' | 'E'
          price: number
          theoretical_hours: number
          practical_hours: number
          exam_attempts: number
          validity_days: number
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          description: string
          category: 'A' | 'B' | 'C' | 'D' | 'E'
          price: number
          theoretical_hours: number
          practical_hours: number
          exam_attempts: number
          validity_days: number
          status?: 'active' | 'inactive'
        }
        Update: {
          name?: string
          description?: string
          category?: 'A' | 'B' | 'C' | 'D' | 'E'
          price?: number
          theoretical_hours?: number
          practical_hours?: number
          exam_attempts?: number
          validity_days?: number
          status?: 'active' | 'inactive'
        }
      }
      sales: {
        Row: {
          id: string
          student_id: string
          package_id: string
          seller_id: string | null
          total_amount: number
          discount: number
          final_amount: number
          payment_method: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'installments'
          installments: number | null
          status: 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          student_id: string
          package_id: string
          seller_id?: string | null
          total_amount: number
          discount?: number
          final_amount: number
          payment_method: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'installments'
          installments?: number | null
          status?: 'completed' | 'cancelled'
          notes?: string | null
        }
        Update: {
          student_id?: string
          package_id?: string
          seller_id?: string | null
          total_amount?: number
          discount?: number
          final_amount?: number
          payment_method?: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'installments'
          installments?: number | null
          status?: 'completed' | 'cancelled'
          notes?: string | null
        }
      }
      lessons: {
        Row: {
          id: string
          student_id: string
          instructor_id: string
          vehicle_id: string | null
          type: 'theoretical' | 'practical'
          date: string
          time: string
          duration: number
          status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
          location: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          student_id: string
          instructor_id: string
          vehicle_id?: string | null
          type: 'theoretical' | 'practical'
          date: string
          time: string
          duration?: number
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
          location?: string | null
          notes?: string | null
        }
        Update: {
          student_id?: string
          instructor_id?: string
          vehicle_id?: string | null
          type?: 'theoretical' | 'practical'
          date?: string
          time?: string
          duration?: number
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
          location?: string | null
          notes?: string | null
        }
      }
      exams: {
        Row: {
          id: string
          student_id: string
          type: 'theoretical' | 'practical'
          date: string
          time: string
          status: 'scheduled' | 'approved' | 'failed' | 'no-show'
          score: number | null
          attempts: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          student_id: string
          type: 'theoretical' | 'practical'
          date: string
          time: string
          status?: 'scheduled' | 'approved' | 'failed' | 'no-show'
          score?: number | null
          attempts?: number
          notes?: string | null
        }
        Update: {
          student_id?: string
          type?: 'theoretical' | 'practical'
          date?: string
          time?: string
          status?: 'scheduled' | 'approved' | 'failed' | 'no-show'
          score?: number | null
          attempts?: number
          notes?: string | null
        }
      }
      accounts_receivable: {
        Row: {
          id: string
          sale_id: string | null
          student_id: string
          description: string
          amount: number
          due_date: string
          status: 'pending' | 'paid' | 'overdue' | 'cancelled'
          payment_date: string | null
          payment_method: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | null
          installment_number: number | null
          total_installments: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          sale_id?: string | null
          student_id: string
          description: string
          amount: number
          due_date: string
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
          payment_date?: string | null
          payment_method?: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | null
          installment_number?: number | null
          total_installments?: number | null
          notes?: string | null
        }
        Update: {
          sale_id?: string | null
          student_id?: string
          description?: string
          amount?: number
          due_date?: string
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
          payment_date?: string | null
          payment_method?: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | null
          installment_number?: number | null
          total_installments?: number | null
          notes?: string | null
        }
      }
      accounts_payable: {
        Row: {
          id: string
          supplier_id: string | null
          category: 'salary' | 'fuel' | 'maintenance' | 'rent' | 'utilities' | 'insurance' | 'taxes' | 'supplies' | 'other'
          description: string
          amount: number
          due_date: string
          status: 'pending' | 'paid' | 'overdue' | 'cancelled'
          payment_date: string | null
          payment_method: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'check' | null
          recurring: boolean
          recurring_frequency: 'monthly' | 'quarterly' | 'yearly' | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          supplier_id?: string | null
          category: 'salary' | 'fuel' | 'maintenance' | 'rent' | 'utilities' | 'insurance' | 'taxes' | 'supplies' | 'other'
          description: string
          amount: number
          due_date: string
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
          payment_date?: string | null
          payment_method?: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'check' | null
          recurring?: boolean
          recurring_frequency?: 'monthly' | 'quarterly' | 'yearly' | null
          notes?: string | null
        }
        Update: {
          supplier_id?: string | null
          category?: 'salary' | 'fuel' | 'maintenance' | 'rent' | 'utilities' | 'insurance' | 'taxes' | 'supplies' | 'other'
          description?: string
          amount?: number
          due_date?: string
          status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
          payment_date?: string | null
          payment_method?: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'check' | null
          recurring?: boolean
          recurring_frequency?: 'monthly' | 'quarterly' | 'yearly' | null
          notes?: string | null
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          cnpj: string | null
          cpf: string | null
          email: string
          phone: string
          address: string
          category: 'fuel' | 'maintenance' | 'supplies' | 'services' | 'other'
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          cnpj?: string | null
          cpf?: string | null
          email: string
          phone: string
          address: string
          category: 'fuel' | 'maintenance' | 'supplies' | 'services' | 'other'
          status?: 'active' | 'inactive'
        }
        Update: {
          name?: string
          cnpj?: string | null
          cpf?: string | null
          email?: string
          phone?: string
          address?: string
          category?: 'fuel' | 'maintenance' | 'supplies' | 'services' | 'other'
          status?: 'active' | 'inactive'
        }
      }
    }
  }
}