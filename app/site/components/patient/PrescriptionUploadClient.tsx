"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "./ImageUpload";

interface PrescriptionUploadClientProps {
  pharmacyId: string;
  patientId: string;
}

const PrescriptionUploadClient: React.FC<PrescriptionUploadClientProps> = ({
  pharmacyId,
  patientId,
}) => {
  const [fileUrl, setFileUrl] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!fileUrl) {
      toast({
        title: "Error",
        description: "Please upload a prescription file",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/patient/uploadPrescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId,
          pharmacyId,
          fileUrl,
          instructions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create prescription");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Prescription uploaded successfully",
      });
      router.push(`/site/patient/`);
    } catch (error) {
      console.error("Error uploading prescription:", error);
      toast({
        title: "Error",
        description: "Failed to upload prescription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold">Upload Your Prescription</h1>
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Prescription Image</h2>
          <p className="text-sm text-gray-600">
            {`Upload a clear photo or scan of your doctor's prescription`}
          </p>
          <ImageUpload
            value={fileUrl}
            onChange={(value) => setFileUrl(value)}
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Special Instructions</h2>
          <p className="text-sm text-gray-600">
            Add any special instructions or notes for the pharmacy
          </p>
          <Textarea
            placeholder="Any information the pharmacy should know"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="min-h-24"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !fileUrl}
          className="w-full md:w-auto"
        >
          {isSubmitting ? "Submitting..." : "Submit Prescription"}
        </Button>
      </div>
    </div>
  );
};

export default PrescriptionUploadClient;
