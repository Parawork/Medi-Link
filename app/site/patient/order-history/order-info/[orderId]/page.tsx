import { prisma } from "@/app/utils/db"; // Assuming you're using Prisma
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, MessageSquare, Download, Phone } from "lucide-react";
import { Button } from "@/components/ui/button"; // Adjust the path based on your project structure
import { UpdateOrderStatusForm } from "@/app/site/components/patient/UpdateOrderStatusForm";

export default async function OrderInfoPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params; // Get dynamic parameter (orderId)

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      createdAt: true,
      status: true,
      totalAmount: true,
      pharmacy: true,
      items: true,
      prescription: true,
      notes: true,
    },
  }); // Get the order ID from the URL parameters
  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 p-3 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/site/patient/order-history"
            className="flex items-center text-blue-600 mb-4 sm:mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Link>

          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-10 gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 relative mb-4">
                  <Image
                    src={order.pharmacy.logo || "/placeholder.svg"}
                    alt={order.pharmacy.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {order.pharmacy.name}
                  </h2>
                  <div className="flex gap-1 items-center">
                    {" "}
                    <Phone className="size-4" />
                    Phone: {order.pharmacy.phone}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end">
                <span className="text-sm font-medium">Order #{order.id}</span>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span
                  className={`text-sm mt-1 px-2 py-1 rounded-full ${
                    order.status === "ACCEPTED"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 sm:pt-6 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                Order Items
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between flex-wrap sm:flex-nowrap"
                  >
                    <div className="mb-1 sm:mb-0">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-right w-full sm:w-auto">
                      LKR {item.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 sm:pt-6 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span>LKR {order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 sm:pt-6 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                Prescription Information
              </h3>
              <p className="text-gray-700 mt-2">
                Prescription ID: {order.prescription.id}
              </p>
              <p className="text-gray-700 mt-2">
                Created At:{" "}
                {new Date(order.prescription.createdAt).toLocaleDateString()}
              </p>
              {order.notes && (
                <>
                  <div className="h-[1px] bg-gray-400 w-full my-3" />
                  <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 mt-3 sm:mt-4">
                    Prescription Notes
                  </h3>
                  <p className="text-gray-700 mt-2">{order.notes}</p>
                  <div className="h-[1px] bg-gray-400 w-full my-3" />
                </>
              )}
            </div>

            <div className="flex flex-col gap-5 justify-between">
              <Link
                href={order.prescription.fileUrl}
                className="w-full sm:flex-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="flex items-center text-center px-2 py-1 bg-white ring-1 rounded-full text-green-700 hover:bg-green-700 hover:text-white text-sm font-normal ring-green-700 tracking-tighter">
                  View Prescription
                </button>
              </Link>
              <div
                className={` ${order.status === "COMPLETED" ? "hidden" : ""}`}
              >
                <UpdateOrderStatusForm orderId={order.id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
