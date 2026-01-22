// Removed 'use client' to allow async/await in Server Component
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Container from "@/app/components/container";
import MonitorClient from "./monitor-client";
import getOrders from "@/actions/get-orders";
import getSettings from "@/actions/get-settings";
import NullData from "@/app/components/null-data";
import getCurrentUser from "@/actions/get-current-user";

const Monitor = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  const orders = await getOrders();
  const settings = await getSettings();

  return (
    <div className="pt-8">
      <Container>
        <MonitorClient orders={orders} settings={settings} />
      </Container>
    </div>
  );
};

export default Monitor;
