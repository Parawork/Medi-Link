// components/ImageUpload.tsx
"use client";
import React, { useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { TbPhotoPlus } from "react-icons/tb";
import Image from "next/image";

// declare global {
//   let cloudinary: any
// }

interface LogoUploadProps {
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
}

const LogoUpload: React.FC<LogoUploadProps> = ({
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
              relative 
              h-[300px]
              cursor-pointer 
              hover:opacity-70 
              border-dashed 
              border-2 
              transition 
              p-10 
              border-neutral-300 
              flex 
              flex-col 
              justify-center 
              items-center 
              gap-4 
              text-neutral-600
              ${disabled && "opacity-50 cursor-not-allowed"}
              ${value ? "border-none p-0" : ""}
            `}
          >
            {!value && (
              <>
                <TbPhotoPlus size={30} />
                <div className="font-semibold text-sm">
                  Click to upload logo
                </div>
              </>
            )}
            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  alt="Pharmacy logo"
                  fill
                  style={{ objectFit: "contain" }}
                  src={value}
                  className="rounded-md"
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default LogoUpload;
