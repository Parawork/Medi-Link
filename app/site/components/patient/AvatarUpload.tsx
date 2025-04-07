// components/patient/AvatarUpload.tsx
"use client";

import React, { useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadProps {
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  onChange,
  value,
  disabled,
}) => {
  const handleUpload = useCallback(
    (result: any) => {
      onChange(result.info.secure_url);
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      onSuccess={handleUpload}
      uploadPreset="uhdsbsjbdd"
      options={{
        maxFiles: 1,
        sources: ["local", "camera"],
        multiple: false,
        resourceType: "image",
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,
        showPoweredBy: false,
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => !disabled && open?.()}
            className={`
              cursor-pointer
              hover:opacity-70
              transition
              ${disabled && "opacity-50 cursor-not-allowed"}
            `}
          >
            <Avatar className="w-24 h-24">
              <AvatarImage src={value} alt="Profile" />
              <AvatarFallback>
                <User size={48} />
              </AvatarFallback>
            </Avatar>
            <p className="text-xs text-center mt-2 text-muted-foreground">
              Click to change
            </p>
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default AvatarUpload;
