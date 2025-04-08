"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomerSignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    streetAddress: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "",
    medicalConditions: "",
    allergies: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    setIsLoading(true);

    try {
      const response = await fetch("/api/sign-up/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "PATIENT", // Explicitly set role for patient signup
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      toast({
        title: "Success",
        description: "Account created successfully! Please login.",
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
          Patient Signup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-sm font-medium text-[#0a2351] mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="fullName"
                  className="block text-xs text-[#0a2351]"
                >
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs text-[#0a2351]">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
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

              <div className="space-y-1">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-xs text-[#0a2351]"
                >
                  Date of Birth
                </label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="gender"
                  className="block text-xs text-[#0a2351]"
                >
                  Gender
                </label>
                <Select
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger
                    id="gender"
                    className="w-full p-2 text-sm border border-gray-300 rounded-md"
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <h3 className="text-sm font-medium text-[#0a2351] mt-6 mb-4">
              Address Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <h3 className="text-sm font-medium text-[#0a2351] mt-6 mb-4">
              Medical Information
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="medicalConditions"
                  className="block text-xs text-[#0a2351]"
                >
                  Medical Conditions (Optional)
                </label>
                <Textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  placeholder="List any medical conditions you have"
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="allergies"
                  className="block text-xs text-[#0a2351]"
                >
                  Allergies (Optional)
                </label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="List any allergies you have"
                  className="w-full p-2 text-sm border border-gray-300 rounded-md"
                />
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
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <span>|</span>
          <Link href="/terms-and-conditions" className="hover:underline">
            Terms and Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
