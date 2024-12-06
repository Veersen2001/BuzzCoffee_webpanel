import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Send, CreditCard, ShoppingCart } from "lucide-react";
import { ReportCard } from "./reportCard";
import { ReportGraph } from "./ReportGraph";
import { getAllOrders } from "../../../redux/slice/OrderSlice";

const Report = () => {
    const [activeTab, setActiveTab] = useState("day");
    const [filteredData, setFilteredData] = useState([]);
    const dispatch = useDispatch();

    const { orderData, loading, error } = useSelector((state) => state.orders);

    // Fetch orders on component load
    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

    // Filter transactions by day, week, or month
    useEffect(() => {
        if (orderData.length > 0) {
            const now = new Date();
            let filtered;

            if (activeTab === "day") {
                filtered = orderData.filter((order) =>
                    new Date(order.orderDate).toDateString() === now.toDateString()
                );
            } else if (activeTab === "week") {
                const weekStart = new Date();
                weekStart.setDate(now.getDate() - 7);
                filtered = orderData.filter((order) =>
                    new Date(order.orderDate) >= weekStart
                );
            } else if (activeTab === "month") {
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                filtered = orderData.filter(
                    (order) => new Date(order.orderDate) >= monthStart
                );
            }

            setFilteredData(filtered);
        }
    }, [activeTab, orderData]);

    // Calculate stats
    const totalUsers = 225; // Replace with dynamic data if needed
    const pendingTickets = filteredData.filter(
        (order) => order.orderStatus === "processing"
    ).length;
   
    
    const totalTransactions = filteredData.reduce(
        (sum, order) => sum + order.totalAmount,
        0
    );
    const totalOrders = filteredData.length;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-900 mb-8">
                    Report Overview
                </h1>

                {/* Report Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <ReportCard
                        title="TOTAL USERS"
                        value={totalUsers}
                        subtitle="from 225"
                        icon={Users}
                        
                    />
                    <ReportCard
                        title="PROCESSING ORDER"
                        value={pendingTickets}
                        subtitle={`from ${pendingTickets}`}
                        icon={Send}
                       
                    />
                    <ReportCard
                        title="THIS PERIOD TRANSACTIONS"
                        value={`₹${totalTransactions.toFixed(2)}`}
                        subtitle={`from ${filteredData.length}`}
                        icon={CreditCard}
                      
                    />
                    <ReportCard
                        title="TOTAL ORDERS"
                        value={totalOrders}
                        subtitle={`from ${orderData.length}`}
                        icon={ShoppingCart}
                       
                    />
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Recent Transactions
                        </h2>
                        <div className="flex gap-2">
                            {["day", "week", "month"].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setActiveTab(period)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === period
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-500 hover:bg-gray-50"
                                        }`}
                                >
                                    {period.charAt(0).toUpperCase() + period.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Graph */}
                    <div className="h-[400px]">
                        <ReportGraph
                            data={filteredData.map((order) => order.totalAmount)}
                            labels={filteredData.map((order) =>
                                new Date(order.orderDate).toLocaleDateString()
                            )}
                            activeTab={activeTab} // Pass activeTab to change graph colors dynamically
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;
