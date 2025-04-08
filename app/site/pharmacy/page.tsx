import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

const formatPrescriptionDate = (prismaDate: Date) => {
  // 1. Get current time in Sri Lanka (UTC+5:30)
  const now = new Date();

  // 2. Prisma already converts MongoDB dates to JavaScript Date objects
  const prescriptionDate = new Date(prismaDate);

  // 3. Calculate time difference in local time
  const diffMs = now.getTime() - prescriptionDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  // 4. Check if date is today in Sri Lanka time
  const isToday =
    prescriptionDate.getDate() === now.getDate() &&
    prescriptionDate.getMonth() === now.getMonth() &&
    prescriptionDate.getFullYear() === now.getFullYear();

  if (isToday) {
    // Format as HH:mm in Sri Lanka time
    return prescriptionDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Colombo",
    });
  } else if (diffMinutes < 60) {
    return diffMinutes <= 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return "yesterday";
  } else if (diffDays < 30) {
    return `${diffDays} days ago`;
  } else {
    // Format as date in Sri Lanka
    return prescriptionDate.toLocaleDateString("en-US", {
      timeZone: "Asia/Colombo",
    });
  }
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
      <div className="w-full max-w-5xl flex flex-col items-center text-center">
        <div className="text-2xl sm:text-3xl font-bold mb-8">
          Welcome To Medi-Link
        </div>

        <div className="text-lg sm:text-xl font-semibold mb-6">
          Bridging Patients And Pharmacies Effortlessly
        </div>

        <div className="w-full sm:w-2/3 flex flex-col sm:flex-row gap-3 items-center justify-center my-6">
          <Link
            href={`/site/pharmacy/orders`}
            className="w-full sm:w-1/2 px-1 py-2 text-center tracking-tighter bg-yellow-600 text-white rounded-2xl hover:bg-yellow-600/90 text-sm"
          >
            Accepted Orders By Patients
          </Link>
          <Link
            href={`/site/pharmacy/orders`}
            className="w-full sm:w-1/2 px-1 py-2 text-center tracking-tighter bg-green-900 text-white rounded-2xl hover:bg-green-900/90 text-sm"
          >
            Paid Orders By Patients
          </Link>
        </div>

        <div className="space-y-4 w-full">
          <h1 className="text-lg font-semibold ">Orders You have created </h1>
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-1 bg-white p-4 rounded-3xl shadow-sm border hover:shadow-md transition"
            >
              <div className="flex gap-6 items-center">
                {/* Avatar */}
                <div className="w-20 h-20 relative rounded-full overflow-hidden border">
                  <Image
                    src={order.Patient?.avatar || "/images/noAvatar.png"}
                    alt={`${order.Patient?.fullName}'s avatar`}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col gap-2 text-left">
                    <p className="text-lg font-medium">
                      {order.Patient?.fullName || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Placed on: {formatPrescriptionDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="mt-2 sm:flex items-center gap-3 hidden">
                    <Link
                      href={`/site/pharmacy/orders/${order.id}`}
                      className="text-sm px-3 py-1.5 rounded-md border border-blue-800 text-blue-800 hover:bg-blue-50 transition"
                    >
                      Order Info
                    </Link>
                    <span className="text-sm px-3 py-1.5 rounded-md bg-red-500 text-white font-medium">
                      {`User haven't Paid yet`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3 sm:hidden mx-auto">
                <Link
                  href={`/site/pharmacy/orders/${order.id}`}
                  className="text-sm px-3 py-1.5 rounded-md border border-blue-800 text-blue-800 hover:bg-blue-50 transition"
                >
                  Order Info
                </Link>
                <span className="text-sm px-3 py-1.5 rounded-md bg-red-500 text-white font-medium">
                  {`User haven't Paid yet`}
                </span>
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
