import { Download, Eye, PenBox, Printer, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function OrderTable({ orders, currentPage, itemsPerPage }) {
 
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [searchQuery, setSearchQuery] = useState("");

  
  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    // Filter orders based on search query
    const filtered = orders.filter(
      (order) =>
        // order.customer.toLowerCase().includes(query) ||
        order.orderStatus.toLowerCase().includes(query) ||
        order.orderId.toLowerCase().includes(query)
    );
    // Sort filtered orders in descending order based on orderId
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [searchQuery, orders]);

  const displayedOrders = filteredOrders.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    const colors = {
      processing: "bg-blue-50 text-blue-600",
      preparing: "bg-orange-50 text-orange-600",
      delivered: "bg-emerald-50 text-emerald-600",
      cancelled: "bg-red-50 text-red-600",
    };
    return colors[status] || "bg-gray-50 text-gray-600";
  };

  
 


  return (
    <div className="mt-6 max-w-[90vw]">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-96 ml-6 bg-white">
          <Search className="absolute left-3 top-1/2 font-bold text-[#e2b492] transform -translate-y-1/2 h-6 w-6" />
          <input
            type="text"
            placeholder="Search by customer or status"
            className="pl-10 pr-4 py-2 w-full bg-white border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#e2b492] focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="hidden items-center gap-2 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors mr-10">
          <Download className="h-4 w-4" />
          <span className="text-xs">Export</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-wrap">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                SL
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                Order ID
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                Customer
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                Total Amount
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                Order Status
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                Payment Method
              </th>

              <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.map((order, index) => (
              <tr
                key={order.orderId}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-4 text-gray-600">
                  {startIndex + index + 1}
                </td>
                <td className="py-4 px-4 text-sm text-blue-600">
                  {order.orderId}
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-sm text-gray-900">
                    {order.customer}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-sm text-gray-900">
                    &#8377;{order.totalAmount.toFixed(2)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="py-4 px-5 text-sm ">
                  {order.isOnlineOrder === true ? (
                    <span className="p-1 text-blue-500 ">Online</span>
                  ) : (
                    <span className="p-1 text-green-500 ">Store</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Link to={`/restaurant/order/details/${order._id}`}>
                      <button
                        className="p-1 text-gray-500 hover:text-gray-700 border-solid hover:bg-[#e2b492] border-2 rounded-md"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-6 w-6 hover:text-white" />
                      </button>
                    </Link>
                    <Link to={`/restaurant/order/invoice/${order._id}`}>
                      <button
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-[#e2b492] border-solid border-2 rounded-md"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Printer className="h-6 w-6 hover:text-white" />
                      </button>
                    </Link>
                    <Link to={`/restaurant/pos/edit_order/${order._id}`}>
                      {order.orderStatus === "processing" ? (
                        <button
                          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-[#e2b492] border-solid border-2 rounded-md"
                          onClick={() => handleViewOrder(order)}
                        >
                          <PenBox className="h-6 w-6 hover:text-white" />
                        </button>
                      ) : null}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderTable;
