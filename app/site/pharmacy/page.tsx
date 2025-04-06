import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="p-4 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Hello, {user.name}</h1>
        <p className="text-gray-600">Manage your accepted orders</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">
          Accepted Orders ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No accepted orders found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">
                    Order #{order.id.slice(-6).toUpperCase()}
                  </CardTitle>
                  <div>
                    <span className="text-gray-500">Created:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Patient</h3>
                      <p>{order.Patient?.fullName || "Unknown"}</p>
                      <p className="text-sm text-gray-600">
                        {order.Patient?.user.phone}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium">
                        Items ({order.items.length})
                      </h3>
                      <ul className="space-y-1">
                        {order.items.map((item, index) => (
                          <li
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between border-t pt-2 font-medium">
                      <span>Total</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
