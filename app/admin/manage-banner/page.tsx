export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Container from "@/app/components/container";
import ManageBannerClient from "./manage-banner-client";
import getSettings from "@/actions/get-settings";
import NullData from "@/app/components/null-data";
import getCurrentUser from "@/actions/get-current-user";

const ManageBanner = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access denied" />;
  }

  const settings = await getSettings();

  // Convert to plain object for client component
  const plainSettings = settings ? JSON.parse(JSON.stringify(settings)) : null;

  return (
    <div className="pt-8">
      <Container>
        <ManageBannerClient settings={plainSettings} />
      </Container>
    </div>
  );
};

export default ManageBanner;
