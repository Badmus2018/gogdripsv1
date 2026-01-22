import Container from "@/app/components/container";
import OrderListClient from "../order-list/order-list-client";
import getCurrentUser from "@/actions/get-current-user";
import NullData from "@/app/components/null-data";
import getOrders from "@/actions/get-orders";

const OrderList = async ({
  searchParams,
}: {
  searchParams: { orders?: string };
}) => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  const orderIds = searchParams.orders?.split(",") || [];
  
  if (orderIds.length === 0) {
    return <NullData title="No orders selected" />;
  }

  const allOrders = await getOrders();
  
  // Filter to only selected orders
  const selectedOrders = allOrders.filter((order) => orderIds.includes(order.id));

  return (
    <div className="pt-8">
      <Container>
        <OrderListClient orders={selectedOrders} />
      </Container>
    </div>
  );
};

export default OrderList;
