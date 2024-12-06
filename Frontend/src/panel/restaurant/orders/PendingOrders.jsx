import axios from "axios";
import { useEffect, useState } from "react";
import OrderTable from "./OrderTable";
import Pagination from "./Pagination";
import { getAllOrders } from "../../../redux/slice/OrderSlice";
import { useDispatch, useSelector } from "react-redux";


const PendingOrders = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { orderData, loading: orderLoading } = useSelector((state) => state.orders);
  useEffect(() => {
    dispatch(getAllOrders())
  }, [dispatch])


  const pendingOrders = orderData.filter(
    (order) => order.orderStatus === "preparing"
  );
  const totalPages = Math.ceil(pendingOrders.length / itemsPerPage);

  return (
    <div>
      <h1 className="text-xl mt-3 ml-2 font-bold text-gray-900 mb-1">
        Pending Orders
      </h1>

      <OrderTable
        orders={pendingOrders}
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

export default PendingOrders;
