export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Container from "@/app/components/container";
import ManageUsersClient from "./manage-users-client";
import getUsers from "@/actions/get-users";
import getOrders from "@/actions/get-orders";
import NullData from "@/app/components/null-data";
import getCurrentUser from "@/actions/get-current-user";
import { enforceManagerPageAccess } from "@/middleware/enforceManagerPageAccess";

const ManageUsers = async () => {

  // Enforce manager page access (key: "users")
  const redirect = await enforceManagerPageAccess("users");
  if (redirect) return redirect;

  const currentUser = await getCurrentUser();

  const usersRaw = await getUsers();
  // Serialize all Date fields in users
  const users = (usersRaw || []).map((user: any) => ({
    ...user,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
    emailVerified:
      user.emailVerified instanceof Date || typeof user.emailVerified === 'object'
        ? user.emailVerified?.toISOString?.() ?? null
        : user.emailVerified ?? null,
  }));
  const orders = await getOrders();

  return (
    <div className="pt-8">
      <Container>
        <ManageUsersClient users={users} orders={orders} />
      </Container>
    </div>
  );
};

export default ManageUsers;
