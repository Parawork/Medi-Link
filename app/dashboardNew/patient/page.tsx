import { prisma } from "@/app/utils/db";
import { signOut } from "@/lib/auth";
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PatientDashboard() {
  const user = await requireUser("PATIENT");

  // Fetch complete patient data with all relations
  const patient = await prisma.patient.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      geoLocation: true,
      prescriptions: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5, // Only get the 5 most recent prescriptions
      },
      subscriptions: {
        include: {
          medicine: {
            include: {
              pharmacy: true,
            },
          },
        },
        orderBy: {
          nextDelivery: "asc",
        },
      },
      orders: {
        include: {
          medicines: {
            include: {
              medicine: true,
            },
          },
          pharmacy: true,
          payment: true,
          delivery: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5, // Only get the 5 most recent orders
      },
    },
  });

  if (!patient) {
    redirect("/auth/complete-profile");
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {patient.fullName}</h1>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut();
            redirect("/login");
          }}
        >
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>

      {/* Personal Information Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Date of Birth</p>
            <p>{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-medium">Gender</p>
            <p>{patient.gender || "Not specified"}</p>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <p>{user.email}</p>
          </div>
        </div>
      </div>

      {/* Address Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Address</h2>
        <div className="space-y-2">
          <p>{patient.streetAddress}</p>
          <p>
            {patient.city}, {patient.stateProvince} {patient.postalCode}
          </p>
          <p>{patient.country}</p>
          {patient.geoLocation && (
            <p className="text-sm text-gray-500 mt-2">
              Location coordinates: {patient.geoLocation.latitude.toFixed(4)},{" "}
              {patient.geoLocation.longitude.toFixed(4)}
            </p>
          )}
        </div>
      </div>

      {/* Medical Information Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Medical Conditions</p>
            <p className="whitespace-pre-line">
              {patient.medicalConditions || "None reported"}
            </p>
          </div>
          <div>
            <p className="font-medium">Allergies</p>
            <p className="whitespace-pre-line">
              {patient.allergies || "None reported"}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Prescriptions Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Prescriptions</h2>
          <Link
            href="/patient/prescriptions"
            className="text-blue-500 hover:underline"
          >
            View All
          </Link>
        </div>
        {patient.prescriptions.length > 0 ? (
          <div className="space-y-4">
            {patient.prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
              >
                <p className="font-medium">
                  {new Date(prescription.createdAt).toLocaleDateString()}
                </p>
                <a
                  href={prescription.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Prescription
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No prescriptions found</p>
        )}
      </div>

      {/* Active Subscriptions Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Subscriptions</h2>
          <Link
            href="/patient/subscriptions"
            className="text-blue-500 hover:underline"
          >
            View All
          </Link>
        </div>
        {patient.subscriptions.length > 0 ? (
          <div className="space-y-4">
            {patient.subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {subscription.medicine.name} -{" "}
                      {subscription.medicine.pharmacy.name}
                    </p>
                    <p>{subscription.frequency} day delivery frequency</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      Next delivery:{" "}
                      {new Date(subscription.nextDelivery).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {subscription.medicine.pharmacy.city}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No active subscriptions</p>
        )}
      </div>

      {/* Recent Orders Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link
            href="/patient/orders"
            className="text-blue-500 hover:underline"
          >
            View All
          </Link>
        </div>
        {patient.orders.length > 0 ? (
          <div className="space-y-4">
            {patient.orders.map((order) => (
              <div
                key={order.id}
                className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      Order #{order.id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.pharmacy.name} -{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      {order.medicines.slice(0, 2).map((item) => (
                        <p key={item.id} className="text-sm">
                          {item.quantity}x {item.medicine.name}
                        </p>
                      ))}
                      {order.medicines.length > 2 && (
                        <p className="text-sm text-gray-500">
                          +{order.medicines.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      Status: {order.delivery ? "Shipped" : "Processing"}
                    </p>
                    {order.delivery?.trackingId && (
                      <p className="text-sm text-blue-500">
                        Track #{order.delivery.trackingId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No recent orders</p>
        )}
      </div>
    </div>
  );
}
