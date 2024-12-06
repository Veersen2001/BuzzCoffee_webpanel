import React, { useEffect, useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import QRCode from 'qrcode';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllCartItems,
    deleteCartItem,
    deleteAllCartItems,
} from "../../../redux/slice/CartSlice";
// Adjust the path based on your project structure
import { createOrder, getOrder } from "../../../redux/slice/OrderSlice";
import { applyCoupon,resetDiscount} from "../../../redux/slice/CouponSlice";
import { toast } from "react-hot-toast";




function BillingSection() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id_edit_order } = useParams(); // Get the order ID from URL params
    const [notification, setNotification] = useState(null);
    const [errors, setErrors] = useState({});
    const [couponCode, setCouponCode] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [isNewOrder, setIsNewOrder] = useState(!id_edit_order);
    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        paymentMethod: "",
    });

    const { cartData, loading: cartLoading } = useSelector((state) => state.cart);
    const { orderData, loading: orderLoading } = useSelector((state) => state.orders);
    const { couponData, discountedPrice,discount, loading, error } = useSelector((state) => state.coupon);
    // Fetching order and cart data when editing
    
    
    
    useEffect(() => {
        if (id_edit_order) {

            dispatch(getOrder(id_edit_order));
        }
        //   dispatch(deleteAllCartItems())
        // Fetch the cart data if no order ID is provided


    }, [dispatch, id_edit_order]);


    const handleApplyCoupon = async () => {
        if (!couponCode) {
            toast.error("Please enter a coupon code.");
            return;
        }
        try {
            // Dispatch the applyCoupon action to apply the coupon and get the discount
            const price = calculateTotalPrice();
            await dispatch(applyCoupon({ couponCode, price }));
            if (error) {
                toast.error(error);
            } else if (price === 0) {
                toast.success("Coupon applied! Price is now zero.");
            } else {
                toast.success("Coupon applied successfully!");
            }
        } catch (err) {
            toast.error("Failed to apply coupon");
        }
    };

    // Update user details if an order is being edited
    useEffect(() => {
        if (id_edit_order && orderData.length > 0) {
            const order = orderData.find((o) => o._id === id_edit_order);
            if (order) {
                setUserDetails({
                    firstName: order.customer.split(" ")[0] || "",
                    lastName: order.customer.split(" ")[1] || "",
                    email: order.email,
                    phone: order.customerId,
                    paymentMethod: order.isOnlineOrder ? "Online" : "Cash",
                });
            }
            else {
                setUserDetails({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    paymentMethod: "",
                });
            }
        }
    }, [id_edit_order]);

    // Handle delete item confirmation
    const confirmDelete = (itemId) => {
        setDeleteItemId(itemId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = () => {
        dispatch(deleteCartItem(deleteItemId))

      // Update the cart data in the store
        setIsDeleteModalOpen(false);
        setDeleteItemId(null);
        dispatch(resetDiscount());

    };

    // Handling input changes for user details
    const handleUserInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    // Validate input fields
    const validateInputs = () => {
        const newErrors = {};
        if (!userDetails.firstName.trim())
            newErrors.firstName = "First name is required.";
        if (!userDetails.phone.trim())
            newErrors.phone = "Phone number is required.";
        if (!userDetails.email.trim()) newErrors.email = "Email is required.";
        if ((id_edit_order ? orderData.length : cartData.length) === 0)
            newErrors.cart = "Cart item is empty.";
        if (!userDetails.paymentMethod)
            newErrors.paymentMethod = "Payment method is not selected.";
        return newErrors;
    };

    // Place the order
    console.log(cartData);


    const handlePlaceOrder = async () => {
        const validationErrors = validateInputs();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const orderId = id_edit_order? id_edit_order: `ORD-${Date.now() + 1}`
        // Use existing ID or create a new one

        const items = id_edit_order ? orderData.find((o) => o._id === id_edit_order).items : cartData;


        // const totalAmount = discountedPrice? discountedPrice : items.reduce((sum, item) => sum + item.total, 0);
        const qrContent = JSON.stringify({

            totalPrice,
            customer: `${userDetails.firstName} ${userDetails.lastName}`,
        });

        try {
            const generatedQRCode = await QRCode.toDataURL(qrContent);
            

            const orderDetails = {
                 orderId:orderId,
                customerId: userDetails.phone || "Unknown",
                email: userDetails.email,
                items: cartData.map((item) => ({
                    productId: item.productId,
                    title:item.title,
                    quantity: item.quantity,
                    image: item.image,
                    price: item.total,
                    
                    variants: item.variants,
                    addons: item.addons,
                })),
                // cartId:cartData._id, 
                 discountedPrice:discountedPrice,
                discount:discount,
                totalAmount:calculateTotalPrice(),
                orderStatus: "processing",
                orderDate: new Date(),
                deliveryDate: userDetails.deliveryDate || "",
                timeSlot: userDetails.timeSlot || null,
                customer: `${userDetails.firstName} ${userDetails.lastName}`,
                isOnlineOrder: userDetails.paymentMethod === "Online",
                qrCode: generatedQRCode,
            };
            if (id_edit_order) {
                // Update existing order logic (if you have an update order API)
                await dispatch(createOrder({ ...orderDetails, _id: id_edit_order }));
            } else {
                await dispatch(createOrder(orderDetails));
            }

            setNotification(
                id_edit_order
                    ? "Order updated successfully!"
                    : "Order placed successfully!"
            );


            // Reset the cart and local states
            dispatch(deleteAllCartItems()); // Clear all cart items from the store

            setUserDetails({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                paymentMethod: "",
            });
            // Reset the discount and coupon states
            dispatch(resetDiscount());
            setCouponCode(""); // Clear the applied coupon code if any

            setTimeout(() => setNotification(null), 3000);
            // if(!id_edit_order){

            //     setUserDetails({
            //         firstName: "",
            //         lastName: "",
            //         email: "",
            //         phone: "",
            //         paymentMethod: "",
            //     });
            // }

        } catch (error) {
            console.error("Error placing/updating order:", error);
            setNotification("Failed to place/update the order. Please try again.");
        }
    };



    // Calculate total price
    const calculateTotalPrice = () => {
       const total = cartData.reduce((total, item) => {
            const itemBaseTotal = item.price * item.quantity;
            const variantsTotal = item.variants
                ? item.variants.reduce((sum, variant) => sum + (variant.price || 0), 0) * item.quantity
                : 0;
            const addonsTotal = item.addons
                ? item.addons.reduce((sum, addon) => sum + (addon.price || 0), 0) * item.quantity
                : 0;
            return total + itemBaseTotal + variantsTotal + addonsTotal ;
        },0);
        return total;


    };
   
    const totalPrice = discountedPrice ? discountedPrice : calculateTotalPrice();
    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDeleteItemId(null);
    };

    const handleCancelOrder = () => {
        dispatch(deleteAllCartItems());
        setUserDetails({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            paymentMethod: "",
        });
         setCouponCode("");
        // Reset the discount and coupon states
        dispatch(resetDiscount());
        setNotification("Order Reset successfully!");
        setTimeout(() => setNotification(null), 3000);
    };
    const handleEditClick = (id) => {
        navigate(`/restaurant/pos/edit_cart/${id}`); // Pass the item ID to the EditMenu component
    };

    return (
        <div className="w-full mt-10 px-3 sm:px-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Billing Section</h2>

            {/* Notification */}
            {notification && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md z-50">
                    {notification}
                </div>
            )}

            {/* Customer Details */}
            <div className="flex flex-col gap-6">
                <h3 className="font-bold">Customer Details:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-900 mb-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            required
                            placeholder="First name"
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                            value={userDetails.firstName}
                            onChange={handleUserInputChange}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-900 mb-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                            value={userDetails.lastName}
                            onChange={handleUserInputChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-900 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                            value={userDetails.email}
                            onChange={handleUserInputChange}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-900 mb-1">Phone</label>
                        <input
                            type="number"
                            name="phone"
                            placeholder="Phone"
                            required
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                            value={userDetails.phone}
                            onChange={handleUserInputChange}
                        />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>
                </div>
            </div>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p>Are you sure you want to delete this item?</p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={handleDeleteConfirmed}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Section */}
            <div className="mt-12">
                <h3 className="font-bold mb-2">Cart:</h3>


                {errors.cart && <p className="text-red-500 text-sm">{errors.cart}</p>}
                {cartData.length === 0 ? (
                   <p className='text-gray-400'>No Cart Item added</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border-collapse border-gray-300 text-sm">
                            <thead className="bg-[#ffd3b252]">
                                <tr>
                                    <th className="border border-gray-300 px-2 py-2">Image</th>
                                    <th className="border border-gray-300 px-2 py-2">Title</th>
                                    <th className="border border-gray-300 px-2 py-2">Qty</th>
                                    <th className="border border-gray-300 px-2 py-2">Price</th>
                                    <th className="border border-gray-300 px-2 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartData.map((item) => (
                                    <tr key={item._id}>
                                        <td className="border border-gray-300 px-2 py-2">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        </td>
                                        <td className="border border-gray-300 px-2 py-2">{item.title}
                                            <br />
                                            {item.variants?.length > 0 && (
                                                <div className="">
                                                    <span className='font-bold text-sm'>Variants:</span>
                                                    {item.variants.map((variant, idx) => (
                                                        <span key={idx} className='text-sm ml-1 text-gray-600'>
                                                            {variant.name}
                                                        </span>
                                                    ))}

                                                </div>
                                            )}

                                            {item.addons?.length > 0 && (
                                                <div className="">
                                                    <span className='font-bold text-sm'>Addons:</span>

                                                    {item.addons.map((addon, idx) => (
                                                        <span className='text-sm text-gray-400' key={idx}>
                                                            {addon.name},
                                                        </span>
                                                    ))}

                                                </div>
                                            )}


                                        </td>
                                        <td className="border border-gray-300 text-center px-2 py-2">{item.quantity}</td>
                                        <td className="border border-gray-300 px-2 py-2">₹{item.total}</td>
                                        <td className="border border-gray-300 px-5 py-2">
                                            <div className="flex items-center justify-between gap-3">
                                                <button
                                                    onClick={() => handleEditClick(item._id)}
                                                    className="text-blue-500 border p-1 border-blue-500 rounded-sm hover:text-blue-800"
                                                >
                                                    <FaPen className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(item._id)}
                                                    className="text-red-500 border p-1 border-red-500 rounded-sm hover:text-red-800"
                                                >
                                                    <FaTrash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                              
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Coupon Code Input */}
                <div className="flex flex-col gap-4 mt-6">
                    
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                            onClick={handleApplyCoupon}
                        >
                            Apply
                        </button>
                    </div>
                </div>

                
                {discountedPrice ? ( 
                <>   
                <div className="max-w-[280px] flex justify-between mt-4">
                    <h3 className="font-bold text-gray-700 text-md">Sub Total Price:</h3>
                    <p className="text-md font-semibold text-gray-600">₹{calculateTotalPrice().toFixed(2)}</p>
                </div>
                <div className="max-w-[280px] flex justify-between mt-4">
                    <h3 className="font-bold text-gray-700 text-md">Discount Price:</h3>
                    <p className="text-md font-semibold text-gray-600">- ₹{discount.toFixed(2)}</p>
                </div>
                        <div className="max-w-[280px] flex justify-between mt-4">
                            <h3 className="font-bold text-gray-700 text-md">Total Price:</h3>
                            <p className="text-md font-semibold text-gray-600">₹{totalPrice.toFixed(2)}</p>
                        </div>
                </>
                ):(
                    <div className="max-w-[280px] flex justify-between mt-4">
                        <h3 className="font-bold text-gray-700 text-md">Total Price:</h3>
                        <p className="text-md font-semibold text-gray-600">₹{calculateTotalPrice().toFixed(2)}</p>
                    </div>
                
                )}
            </div>

            <div className="payment-method mt-5">
                <label className="text-sm font-bold text-black">Payment Method:</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    <button
                        className={`text-blue-500 border-2 rounded-sm px-3 py-1 border-slate-300 ${userDetails.paymentMethod === 'Cash' ? 'bg-blue-500 text-white ' : ''
                            }`}
                        onClick={() => setUserDetails({ ...userDetails, paymentMethod: 'Cash' })}
                    >
                        Cash
                    </button>
                    <button
                        className={`text-green-500 border-2 px-3 py-1 rounded-sm border-slate-300 ${userDetails.paymentMethod === 'Online' ? 'bg-green-600 text-white' : ''
                            }`}
                        onClick={() => setUserDetails({ ...userDetails, paymentMethod: 'Online' })}
                    >
                        Online
                    </button>
                    {errors.paymentMethod && (
                        <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
                    )}
                </div>
            </div>


            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                <button
                    onClick={handleCancelOrder}
                    className="border font-bold border-red-500 text-black px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white"
                >
                    Reset All
                </button>
                <button
                    onClick={handlePlaceOrder}
                    className="bg-[#f3b587] font-bold text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                    {id_edit_order ? "Update Order" : "Place Order"}
                </button>
            </div>
        </div>

    );
}
export default BillingSection;