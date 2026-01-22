import getCurrentUser from "./get-current-user";
import { redirect } from "next/navigation";

export default async function getManagerUser() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "ADMIN" && currentUser.role !== "MANAGER") {
    redirect("/");
  }

  return currentUser;
}
