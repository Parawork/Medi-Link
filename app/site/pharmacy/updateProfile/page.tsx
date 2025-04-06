import { requireUser } from "@/lib/requireUser";
import { PharmacyProfileForm } from "../../components/pharmacy/PharmacyProfileForm";
import { prisma } from "@/app/utils/db";

export default async function PharmacyProfilePage() {
  const user = await requireUser("PHARMACY");

  const pharmacy = await prisma.pharmacy.findUnique({
    where: { userId: user.id },
  });

  if (!pharmacy) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Pharmacy Profile</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Pharmacy profile not found. Please create your profile.</p>
            {/* You could add a link to a create profile page here */}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Pharmacy Profile</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <PharmacyProfileForm initialData={pharmacy} />
        </div>
      </div>
    </div>
  );
}
