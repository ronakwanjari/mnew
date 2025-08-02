"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Phone,
  Video,
  AlertTriangle,
  Stethoscope,
} from "lucide-react"
import { DoctorLayout } from "@/components/doctor-layout"
import { useToast } from "@/hooks/use-toast"

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "John Doe",
      patientEmail: "john.doe@example.com",
      symptoms: "Persistent headache and fatigue for 3 days. Pain level 6/10, affecting daily activities.",
      severity: "medium",
      requestedTime: "2024-01-22 14:00:00",
      status: "pending",
      aiAnalysis:
        "Patient reports moderate headache with fatigue. Symptoms suggest possible tension headache or mild migraine. Recommend consultation for proper diagnosis.",
      vitalSigns: { heartRate: 75, spO2: 98, temperature: 98.4 },
    },
    {
      id: 2,
      patientName: "Jane Smith",
      patientEmail: "jane.smith@example.com",
      symptoms: "Chest pain and shortness of breath during exercise. Started yesterday evening.",
      severity: "high",
      requestedTime: "2024-01-22 10:30:00",
      status: "approved",
      aiAnalysis:
        "HIGH PRIORITY: Chest pain with dyspnea requires immediate evaluation. Possible cardiac or pulmonary etiology. Urgent consultation recommended.",
      vitalSigns: { heartRate: 95, spO2: 94, temperature: 99.1 },
    },
    {
      id: 3,
      patientName: "Bob Johnson",
      patientEmail: "bob.johnson@example.com",
      symptoms: "My 5-year-old has fever (101°F) and persistent cough for 2 days. Not eating well.",
      severity: "medium",
      requestedTime: "2024-01-23 16:00:00",
      status: "pending",
      aiAnalysis:
        "Pediatric case: Fever with cough in young child. Possible viral or bacterial infection. Requires pediatric evaluation for proper treatment.",
      vitalSigns: { heartRate: 110, spO2: 97, temperature: 101.0 },
    },
  ])

  const { toast } = useToast()

  const handleAppointmentAction = (appointmentId: number, action: "approve" | "reject") => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: action === "approve" ? "approved" : "rejected" } : apt,
      ),
    )

    toast({
      title: action === "approve" ? "Appointment Approved" : "Appointment Rejected",
      description: `Patient will be notified via email about the ${action === "approve" ? "approval" : "rejection"}.`,
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/20"
      case "medium":
        return "bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20"
      case "low":
        return "bg-green-100 border-green-200 text-green-800 dark:bg-green-900/20"
      default:
        return "bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-900/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const stats = {
    totalAppointments: appointments.length,
    pendingApprovals: appointments.filter((apt) => apt.status === "pending").length,
    todayScheduled: appointments.filter((apt) => apt.status === "approved").length,
    highPriority: appointments.filter((apt) => apt.severity === "high").length,
  }

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doctor Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your appointments and patient consultations</p>
          </div>
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium">Dr. Sarah Johnson</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAppointments}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingApprovals}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Today's Schedule</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.todayScheduled}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">High Priority</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.highPriority}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Management */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Approvals ({stats.pendingApprovals})</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="all">All Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Requests Awaiting Your Approval</CardTitle>
                <CardDescription>
                  Review AI analysis and patient information to approve or reject appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {appointments
                    .filter((apt) => apt.status === "pending")
                    .map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {appointment.patientName}
                              </h3>
                              <Badge className={getSeverityColor(appointment.severity)}>
                                {appointment.severity.toUpperCase()} PRIORITY
                              </Badge>
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(appointment.status)}`} />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{appointment.patientEmail}</p>
                            <p className="text-sm text-gray-500">
                              Requested: {new Date(appointment.requestedTime).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Patient Symptoms</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                              {appointment.symptoms}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">AI Analysis</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                              {appointment.aiAnalysis}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Latest Vital Signs</h4>
                          <div className="flex space-x-6 text-sm">
                            <span>
                              Heart Rate: <strong>{appointment.vitalSigns.heartRate} BPM</strong>
                            </span>
                            <span>
                              SpO2: <strong>{appointment.vitalSigns.spO2}%</strong>
                            </span>
                            <span>
                              Temperature: <strong>{appointment.vitalSigns.temperature}°F</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleAppointmentAction(appointment.id, "approve")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAppointmentAction(appointment.id, "reject")}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                            <Button size="sm" variant="outline">
                              <Video className="h-4 w-4 mr-1" />
                              Video
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {appointments.filter((apt) => apt.status === "pending").length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-500">No pending appointments to review</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approved Appointments</CardTitle>
                <CardDescription>Your scheduled consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments
                    .filter((apt) => apt.status === "approved")
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{appointment.patientName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{appointment.patientEmail}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(appointment.requestedTime).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm">
                            <Video className="h-4 w-4 mr-1" />
                            Start Consultation
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>Complete appointment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{appointment.patientName}</h3>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(appointment.status)}`} />
                          <span className="text-xs text-gray-500 capitalize">{appointment.status}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{appointment.patientEmail}</p>
                        <p className="text-xs text-gray-500">{new Date(appointment.requestedTime).toLocaleString()}</p>
                      </div>
                      <Badge className={getSeverityColor(appointment.severity)}>{appointment.severity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DoctorLayout>
  )
}
