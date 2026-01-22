import Container from "@/app/components/container";
import ManageHostelsClient from "./manage-hostels-client";
import getCurrentUser from "@/actions/get-current-user";
import NullData from "@/app/components/null-data";
import getSettings from "@/actions/get-settings";

const ManageHostels = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  const settings = await getSettings();

  return (
    <div className="pt-8">
      <Container>
        <ManageHostelsClient hostels={settings?.hostels || []} />
      </Container>
    </div>
  );
};

export default ManageHostels;
