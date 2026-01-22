"use client";

import Heading from "@/app/components/heading";
import { User as UserIcon, Mail, Calendar, ShoppingCart, CheckCircle, XCircle } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  accessiblePages?: string[];
  createdAt?: string;
}

interface Order {
  id: string;
  userId?: string | null;
  amount: number;
  paymentConfirmed: boolean;
  deliveryStatus: string;
  cancelled?: boolean;
}

interface ManageUsersClientProps {
  users: User[];
  orders: Order[];
}

// Define available admin/manager pages (keys/routes)
const AVAILABLE_PAGES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "orders", label: "Orders" },
  { key: "products", label: "Products" },
  { key: "users", label: "Users" },
  { key: "analytics", label: "Analytics" },
  { key: "settings", label: "Settings" },
];

const ManageUsersClient: React.FC<ManageUsersClientProps> = ({ users, orders }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  const getUserStats = (userId: string) => {
    const userOrders = orders.filter(order => order.userId === userId);
    const completedOrders = userOrders.filter(order => order.paymentConfirmed && order.deliveryStatus === "delivered");
    const cancelledOrders = userOrders.filter(order => (order as any).cancelled);
    const totalSpent = completedOrders.reduce((sum, order) => sum + order.amount, 0);
    
    return {
      totalOrders: userOrders.length,
      completedOrders: completedOrders.length,
      cancelledOrders: cancelledOrders.length,
      totalSpent,
    };
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setIsLoading(userId);
    try {
      await axios.put("/api/user/role", { userId, role: newRole });
      toast.success("User role updated successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update user role");
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  };

  // Track loading state for accessiblePages update
  const [accessLoading, setAccessLoading] = useState<string | null>(null);

  // Handler to update accessiblePages for a user
  const handleAccessChange = async (userId: string, newPages: string[]) => {
    setAccessLoading(userId);
    try {
      await axios.put("/api/user/role", { userId, accessiblePages: newPages });
      toast.success("Manager access updated!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update access");
      console.error(error);
    } finally {
      setAccessLoading(null);
    }
  };

  return (
    <div className="max-w-[1200px] m-auto px-4">
      <div className="mb-6 mt-8">
        <Heading title="Manage Users" center />
        <p className="text-center text-slate-500 text-sm mt-2">
          Track registered users and their order statistics
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2">
            <UserIcon className="text-blue-600 text-2xl" />
            <div>
              <p className="text-xs text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600 text-2xl" />
            <div>
              <p className="text-xs text-slate-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => orders.some(o => o.userId === u.id)).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-purple-600 text-2xl" />
            <div>
              <p className="text-xs text-slate-600">Total Orders</p>
              <p className="text-2xl font-bold text-purple-600">{orders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center gap-2">
            <UserIcon className="text-amber-600 text-2xl" />
            <div>
              <p className="text-xs text-slate-600">Admin Users</p>
              <p className="text-2xl font-bold text-amber-600">
                {users.filter(u => u.role === "ADMIN").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      {users.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-lg">
          <UserIcon className="text-6xl text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No users found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => {
            const stats = getUserStats(user.id);
            const isManager = user.role === "MANAGER";
            // For managers, show accessiblePages checklist
            const userPages: string[] = Array.isArray((user as any).accessiblePages) ? (user as any).accessiblePages : [];

            return (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-sm border border-slate-300 p-5 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                        <UserIcon className="text-2xl text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-slate-800">{user.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Mail size={14} />
                          <span>{user.email}</span>
                        </div>
                      </div>
                      {user.role === "ADMIN" && (
                        <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-xs font-semibold">
                          ADMIN
                        </div>
                      )}
                      {user.role === "MANAGER" && (
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold">
                          MANAGER
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-slate-500 text-xs mb-1">Total Orders</p>
                        <p className="font-bold text-lg text-slate-800">{stats.totalOrders}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-slate-500 text-xs mb-1">
                          <CheckCircle className="inline mr-1" size={12} />
                          Completed
                        </p>
                        <p className="font-bold text-lg text-green-700">{stats.completedOrders}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3">
                        <p className="text-slate-500 text-xs mb-1">
                          <XCircle className="inline mr-1" size={12} />
                          Cancelled
                        </p>
                        <p className="font-bold text-lg text-red-700">{stats.cancelledOrders}</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-slate-500 text-xs mb-1">Total Spent</p>
                        <p className="font-bold text-lg text-blue-700">
                          ₦{stats.totalSpent.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User Metadata, Role Selector, and Access Checklist */}
                  <div className="flex flex-col gap-3 md:items-end">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar size={14} />
                      <span>Joined {moment(user.createdAt).format("MMM DD, YYYY")}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {moment(user.createdAt).fromNow()}
                    </div>
                    
                    {/* Role Selector */}
                    <div className="mt-2">
                      <label className="text-xs text-slate-600 mb-1 block">User Role</label>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={isLoading === user.id}
                        className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="USER">User</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>

                    {/* Manager Page Access Checklist */}
                    {isManager && (
                      <div className="mt-2">
                        <label className="text-xs text-slate-600 mb-1 block">Accessible Pages</label>
                        <div className="flex flex-wrap gap-2">
                          {AVAILABLE_PAGES.map((page) => (
                            <label key={page.key} className="flex items-center gap-1 text-xs bg-slate-100 px-2 py-1 rounded">
                              <input
                                type="checkbox"
                                checked={userPages.includes(page.key)}
                                disabled={accessLoading === user.id}
                                onChange={e => {
                                  const newPages = e.target.checked
                                    ? [...userPages, page.key]
                                    : userPages.filter(p => p !== page.key);
                                  handleAccessChange(user.id, newPages);
                                }}
                              />
                              {page.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageUsersClient;
