
"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, VideoOff, Mic, MicOff, Phone, Monitor, MessageSquare } from "lucide-react"

declare global {
  interface Window {
    OT: any;
  }
}

interface VideoCallData {
  roomId: string
  sessionId: string
  doctorToken: string
  patientToken: string
  settings: {
    recordingEnabled: boolean
    chatEnabled: boolean
    screenShareEnabled: boolean
  }
}

export default function VideoCallRoom() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  
  const [videoCallData, setVideoCallData] = useState<VideoCallData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [userRole, setUserRole] = useState<"doctor" | "patient">("patient")
  
  const sessionRef = useRef<any>(null)
  const publisherRef = useRef<any>(null)
  const subscriberRef = useRef<any>(null)

  useEffect(() => {
    loadVonageScript()
    fetchVideoCallData()
  }, [roomId])

  const loadVonageScript = () => {
    if (window.OT) return Promise.resolve()
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://static.opentok.com/v2/js/opentok.min.js'
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  const fetchVideoCallData = async () => {
    try {
      const response = await fetch(`/api/video-calls/create?roomId=${roomId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch video call data')
      }
      const data = await response.json()
      setVideoCallData(data.videoCall)
      
      // Determine user role (in production, get from auth context)
      const role = new URLSearchParams(window.location.search).get('role') as "doctor" | "patient" || "patient"
      setUserRole(role)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const initializeSession = async () => {
    if (!videoCallData || !window.OT) return

    try {
      const session = window.OT.initSession(process.env.NEXT_PUBLIC_VONAGE_API_KEY, videoCallData.sessionId)
      sessionRef.current = session

      // Session event handlers
      session.on('streamCreated', (event: any) => {
        const subscriber = session.subscribe(event.stream, 'subscriber-container', {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        })
        subscriberRef.current = subscriber
      })

      session.on('sessionConnected', () => {
        setIsConnected(true)
        
        // Initialize publisher
        const publisher = window.OT.initPublisher('publisher-container', {
          insertMode: 'append',
          width: '100%',
          height: '100%',
          publishAudio: isAudioEnabled,
          publishVideo: isVideoEnabled
        })
        publisherRef.current = publisher
        
        session.publish(publisher)
      })

      session.on('sessionDisconnected', () => {
        setIsConnected(false)
      })

      // Connect to session
      const token = userRole === "doctor" ? videoCallData.doctorToken : videoCallData.patientToken
      session.connect(token)

    } catch (err) {
      console.error('Error initializing session:', err)
      setError('Failed to initialize video session')
    }
  }

  const toggleVideo = () => {
    if (publisherRef.current) {
      publisherRef.current.publishVideo(!isVideoEnabled)
      setIsVideoEnabled(!isVideoEnabled)
    }
  }

  const toggleAudio = () => {
    if (publisherRef.current) {
      publisherRef.current.publishAudio(!isAudioEnabled)
      setIsAudioEnabled(!isAudioEnabled)
    }
  }

  const endCall = async () => {
    try {
      if (sessionRef.current) {
        sessionRef.current.disconnect()
      }
      
      await fetch('/api/video-calls/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          userId: 'current-user-id', // Get from auth context
          userRole,
          duration: 0, // Calculate actual duration
          notes: ''
        }),
      })
      
      router.push('/patient/appointments')
    } catch (err) {
      console.error('Error ending call:', err)
    }
  }

  useEffect(() => {
    if (videoCallData && window.OT) {
      initializeSession()
    }
  }, [videoCallData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading video call...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Medical Consultation</h1>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : "Connecting..."}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {userRole}
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          Room: {roomId}
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 flex">
        {/* Main Video */}
        <div className="flex-1 relative bg-gray-800">
          <div id="subscriber-container" className="w-full h-full"></div>
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Waiting for other participant...</p>
              </div>
            </div>
          )}
        </div>

        {/* Self Video */}
        <div className="w-80 bg-gray-700 relative">
          <div id="publisher-container" className="w-full h-full"></div>
          <div className="absolute top-4 left-4 text-white text-sm">
            You ({userRole})
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 flex items-center justify-center space-x-4">
        <Button
          variant={isAudioEnabled ? "default" : "destructive"}
          size="lg"
          onClick={toggleAudio}
          className="rounded-full w-12 h-12"
        >
          {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>

        <Button
          variant={isVideoEnabled ? "default" : "destructive"}
          size="lg"
          onClick={toggleVideo}
          className="rounded-full w-12 h-12"
        >
          {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>

        {videoCallData?.settings.screenShareEnabled && (
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12"
          >
            <Monitor className="h-5 w-5" />
          </Button>
        )}

        {videoCallData?.settings.chatEnabled && (
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        )}

        <Button
          variant="destructive"
          size="lg"
          onClick={endCall}
          className="rounded-full w-12 h-12 ml-8"
        >
          <Phone className="h-5 w-5 transform rotate-[135deg]" />
        </Button>
      </div>
    </div>
  )
}
