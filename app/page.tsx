export const revalidate = 0;

import Container from "./components/container";
import HomeClient from "./home-client";
import HomeBanner from "./components/home-banner";
import ProductCard from "./components/products/product-card";
import getProducts, { IProductParams } from "@/actions/get-products";
import NullData from "./components/null-data";
import getCurrentUser from "@/actions/get-current-user";
import getOrdersByUserId from "@/actions/get-orders-by-user-id";
import UserDashboard from "./components/user-dashboard";
import getSettings from "@/actions/get-settings";

interface HomeProps {
  searchParams: IProductParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const products = await getProducts(searchParams);
  const currentUser = await getCurrentUser();
  const settings = await getSettings();
  
  // Get user's orders if logged in
  let userOrders = [];
  if (currentUser) {
    const orders = await getOrdersByUserId(currentUser.id);
    // Serialize orders to plain objects
    userOrders = orders.map((order: any) => ({
      ...order,
      id: order.id.toString(),
      createDate: order.createDate.toISOString(),
      createdAt: order.createdAt?.toISOString(),
      updatedAt: order.updatedAt?.toISOString(),
      cancelledAt: order.cancelledAt?.toISOString() || null,
      reimbursedAt: order.reimbursedAt?.toISOString() || null,
      user: order.user ? {
        ...order.user,
        id: order.user.id.toString(),
        createdAt: order.user.createdAt.toISOString(),
        updatedAt: order.user.updatedAt.toISOString(),
        emailVerified: order.user.emailVerified?.toISOString() || null,
      } : undefined,
    }));
  }

  if (products.length === 0) {
    return (
      <NullData title='Oops! No products found. Click "All" to clear filters.' />
    );
  }

  const shuffleArray = (array: any) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  };

  const shuffledProducts = shuffleArray(products);

  // Move main render to a client component for useEffect
  return <HomeClient products={shuffledProducts} currentUser={currentUser} userOrders={userOrders} settings={settings} />;
}
