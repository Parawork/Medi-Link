import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";

export default async function SearchPharmacyByName() {
  const user = await requireUser("PATIENT");

  const pharmacies = await prisma.pharmacy.findMany({});
}
