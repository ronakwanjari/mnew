"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, XCircle, Plus, MessageSquare, Phone, Video } from "lucide-react"
import { PatientLayout } from "@/components/patient-layout"
import { useToast } from "@/hooks/use-toast"

interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  appointmentDate: string
  appointmentTime: string
  reason: string
  symptoms: string
  status: "pending" | "approved" | "rejected" | "completed"
  createdAt: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/appointments?patientId=patient_123")
      const data = await response.json()

      if (response.ok && data.success) {
        setAppointments(data.appointments || [])
      } else {
        throw new Error(data.error || "Failed to fetch appointments")
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
      toast({
        title: "Error",
        description: "Failed to load appointments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookAppointment = async (formData: FormData) => {
    try {
      setIsBooking(true)

      const appointmentData = {
        patientName: formData.get("patientName") as string,
        patientEmail: formData.get("patientEmail") as string,
        appointmentDate: formData.get("appointmentDate") as string,
        appointmentTime: formData.get("appointmentTime") as string,
        reason: formData.get("reason") as string,
        symptoms: formData.get("symptoms") as string,
        patientId: "patient_123",
      }

      console.log("Booking appointment with data:", appointmentData)

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Appointment Booked! 🎉",
          description: "Your appointment request has been sent to our doctors.",
        })

        setIsBookingDialogOpen(false)
        fetchAppointments() // Refresh the list
      } else {
        throw new Error(data.error || "Failed to book appointment")
      }
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast({
        title: "Booking Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBooking(false)
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
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 border-green-200 text-green-800 dark:bg-green-900/20"
      case "rejected":
        return "bg-red-100 border-red-200 text-red-800 dark:bg-red-900/20"
      case "pending":
        return "bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20"
      case "completed":
        return "bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/20"
      default:
        return "bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-900/20"
    }
  }

  if (isLoading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading appointments...</p>
          </div>
        </div>
      </PatientLayout>
    )
  }

  return (
    <PatientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Appointments</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your medical appointments and consultations</p>
          </div>
          <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Book New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
                <DialogDescription>Fill in your details to request an appointment with a doctor</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleBookAppointment(new FormData(e.currentTarget))
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Full Name</Label>
                    <Input id="patientName" name="patientName" defaultValue="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientEmail">Email</Label>
                    <Input
                      id="patientEmail"
                      name="patientEmail"
                      type="email"
                      defaultValue="john.doe@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDate">Date</Label>
                    <Input
                      id="appointmentDate"
                      name="appointmentDate"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointmentTime">Time</Label>
                    <Input id="appointmentTime" name="appointmentTime" type="time" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input id="reason" name="reason" placeholder="General consultation" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms (Optional)</Label>
                  <Textarea
                    id="symptoms"
                    name="symptoms"
                    placeholder="Please describe your symptoms or reason for the appointment..."
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isBooking}>
                  {isBooking ? "Booking..." : "Book Appointment"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Appointments Yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You haven't booked any appointments yet. Book your first consultation with our AI-powered medical
                  assistant.
                </p>
                <Button onClick={() => setIsBookingDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Book Your First Appointment
                </Button>
              </CardContent>
            </Card>
          ) : (
            appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>Appointment #{appointment.id}</span>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(appointment.status)}`} />
                        <Badge variant="outline" className="capitalize">
                          {appointment.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Scheduled: {new Date(appointment.appointmentDate).toLocaleDateString()} at{" "}
                        {appointment.appointmentTime}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusBadgeColor(appointment.status)}>{appointment.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Reason for Visit</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        {appointment.reason}
                      </p>
                    </div>

                    {appointment.symptoms && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Symptoms</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                          {appointment.symptoms}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Patient Information</h4>
                      <div className="flex space-x-6 text-sm">
                        <span>
                          Name: <strong>{appointment.patientName}</strong>
                        </span>
                        <span>
                          Email: <strong>{appointment.patientEmail}</strong>
                        </span>
                      </div>
                    </div>

                    {appointment.status === "approved" && (
                      <div className="flex space-x-2 pt-4 border-t">
                        <Button size="sm">
                          <Video className="h-4 w-4 mr-1" />
                          Join Video Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message Doctor
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Call Doctor
                        </Button>
                      </div>
                    )}

                    {appointment.status === "pending" && (
                      <div className="flex items-center space-x-2 pt-4 border-t">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Waiting for doctor approval...</span>
                      </div>
                    )}

                    {appointment.status === "rejected" && (
                      <div className="flex items-center space-x-2 pt-4 border-t">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Appointment was not approved. Please book a new one or contact support.
                        </span>
                      </div>
                    )}

                    {appointment.status === "completed" && (
                      <div className="flex items-center space-x-2 pt-4 border-t">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Consultation completed. Check your email for follow-up instructions.
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PatientLayout>
  )
}
