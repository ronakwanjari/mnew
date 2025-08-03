import { type NextRequest, NextResponse } from "next/server"

// Mock database for appointments - in production, use a real database
let appointments: Array<{
  id: string
  patientId: string
  patientName: string
  patientEmail: string
  patientPhone?: string
  doctorId?: string
  doctorName?: string
  doctorEmail?: string
  appointmentDate: string
  appointmentTime: string
  reason: string
  symptoms: string
  status: "pending" | "approved" | "rejected" | "completed"
  consultationFee?: number
  meetingLink?: string
  createdAt: string
  updatedAt: string
}> = [
  {
    id: "apt_001",
    patientId: "patient_123",
    patientName: "John Doe",
    patientEmail: "john.doe@example.com",
    patientPhone: "+1 (555) 123-4567",
    doctorId: "1",
    doctorName: "Dr. Sarah Johnson",
    doctorEmail: "sarah.johnson@medibot.com",
    appointmentDate: "2024-01-25",
    appointmentTime: "14:00",
    reason: "General consultation",
    symptoms: "Persistent headache and fatigue",
    status: "pending",
    consultationFee: 150,
    meetingLink: "https://medibot-meet.com/room/apt_001",
    createdAt: "2024-01-20T10:00:00.000Z",
    updatedAt: "2024-01-20T10:00:00.000Z"
  }
]

// GET - Fetch specific appointment by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id
    const appointment = appointments.find(apt => apt.id === appointmentId)

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      appointment
    })
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return NextResponse.json(
      { error: "Failed to fetch appointment details" },
      { status: 500 }
    )
  }
}

// PUT - Update appointment status (approve/reject by doctor)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id
    const body = await request.json()
    const { status, doctorNotes, meetingLink } = body

    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId)
    
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    // Update appointment
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      status,
      ...(doctorNotes && { doctorNotes }),
      ...(meetingLink && { meetingLink }),
      updatedAt: new Date().toISOString()
    }

    // Send notification to patient (mock)
    const appointment = appointments[appointmentIndex]
    console.log(`Sending notification to patient: ${appointment.patientEmail}`)
    console.log(`Appointment ${status}: ${appointmentId}`)

    return NextResponse.json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment: appointments[appointmentIndex]
    })
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    )
  }
}

// DELETE - Cancel appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id
    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId)
    
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    const deletedAppointment = appointments.splice(appointmentIndex, 1)[0]

    return NextResponse.json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment: deletedAppointment
    })
  } catch (error) {
    console.error("Error cancelling appointment:", error)
    return NextResponse.json(
      { error: "Failed to cancel appointment" },
      { status: 500 }
    )
  }
}