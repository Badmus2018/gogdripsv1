import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/libs/prismadb";

// DELETE /api/product/[id]/delete-all-images
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    query: { id },
  } = req;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Product ID required" });
  }

  try {
    // Set images to empty array for the product
    await prisma.product.update({
      where: { id },
      data: { image: '' },
    });
    return res.status(200).json({ message: "All images deleted for product" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete images", error: String(error) });
  }
}
