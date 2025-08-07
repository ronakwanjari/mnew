import { supabase } from './supabase'
import type { Doctor, Appointment, Vital, ChatSession, ChatMessage, Pharmacy } from './supabase'

// Doctor operations
export async function getDoctors(specialty?: string, search?: string) {
  // Show only one doctor for simplified booking
  const mockDoctors = [
    {
      id: "doc_001",
      name: "Dr. Sarah Johnson",
      specialty: "General Medicine",
      email: "sujalt.etc22@sbjit.edu.in",
      phone: "+1 (555) 123-4567",
      license_number: "MD123456",
      experience: "8 years",
      education: "MD from Harvard Medical School",
      about: "Dr. Sarah Johnson is a dedicated general practitioner with over 8 years of experience in primary care.",
      languages: ["English", "Spanish"],
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      consultation_fee: 150,
      rating: 4.8,
      total_reviews: 245,
      image: "/placeholder-user.jpg",
      status: "active",
      consultationFee: 150,
      totalReviews: 245,
      licenseNumber: "MD123456"
    }
  ]

  // Filter mock data based on parameters
  let filteredDoctors = mockDoctors
  
  if (specialty && specialty !== 'all') {
    filteredDoctors = filteredDoctors.filter(doc => 
      doc.specialty.toLowerCase().includes(specialty.toLowerCase())
    )
  }
  
  if (search) {
    filteredDoctors = filteredDoctors.filter(doc =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase())
    )
  }

  try {
    // Try to fetch from Supabase as fallback
    let query = supabase
      .from('doctors')
      .select('*')
      .eq('status', 'active')
      .order('rating', { ascending: false })
      .limit(1) // Only show one doctor

    if (specialty && specialty !== 'all') {
      query = query.ilike('specialty', `%${specialty}%`)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,specialty.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (!error && data && data.length > 0) {
      // Map database fields to frontend expected format
      return data.slice(0, 1).map(doctor => ({
        ...doctor,
        consultationFee: doctor.consultation_fee,
        totalReviews: doctor.total_reviews,
        licenseNumber: doctor.license_number
      })) as Doctor[]
    }
  } catch (dbError) {
    console.log('Database not available, using mock data')
  }

  return filteredDoctors as Doctor[]
}

export async function getDoctorById(id: string) {
  try {
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
  } catch (error) {
    // Fallback to mock data
    const mockDoctors = await getDoctors()
    const doctor = mockDoctors.find(d => d.id === id)
    if (!doctor) {
      throw new Error('Doctor not found')
    }
    return doctor
  }
}

// Appointment operations
export async function createAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) {
  try {
    console.log("Creating appointment in database:", appointmentData)
    
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
      // Fall back to mock appointment instead of throwing error
      console.log('Falling back to mock appointment creation')
      const mockAppointment = {
        id: `apt_${Date.now()}`,
        ...appointmentData,
        meeting_link: `https://medibot-meet.com/room/${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      console.log("Mock appointment created:", mockAppointment.id)
      return mockAppointment as Appointment
    }

    console.log("Database appointment created successfully:", data.id)
    return data as Appointment
  } catch (error) {
    console.log("Database error, creating mock appointment:", error)
    // Create mock appointment for demo
    const mockAppointment = {
      id: `apt_${Date.now()}`,
      ...appointmentData,
      meeting_link: `https://medibot-meet.com/room/${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    console.log("Mock appointment created:", mockAppointment.id)
    return mockAppointment as Appointment
  }
}

export async function getAppointments(patientId?: string, doctorId?: string, status?: string) {
  try {
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
  } catch (error) {
    // Return mock appointments for demo
    return [] as Appointment[]
  }
}

export async function updateAppointment(id: string, updates: Partial<Appointment>) {
  try {
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
  } catch (error) {
    // Return mock updated appointment for demo
    return {
      id,
      ...updates,
      updated_at: new Date().toISOString()
    } as Appointment
  }
}

// Vital signs operations
export async function saveVitals(vitalData: Omit<Vital, 'id' | 'recorded_at'>) {
  try {
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
  } catch (error) {
    // Return mock vital record for demo
    return {
      id: `vital_${Date.now()}`,
      ...vitalData,
      recorded_at: new Date().toISOString()
    } as Vital
  }
}

export async function getVitals(patientId: string, limit = 10) {
  try {
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
  } catch (error) {
    // Return mock vitals for demo
    return [] as Vital[]
  }
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