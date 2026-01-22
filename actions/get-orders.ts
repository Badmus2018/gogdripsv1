import prisma from "@/libs/prismadb";

export default async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createDate: "desc",
      },
    });

    // Serialize and filter fields for client
    return orders.map((order) => ({
      id: order.id,
      user: order.user
        ? {
            id: order.user.id,
            name: order.user.name ?? null,
          }
        : null,
      userId: order.userId ?? null,
      guestName: order.guestName ?? null,
      address: order.address ?? null,
      adminConfirmedAvailability: order.adminConfirmedAvailability ?? false,
      createDate: order.createDate ? order.createDate.toISOString() : undefined,
      paymentConfirmed: order.paymentConfirmed ?? false,
      products: Array.isArray(order.products)
        ? order.products.map((p) => {
            try {
              return typeof p === "string" ? JSON.parse(p) : p;
            } catch {
              return p;
            }
          })
        : [],
      amount: order.amount,
      deliveryStatus: order.deliveryStatus,
      cancelled: order.cancelled ?? false,
    }));
  } catch (error: any) {
    throw new Error(error);
  }
}
