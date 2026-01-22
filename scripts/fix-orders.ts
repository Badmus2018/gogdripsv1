
import prisma from "../libs/prismadb";

async function fixOrders() {
  // Find orders without createDate using raw SQL
  const ordersWithoutCreateDate = await prisma.$queryRawUnsafe<any[]>(
    `SELECT * FROM "Order" WHERE "createDate" IS NULL`
  );
  console.log(`Found ${ordersWithoutCreateDate.length} orders without createDate`);

  // Update them
  for (const order of ordersWithoutCreateDate) {
    await prisma.order.update({
      where: { id: order.id },
      data: { createDate: order.createdat || new Date() },
    });
    console.log(`Fixed order ${order.id}`);
  }
}

fixOrders().catch(console.error);
