import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addCartItem, updateCartItem } from "../../../redux/slice/CartSlice";
import { getAllProducts } from "../../../redux/slice/ProductSlice";

// Notification Component
const Notification = ({ message, type }) => (
    <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded shadow-md z-50 ${type === "success"
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
    >
        {message}
    </div>
);

// Product Grid Component
const ProductGrid = ({ products, handleProductClick }) => (
    <div className="overflow-y-auto max-h-[75vh] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {products.length > 0 ? (
            products.map((item) => (
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
);

function ProductSection() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "",
    });

    const { products } = useSelector((state) => state.products);
    const { cartData, loading: cartLoading } = useSelector((state) => state.cart);

    // Fetch products and handle editing if an ID is provided
    useEffect(() => {
        dispatch(getAllProducts());
        if (id) {
            const cartItem = cartData.find((cart) => cart._id === id);
            const product = products.find((product) => product._id === cartItem.productId);

            if (cartItem && product) {
                setSelectedProduct({
                    ...product,
                    quantity: cartItem.quantity,
                    total: cartItem.totalPrice,
                });
                // const cartVariant = cartItem.variants.map((vari) => (vari.name))
                setSelectedVariant(cartItem.variants|| null);
                setSelectedAddons(cartItem.addons || []);
                setQuantity(cartItem.quantity);
            }
        }
    }, [dispatch, id]);

    // Filter products based on search query
    const filteredOrders = products.filter((item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate total price
    const calculateTotalPrice = () => {
        const variantPrice = selectedVariant?.price || 0;
        const addonsPrice = selectedAddons.reduce((acc, addon) => acc + addon.price, 0);
        return (selectedProduct.price + variantPrice + addonsPrice) * quantity;
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setSelectedVariant(null);
        setSelectedAddons([]);
        setQuantity(1);
    };

    const increaseQuantity = () => setQuantity((prev) => Math.min(prev + 1, 99));
    const decreaseQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

    const closeModal = () => {
        setSelectedProduct(null);
        setTimeout(() => navigate("/restaurant/pos/all"));
    };

    const handleVariantChange = (variant) => setSelectedVariant(variant);

    const handleAddandSave = async () => {
        const addonsData = selectedAddons.map((addon) => ({
            name: addon.name,
            price: addon.price,
        }));

        const cartItemData = {
            productId: selectedProduct._id,
            title: selectedProduct.name,
            image: selectedProduct.image,
            price: selectedProduct.price,
            variants: selectedVariant,
            addons: addonsData,
            quantity,
            total: calculateTotalPrice(),
        };
          console.log(cartItemData);
          
        try {
            if (id) {
                await dispatch(updateCartItem({ id: id, updatedData: cartItemData })).unwrap();
                setNotification({
                    show: true,
                    message: "Cart item updated successfully!",
                    type: "success",
                });
            } else {
                await dispatch(addCartItem(cartItemData)).unwrap();
                setNotification({
                    show: true,
                    message: "Cart item added successfully!",
                    type: "success",
                });
            }
            setTimeout(() => navigate("/restaurant/pos/all"), 1000);
        } catch (error) {
            setNotification({
                show: true,
                message: "Failed to process the request. Please try again.",
                type: "error",
            });
        }

        setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
        closeModal();
    };

    return (
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
                    <Notification message={notification.message} type={notification.type} />
                )}

                {/* Product Grid */}
                <ProductGrid products={filteredOrders} handleProductClick={handleProductClick} />

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
                                        {selectedProduct.variants.map((variant) => (
                                            <label key={variant._id} className="flex items-center mb-2">
                                                <input
                                                    type="radio"
                                                    name="variant"
                                                    value={variant.name}
                                                    onChange={() => handleVariantChange(variant)}
                                                    defaultChecked={
                                                        id? selectedVariant:
                                                        selectedVariant?.name === variant.name
                                                    }
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
                                        {selectedProduct.addons.map((addon) => (
                                            <label key={addon._id} className="flex items-center mb-2">
                                                <input
                                                    type="checkbox"
                                                    value={addon.name}
                                                    onChange={() => {
                                                        const isSelected = selectedAddons.some(
                                                            (item) => item.name === addon.name
                                                        );
                                                        if (isSelected) {
                                                            setSelectedAddons((prev) =>
                                                                prev.filter((item) => item.name !== addon.name)
                                                            );
                                                        } else {
                                                            setSelectedAddons((prev) => [...prev, addon]);
                                                        }
                                                    }}
                                                    defaultChecked={selectedAddons.some(
                                                        (item) => item.name === addon.name
                                                    )}
                                                    className="mr-2 w-5 h-5 border-gray-300 text-[#e2b492] focus:ring-[#e2b492]"
                                                />
                                                {addon.name} (+ ₹{addon.price.toFixed(2)})
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity and Total */}
                                <div className="flex items-center justify-between w-full my-4">
                                    <div className="flex items-center">
                                        <button
                                            onClick={decreaseQuantity}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-l-md"
                                        >
                                            -
                                        </button>
                                        <span className="text-lg px-3 font-semibold">{quantity}</span>
                                        <button
                                            onClick={increaseQuantity}
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-r-md"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <h2 className="text-lg font-semibold ml-3 text-gray-800">
                                        Total: ₹{calculateTotalPrice().toFixed(2)}
                                    </h2>
                                </div>

                                {/* Add/Update Button */}
                                <button
                                    onClick={handleAddandSave}
                                    className="w-full bg-[#e2b492] text-white hover:bg-[#d3a683] font-semibold py-2 px-4 rounded-md"
                                >
                                    {id ? "Update Item" : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductSection;
