import PrescriptionUploadClient from "@/app/site/components/patient/PrescriptionUploadClient";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";

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
