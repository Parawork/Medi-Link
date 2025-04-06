import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import PrescriptionUploadClient from "../../components/patient/PrescriptionUploadClient";

export default async function NewPrescriptionPage({
  params,
}: {
  params: Promise<{ pharmacyId: string }>;
}) {
  const user = await requireUser("PATIENT");
  const { pharmacyId } = await params;

  if (!user.patient) {
    redirect("/patient/dashboard");
  }

  return (
    <PrescriptionUploadClient
      pharmacyId={pharmacyId}
      patientId={user.patient.id}
    />
  );
}
