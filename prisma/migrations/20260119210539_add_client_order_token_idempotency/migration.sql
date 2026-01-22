/*
  Warnings:

  - A unique constraint covering the columns `[clientOrderToken]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "clientOrderToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_clientOrderToken_key" ON "Order"("clientOrderToken");
