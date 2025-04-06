
import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


export default async function PharmacyDashboard() {

  const user = await requireUser("PHARMACY");


  const orders = await prisma.order.findMany({
    where: {
      pharmacyId: user.pharmacy?.id,
      status: "ACCEPTED",
    },
    include: {
      Patient: {
        select: {
          fullName: true,
          avatar: true,
          user: {
            select: {
              email: true,
              phone: true,
            },
          },
        },
      },
      items: {
        select: {
          name: true,
          quantity: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-5xl flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8">Welcome To Medi-Link</h1>

        <h2 className="text-xl font-semibold mb-6">
          Bridging Patients And Pharmacies Effortlessly
        </h2>

        <div className="w-full flex gap-3 items-center justify-center my-6">
          <Link
            href={`/site/pharmacy/orders`}
            className="px-3 py-3 bg-yellow-600 text-white rounded-2xl hover:bg-yellow-600/90"
          >
            Accepted Orders
          </Link>
          <Link
            href={`/site/pharmacy/orders`}
            className="px-3 py-3 bg-green-900 text-white rounded-2xl hover:bg-green-900/90"
          >
            Completed Orders
          </Link>
        </div>

        <div className="space-y-4 w-full">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center gap-6 bg-white p-4 rounded-3xl shadow-sm border hover:shadow-md transition"
            >
              {/* Avatar */}
              <div className="w-20 h-20 relative rounded-full overflow-hidden border">
                <Image
                  src="/images/today1.jpg"
                  alt={`${order.Patient?.fullName}'s avatar`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-lg font-medium">
                  {order.Patient?.fullName || "Unknown"}
                </p>
                <p className="text-sm text-gray-600">
                  Placed on: {formatDate(order.createdAt)}
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <Link
                    href={`/site/pharmacy/orders/${order.id}`}
                    className="text-sm px-3 py-1.5 rounded-md border border-blue-800 text-blue-800 hover:bg-blue-50 transition"
                  >
                    Order Info
                  </Link>
                  <span className="text-sm px-3 py-1.5 rounded-md bg-red-500 text-white font-medium">
                    User haven't Paid yet
                  </span>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-gray-500 text-center py-12">
              No pending orders found.
            </div>
          )}
        </div>
      </div>
    </div>

  );
}

