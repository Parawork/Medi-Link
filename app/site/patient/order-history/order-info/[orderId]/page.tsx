import { prisma } from "@/app/utils/db"; // Assuming you're using Prisma
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, MessageSquare, Download } from "lucide-react"
import { Button } from "@/components/ui/button"; // Adjust the path based on your project structure

export default async function OrderInfoPage({ params }: {params: Promise<{ orderId: string }>}) {
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
        },
    });// Get the order ID from the URL parameters
  if (!order) {
    return <div>Prescription not found</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <Link href="/site/patient/order-history" className="flex items-center text-blue-600 mb-6">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Link>

            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={order.pharmacy.logo || "/placeholder.svg"}
                      alt={order.pharmacy.name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{order.pharmacy.name}</h2>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">Order #{order.id}</span>
                  <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                  
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">LKR {item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>LKR {order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Delivery Information</h3>
                {/* <p className="text-gray-700">{order.deliveryAddress}</p>
                <p className="text-gray-700 mt-2">Payment Method: {order.paymentMethod}</p> */}
                <p className="text-gray-700 mt-2">Prescription ID: {order.prescription.id}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={order.prescription.fileUrl} className="flex-1" target="_blank" rel="noopener noreferrer" download>
                    <Button variant="outline" className="flex items-center gap-2" >
                    <Download className="h-4 w-4" />
                    Download Prescription
                    </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
};


// export async function getServerSideProps({ params }: { params: { orderId: string } }) {
//   const { orderId } = params; // Get dynamic parameter (prescriptionId)

//   // Fetch the prescription data from the database or an API
//   const order = await prisma.order.findUnique({
//     where: { id: orderId },
//     include: {
//       pharmacy: true, // Assuming the prescription has a pharmacy relation
//     },
//   });

//   if (!order) {
//     return {
//       notFound: true, // Return 404 if prescription is not found
//     };
//   }

//   return {
//     props: {
//       order,
//     },
//   };
// }

// interface Order {
//     id: string;
//     createdAt: string;
//     status: string;
//     pharmacy: {
//       id: string
//       name: string
//       logo: string
//       phone: string
//     };
//     items: {
//       name: string
//       quantity: number
//       price: number
//     }[]
//     totalAmount: number
//     prescription: {
//       id: string
//       createdAt: string
//       fileUrl: string
//     }
//   }