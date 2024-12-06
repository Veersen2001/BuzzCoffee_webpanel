import { orders } from "./data/orderData";

//
function OrderList({ searchQuery }) {
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      Confirmed: "bg-emerald-50 text-emerald-600",
      Delivered: "bg-emerald-50 text-emerald-600",
      Packaging: "bg-orange-50 text-orange-600",
      Pending: "bg-blue-50 text-blue-600",
      Canceled: "bg-red-50 text-red-600",
      "Failed To Deliver": "bg-red-50 text-red-600",
      "Out For Delivery": "bg-cyan-50 text-cyan-600",
      Returned: "bg-yellow-50 text-yellow-600",
    };
    return colors[status] || "bg-gray-50 text-gray-600";
  };

  const getPaymentStatusColor = (status) => {
    return status === "Paid" ? "text-emerald-600" : "text-red-600";
  };

  const getTypeColor = (type) => {
    return "bg-cyan-50 text-cyan-600";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
              SL
            </th>
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
              Order ID
            </th>
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
              Delivery Date
            </th>
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
              Time Slot
            </th>
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
              Customer
            </th>
            {/* <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Branch</th> */}
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
              Total Amount
            </th>
            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">
              Order Status
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => (
            <tr
              key={order.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-4 px-4 text-gray-600">{index + 1}</td>
              <td className="py-4 px-4 font-medium text-gray-900">
                {order.id}
              </td>
              <td className="py-4 px-4 text-gray-600">{order.date}</td>
              <td className="py-4 px-4 text-gray-600">{order.timeSlot}</td>
              <td className="py-4 px-4">
                <div>
                  <div className="font-medium text-gray-900">
                    {order.customer}
                  </div>
                  <div className="text-sm text-gray-500">{order.phone}</div>
                </div>
              </td>

              <td className="py-4 px-4">
                <div>
                  <div className="font-medium text-gray-900">
                    ${order.amount.toFixed(2)}
                  </div>
                  <div
                    className={`text-sm ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
