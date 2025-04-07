import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/app/utils/db";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";

// Helper function for order status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case "ACCEPTED":
      return <Badge className="bg-blue-100 text-blue-800">Accepted</Badge>;
    case "COMPLETED":
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
  }
};

export default async function SingleOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const user = await requireUser("PHARMACY");

  if (!user.pharmacy) {
    redirect("/site/pharmacy/dashboard");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      pharmacyId: user.pharmacy.id,
    },
    include: {
      items: true,
      prescription: {
        include: {
          patient: true,
        },
      },
      delivery: true,
    },
  });

  if (!order) {
    redirect("/site/pharmacy/orders");
  }

  // Format the date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-gray-500">Order #{orderId.slice(0, 8)}</p>
        </div>

        <div className="flex gap-4">
          <form action="/site/pharmacy/orders">
            <Button variant="outline" type="submit">
              Back to Orders
            </Button>
          </form>
          {/* <form action={`/site/pharmacy/orders/${orderId}/update`}>
            <Button type="submit">Update Status</Button>
          </form> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                Created on {formatDate(order.createdAt)}
              </CardDescription>
            </div>
            {getStatusBadge(order.status)}
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-medium text-lg mb-2">Medications</h3>
                <div className="bg-gray-50 rounded-md">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex items-center justify-between border-b last:border-0"
                    >
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-md p-4">
                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <p className="text-sm text-gray-500">
              Last Updated: {formatDate(order.updatedAt)}
            </p>
          </CardFooter>
        </Card>

        {/* Side Information */}
        <div className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="size-14 relative rounded-full bg-gray-200 overflow-hidden">
                  {order.prescription.patient.avatar ? (
                    <Image
                      src={order.prescription.patient.avatar}
                      alt={`${order.prescription.patient.fullName}'s avatar`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="size-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-xl">
                      {order.prescription.patient.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">
                    {order.prescription.patient.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Patient ID: {order.prescription.patient.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{order.prescription.patient.streetAddress}</p>
                  <p>
                    {order.prescription.patient.city},{" "}
                    {order.prescription.patient.stateProvince}{" "}
                    {order.prescription.patient.postalCode}
                  </p>
                  <p>{order.prescription.patient.country}</p>
                </div>

                {order.prescription.patient.medicalConditions && (
                  <div>
                    <p className="text-sm text-gray-500">Medical Conditions</p>
                    <p>{order.prescription.patient.medicalConditions}</p>
                  </div>
                )}

                {order.prescription.patient.allergies && (
                  <div>
                    <p className="text-sm text-gray-500">Allergies</p>
                    <p>{order.prescription.patient.allergies}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Prescription */}
          <Card>
            <CardHeader>
              <CardTitle>Prescription</CardTitle>
              <CardDescription>
                Created on {formatDate(order.prescription.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden mb-4">
                {order.prescription.fileUrl.endsWith(".pdf") ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-4">
                      <p className="text-gray-500 mb-2">PDF Document</p>
                      <a
                        href={order.prescription.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View PDF
                      </a>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={order.prescription.fileUrl}
                    alt="Prescription"
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              <div className="text-center">
                <a
                  href={order.prescription.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    type="button"
                  >
                    Download Prescription
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          {order.delivery && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Delivery details available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
