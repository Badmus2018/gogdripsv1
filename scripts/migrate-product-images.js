// Script to migrate Product.images[] to Product.image
// Run: node scripts/migrate-product-images.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  const products = await prisma.product.findMany();
  let updated = 0;
  for (const product of products) {
    if (Array.isArray(product.images) && product.images.length > 0) {
      await prisma.product.update({
        where: { id: product.id },
        data: { image: product.images[0] },
      });
      updated++;
    }
  }
  console.log(`Migrated ${updated} products.`);
  await prisma.$disconnect();
}

migrate().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
