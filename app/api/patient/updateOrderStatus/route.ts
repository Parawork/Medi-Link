import { prisma } from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
  try {
    console.log("Received request to update order status:", params.orderId);
    const updatedOrder = await prisma.order.update({
      where: { id: params.orderId },
      data: { status: "COMPLETED" },
    });
    console.log("Order updated successfully:", updatedOrder);
    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
