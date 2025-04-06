import { requireUser } from "@/lib/requireUser";
import OrderTabs from "../../components/pharmacy/OrderTabs";

export default async function OrdersPage() {
  const user = await requireUser("PHARMACY");

  return <OrderTabs pharmacyId={user.pharmacy?.id || ""} />;
}
