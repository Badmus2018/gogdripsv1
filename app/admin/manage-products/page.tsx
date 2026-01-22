export const dynamic = "force-dynamic";

import Container from "@/app/components/container";
import ManageProductsClient from "./manage-products-client";
import getAdminProducts from "@/actions/get-admin-products";
import getCurrentUser from "@/actions/get-current-user";
import { enforceManagerPageAccess } from "@/middleware/enforceManagerPageAccess";
import NullData from "@/app/components/null-data";

const ManageProducts = async () => {

  // Enforce manager page access (key: "products")
  const redirect = await enforceManagerPageAccess("products");
  if (redirect) return redirect;

  const productsRaw = await getAdminProducts({ category: null });

  // Robustly serialize products and ensure plain objects with no prototype
  // Only pass the fields needed by the client component to avoid serialization issues
  const products = productsRaw.map((product: any) => {
    // Deep clone all fields to ensure plain objects/arrays
    const plainImages = Array.isArray(product.images)
      ? JSON.parse(JSON.stringify(product.images))
      : [];
    const plainReviews = Array.isArray(product.reviews)
      ? product.reviews.map((review: any) => ({
          id: review.id,
          userId: review.userId,
          productId: review.productId,
          rating: review.rating,
          comment: review.comment,
          createdDate: review.createdDate instanceof Date ? review.createdDate.toISOString() : review.createdDate,
          user: review.user
            ? {
                id: review.user.id,
                name: review.user.name ?? null,
              }
            : null,
        }))
      : [];
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      dmc: product.dmc,
      category: product.category,
      brand: product.brand,
      inStock: product.inStock,
      isVisible: product.isVisible,
      images: plainImages,
      stock: product.stock,
      remainingStock: product.remainingStock,
      reviews: plainReviews,
    };
  });

  return (
    <div className="pt-8">
      <Container>
        <ManageProductsClient products={products} />
      </Container>
    </div>
  );
};

export default ManageProducts;
