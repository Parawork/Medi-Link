"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  name: string;
  price: string;
  quantity: string;
}

export function OrderForm({ prescription }: { prescription: string }) {
  const router = useRouter();
  const [items, setItems] = useState<OrderItem[]>([
    { name: "", price: "", quantity: "1" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total amount by parsing the string values
  const totalAmount = items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const handleAddItem = () => {
    setItems([...items, { name: "", price: "", quantity: "1" }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: string
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert string values to numbers before submitting
    const itemsToSubmit = items.map((item) => ({
      ...item,
      price: parseFloat(item.price) || 0,
      quantity: parseInt(item.quantity) || 1,
    }));

    const createOrderPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/api/pharmacy/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prescriptionId: prescription,
            items: itemsToSubmit, // Use the converted items
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create order");
        }

        const data = await response.json();
        resolve(data);
        router.push("/site/pharmacy/order-history");
        toast({
          title: "Success",
          description: `Order has been created successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create order. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-end"
          >
            <div className="col-span-1 sm:col-span-5">
              <label className="block text-sm font-medium mb-1">
                Medicine Name
              </label>
              <Input
                type="text"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
                required
              />
            </div>
            <div className="col-span-1 sm:col-span-3">
              <label className="block text-sm font-medium mb-1">Price</label>
              <Input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
                placeholder="0.00"
                required
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                required
              />
            </div>
            <div className="col-span-1 sm:col-span-2 mt-2 sm:mt-0">
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleRemoveItem(index)}
                disabled={items.length <= 1}
                className="w-full"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <Button type="button" variant="secondary" onClick={handleAddItem}>
          Add Medicine
        </Button>
        <div className="text-lg font-semibold">
          Total: LKR {totalAmount.toFixed(2)}
        </div>
      </div>
      <div className="pt-4 border-t">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Creating Order..." : "Create Order"}
        </Button>
      </div>
    </form>
  );
}
