import React, { useEffect, useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import QRCode from 'qrcode';
import { useParams } from 'react-router-dom';
import { getAllProducts } from "../../../redux/slice/ProductSlice"
import { useDispatch, useSelector } from 'react-redux';
import { getOrder } from '@/redux/slice/OrderSlice';

function EditOrder() {
    // production code 

    const { id_edit_order } = useParams();
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [errors, setErrors] = useState({});
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        paymentMethod: "",
    });

    // Redux state for cart and products

    const { products } = useSelector((state) => state.products);

    // Fetch products data
    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    // Filter products based on search query
    const filteredOrders = products.filter((item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate total price
   

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setSelectedVariant(null);
        setSelectedAddons([]);
        setQuantity(1);
    };

    const increaseQuantity = () => setQuantity((prev) => prev + 1);
    const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    const closeModal = () => setSelectedProduct(null);

    const handleVariantChange = (variant) => setSelectedVariant(variant);

    const handleAddandSave = async () => {
        const variantData = selectedVariant
            ? { name: selectedVariant.name, price: selectedVariant.price }
            : null;

        const addonsData = selectedAddons.map((addon) => ({
            name: addon.name,
            price: addon.price,
        }));

        const totalPrice =
            (selectedProduct.price +
                (selectedVariant?.price || 0) +
                selectedAddons.reduce((acc, addon) => acc + addon.price, 0)) *
            quantity;

        const cartItemData = {
            id: selectedProduct._id,
            title: selectedProduct.name,
            image: selectedProduct.image,
            price: selectedProduct.price,
            variants: variantData,
            addons: addonsData,
            quantity,
            total: totalPrice,
        };

        if (id) {
            dispatch(updateCartItem({ id, updatedData: cartItemData }))
                .unwrap()
                .then(() => {
                    setNotification({
                        show: true,
                        message: "Cart item updated successfully!",
                        type: "success",
                    });
                })
                .catch(() => {
                    setNotification({
                        show: true,
                        message: "Failed to update cart item. Please try again.",
                        type: "error",
                    });
                });
        } else {
            dispatch(addCartItem(cartItemData))
                .unwrap()
                .then(() => {
                    setNotification({
                        show: true,
                        message: "Cart item added successfully!",
                        type: "success",
                    });
                })
                .catch(() => {
                    setNotification({
                        show: true,
                        message: "Failed to add item to cart. Please try again.",
                        type: "error",
                    });
                });
        }

        setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
        closeModal();
    };

    // Billing Code
    const { orderData, loading: orderLoading } = useSelector((state) => state.orders);
    useEffect(()=>{

        dispatch(getOrder(id_edit_order));
    },[])
    useEffect(() => {
        if (id_edit_order && orderData.length > 0) {
            const order = orderData.find((o) => o._id === id_edit_order);


            // Handle delete item confirmation
            const confirmDelete = (itemId) => {
                setDeleteItemId(itemId);
                setIsDeleteModalOpen(true);
            };

            const handleDeleteConfirmed = () => {
                dispatch(deleteCartItem(deleteItemId)).then(() => {
                    const updatedCartData = cartData.filter(item => item._id !== deleteItemId);
                    dispatch(getAllCartItems(updatedCartData)); // Update the cart data in the store
                    setIsDeleteModalOpen(false);
                    setDeleteItemId(null);
                }).catch((error) => {
                    console.error('Error deleting item:', error);
                });
            };

            // Handling input changes for user details
            const handleUserInputChange = () => {
                const { name, value } = e.target;
                // setUserDetails((prevDetails) => ({
                //     ...prevDetails,
                //     [name]: value,
                // }));
                setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
            };
            // Validate input fields
            const validateInputs = () => {
                const newErrors = {};
                if (!userDetails.firstName.trim()) newErrors.firstName = "First name is required.";
                if (!userDetails.phone.trim()) newErrors.phone = "Phone number is required.";
                if (!userDetails.email.trim()) newErrors.email = "Email is required.";
                return newErrors;
            };



            if (order) {
                setUserDetails({
                    firstName: order.customer.split(" ")[0] || "",
                    lastName: order.customer.split(" ")[1] || "",
                    email: order.email,
                    phone: order.customerId,
                    paymentMethod: order.isOnlineOrder ? "Online" : "Cash",
                });
            }
        }
    }, [id_edit_order, orderData]);


    const calculateTotalPrice = () => {
        return cartData.reduce((total, item) => {
            const itemBaseTotal = item.price * item.quantity;
            const variantsTotal = item.variants
                ? item.variants.reduce((sum, variant) => sum + (variant.price || 0), 0) * item.quantity
                : 0;
            const addonsTotal = item.addons
                ? item.addons.reduce((sum, addon) => sum + (addon.price || 0), 0) * item.quantity
                : 0;
            return total + itemBaseTotal + variantsTotal + addonsTotal;
        }, 0);
    };
    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDeleteItemId(null);
    };

    const handleCancelOrder = () => {
        setUserDetails({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            paymentMethod: "",
        });
        setNotification("Order canceled successfully!");
        setTimeout(() => setNotification(null), 3000);
    };

  return (
      <div className=" lg:flex gap-3 px-3 md:px-8">
        {/* production Section */}
        <div className="w-full lg:w-3/5">
              <div className="flex flex-wrap border">
                  <div className="bg-gray-50 shadow-sm mt-5 w-full">
                      <h2 className="text-xl font-semibold mb-6 text-gray-800">Product Section</h2>

                      {/* Search Bar */}
                      <div className="flex justify-center md:justify-between items-center mb-4">
                          <div className="relative w-full max-w-md">
                              <input
                                  type="text"
                                  placeholder="Search items here ..."
                                  className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-700 focus:ring focus:ring-[#e2b492] focus:outline-none"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                              />
                              <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
                          </div>
                      </div>

                      {/* Notification */}
                      {notification.show && (
                          <div
                              className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded shadow-md z-50 ${notification.type === "success"
                                  ? "bg-green-100 border border-green-400 text-green-700"
                                  : "bg-red-100 border border-red-400 text-red-700"
                                  }`}
                          >
                              {notification.message}
                          </div>
                      )}

                      {/* Product Grid */}
                      <div className="overflow-y-auto max-h-[75vh] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                          {filteredOrders.length > 0 ? (
                              filteredOrders.map((item) => (
                                  <div
                                      key={item._id}
                                      className="text-gray-700 bg-white hover:bg-[#e6cfbde1] hover:text-gray-800 transition duration-500 transform hover:scale-105 rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer hover:shadow-lg p-3"
                                      onClick={() => handleProductClick(item)}
                                  >
                                      <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-full h-28 object-cover mb-2 rounded-lg"
                                      />
                                      <hr className="border-slate-500 w-full my-2" />
                                      <h3 className="text-sm text-wrap font-medium truncate">{item.name}</h3>
                                      <p className="text-gray-500">₹{item.price.toFixed(2)}</p>
                                  </div>
                              ))
                          ) : (
                              <div className="col-span-2 sm:col-span-3 lg:col-span-4 flex justify-center items-center h-[50vh]">
                                  <p className="text-lg font-semibold text-gray-500">
                                      No items found. Try searching for something else.
                                  </p>
                              </div>
                          )}
                      </div>

                      {/* Modal */}
                      {selectedProduct && (

                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                              <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                                  {/* Close Button */}
                                  <button
                                      onClick={closeModal}
                                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                  >
                                      ✖
                                  </button>

                                  {/* Product Details */}
                                  <div className="flex flex-col items-start">
                                      <div className="flex gap-5 items-center">
                                          <img
                                              src={selectedProduct.image}
                                              alt={selectedProduct.name}
                                              className="w-32 h-32 object-cover rounded-md"
                                          />
                                          <h3 className="text-lg font-semibold text-gray-800">
                                              {selectedProduct.name}
                                          </h3>
                                      </div>

                                      {/* Variants */}
                                      <div className="my-4">
                                          <h2 className="text-lg font-semibold text-gray-800">Variants</h2>
                                          <div className="mt-2">
                                              {selectedProduct.variants?.map((variant) => (
                                                  <label key={variant._id} className="flex items-center mb-2">
                                                      <input
                                                          type="radio"
                                                          name="variant"
                                                          value={variant.name}
                                                          onChange={() => handleVariantChange(variant)}
                                                          checked={selectedVariant?.name === variant.name}
                                                          className="mr-2 w-5 h-5 border-gray-300 text-[#e2b492] focus:ring-[#e2b492]"
                                                      />
                                                      {variant.name} (+ ₹{variant.price.toFixed(2)})
                                                  </label>
                                              ))}
                                          </div>
                                      </div>

                                      {/* Addons */}
                                      <div className="my-4">
                                          <h2 className="text-lg font-semibold text-gray-800">Addons</h2>
                                          <div className="mt-2">
                                              {selectedProduct.addons?.map((addon) => (
                                                  <label key={addon._id} className="flex items-center mb-2">
                                                      <input
                                                          type="checkbox"
                                                          value={addon.price}
                                                          onChange={(e) => {
                                                              if (e.target.checked) {
                                                                  setSelectedAddons([
                                                                      ...selectedAddons,
                                                                      {
                                                                          ...addon,
                                                                          additionalPrice: parseFloat(addon.price),
                                                                      },
                                                                  ]);
                                                              } else {
                                                                  setSelectedAddons(
                                                                      selectedAddons.filter(
                                                                          (item) => item._id !== addon._id
                                                                      )
                                                                  );
                                                              }
                                                          }}
                                                          className="mr-2 w-5 h-5 border-gray-300 text-[#e2b492] focus:ring-[#e2b492]"
                                                      />
                                                      {addon.name} (+ ₹{addon.price.toFixed(2)})
                                                  </label>
                                              ))}
                                          </div>
                                      </div>

                                      {/* Quantity */}
                                      <div className="my-4">
                                          <h2 className="text-lg font-semibold text-gray-800">Quantity</h2>
                                          <div className="flex items-center space-x-4">
                                              <button
                                                  onClick={decreaseQuantity}
                                                  className="bg-gray-200 px-4 py-2 rounded-md"
                                              >
                                                  -
                                              </button>
                                              <span className="text-lg font-semibold">{quantity}</span>
                                              <button
                                                  onClick={increaseQuantity}
                                                  className="bg-gray-200 px-4 py-2 rounded-md"
                                              >
                                                  +
                                              </button>
                                          </div>
                                      </div>

                                      {/* Total Price */}
                                      <div className="my-4">
                                          <h2 className="text-lg font-semibold text-gray-800">Total Price</h2>
                                          <p className="text-lg font-semibold text-gray-800">
                                              ₹{calculateTotalPrice().toFixed(2)}
                                          </p>
                                      </div>

                                      {/* Add to Cart */}
                                      <button
                                          onClick={handleAddandSave}
                                          className="bg-[#e2b492] hover:bg-[#d89b7c] text-white font-semibold py-2 px-4 rounded-md mt-4 w-full"
                                      >
                                          {id ? "Save Changes" : "Add to Cart"}
                                      </button>
                                  </div>
                              </div>
                          </div>
                      )}


                  </div>
              </div>
        </div>

        {/* billing Section */}
        {/* <div className="w-full lg:w-2/5">
              <div className="w-full mt-10 px-3 sm:px-6 flex flex-col">
                  <h2 className="text-xl font-semibold mb-6 text-gray-800">Billing Section</h2>

                  {/* Notification */}
                  {/* {notification && (
                      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md z-50">
                          {notification}
                      </div>
                  )} */}

                  {/* Customer Details */}
                  {/* <div className="flex flex-col gap-6">
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
                                //   onChange={handleUserInputChange}
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
                                //   onChange={handleUserInputChange}
                              />
                          </div>
                      </div> */}

                      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col">
                              <label className="text-sm font-medium text-gray-900 mb-1">Email</label>
                              <input
                                  type="email"
                                  name="email"
                                  placeholder="Email"
                                  required
                                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                  value={userDetails.email}
                                //   onChange={handleUserInputChange}
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
                                //   onChange={handleUserInputChange}
                              />
                              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                          </div>
                      </div>
                  </div> */}

                  {/* {isDeleteModalOpen && (
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
                                    //   onClick={handleDeleteConfirmed}
                                  >
                                      Delete
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* Cart Section */}
                  {/* <div className="mt-12">
                      <h3 className="font-bold mb-2">Cart:</h3>
                      {cartData.length === 0 ? (
                          <p className="text-gray-600">Your cart is empty.</p>
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
                                              <td className="border border-gray-300 px-2 py-2">{id_edit_order ? item.productId : item.title}
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
                                              <td className="border border-gray-300 px-2 py-2">₹{item.price}</td>
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
                      <div className="max-w-[280px] flex justify-between mt-4">
                          <h3 className="font-bold text-gray-700 text-md">Total Price:</h3>
                          <p className="text-md font-semibold text-gray-600">₹{calculateTotalPrice().toFixed(2)}</p>
                      </div>
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
                      </div>
                  </div> */}

                  {/* Actions */}
                  {/* <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                      <button
                          onClick={handleCancelOrder}
                          className="border font-bold border-red-500 text-black px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white"
                      >
                          Cancel Order
                      </button>
                      <button
                          onClick={handlePlaceOrder}
                          className="bg-[#f3b587] font-bold text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                      >
                          Place Order
                      </button>
                  </div>
              </div> 
        </div>  */}

    </div>
  )
}

export default EditOrder