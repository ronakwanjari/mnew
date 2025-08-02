import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const appointments: Array<{
  id: string
  patientId: string
  patientName: string
  patientEmail: string
  doctorId?: string
  doctorName?: string
  appointmentDate: string
  appointmentTime: string
  reason: string
  symptoms: string
  status: "pending" | "approved" | "rejected" | "completed"
  createdAt: string
  updatedAt: string
}> = []

// Helper function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Helper function to validate appointment data
function validateAppointmentData(data: any) {
  const required = ["patientName", "patientEmail", "appointmentDate", "appointmentTime", "reason"]
  const missing = required.filter((field) => !data[field])

  if (missing.length > 0) {
    return { valid: false, message: `Missing required fields: ${missing.join(", ")}` }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.patientEmail)) {
    return { valid: false, message: "Invalid email format" }
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(data.appointmentDate)) {
    return { valid: false, message: "Invalid date format. Use YYYY-MM-DD" }
  }

  // Validate time format (HH:MM)
  const timeRegex = /^\d{2}:\d{2}$/
  if (!timeRegex.test(data.appointmentTime)) {
    return { valid: false, message: "Invalid time format. Use HH:MM" }
  }

  return { valid: true }
}

// POST - Create new appointment
export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/appointments - Creating new appointment")

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    console.log("Received appointment data:", body)

    // Validate required fields
    const validation = validateAppointmentData(body)
    if (!validation.valid) {
      console.error("Validation error:", validation.message)
      return NextResponse.json({ error: validation.message }, { status: 400 })
    }

    // Create new appointment
    const newAppointment = {
      id: generateId(),
      patientId: body.patientId || generateId(),
      patientName: body.patientName.trim(),
      patientEmail: body.patientEmail.trim().toLowerCase(),
      doctorId: body.doctorId || null,
      doctorName: body.doctorName || null,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      reason: body.reason.trim(),
      symptoms: body.symptoms?.trim() || "",
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to mock database
    appointments.push(newAppointment)

    console.log("Appointment created successfully:", newAppointment.id)

    return NextResponse.json(
      {
        success: true,
        message: "Appointment booked successfully",
        appointment: newAppointment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to create appointment",
      },
      { status: 500 },
    )
  }
}

// GET - Fetch appointments
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/appointments - Fetching appointments")

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")
    const doctorId = searchParams.get("doctorId")
    const status = searchParams.get("status")

    let filteredAppointments = [...appointments]

    // Filter by patient ID
    if (patientId) {
      filteredAppointments = filteredAppointments.filter((apt) => apt.patientId === patientId)
    }

    // Filter by doctor ID
    if (doctorId) {
      filteredAppointments = filteredAppointments.filter((apt) => apt.doctorId === doctorId)
    }

    // Filter by status
    if (status) {
      filteredAppointments = filteredAppointments.filter((apt) => apt.status === status)
    }

    // Sort by creation date (newest first)
    filteredAppointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    console.log(`Found ${filteredAppointments.length} appointments`)

    return NextResponse.json({
      success: true,
      appointments: filteredAppointments,
      total: filteredAppointments.length,
    })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch appointments",
      },
      { status: 500 },
    )
  }
}

// PUT - Update appointment
export async function PUT(request: NextRequest) {
  try {
    console.log("PUT /api/appointments - Updating appointment")

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { id, status, doctorId, doctorName } = body

    if (!id) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 })
    }

    // Find appointment
    const appointmentIndex = appointments.findIndex((apt) => apt.id === id)
    if (appointmentIndex === -1) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Update appointment
    const updatedAppointment = {
      ...appointments[appointmentIndex],
      ...(status && { status }),
      ...(doctorId && { doctorId }),
      ...(doctorName && { doctorName }),
      updatedAt: new Date().toISOString(),
    }

    appointments[appointmentIndex] = updatedAppointment

    console.log("Appointment updated successfully:", id)

    return NextResponse.json({
      success: true,
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    })
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to update appointment",
      },
      { status: 500 },
    )
  }
}

// DELETE - Remove appointment
export async function DELETE(request: NextRequest) {
  try {
    console.log("DELETE /api/appointments - Deleting appointment")

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 })
    }

    // Find and remove appointment
    const appointmentIndex = appointments.findIndex((apt) => apt.id === id)
    if (appointmentIndex === -1) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    const deletedAppointment = appointments.splice(appointmentIndex, 1)[0]

    console.log("Appointment deleted successfully:", id)

    return NextResponse.json({
      success: true,
      message: "Appointment deleted successfully",
      appointment: deletedAppointment,
    })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to delete appointment",
      },
      { status: 500 },
    )
  }
}
