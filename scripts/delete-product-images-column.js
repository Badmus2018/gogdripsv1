// Script to drop the images column from Product table
// Run: node scripts/delete-product-images-column.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // This script only works if you use raw SQL, as Prisma does not support dropping columns directly
  await prisma.$executeRawUnsafe('ALTER TABLE "Product" DROP COLUMN IF EXISTS "images";');
  console.log('Dropped images column from Product table.');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
