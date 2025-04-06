"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X, FileText, Check } from "lucide-react"
import { useRouter } from "next/navigation"

interface PrescriptionViewProps {
  prescriptionId: string
  pharmacyName: string
  createdAt: Date
  fileUrl: string
}

const PrescriptionView: React.FC<PrescriptionViewProps> = ({
    prescriptionId,
    fileUrl,
    pharmacyName,
    createdAt,

}) => {
  const [files, setFiles] = useState<File[]>([])
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  
  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload Prescription</h1>

        <Card>
          <CardHeader>
            <CardTitle>Prescription Details</CardTitle>
            <CardDescription>Upload your prescription to find nearby pharmacies that can fulfill it.</CardDescription>
          </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prescription">Prescription Files</Label>
                <img src={fileUrl} alt="Prescription" className="w-full h-auto rounded-md" />
              </div>

            </CardContent>
            <CardFooter>
                <div>
                    <h3 className="font-medium">{pharmacyName}</h3>
                    <p className="text-sm text-gray-500">
                        {createdAt.toLocaleDateString("en-US")}
                    </p>
                </div>
              
            </CardFooter>

        </Card>
      </div>
    </div>
  )
}

export default PrescriptionView

