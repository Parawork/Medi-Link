// components/pharmacy/PharmacyProfileForm.tsx
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LogoUpload from "./LogoUpload";

// Form schema
const pharmacyFormSchema = z.object({
  name: z.string().min(1, "Name must be at least 2 characters"),
  phone: z.string().min(1, "Phone number is required"),
  streetAddress: z.string().min(1, "Address is too short"),
  city: z.string().min(1, "City is required"),
  stateProvince: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  logo: z.string().optional(),
});

type PharmacyFormValues = z.infer<typeof pharmacyFormSchema>;

interface PharmacyProfileFormProps {
  initialData: Partial<PharmacyFormValues>;
}

export function PharmacyProfileForm({ initialData }: PharmacyProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialData);

  const form = useForm<PharmacyFormValues>({
    resolver: zodResolver(pharmacyFormSchema),
    defaultValues: initialData || {
      name: "",
      phone: "",
      streetAddress: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
      licenseNumber: "",
      logo: "",
    },
  });

  // If initialData changes (like after fetch), reset the form
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      setIsLoading(false);
    }
  }, [initialData, form]);

  const { toast } = useToast();

  const onSubmit = async (values: PharmacyFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/pharmacy/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      form.reset(updatedData);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      try {
        // Simulate file upload process
        setIsLoading(true);

        // In a real app, you would:
        // 1. Upload to your server endpoint
        // 2. Get back the file path
        // For demo, we'll just create a mock path
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockFilePath = `/pharmacyLogos/${file.name}`;

        form.setValue("logo", mockFilePath);
        toast({
          title: "Success",
          description: "Logo uploaded successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload logo",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pharmacy Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pharmacy Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* License Number */}
          <FormField
            control={form.control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Logo Upload */}
          {/* Logo Upload */}
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Pharmacy Logo</FormLabel>
                <FormControl>
                  <LogoUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Street Address */}
          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* State/Province */}
          <FormField
            control={form.control}
            name="stateProvince"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Postal Code */}
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Form>
  );
}
