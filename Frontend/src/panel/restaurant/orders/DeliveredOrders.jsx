import axios from "axios";
import { useEffect, useState } from "react";
import OrderTable from "./OrderTable";
import Pagination from "./Pagination";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../../redux/slice/OrderSlice";


const DeliveredOrders = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { orderData, loading: orderLoading } = useSelector((state) => state.orders);
  useEffect(() => {
    dispatch(getAllOrders())
  }, [dispatch])

  const deliveredOrders = orderData.filter(
    (order) => order.orderStatus === "delivered"
  );
  const totalPages = Math.ceil(deliveredOrders.length / itemsPerPage);

  return (
    <div>
      <h1 className="text-xl mt-3 ml-2 font-bold text-gray-900 mb-1">
        Delivered Orders
      </h1>

      <OrderTable
        orders={deliveredOrders}
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
};

export default DeliveredOrders;
