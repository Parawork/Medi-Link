// components/UpdateOrderStatusForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function UpdateOrderStatusForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/patient/updateOrderStatus/${orderId}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (data.success) {
        router.push("/site/patient/order-history");
        router.refresh();
        toast({
          title: "Success",
          description: "Payment made successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to make the payment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center text-center px-2 py-1 bg-white ring-1 rounded-full text-red-700 hover:bg-red-700 hover:text-white text-sm font-normal ring-red-700 tracking-tighter"
      >
        {isSubmitting ? "Processing..." : "Make Payment"}
      </button>
    </form>
  );
}
