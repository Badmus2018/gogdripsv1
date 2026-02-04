import prisma from "@/libs/prismadb";

interface ItemsParams {
  productId?: string;
}

export default async function getProductById(params: ItemsParams) {
  try {
    const { productId } = params;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdDate: "desc",
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    // Fix: convert image null to undefined for type compatibility
    return {
      ...product,
      image: product.image === null ? undefined : product.image,
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
