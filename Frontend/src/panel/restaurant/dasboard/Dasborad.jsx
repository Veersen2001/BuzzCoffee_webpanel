import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Clock, Package, XCircle } from "lucide-react";
import { getAllOrders } from "../../../redux/slice/OrderSlice"; // Adjust path to your slice
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import StatusCard from "../StatusCard";
import moment from "moment";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { orderData, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);
  
  

  // Compute order statistics
  const orderStatusCounts = orderData.reduce(
    (acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    },
    { delivered: 0, preparing: 0, processing: 0, cancelled: 0 }
  );

  const totalRevenue = orderData.reduce((acc, order) => acc + order.totalAmount, 0);

  // Group orders by month and calculate revenue
  const monthlyRevenue = orderData.reduce((acc, order) => {
    const month = moment(order.orderDate).format("MMMM YYYY"); // Example: "January 2024"
    acc[month] = (acc[month] || 0) + order.totalAmount;
    return acc;
  }, {});
  
  const STATUS_COLORS = {
    processing: "#1E90FF", // Blue
    preparing: "#e57740", // Orange
    delivered: "#32CD32", // Green
    cancelled: "#FF6347", // Red
  };

  // Convert orderStatusCounts into pieData and assign colors
  const pieData = Object.entries(orderStatusCounts).map(([key, value]) => ({
    name: key,
    value,
    color: STATUS_COLORS[key] || "#808080", // Default to gray if status not mapped
  }));
  // Convert monthlyRevenue object into an array for BarChart
  const barData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
    month,
    revenue,
  }));

 

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const countOrdersByStatus = (status) => {
    return orderData.filter((order) => order.orderStatus === status).length;
  };

  const stats = [
    {
      label: "Processing",
      count: countOrdersByStatus("processing"),
      icon: Clock,
      color: "blue",
    },
    {
      label: "Preparing",
      count: countOrdersByStatus("preparing"),
      icon: Package,
      color: "orange",
    },
    {
      label: "Delivered",
      count: countOrdersByStatus("delivered"),
      icon: Box,
      color: "emerald",
    },
    {
      label: "Cancelled",
      count: countOrdersByStatus("cancelled"),
      icon: XCircle,
      color: "red",
    },
  ];

  

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Order Dashboard</h1>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatusCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
        {/* Pie Chart */}
        <div className="w-full lg:w-1/2 bg-white shadow rounded-lg p-5">
          <h2 className="text-xl font-semibold text-center mb-4">Order Status Distribution</h2>
          <div className="flex justify-center mr-2">
            <PieChart width={500} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="w-full lg:w-1/2 bg-white shadow rounded-lg p-5">
          <h2 className="text-xl font-semibold text-center mb-4">Monthly Revenue</h2>
          <div className="flex justify-center">
            <BarChart width={300} height={300} data={barData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#e2b492" />
            </BarChart>
          </div>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold text-gray-500">
          Total Revenue: ₹{totalRevenue.toFixed(2)}
        </h2>
      </div>
    </div>
  );
};

export default Dashboard;
