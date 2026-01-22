import prisma from "../libs/prismadb";

async function deleteAllOrders() {
  try {
    const result = await prisma.order.deleteMany({});
    console.log(`Deleted ${result.count} orders.`);
  } catch (error) {
    console.error("Error deleting orders:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllOrders();
