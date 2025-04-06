import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardContent } from "@/components/ui/card";
import { Suspense } from "react";

import OrderList from "./OrderList";
import OrderListSkeleton from "../skeltons/OrderListSkelton";

export default function OrderTabs({ pharmacyId }: { pharmacyId: string }) {
  return (
    <CardContent className="pt-6">
      <Tabs defaultValue="accepted" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="accepted">Accepted Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed Orders</TabsTrigger>
        </TabsList>

        <Suspense fallback={<OrderListSkeleton />}>
          <TabsContent value="accepted">
            <OrderList pharmacyId={pharmacyId} status="ACCEPTED" />
          </TabsContent>
          <TabsContent value="completed">
            <OrderList pharmacyId={pharmacyId} status="COMPLETED" />
          </TabsContent>
        </Suspense>
      </Tabs>
    </CardContent>
  );
}
