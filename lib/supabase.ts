import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  date_of_birth?: string
  user_type: 'patient' | 'admin'
  created_at: string
  updated_at: string
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  email: string
  phone?: string
  license_number?: string
  experience?: string
  education?: string
  about?: string
  languages: string[]
  availability: string[]
  consultation_fee: number
  rating: number
  total_reviews: number
  image?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Pharmacy {
  id: string
  name: string
  address: string
  phone?: string
  email?: string
  delivery_time?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  patient_name: string
  patient_email: string
  patient_phone?: string
  doctor_id?: string
  doctor_name?: string
  doctor_email?: string
  appointment_date: string
  appointment_time: string
  reason: string
  symptoms: string
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  consultation_fee: number
  meeting_link?: string
  doctor_notes?: string
  created_at: string
  updated_at: string
}

export interface Vital {
  id: string
  patient_id: string
  heart_rate?: number
  spo2?: number
  temperature?: number
  bmi?: number
  recorded_at: string
}

export interface ChatSession {
  id: string
  patient_id: string
  session_start: string
  session_end?: string
  status: 'active' | 'completed'
}

export interface ChatMessage {
  id: string
  session_id: string
  message: string
  sender: 'user' | 'bot'
  severity?: 'low' | 'medium' | 'high'
  appointment_suggested: boolean
  created_at: string
}

export interface MedicineOrder {
  id: string
  patient_id: string
  pharmacy_id?: string
  medicines: any
  total_amount?: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  delivery_address?: string
  created_at: string
  updated_at: string
}