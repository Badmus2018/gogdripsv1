import prisma from "@/libs/prismadb";

export async function getProductPerformanceData() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        paymentConfirmed: true,
      },
    });

    // Aggregate product stats by parsing each product entry as JSON
    const productStats: {
      [productId: string]: {
        name: string;
        revenue: number;
        quantity: number;
        orders: number;
      };
    } = {};

    orders.forEach((order: any) => {
      (order.products as string[]).forEach((productStr) => {
        let product;
        try {
          product = JSON.parse(productStr);
        } catch (e) {
          return; // skip invalid entries
        }
        if (!product?.id) return;
        if (!productStats[product.id]) {
          productStats[product.id] = {
            name: product.name || "Unknown",
            revenue: 0,
            quantity: 0,
            orders: 0,
          };
        }
        productStats[product.id].revenue += (product.price || 0) * (product.quantity || 1);
        productStats[product.id].quantity += (product.quantity || 1);
        productStats[product.id].orders += 1;
      });
    });

    const sortedProducts = Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue);

    return sortedProducts;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default getProductPerformanceData;
