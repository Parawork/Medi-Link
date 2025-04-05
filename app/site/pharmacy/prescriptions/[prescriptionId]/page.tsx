import { OrderForm } from "@/app/site/components/pharmacy/OrderForm";
import { prisma } from "@/app/utils/db";
import { requireUser } from "@/lib/requireUser";

export default async function ReviewOrder({
  params,
}: {
  params: Promise<{ prescriptionId: string }>;
}) {
  const user = await requireUser("PHARMACY");

  const { prescriptionId } = await params;

  return (
    <div>
      <h1>Hello {user.pharmacy?.id}</h1>
      <h1>Hello {user.id}</h1>
      <h1>This is prescription {prescriptionId}</h1>
      <OrderForm prescription={prescriptionId} />
    </div>
  );
}
