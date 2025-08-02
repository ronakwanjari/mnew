import { type NextRequest, NextResponse } from "next/server"

// Mock database for vitals
const vitalsData: any[] = []

export async function POST(req: NextRequest) {
  try {
    const { patientId, heartRate, spO2, temperature, bmi } = await req.json()

    const vitalRecord = {
      id: Date.now().toString(),
      patientId,
      heartRate,
      spO2,
      temperature,
      bmi,
      timestamp: new Date().toISOString(),
    }

    vitalsData.push(vitalRecord)

    return NextResponse.json({
      success: true,
      data: vitalRecord,
    })
  } catch (error) {
    console.error("Error saving vitals:", error)
    return NextResponse.json({ error: "Failed to save vitals data" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get("patientId")

  let filteredData = vitalsData
  if (patientId) {
    filteredData = vitalsData.filter((record) => record.patientId === patientId)
  }

  return NextResponse.json({ vitals: filteredData })
}
