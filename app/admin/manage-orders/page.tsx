
import Container from "@/app/components/container";
import ManageOrdersClient from "./manage-orders-client";
import getCurrentUser from "@/actions/get-current-user";
import { enforceManagerPageAccess } from "@/middleware/enforceManagerPageAccess";
import NullData from "@/app/components/null-data";
import getOrders from "@/actions/get-orders";
import Spinner from "@/app/components/spinner";

export const dynamic = 'force-dynamic';
export const revalidate = 0;


import { Suspense } from "react";

const ManageOrders = async () => {
  // Enforce manager page access (key: "orders")
  const redirect = await enforceManagerPageAccess("orders");
  if (redirect) return redirect;

  const ordersRaw = await getOrders();
  // Serialize all Date fields in orders and nested user
  const orders = ordersRaw.map((order: any) => ({
    ...order,
    createDate: order.createDate instanceof Date ? order.createDate.toISOString() : order.createDate,
    user: order.user
      ? {
          ...order.user,
          createdAt: order.user.createdAt instanceof Date ? order.user.createdAt.toISOString() : order.user.createdAt,
          updatedAt: order.user.updatedAt instanceof Date ? order.user.updatedAt.toISOString() : order.user.updatedAt,
          emailVerified:
            order.user.emailVerified instanceof Date || typeof order.user.emailVerified === 'object'
              ? order.user.emailVerified?.toISOString?.() ?? null
              : order.user.emailVerified ?? null,
        }
      : null,
  }));

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-96"><Spinner size={48} /></div>}>
      <div className="pt-8">
        <Container>
          <ManageOrdersClient orders={orders} />
        </Container>
      </div>
    </Suspense>
  );
};

export default ManageOrders;
