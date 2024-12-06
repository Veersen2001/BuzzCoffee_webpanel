import { getOrder } from "@/redux/slice/OrderSlice";

import { ChefHat } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function Invoice() {
  const receiptRef = useRef();
  const { id } = useParams();
  const dispatch = useDispatch();


  const { orderData, loading } = useSelector((state) => state.orders);
  const order = orderData.find((o) => o._id === id);
  

  useEffect(() => {
    dispatch(getOrder(id));
  }, [dispatch, id]);

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  // print receipt code
  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank"); // Open new window
      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Receipt</title>
            <style>
              @page {
                size: 80mm 500px;
                margin: 0; /* Remove default margin */
              }
              body {
                 font-family: 'Courier New', Courier, monospace;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  height: 100vh;
              }
              .receipt {
               width: 58mm; /* Standard width for 58mm thermal printers */
  background: #fff;
  padding: 10px; /* Padding inside the receipt */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Adds a print-like feel for screens */
  border-radius: 2px; /* Slightly rounded corners */
  text-align: center;
  border: 1px solid #ddd; /* Simulates print edges */
              }
              .header {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 20px;
              }
              .logo {
                margin-bottom: 10px;
              }
              .divider {
                border-top: 1px dashed black;
                margin: 20px 0;
              }
              .customer-info {
                text-align: left;
                font-size: 10px;
                margin-bottom: 20px;
              }
              .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
              }
              .label {
                font-weight: bold;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                font-size: 10px;
              }
              th, td {
                text-align: left;
                padding: 8px 0;
              }
              .total-section {
                margin-top: 20px;
                font-weight: bold;
                font-size: 10px;
              }
              .total-row {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="logo">
                  <!-- ChefHat SVG -->
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                    style="width: 40px; height: 40px;">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 3c1.75 0 3.29.92 4.14 2.3a4.501 4.501 0 015.86 4.2 4.5 4.5 0 01-3.65 4.415V19a2 2 0 01-2 2H7a2 2 0 01-2-2v-5.085a4.5 4.5 0 01-3.65-4.415 4.501 4.501 0 015.86-4.2A4.998 4.998 0 0112 3z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.5 15h7M9 11h6" />
                  </svg>
                </div>
                Coffee House
              </div>
              <div class="divider"></div>
              <div class="customer-info">
                <div class="info-row">
                  <span class="label">Order ID:</span>
                  <span>${order?.orderId}</span>
                </div>
                <div class="info-row">
                  <span class="label">Customer:</span>
                  <span>${order?.customer}</span>
                </div>
                <div class="info-row">
                  <span class="label">Order Date:</span>
                  <span>${new Date(
        order?.orderDate
      ).toLocaleDateString()}</span>
                </div>
                
              </div>
              <div class="divider"></div>
              <table>
                <thead>
                  <tr>
                    <th>QTY</th>
                    <th>DESC</th>
                    <th style="text-align: right">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  ${order?.items
          .map(
            (item) => `
                    <tr>
                      <td>${item.quantity}</td>
                      <td>${item.productId}</td>
                      <td style="text-align: right">₹${item.price.toFixed(2) * item.quantity}</td>
                    </tr>
                  `
          )
          .join("")}
                </tbody>
              </table>
              <div class="total-section">
                <div class="info-row">
                  <span>Items Price:</span>
                  <span>₹${order?.totalAmount.toFixed(2)}</span>
                </div>
                <div class="total-row">
                  <span>Total:</span>
                  <span>₹${order?.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print(); // Trigger print
    }
  };

  return (
    <div className="flex flex-col  w-full">
      <div className="flex gap-10 justify-center">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-[#e2b492] text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Print Receipt
        </button>

        <button
          className="px-5 py-3 bg-[#e85454] text-white text-sm font-semibold rounded"
          onClick={handleGoBack}
        >
          Back
        </button>
      </div>
      <div ref={receiptRef}>
        {order && (
          <div
            key={order._id}
            className="w-full rounded bg-gray-50 px-6 pt-8 flex flex-col items-center justify-center gap-5 mt-9"
          >
            <div className="flex aspect-square size-15 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <ChefHat className="size-10" />
            </div>
            <div>
              <h4 className="font-semibold text-2xl">Coffee House</h4>
            </div>
            ---------------------------------------------
            <div className="flex gap-3 border-b text-sm">
              <div className="flex gap-4 flex-col font-semibold">
                <span>Order Id:</span>
                <span>Customer Name:</span>
                <span>Phone No.</span>
                <span>Order Date:</span>

                {/* <span>Delivery Date:</span>
                <span>Time Slot:</span> */}
              </div>
              <div className="flex justify-between flex-col">
                <span>{order.orderId}</span>
                <span>{order.customer}</span>
                <span>{order.customerId}</span>
                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                {/* <span>{new Date(order.deliveryDate).toLocaleDateString()}</span>
                <span>{order.timeSlot}</span> */}
              </div>
            </div>
            --------------------------------------------
            <div className="flex flex-col gap-3 text-xs">
              <div className="w-full">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-2">
                      <th className="pb-2 text-left">SL No.</th>
                      <th className="pb-2 mr-2">DESC</th>
                      <th className="pb-2 mr-2">QTY</th>
                      <th className="pb-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={item._id} className="border text-sm border-dashed">
                        <td className="p-3  border-2 font-bold text-gray-500">{index + 1}.</td>
                        <td className="p-3 border-2">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <div className="mt-1 text-sm text-gray-500">


                              {item.variants?.length > 0 && (
                                <div className="">
                                  <span className='font-bold text-sm'>Variants:</span>
                                  {item.variants.map((variant, idx) => (
                                    <span key={idx} className='text-sm ml-1 font-bold text-gray-600'>
                                      {variant.name}

                                    </span>
                                  ))}

                                </div>
                              )}
                              {item.addons?.length > 0 && (
                                <div className="">
                                  <span className='font-bold text-sm'>Addons:</span>

                                  {item.addons.map((addon, idx) => (
                                    <span className='text-sm font-bold text-gray-600' key={idx}>
                                      {addon.name},
                                    </span>
                                  ))}

                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-right border-2">
                           {item.quantity}
                        </td>
                        <td className="p-3 text-right border-2">
                          &#8377;{item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="text-sm ">
                    {order.discountedPrice > 0 ? (
                      <>
                        <tr className="border-b border-dashed">
                          <td colSpan={2} className="py-2">
                            Sub Total Price:
                          </td>
                          <td className="py-2 text-right">
                            &#8377;{order.totalAmount.toFixed(2)}
                          </td>
                        </tr>
                        <tr className="border-b border-dashed">
                          <td colSpan={2} className="py-2">
                            Discount Price:
                          </td>
                          <td className="py-2 text-right">
                            - ₹{order.discount.toFixed(2)}
                          </td>
                        </tr>
                        <tr className="border-b border-dashed">
                          <td colSpan={2} className="py-2">
                            Total Price:
                          </td>
                          <td className="py-2 text-right">
                            ₹{order.discountedPrice.toFixed(2)}
                          </td>
                        </tr>
                      </>

                    )
                      : (
                        <tr>
                          <td colSpan={2} className="py-2 font-bold">
                            Total Price:
                          </td>
                          <td className="py-2 text-right font-bold">
                            &#8377;{order.totalAmount.toFixed(2)}
                          </td>

                        </tr>
                      )}

                  </tfoot>
                </table>
                <div className="flex flex-col items-center justify-center ">
                  <h3 className="font-bold text-sm">Scan QR</h3>
                  <div >
                    <img src={order.qrCode} alt="QR Code" className=" h-40 w-40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
