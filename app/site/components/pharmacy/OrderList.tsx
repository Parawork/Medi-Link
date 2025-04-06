import { prisma } from "@/app/utils/db";
import Link from "next/link";

export default async function OrderList({
  pharmacyId,
  status,
}: {
  pharmacyId: string;
  status: "ACCEPTED" | "COMPLETED";
}) {
  const orders = await prisma.order.findMany({
    where: {
      pharmacyId,
      status,
    },
    include: {
      Patient: {
        select: {
          fullName: true,
        },
      },
      items: true,
      prescription: {
        select: {
          fileUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No {status.toLowerCase()} orders found.
      </div>
    );
  }

  return (
    <div className="divide-y border rounded-lg overflow-hidden">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-sm text-gray-700 w-full">
            <div>
              <span className="text-gray-500">Order ID:</span>{" "}
              <span className="font-medium">#{order.id.slice(-6)}</span>
            </div>
            <div>
              <span className="text-gray-500">Patient:</span>{" "}
              {order.Patient?.fullName || "Unknown"}
            </div>
            <div>
              <span className="text-gray-500">Total:</span> LKR
              {` ${order.totalAmount.toFixed(2)}`}
            </div>
            <div>
              <span className="text-gray-500">Created:</span>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-end justify-center gap-6 text-sm text-blue-800 ml-4 shrink-0">
            <Link
              href={`/site/pharmacy/orders/${order.id}`}
              className="hover:underline"
            >
              View Details
            </Link>
            {order.prescription?.fileUrl && (
              <a
                href={order.prescription.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Prescription
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
