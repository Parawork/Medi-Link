import { prisma } from '@/app/utils/db'; 
import Image from 'next/image';

export default async function trackOrder({ params }: { params: Promise<{ orderId: string }> }) {
  const {orderId} = await params;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    select: {
      pharmacy: {
        select: {
            id: true,
          name: true,
          logo: true,
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
      Patient: {
        select: {
          streetAddress: true,
          city: true,
          stateProvince: true,
          postalCode: true,
            country: true,
        },
      },
      id: true,
      status: true,
      createdAt: true,
      totalAmount: true,
    },
  });

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">

        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold mb-6">Order Progress</h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 relative overflow-hidden">
                  <Image
                    src={order.pharmacy.logo || "/placeholder.svg"}
                    alt={order.pharmacy.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{order.pharmacy.name}</h3>
                  <p className="text-sm text-gray-500">Id: {order.pharmacy.id}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <p className="text-sm font-medium">Order ID: {order.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center">
                  <p className="text-xs text-gray-500">Order date: {order.createdAt.toLocaleDateString("en-US")}</p>
                </div>
              </div>

              {/* Progress tracker */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Order Placed</span>
                  <span className="text-sm font-medium">Order Accepted</span>
                  <span className="text-sm font-medium">Order Completed</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-teal-500 rounded-full"
                      style={{ width: order.status >= "PENDING" ? "0%" : order.status >= "ACCEPTED" ? "50%" : order.status >= "COMPLETED" ? "100%" : "0%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between absolute -top-1 w-full">
                    <div className={`w-4 h-4 rounded-full ${order.status >= "PENDING" ? "bg-teal-500" : "bg-gray-300"}`}></div>
                    <div className={`w-4 h-4 rounded-full ${order.status >= "ACCEPTED" ? "bg-teal-500" : "bg-gray-300"}`}></div>
                    <div className={`w-4 h-4 rounded-full ${order.status >= "COMPLETED" ? "bg-teal-500" : "bg-gray-300"}`}></div>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{order.createdAt.toLocaleDateString("en-US")}</span>
                </div>
              </div>

              {/* Order summary */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>LKR {item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 flex justify-between font-medium">
                    <span>Total</span>
                    <span>LKR {order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Delivery</h3>
                <p className="text-gray-700">street: {order.Patient?.streetAddress}</p>
                <p className="text-gray-700">city: {order.Patient?.city}</p>
                <p className="text-gray-700">state: {order.Patient?.stateProvince}</p>
                <p className="text-gray-700">country: {order.Patient?.country}</p>
              </div>

            
            </div>
          </div>
        </main>
      </div>

  );
}