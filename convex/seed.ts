
import { mutation } from "./_generated/server";

export const seedData = mutation({
  handler: async (ctx) => {
    // Seed a doctor
    const doctorId = await ctx.db.insert("doctors", {
      clerkId: "seed_doctor_1",
      name: "Dr. Sarah Johnson",
      specialty: "General Medicine",
      email: "sujalt.etc22@sbjit.edu.in",
      phone: "+1 (555) 123-4567",
      licenseNumber: "MD123456",
      experience: "8 years",
      education: "MD from Harvard Medical School",
      about: "Dr. Sarah Johnson is a dedicated general practitioner with over 8 years of experience in primary care.",
      languages: ["English", "Spanish"],
      availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      consultationFee: 150,
      rating: 4.8,
      totalReviews: 245,
      image: "/placeholder-user.jpg",
      status: "active",
    });

    // Seed a pharmacy
    await ctx.db.insert("pharmacies", {
      name: "HealthCare Pharmacy",
      address: "123 Medical Center Dr, Health City, HC 12345",
      phone: "+1 (555) 987-6543",
      email: "contact@healthcarepharmacy.com",
      deliveryTime: "30-45 minutes",
      status: "active",
    });

    return { doctorId };
  },
});
