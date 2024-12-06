import axios from "axios";
import { Box, Clock, Package, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import StatusCard from "../StatusCard";
import OrderTable from "./OrderTable";
import Pagination from "./Pagination";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../../redux/slice/OrderSlice";


function AllOrders() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { orderData, loading: orderLoading } = useSelector((state) => state.orders);
  useEffect(() => {
    dispatch(getAllOrders())
  }, [dispatch]);
  
  

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

  const totalPages = Math.ceil(orderData.length / itemsPerPage);

  return (
    <div>
      <div className="mt-2 ml-2">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Order Management
        </h1>
        <p className="text-gray-600">
          Track and manage all your orders in one place
        </p>
      </div>
      <div className="flex flex-wrap item-center justify-evenly max-w-[100vw] gap-3">
        {stats.map((stat, index) => (
          <StatusCard key={index} {...stat} />
        ))}
      </div>

      <OrderTable
        orders={orderData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default AllOrders;
