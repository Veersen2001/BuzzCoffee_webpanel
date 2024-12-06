
import { Mail, Phone,QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllOrders, getOrder, updateOrder } from "../../../redux/slice/OrderSlice";

const getStatusColor = (status) => {
  const colors = {
    delivered: "bg-emerald-50 text-emerald-600",
    preparing: "bg-orange-50 text-orange-600",
    processing: "bg-blue-50 text-blue-600",
    cancelled: "bg-red-50 text-red-600",
  };
  return colors[status] || "bg-gray-50 text-gray-600";
};

const getPaymentStatusColor = (status) => {
  return status === "Paid" ? "text-emerald-600" : "text-red-600";
};

export default function OrderRow() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [currentStatus, setCurrentStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  // const { orderData, loading,error } = useSelector((state) => state.orders);
  const { orderData, loading } = useSelector((state) => state.orders);
  const order = orderData.find((o) => o._id === id);
    
  
  console.log(id);
  
  
  

    useEffect(() => {
      
        dispatch(getOrder(id));
        
     
        // setCurrentStatus(order.orderStatus || "processing");
        // setPaymentStatus(order.paymentStatus || "unpaid");
      
    }, [dispatch, id,order]);
    console.log(order?.orderId);
    

    const handleStatusChange = (event) => {
      setCurrentStatus(event.target.value);
    };

    const handlePaymentStatusChange = (event) => {
      setPaymentStatus(event.target.value);
    };
     

    const handleUpdatePreparingStatus = () => {
      dispatch(
        updateOrder({
          id,
          updatedData: {
            orderStatus:"preparing",
           },
        })
      );
      setUpdateMessage("Order status updated successfully!");
      setTimeout(() => {
        setUpdateMessage("");
      }, 2000);
    };
  const handleUpdateDeliveredStatus = () => {
    dispatch(
      updateOrder({
        id,
        updatedData: {
          orderStatus: "delivered",
        },
      })
    );
    setUpdateMessage("Order status updated successfully!");
    setTimeout(() => {
      setUpdateMessage("");
    }, 2000);
  };

    const handleCancelOrder = () => {
      dispatch(
        updateOrder({
          id,
          updatedData: { orderStatus: "cancelled" },
        })
      );
      setShowCancelPopup(false);
      setCurrentStatus("Cancelled");
      setUpdateMessage("Order has been cancelled successfully.");
      setTimeout(() => {
        setUpdateMessage("");
      }, 2000);
    };

  if (loading) {
    return <div>Loading...</div>; // Show a loader while fetching data
  }
    
  
  return (
    <div className="flex flex-wrap">
      <div
        key={order._id}
        className="lg:flex w-full justify-around"
      >
        <div
          className="bg-white rounded-lg border mx-auto w-full sm:max-w-md md:max-w-3xl  p-4 sm:p-6 lg:w-4/5"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Order Details # {order.orderId}
          </h2>
          <div className="rounded-lg bg-white flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 p-3 sm:p-5">
            <Link to={`/restaurant/order/invoice/${order._id}`}>
              <button
                onClick={() => handleViewOrder(order._id)}
                className="px-3 sm:px-4 py-2 bg-[#e2b492] text-white text-xs sm:text-sm font-semibold rounded hover:bg-white hover:text-black hover:border-[#e2b492] hover:border-2 transition-colors"
              >
                Print Invoice
              </button>
            </Link>

            <div className="text-xs sm:text-sm space-y-2 font-bold">
              <p>
                <span className="text-gray-600">Status:</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </p>
              <p>
                <span className="text-gray-600">Payment Status:</span>
                <span
                  className={`font-medium px-2 py-1 text-xs rounded ${getPaymentStatusColor(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus}
                </span>
              </p>
              <p>
                <span className="text-gray-600">Order Type:</span>
                <span className="px-2 py-1 text-xs font-medium bg-teal-100 text-teal-600 rounded">
                  {order.isOnlineOrder ? "Online" : "Offline"}
                </span>
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-0 flex flex-col flex-wrap">
            <h3 className="text-md sm:text-lg font-semibold mb-1">
              Customer Information
            </h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-xs sm:text-sm">
                      {order.customerId || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Name</p>
                    <p className="font-medium text-xs sm:text-sm">
                      {order.customer}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                    <p className="font-medium text-xs sm:text-sm">
                      {order.email}
                    </p>
                  </div>
                </div>
                {order.qrCode !== "GENERATED_QR_CODE" && (
                  <div className="flex items-center justify-center border">
                    <QrCode className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Scan QR</p>
                      <img
                        src={order.qrCode}
                        alt="QR Code"
                        className="h-32 w-32 sm:h-40 sm:w-40"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="p-3 sm:p-4">
            <h2 className="font-bold text-md sm:text-lg mb-1">Order Note:</h2>
            <div className="overflow-auto border rounded-lg">
              <table className="w-full bg-white">
                <thead className="bg-[#e2b492] text-white">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold">
                      SL
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold">
                      Item Details
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold">
                      Price * QTY
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold">
                      Total Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={item._id} className="border-t">
                      <td className="px-2 sm:px-5 py-2 text-xs sm:text-sm">
                        {index + 1}.
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                        <div className="flex flex-col items-start space-x-3">
                          <div>
                            <p className="font-semibold">{item.title}</p>
                          </div>

                          {item.variants?.length > 0 && (
                            <div>
                              <span className="font-bold text-xs sm:text-sm">
                                Variants:
                              </span>
                              {item.variants.map((variant, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs sm:text-sm ml-1 font-bold text-gray-600"
                                >
                                  {variant.name}
                                </span>
                              ))}
                            </div>
                          )}
                          {item.addons?.length > 0 && (
                            <div>
                              <span className="font-bold text-xs sm:text-sm">
                                Addons:
                              </span>
                              {item.addons.map((addon, idx) => (
                                <span
                                  className="text-xs sm:text-sm font-bold text-gray-600"
                                  key={idx}
                                >
                                  {addon.name},
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                        &#8377;{item.price.toFixed(2)}*{item.quantity}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold">
                        &#8377;{item.price.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 flex flex-wrap">
              <table className="w-full max-w-[60vh] bg-white">
                <tbody>
                  <tr>
                    {order.discountedPrice > 0 ? (
                      <>
                        <div className="max-w-[280px] flex justify-between mt-4">
                          <h3 className="font-bold text-gray-700 text-xs sm:text-md">
                            Sub Total Price:
                          </h3>
                          <p className="text-xs sm:text-md font-semibold text-gray-600">
                            ₹{order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                        <div className="max-w-[280px] flex justify-between mt-4">
                          <h3 className="font-bold text-gray-700 text-xs sm:text-md">
                            Discount Price:
                          </h3>
                          <p className="text-xs sm:text-md font-semibold text-gray-600">
                            - ₹{order.discount.toFixed(2)}
                          </p>
                        </div>
                        <div className="max-w-[280px] flex justify-between mt-4">
                          <h3 className="font-bold text-gray-700 text-xs sm:text-md">
                            Total Price:
                          </h3>
                          <p className="text-xs sm:text-md font-semibold text-gray-600">
                            ₹{order.discountedPrice.toFixed(2)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="max-w-[280px] flex justify-between mt-4">
                        <h3 className="font-bold text-gray-700 text-xs sm:text-md">
                          Total Price:
                        </h3>
                        <p className="text-xs sm:text-md font-semibold text-gray-600">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        





        {/* Order Setup */}

        <div className=" w-full lg:w-1/5 flex flex-col  border-solid font-medium text-sm gap-y-3 px-10 mr-8">
            <h3 className="text-center text-lg font-semibold mb-1">
              Order Setup
            </h3>
            
             <div className=" flex flex-col flex-wrap">
               <label
                htmlFor="small"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Payment Status:
              </label>
              <select
                id="small"
                className="block w-60 p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={paymentStatus}
                onChange={handlePaymentStatusChange}
              >
                <option className="text-red-500">Unpaid</option>
                <option className="text-green-500">Paid</option>
              </select>
            </div>

            {/* <button
              className="px-5 py-3 bg-[#dbb99f] text-white text-sm font-semibold rounded  hover:bg-white hover:text-black hover:border-[#e2b492] hover:border-2 transition-colors"
              onClick={handleUpdateStatus}
            >
              {" "}
              Update Status{" "}
            </button> */}

            {updateMessage && (
              <p className="text-green-500 mt-2 w-60">{updateMessage}</p>
            )}
            {/* Cancel Order Button */}
            {order.orderStatus === "processing" ?(
              <div>
              <button
                className="px-5 py-3 mt-3 bg-orange-400 text-white text-sm font-semibold rounded hover:bg-red-700 transition-colors"
                onClick={() => handleUpdatePreparingStatus()}
              >
                Preparing

              </button>

            <button
              className="px-5 py-3 mt-3 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-700 transition-colors"
              onClick={() => setShowCancelPopup(true)}
              >
              Cancel Order

            </button>
            
            </div>
            ): 
            <div>
             < button
              className="px-5 py-3 mt-3 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-900 transition-colors"
              onClick={() => handleUpdateDeliveredStatus()}
              >
              Delivered

            </button>
            </div>
            
            }
          </div>
          {showCancelPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-lg font-semibold mb-4">
                  Are you sure you want to cancel this order?
                </h2>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                    onClick={handleCancelOrder}
                  >
                    Yes, Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setShowCancelPopup(false)}
                  >
                    No, Go Back
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>

  );
}
