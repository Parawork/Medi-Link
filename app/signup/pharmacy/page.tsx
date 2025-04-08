"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { Upload } from "lucide-react";

export default function PharmacySignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    streetAddress: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!licenseFile) {
      toast({
        title: "Error",
        description: "License document is required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append the license file
      formDataToSend.append("licenseFile", licenseFile);
      // Explicitly set role
      formDataToSend.append("role", "PHARMACY");

      const response = await fetch("/api/sign-up/pharmacy", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      toast({
        title: "Success",
        description:
          "Pharmacy account created successfully! Awaiting verification.",
      });

      // Redirect to login
      router.push("/login");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a2351] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#e6eaf2] rounded-3xl p-8 shadow-lg my-8">
        <h1 className="text-2xl font-bold text-center text-[#0a2351] mb-2">
          Welcome to Medi-Link
        </h1>
        <h2 className="text-lg text-center text-[#0a2351] mb-6">
          Pharmacy Signup
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium text-[#0a2351] mb-4">
              Pharmacy Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs text-[#0a2351]">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Pharmacy name"
                  required
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="licenseNumber"
                  className="block text-xs text-[#0a2351]"
                >
                  License Number
                </label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="XXXXXXXXXX"
                  required
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="streetAddress"
                  className="block text-xs text-[#0a2351]"
                >
                  Street Address
                </label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  required
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="city" className="block text-xs text-[#0a2351]">
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  required
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="stateProvince"
                  className="block text-xs text-[#0a2351]"
                >
                  State/Province
                </label>
                <Input
                  id="stateProvince"
                  name="stateProvince"
                  value={formData.stateProvince}
                  onChange={handleChange}
                  placeholder="NY"
                  required
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="postalCode"
                  className="block text-xs text-[#0a2351]"
                >
                  Postal Code
                </label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="10001"
                  required
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="country"
                  className="block text-xs text-[#0a2351]"
                >
                  Country
                </label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="USA"
                  required
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <label htmlFor="email" className="block text-xs text-[#0a2351]">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="pharmacy@example.com"
                required
                className="w-full p-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div className="mt-4 space-y-1">
              <label htmlFor="phone" className="block text-xs text-[#0a2351]">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                required
                className="w-full p-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            <div className="mt-4 space-y-1">
              <label className="block text-xs text-[#0a2351]">
                Upload Pharmacy License Document
              </label>
              <div
                className="border border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer bg-gray-50"
                onClick={() =>
                  document.getElementById("license-upload")?.click()
                }
              >
                <input
                  id="license-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    {licenseFile
                      ? licenseFile.name
                      : "Drag & Drop Files or Browse"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium text-[#0a2351] mb-4">
              Account Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="username"
                  className="block text-xs text-[#0a2351]"
                >
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username"
                  required
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1 md:col-span-1"></div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-xs text-[#0a2351]"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs text-[#0a2351]"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0a2351] hover:bg-[#0a2351]/90 text-white py-3 rounded-md font-medium"
          >
            {isLoading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-[#0a2351]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500 flex justify-center space-x-4">
          <Link href="" className="hover:underline">
            Privacy Policy
          </Link>
          <span>|</span>
          <Link href="" className="hover:underline">
            Terms and Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
