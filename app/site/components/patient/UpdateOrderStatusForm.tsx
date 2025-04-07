// components/UpdateOrderStatusForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdateOrderStatusForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      if (data.success && data.redirectUrl) {
        router.push("/site/patient/order-history");
      }
    } catch (error) {
      console.error("Submission error:", error);
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
