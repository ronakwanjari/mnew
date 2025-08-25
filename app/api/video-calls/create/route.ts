
import { type NextRequest, NextResponse } from "next/server"
import { Video } from "@vonage/video"

// Initialize Vonage Video client
const video = new Video({
  apiKey: process.env.VONAGE_VIDEO_API_KEY!,
  apiSecret: process.env.VONAGE_VIDEO_API_SECRET!,
})

interface VideoCallRoom {
  roomId: string
  sessionId: string
  roomUrl: string
  doctorToken: string
  patientToken: string
  appointmentId: string
  status: "created" | "active" | "ended"
  participants: Array<{
    id: string
    name: string
    role: "doctor" | "patient"
    joinedAt?: string
    leftAt?: string
  }>
  createdAt: string
  expiresAt: string
  settings: {
    recordingEnabled: boolean
    chatEnabled: boolean
    screenShareEnabled: boolean
    maxDuration: number
  }
}

// Mock database for video calls
const videoCalls: VideoCallRoom[] = []

// Helper function to generate room ID
function generateRoomId(): string {
  return `medibot_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// POST - Create video call room with Vonage
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { appointmentId, doctorId, patientId, doctorName, patientName } = body

    if (!appointmentId || !doctorId || !patientId) {
      return NextResponse.json(
        { error: "Missing required fields: appointmentId, doctorId, patientId" },
        { status: 400 }
      )
    }

    // Check if room already exists for this appointment
    const existingRoom = videoCalls.find(call => call.appointmentId === appointmentId)
    if (existingRoom) {
      return NextResponse.json({
        success: true,
        message: "Video call room already exists",
        videoCall: existingRoom
      })
    }

    // Create Vonage session
    const session = await video.createSession({
      archiveMode: "always", // Enable recording
      mediaMode: "routed"     // Use Vonage servers for better quality
    })

    // Generate tokens for doctor and patient
    const doctorToken = video.generateClientToken(session.sessionId, {
      role: "moderator",
      data: JSON.stringify({ 
        userId: doctorId, 
        role: "doctor", 
        name: doctorName || "Doctor" 
      }),
      expireTime: Math.floor(Date.now() / 1000) + (4 * 60 * 60) // 4 hours
    })

    const patientToken = video.generateClientToken(session.sessionId, {
      role: "publisher",
      data: JSON.stringify({ 
        userId: patientId, 
        role: "patient", 
        name: patientName || "Patient" 
      }),
      expireTime: Math.floor(Date.now() / 1000) + (4 * 60 * 60) // 4 hours
    })

    const roomId = generateRoomId()
    
    const videoCall: VideoCallRoom = {
      roomId,
      sessionId: session.sessionId,
      roomUrl: `${process.env.NEXT_PUBLIC_APP_URL}/video-call/${roomId}`,
      doctorToken,
      patientToken,
      appointmentId,
      status: "created",
      participants: [
        {
          id: doctorId,
          name: doctorName || "Doctor",
          role: "doctor"
        },
        {
          id: patientId,
          name: patientName || "Patient",
          role: "patient"
        }
      ],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      settings: {
        recordingEnabled: true,
        chatEnabled: true,
        screenShareEnabled: true,
        maxDuration: 60
      }
    }

    // Add to mock database
    videoCalls.push(videoCall)

    console.log("Vonage video call room created:", roomId, "Session:", session.sessionId)

    return NextResponse.json({
      success: true,
      message: "Video call room created successfully",
      videoCall: {
        roomId: videoCall.roomId,
        sessionId: videoCall.sessionId,
        roomUrl: videoCall.roomUrl,
        doctorToken: videoCall.doctorToken,
        patientToken: videoCall.patientToken,
        expiresAt: videoCall.expiresAt,
        settings: videoCall.settings
      }
    })
  } catch (error) {
    console.error("Error creating Vonage video call room:", error)
    return NextResponse.json(
      { error: "Failed to create video call room" },
      { status: 500 }
    )
  }
}

// GET - Get video call room details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get("appointmentId")
    const roomId = searchParams.get("roomId")

    if (!appointmentId && !roomId) {
      return NextResponse.json(
        { error: "Either appointmentId or roomId is required" },
        { status: 400 }
      )
    }

    let videoCall: VideoCallRoom | undefined

    if (appointmentId) {
      videoCall = videoCalls.find(call => call.appointmentId === appointmentId)
    } else if (roomId) {
      videoCall = videoCalls.find(call => call.roomId === roomId)
    }

    if (!videoCall) {
      return NextResponse.json(
        { error: "Video call room not found" },
        { status: 404 }
      )
    }

    // Check if room has expired
    if (new Date() > new Date(videoCall.expiresAt)) {
      videoCall.status = "ended"
      return NextResponse.json(
        { error: "Video call room has expired" },
        { status: 410 }
      )
    }

    return NextResponse.json({
      success: true,
      videoCall
    })
  } catch (error) {
    console.error("Error fetching video call room:", error)
    return NextResponse.json(
      { error: "Failed to fetch video call room" },
      { status: 500 }
    )
  }
}
