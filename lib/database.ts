import { supabase } from './supabase'
import type { Doctor, Appointment, Vital, ChatSession, ChatMessage, Pharmacy } from './supabase'

// Doctor operations
export async function getDoctors(specialty?: string, search?: string) {
  let query = supabase
    .from('doctors')
    .select('*')
    .eq('status', 'active')
    .order('rating', { ascending: false })

  if (specialty && specialty !== 'all') {
    query = query.ilike('specialty', `%${specialty}%`)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,specialty.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching doctors:', error)
    throw new Error('Failed to fetch doctors')
  }

  return data as Doctor[]
}

export async function getDoctorById(id: string) {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (error) {
    console.error('Error fetching doctor:', error)
    throw new Error('Doctor not found')
  }

  return data as Doctor
}

// Appointment operations
export async function createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      ...appointmentData,
      meeting_link: `https://medibot-meet.com/room/${Date.now()}`
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating appointment:', error)
    throw new Error('Failed to create appointment')
  }

  return data as Appointment
}

export async function getAppointments(patientId?: string, doctorId?: string, status?: string) {
  let query = supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false })

  if (patientId) {
    query = query.eq('patient_id', patientId)
  }

  if (doctorId) {
    query = query.eq('doctor_id', doctorId)
  }

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching appointments:', error)
    throw new Error('Failed to fetch appointments')
  }

  return data as Appointment[]
}

export async function updateAppointment(id: string, updates: Partial<Appointment>) {
  const { data, error } = await supabase
    .from('appointments')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating appointment:', error)
    throw new Error('Failed to update appointment')
  }

  return data as Appointment
}

// Vital signs operations
export async function saveVitals(vitalData: Omit<Vital, 'id' | 'recorded_at'>) {
  const { data, error } = await supabase
    .from('vitals')
    .insert([vitalData])
    .select()
    .single()

  if (error) {
    console.error('Error saving vitals:', error)
    throw new Error('Failed to save vitals')
  }

  return data as Vital
}

export async function getVitals(patientId: string, limit = 10) {
  const { data, error } = await supabase
    .from('vitals')
    .select('*')
    .eq('patient_id', patientId)
    .order('recorded_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching vitals:', error)
    throw new Error('Failed to fetch vitals')
  }

  return data as Vital[]
}

// Chat operations
export async function createChatSession(patientId: string) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{ patient_id: patientId }])
    .select()
    .single()

  if (error) {
    console.error('Error creating chat session:', error)
    throw new Error('Failed to create chat session')
  }

  return data as ChatSession
}

export async function saveChatMessage(messageData: Omit<ChatMessage, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([messageData])
    .select()
    .single()

  if (error) {
    console.error('Error saving chat message:', error)
    throw new Error('Failed to save chat message')
  }

  return data as ChatMessage
}

export async function getChatMessages(sessionId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching chat messages:', error)
    throw new Error('Failed to fetch chat messages')
  }

  return data as ChatMessage[]
}

// Pharmacy operations
export async function getPharmacies() {
  const { data, error } = await supabase
    .from('pharmacies')
    .select('*')
    .eq('status', 'active')
    .order('name')

  if (error) {
    console.error('Error fetching pharmacies:', error)
    throw new Error('Failed to fetch pharmacies')
  }

  return data as Pharmacy[]
}

// Statistics operations
export async function getAppointmentStats() {
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('status, created_at')

  if (error) {
    console.error('Error fetching appointment stats:', error)
    return {
      total: 0,
      pending: 0,
      approved: 0,
      completed: 0,
      rejected: 0
    }
  }

  const stats = appointments.reduce((acc, apt) => {
    acc.total++
    acc[apt.status as keyof typeof acc] = (acc[apt.status as keyof typeof acc] || 0) + 1
    return acc
  }, {
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
    cancelled: 0
  })

  return stats
}