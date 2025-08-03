import { type NextRequest, NextResponse } from "next/server"

// Mock database for doctors - in production, use a real database
const doctors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    email: "sarah.johnson@medibot.com",
    phone: "+1 (555) 123-4567",
    licenseNumber: "MD123456",
    experience: "8 years",
    education: "MD from Harvard Medical School",
    about: "Dr. Sarah Johnson is a dedicated general practitioner with over 8 years of experience in primary care. She specializes in preventive medicine, chronic disease management, and patient education. Dr. Johnson is known for her compassionate approach and thorough diagnostic skills.",
    languages: ["English", "Spanish"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    consultationFee: 150,
    rating: 4.8,
    totalReviews: 245,
    image: "/placeholder-user.jpg",
    status: "active"
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    email: "michael.chen@medibot.com",
    phone: "+1 (555) 234-5678",
    licenseNumber: "MD234567",
    experience: "12 years",
    education: "MD from Johns Hopkins University",
    about: "Dr. Michael Chen is a board-certified cardiologist with extensive experience in treating heart conditions. He specializes in interventional cardiology, heart disease prevention, and cardiac rehabilitation. Dr. Chen has published numerous research papers and is actively involved in clinical trials.",
    languages: ["English", "Mandarin"],
    availability: ["Monday", "Wednesday", "Friday"],
    consultationFee: 250,
    rating: 4.9,
    totalReviews: 189,
    image: "/placeholder-user.jpg",
    status: "active"
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    email: "emily.rodriguez@medibot.com",
    phone: "+1 (555) 345-6789",
    licenseNumber: "MD345678",
    experience: "10 years",
    education: "MD from Stanford University",
    about: "Dr. Emily Rodriguez is a compassionate pediatrician who has been caring for children and adolescents for over 10 years. She specializes in developmental pediatrics, childhood immunizations, and adolescent medicine. Dr. Rodriguez is fluent in both English and Spanish.",
    languages: ["English", "Spanish"],
    availability: ["Tuesday", "Thursday", "Saturday"],
    consultationFee: 180,
    rating: 4.7,
    totalReviews: 156,
    image: "/placeholder-user.jpg",
    status: "active"
  },
  {
    id: "4",
    name: "Dr. David Wilson",
    specialty: "Dermatology",
    email: "david.wilson@medibot.com",
    phone: "+1 (555) 456-7890",
    licenseNumber: "MD456789",
    experience: "15 years",
    education: "MD from UCLA Medical School",
    about: "Dr. David Wilson is a renowned dermatologist with 15 years of experience in treating skin conditions. He specializes in medical dermatology, cosmetic procedures, and skin cancer detection. Dr. Wilson is known for his expertise in advanced dermatological treatments.",
    languages: ["English"],
    availability: ["Monday", "Tuesday", "Thursday", "Friday"],
    consultationFee: 200,
    rating: 4.6,
    totalReviews: 203,
    image: "/placeholder-user.jpg",
    status: "active"
  },
  {
    id: "5",
    name: "Dr. Lisa Thompson",
    specialty: "Psychiatry",
    email: "lisa.thompson@medibot.com",
    phone: "+1 (555) 567-8901",
    licenseNumber: "MD567890",
    experience: "9 years",
    education: "MD from Yale University",
    about: "Dr. Lisa Thompson is a compassionate psychiatrist specializing in anxiety disorders, depression, and cognitive behavioral therapy. She has 9 years of experience helping patients achieve mental wellness through personalized treatment plans and therapeutic interventions.",
    languages: ["English", "French"],
    availability: ["Monday", "Wednesday", "Thursday", "Friday"],
    consultationFee: 220,
    rating: 4.8,
    totalReviews: 167,
    image: "/placeholder-user.jpg",
    status: "active"
  }
]

// GET - Fetch all doctors or filter by specialty
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get("specialty")
    const search = searchParams.get("search")

    let filteredDoctors = doctors.filter(doctor => doctor.status === "active")

    // Filter by specialty
    if (specialty && specialty !== "all") {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
      )
    }

    // Filter by search term
    if (search) {
      filteredDoctors = filteredDoctors.filter(doctor =>
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      doctors: filteredDoctors,
      total: filteredDoctors.length
    })
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    )
  }
}