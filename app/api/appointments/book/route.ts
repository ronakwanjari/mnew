import { type NextRequest, NextResponse } from "next/server"

// Mock database for appointments
const appointments: Array<{
  id: string
  patientId: string
  patientName: string
  patientEmail: string
  patientPhone: string
  doctorId: string
  doctorName: string
  doctorEmail: string
  appointmentDate: string
  appointmentTime: string
  reason: string
  symptoms: string
  status: "pending" | "confirmed" | "rejected" | "completed" | "cancelled"
  consultationFee: number
  meetingLink?: string
  createdAt: string
  updatedAt: string
}> = []

// Helper function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Helper function to generate meeting link
function generateMeetingLink(appointmentId: string): string {
  return `https://medibot-meet.com/room/${appointmentId}`
}

// Helper function to send email notification (mock)
async function sendEmailNotification(appointment: any) {
  // In production, integrate with email service like SendGrid, Nodemailer, etc.
  console.log("Sending email notification to doctor:", appointment.doctorEmail)
  console.log("Appointment details:", {
    patient: appointment.patientName,
    date: appointment.appointmentDate,
    time: appointment.appointmentTime,
    reason: appointment.reason
  })
  
  // Mock email content
  const emailContent = {
    to: appointment.doctorEmail,
    subject: `New Appointment Request - ${appointment.patientName}`,
    html: `
      <h2>New Appointment Request</h2>
      <p><strong>Patient:</strong> ${appointment.patientName}</p>
      <p><strong>Email:</strong> ${appointment.patientEmail}</p>
      <p><strong>Phone:</strong> ${appointment.patientPhone}</p>
      <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
      <p><strong>Reason:</strong> ${appointment.reason}</p>
      <p><strong>Symptoms:</strong> ${appointment.symptoms}</p>
      <p><strong>Consultation Fee:</strong> $${appointment.consultationFee}</p>
      <br>
      <p>Please log in to your dashboard to approve or reject this appointment.</p>
    `
  }
  
  return { success: true, emailContent }
}

// POST - Book new appointment with doctor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      patientName,
      patientEmail,
      patientPhone,
      doctorId,
      doctorName,
      doctorEmail,
      appointmentDate,
      appointmentTime,
      reason,
      symptoms,
      consultationFee
    } = body

    // Validate required fields
    if (!patientName || !patientEmail || !doctorId || !appointmentDate || !appointmentTime || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Generate appointment ID and meeting link
    const appointmentId = generateId()
    const meetingLink = generateMeetingLink(appointmentId)

    // Create new appointment
    const newAppointment = {
      id: appointmentId,
      patientId: body.patientId || generateId(),
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim().toLowerCase(),
      patientPhone: patientPhone || "",
      doctorId,
      doctorName,
      doctorEmail,
      appointmentDate,
      appointmentTime,
      reason: reason.trim(),
      symptoms: symptoms?.trim() || "",
      status: "pending" as const,
      consultationFee: consultationFee || 0,
      meetingLink,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to mock database
    appointments.push(newAppointment)

    // Send email notification to doctor
    try {
      // Send email using the new email API
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'appointmentRequest',
          appointment: newAppointment
        })
      })

      if (emailResponse.ok) {
        console.log("Email notification sent successfully")
      } else {
        console.error("Failed to send email notification")
      }
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError)
      // Don't fail the appointment booking if email fails
    }

    console.log("Appointment booked successfully:", appointmentId)

    return NextResponse.json(
      {
        success: true,
        message: "Appointment booked successfully! The doctor will be notified via email.",
        appointment: {
          id: newAppointment.id,
          doctorName: newAppointment.doctorName,
          appointmentDate: newAppointment.appointmentDate,
          appointmentTime: newAppointment.appointmentTime,
          status: newAppointment.status,
          meetingLink: newAppointment.meetingLink
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error booking appointment:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to book appointment",
      },
      { status: 500 }
    )
  }
}

// GET - Get appointment by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get("id")

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      )
    }

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
      { error: "Failed to fetch appointment" },
      { status: 500 }
    )
  }
}