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
      <div className="text-center py-12 text-gray-500">
        <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 className="text-lg font-medium">
          No {status.toLowerCase()} orders
        </h3>
        <p className="text-sm mt-1">
          When you have orders, they'll appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
        >
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-900"></span>
                  <span className="text-sm font-medium text-gray-700">
                    #{order.id.slice(-6)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {order.Patient?.fullName || "Unknown Patient"}
                </h3>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium${
                  status === "ACCEPTED" ? "text-blue-900" : "text-green-900"
                } ${status === "ACCEPTED" ? "bg-blue-100" : "bg-green-100"}`}
              >
                {status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="font-medium">
                  LKR {order.totalAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {order.prescription?.fileUrl && (
                <a
                  href={order.prescription.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-blue-900 hover:text-blue-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Prescription
                </a>
              )}
            </div>
            <Link
              href={`/site/pharmacy/orders/${order.id}`}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
