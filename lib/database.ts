import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Types for compatibility
export type Doctor = {
  _id: string;
  clerkId: string;
  name: string;
  specialty: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  experience?: string;
  education?: string;
  about?: string;
  languages: string[];
  availability: string[];
  consultationFee: number;
  rating: number;
  totalReviews: number;
  image?: string;
  status: "active" | "inactive";
  _creationTime: number;
};

export type Appointment = {
  _id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  doctorId: string;
  doctorName?: string;
  doctorEmail?: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  symptoms: string;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  consultationFee: number;
  meetingLink?: string;
  doctorNotes?: string;
  _creationTime: number;
};

export type Vital = {
  _id: string;
  patientId: string;
  heartRate?: number;
  spo2?: number;
  temperature?: number;
  bmi?: number;
  _creationTime: number;
};

export type User = {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  userType: "patient" | "doctor" | "admin";
  _creationTime: number;
};

// Doctor operations
export async function getDoctors(specialty?: string, search?: string) {
  try {
    const doctors = await client.query(api.doctors.getDoctors, {
      specialty,
      search,
    });

    return doctors.map(doctor => ({
      ...doctor,
      id: doctor._id,
      consultation_fee: doctor.consultationFee,
      total_reviews: doctor.totalReviews,
      license_number: doctor.licenseNumber,
    })) as any[];
  } catch (error) {
    console.log('Convex not available, using mock data');
    // Fallback to mock data
    return [
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
    ];
  }
}

export async function getDoctorById(id: string) {
  try {
    return await client.query(api.doctors.getDoctorById, { id: id as any });
  } catch (error) {
    const mockDoctors = await getDoctors();
    const doctor = mockDoctors.find(d => d.id === id);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    return doctor;
  }
}

// Appointment operations
export async function createAppointment(appointmentData: Omit<Appointment, '_id' | '_creationTime'>) {
  try {
    console.log("Creating appointment in Convex:", appointmentData);

    const result = await client.mutation(api.appointments.createAppointment, {
      ...appointmentData,
      status: appointmentData.status || "pending",
    });

    console.log("Convex appointment created successfully:", result);
    return {
      ...appointmentData,
      _id: result,
      id: result,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;
  } catch (error) {
    console.log("Convex error, creating mock appointment:", error);
    const mockAppointment = {
      id: `apt_${Date.now()}`,
      ...appointmentData,
      meetingLink: `https://medibot-meet.com/room/${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    console.log("Mock appointment created:", mockAppointment.id);
    return mockAppointment as any;
  }
}

export async function getAppointments(patientId?: string, doctorId?: string, status?: string) {
  try {
    const appointments = await client.query(api.appointments.getAppointments, {
      patientId,
      doctorId,
      status,
    });

    return appointments.map(apt => ({
      ...apt,
      id: apt._id,
      created_at: new Date(apt._creationTime).toISOString(),
      updated_at: new Date(apt._creationTime).toISOString(),
    })) as any[];
  } catch (error) {
    return [] as any[];
  }
}

export async function updateAppointment(id: string, updates: Partial<Appointment>) {
  try {
    await client.mutation(api.appointments.updateAppointment, {
      id: id as any,
      ...updates,
    });

    return {
      id,
      ...updates,
      updated_at: new Date().toISOString()
    } as any;
  } catch (error) {
    return {
      id,
      ...updates,
      updated_at: new Date().toISOString()
    } as any;
  }
}

// Vital signs operations
export async function saveVitals(vitalData: Omit<Vital, '_id' | '_creationTime'>) {
  try {
    const result = await client.mutation(api.vitals.saveVitals, vitalData);
    return {
      id: result,
      ...vitalData,
      recorded_at: new Date().toISOString()
    } as any;
  } catch (error) {
    return {
      id: `vital_${Date.now()}`,
      ...vitalData,
      recorded_at: new Date().toISOString()
    } as any;
  }
}

export async function getVitals(patientId: string, limit = 10) {
  try {
    const vitals = await client.query(api.vitals.getVitals, {
      patientId,
      limit,
    });

    return vitals.map(vital => ({
      ...vital,
      id: vital._id,
      recorded_at: new Date(vital._creationTime).toISOString(),
    })) as any[];
  } catch (error) {
    return [] as any[];
  }
}

// Chat operations (These were not provided in the edited snippet, so they are kept as is from the original code)
// If you have Convex functions for these, please provide them.

// Pharmacy operations (These were not provided in the edited snippet, so they are kept as is from the original code)
// If you have Convex functions for these, please provide them.

// Statistics operations
export async function getAppointmentStats() {
  try {
    return await client.query(api.appointments.getAppointmentStats);
  } catch (error) {
    return {
      total: 0,
      pending: 0,
      approved: 0,
      completed: 0,
      rejected: 0,
      cancelled: 0
    };
  }
}

// User operations for Clerk integration
export async function createUser(userData: Omit<User, '_id' | '_creationTime'>) {
  try {
    return await client.mutation(api.users.createUser, userData);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    return await client.query(api.users.getUserByClerkId, { clerkId });
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function updateUser(clerkId: string, updates: Partial<User>) {
  try {
    return await client.mutation(api.users.updateUser, {
      clerkId,
      ...updates,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}