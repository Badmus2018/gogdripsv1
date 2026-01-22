"use client";

import { ShoppingCart, CheckCircle, XCircle, Clock } from "lucide-react";
import { formatPrice } from "@/utils/format-price";


interface Order {
  id: string;
  amount: number;
  paymentConfirmed: boolean;
  deliveryStatus: string;
  cancelled?: boolean;
}

interface UserDashboardProps {
  orders: Order[];
  userName?: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ orders, userName }) => {
  const completedOrders = orders.filter(
    order => order.paymentConfirmed && order.deliveryStatus === "delivered"
  );
  const cancelledOrders = orders.filter(order => (order as any).cancelled);
  const pendingOrders = orders.filter(
    order => !order.paymentConfirmed || (order.deliveryStatus === "pending" && !(order as any).cancelled)
  );
  const totalSpent = completedOrders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="bg-gradient-to-r from-zinc-900 to-neutral-900 rounded-lg p-6 shadow-lg mb-8">
      <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart className="text-3xl" />
        {userName ? `${userName}'s Dashboard` : "My Order Dashboard"}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="text-white text-xl" />
            <p className="text-white/80 text-xs font-medium">Total Orders</p>
          </div>
          <p className="text-white text-3xl font-bold">{orders.length}</p>
        </div>

        {/* Completed Orders */}
        <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4 border border-green-400/30">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="text-green-300 text-xl" />
            <p className="text-green-100 text-xs font-medium">Completed</p>
          </div>
          <p className="text-green-50 text-3xl font-bold">{completedOrders.length}</p>
          <p className="text-green-200 text-xs mt-1">
            {formatPrice(totalSpent)} spent
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-amber-500/20 backdrop-blur-sm rounded-lg p-4 border border-amber-400/30">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-amber-300 text-xl" />
            <p className="text-amber-100 text-xs font-medium">Pending</p>
          </div>
          <p className="text-amber-50 text-3xl font-bold">{pendingOrders.length}</p>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 border border-red-400/30">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="text-red-300 text-xl" />
            <p className="text-red-100 text-xs font-medium">Cancelled</p>
          </div>
          <p className="text-red-50 text-3xl font-bold">{cancelledOrders.length}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
