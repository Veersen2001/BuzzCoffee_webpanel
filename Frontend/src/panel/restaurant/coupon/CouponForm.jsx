import React, { useState } from "react";
import { Calendar, X, Clock } from "lucide-react";
import { useDispatch } from "react-redux";
import { addCoupon, updateCoupon } from "@/redux/slice/CouponSlice";

export default function CouponForm({ onClose, editingCoupon }) {
    const dispatch = useDispatch();

    // State for coupon data
    const [couponData, setCouponData] = useState({
        code: editingCoupon?.code || "",
        discount: editingCoupon?.discount || "",
        discountType: editingCoupon?.discountType || "%",
        startDate: editingCoupon?.startDate || "",
        endDate: editingCoupon?.endDate || "",
        startHour: editingCoupon?.startHour || "", // Start Hour
        endHour: editingCoupon?.endHour || "", // End Hour
        minimumPrice: editingCoupon?.minimumPrice || "",
        maximumOrder: editingCoupon?.maximumOrder || "",
        usageLimit: editingCoupon?.usageLimit || "",
        status: editingCoupon?.status ?? true,
    });

    // Function to generate a random coupon code
    const generateCouponCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "CoffeeBuzz";
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCouponData({ ...couponData, code });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCoupon) {
            dispatch(updateCoupon({ id: editingCoupon._id, updatedData: couponData }));
        } else {
            dispatch(addCoupon(couponData));
        }
        onClose();
    };

    return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-lg sm:max-w-xl md:max-w-2xl overflow-auto">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
                            {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} className="sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Coupon Code */}
                            <div className="space-y-2 ">
                                <label className="block text-sm sm:text-base font-medium text-gray-700">
                                    Coupon Code
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <input
                                        type="text"
                                        value={couponData.code}
                                        onChange={(e) =>
                                            setCouponData({ ...couponData, code: e.target.value })
                                        }
                                        className="flex-1 bg-white rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-sm"
                                        placeholder="Enter Coupon Code"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={generateCouponCode}
                                        className="bg-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>

                            {/* Discount */}
                            <div className="space-y-2">
                                <label className="block text-sm sm:text-base font-medium text-gray-700">
                                    Discount
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={couponData.discount}
                                        onChange={(e) =>
                                            setCouponData({ ...couponData, discount: e.target.value })
                                        }
                                        className="flex-1 bg-white rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-sm"
                                        placeholder="Enter Discount Amount"
                                        required
                                    />
                                    <select
                                        value={couponData.discountType}
                                        onChange={(e) =>
                                            setCouponData({ ...couponData, discountType: e.target.value })
                                        }
                                        className="rounded-md border bg-white border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-sm"
                                    >
                                        <option value="%">%</option>
                                        <option value="₹">₹</option>
                                    </select>
                                </div>
                            </div>

                            {/* Number of Users */}
                            <div className="space-y-2">
                                <label className="block text-sm sm:text-base font-medium text-gray-700">
                                Number of Usage Limit
                                </label>
                                <input
                                    type="number"
                                value={couponData.usageLimit}
                                    onChange={(e) =>
                                        setCouponData({ ...couponData, usageLimit: e.target.value })
                                    }
                                    className="w-full bg-white rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-sm"
                                    placeholder="Enter Number of Users"
                                />
                            </div>

                            {/* Dates and Times */}
                            <div className="space-y-2">
                                <label className="block text-sm sm:text-base font-medium text-gray-700">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={couponData.startDate}
                                        onChange={(e) =>
                                            setCouponData({ ...couponData, startDate: e.target.value })
                                        }
                                        className="w-full bg-white rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-sm"
                                    />
                                    <Calendar className="absolute right-3 top-2.5 sm:top-3 text-gray-400" size={16} />
                                </div>
                            </div>

                           
                            {/* End Date */}
                            <div className="space-y-2">
                            <label className="block text-sm sm:text-base font-medium text-gray-700">End Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={couponData.endDate}
                                        onChange={(e) =>
                                            setCouponData({ ...couponData, endDate: e.target.value })
                                        }
                                    className="w-full bg-white rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-sm"
                                    />
                                <Calendar className="absolute right-3 top-2.5 sm:top-3 text-gray-400" size={16} />
                                </div>
                            </div>

                            {/* Start Hour */}
                            <div className="space-y-2">
                            <label className="block text-sm sm:text-base font-medium text-gray-700">Start Hour</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        value={couponData.startHour}
                                        onChange={(e) =>
                                            setCouponData({ ...couponData, startHour: e.target.value })
                                        }
                                    className="w-full bg-white rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-sm"
                                    />
                                <Clock className="absolute right-3 top-2.5 sm:top-3 text-gray-400" size={16} />
                                </div>
                            </div>

                            {/* End Hour */}
                            <div className="space-y-2">
                            <label className="block text-sm sm:text-base font-medium text-gray-700">End Hour</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        value={couponData.endHour}
                                        onChange={(e) =>
                                            setCouponData({ ...couponData, endHour: e.target.value })
                                        }
                                    className="w-full bg-white rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-sm"
                                    />
                                <Clock className="absolute right-3 top-2.5 sm:top-3 text-gray-400" size={16} />
                                </div>
                            </div>

                            {/* Status Toggle */}
                            <div className="col-span-2">
                                <label className="flex flex-wrap items-center justify-between space-x-2">
                                <span className="block text-sm sm:text-base font-medium text-gray-700">Status</span>
                                    <div
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${couponData.status ? "bg-blue-500" : "bg-gray-200"
                                            }`}
                                        onClick={() =>
                                            setCouponData({ ...couponData, status: !couponData.status })
                                        }
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${couponData.status ? "translate-x-6" : "translate-x-1"
                                                }`}
                                        />
                                    </div>
                                </label>
                            </div>
                            <h3 className="text-gray-400 w-full mt-0">If you enable coupon code , then please turn on this button.</h3>
                        </div>




                        <div className="mt-4 sm:mt-6">
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-blue-600 text-sm sm:text-base"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>

      




        
    );
}


