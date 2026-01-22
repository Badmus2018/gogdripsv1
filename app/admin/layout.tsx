
import AdminNav from "../components/admin/admin-nav";
import { appConfig } from "../../config/appConfig";

export const metadata = {
  title: `${appConfig.appName} Admin`,
  description: `${appConfig.appName} Admin Dashboard`,
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
};

export default AdminLayout;
