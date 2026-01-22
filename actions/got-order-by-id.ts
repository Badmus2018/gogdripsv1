import prisma from "../libs/prismadb";

interface ItemParams {
  orderId?: string;
}

export default async function getOrderById(params: ItemParams) {
  try {
    const { orderId } = params;

    // Validate orderId
    if (!orderId || orderId === "null" || orderId === "undefined") {
      return null;
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) return null;

    // Serialize and filter fields for client
    return {
      ...order,
      createDate: order.createDate ? order.createDate.toISOString() : undefined,
      adminConfirmedAvailabilityAt: order.adminConfirmedAvailabilityAt ? order.adminConfirmedAvailabilityAt.toISOString() : undefined,
      cancelledAt: order.cancelledAt ? order.cancelledAt.toISOString() : undefined,
      reimbursedAt: order.reimbursedAt ? order.reimbursedAt.toISOString() : undefined,
      userConfirmedDeliveryAt: order.userConfirmedDeliveryAt ? order.userConfirmedDeliveryAt.toISOString() : undefined,
      products: Array.isArray(order.products)
        ? order.products.map((p) => {
            try {
              return typeof p === "string" ? JSON.parse(p) : p;
            } catch {
              return p;
            }
          })
        : [],
    };
  } catch (error: any) {
    throw new Error(error?.message || String(error));
  }
}
