import { NextResponse } from "next/server"

// Mock appointment statistics
const appointmentStats = {
  total: 1247,
  pending: 23,
  approved: 45,
  completed: 1156,
  rejected: 23,
  todayAppointments: 12,
  thisWeekAppointments: 67,
  thisMonthAppointments: 234,
  averageWaitTime: "2.5 hours",
  patientSatisfaction: 4.8,
  doctorResponseTime: "15 minutes"
}

// Monthly appointment data for charts
const monthlyData = [
  { month: "Jan", appointments: 98, completed: 92 },
  { month: "Feb", appointments: 105, completed: 98 },
  { month: "Mar", appointments: 112, completed: 108 },
  { month: "Apr", appointments: 98, completed: 95 },
  { month: "May", appointments: 125, completed: 118 },
  { month: "Jun", appointments: 134, completed: 128 },
  { month: "Jul", appointments: 145, completed: 140 },
  { month: "Aug", appointments: 156, completed: 148 },
  { month: "Sep", appointments: 142, completed: 135 },
  { month: "Oct", appointments: 138, completed: 132 },
  { month: "Nov", appointments: 125, completed: 120 },
  { month: "Dec", appointments: 89, completed: 85 }
]

// Specialty-wise appointment distribution
const specialtyStats = [
  { specialty: "General Medicine", count: 345, percentage: 28 },
  { specialty: "Cardiology", count: 198, percentage: 16 },
  { specialty: "Pediatrics", count: 234, percentage: 19 },
  { specialty: "Dermatology", count: 156, percentage: 12 },
  { specialty: "Psychiatry", count: 123, percentage: 10 },
  { specialty: "Others", count: 191, percentage: 15 }
]

// GET - Fetch appointment statistics
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      stats: appointmentStats,
      monthlyData,
      specialtyStats,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error fetching appointment stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch appointment statistics" },
      { status: 500 }
    )
  }
}