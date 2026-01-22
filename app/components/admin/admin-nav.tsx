"use client";

import Link from "next/link";
import Spinner from "@/app/components/spinner";
import Container from "../container";
import AdminNavItem from "./admin-nav-item";
import {
  LayoutDashboard,
  Package,
  List,
  PlusSquare,
  Building2,
  Home,
  Monitor,
  Users,
  LayoutGrid,
} from "lucide-react";
import AdminNotifications from "./admin-notifications";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AdminNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [accessiblePages, setAccessiblePages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/current-user-role')
      .then(res => res.json())
      .then(data => {
        setUserRole(data.role);
        if (data.accessiblePages) setAccessiblePages(data.accessiblePages);
      })
      .catch(() => setUserRole(null));
  }, []);

  // Show spinner on link click, hide when pathname changes (navigation complete)
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const handleNavClick = () => {
    setLoading(true);
  };

  const isManager = userRole === "MANAGER";

  // Define nav items with keys matching accessiblePages
  const NAV_ITEMS = [
    { key: "dashboard", label: "Summary", href: "/admin", icon: LayoutDashboard },
    { key: "products", label: "Manage Products", href: "/admin/manage-products", icon: Package },
    { key: "orders", label: "Manage Orders", href: "/admin/manage-orders", icon: List },
    { key: "users", label: "Manage Users", href: "/admin/manage-users", icon: Users },
    { key: "analytics", label: "Monitor", href: "/admin/monitor", icon: Monitor },
    { key: "settings", label: "Bank Details", href: "/admin/manage-bank-details", icon: Building2 },
    { key: "locations", label: "Locations", href: "/admin/manage-hostels", icon: Home },
    { key: "categories", label: "Categories", href: "/admin/category", icon: LayoutGrid },
    { key: "banner", label: "Banner", href: "/admin/manage-banner", icon: LayoutGrid },
    { key: "add-products", label: "Add Products", href: "/admin/add-products", icon: PlusSquare },
  ];

  // For managers, only show allowed pages; for admins, show all
  const visibleNavItems = isManager
    ? NAV_ITEMS.filter(item => accessiblePages.includes(item.key) || item.key === "dashboard")
    : NAV_ITEMS;

  return (
    <div className="w-full shadow-xl border-b-[0.5px] bg-slate-300">
      <Container>
        <div className="flex flex-wrap items-center pt-1 justify-start md:justify-start gap-4 md:gap-12 overflow-x-auto">
          {loading && (
            <div className="flex items-center justify-center w-full py-2">
              <Spinner size={28} />
            </div>
          )}
          {visibleNavItems.map(item => (
            <Link key={item.key} href={item.href} onClick={handleNavClick}>
              <AdminNavItem
                label={item.label}
                icon={item.icon}
                selected={pathname === item.href}
              />
            </Link>
          ))}
          <div className="ml-auto mr-4">
            <AdminNotifications />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminNav;
