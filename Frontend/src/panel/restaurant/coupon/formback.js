import React, { useEffect, useState } from 'react';
import { Calendar, X, Clock } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addCoupon } from '@/redux/slice/CouponSlice';


export default function Form({ onClose, editingCoupon }) {

    const dispatch =  useDispatch()
    // const [couponData, setCouponData] = useState({});
    
    const couponData = {
          code: editingCoupon?.code || '',
          discount: editingCoupon?.discount || '',
          discountType: editingCoupon?.discountType || '%',
          startDate: editingCoupon?.startDate || '',
          endDate: editingCoupon?.endDate || '',
          startHour: editingCoupon?.startHour || '',
          endHour: editingCoupon?.endHour || '',
          minimumPrice: editingCoupon?.minimumPrice || '',
          maximumOrder: editingCoupon?.maximumOrder || '',
          status: editingCoupon?.status ?? true
      }
    console.log(couponData);
    
        dispatch(addCoupon(couponData));
    

    const generateCouponCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'CoffeeBuzz';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCouponData({ ...couponData, code });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCoupon) {
            updateCoupon(editingCoupon.id, couponData);
        } else {
            dispatch(addCoupon(couponData));
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Coupon Information</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-6">
                        {/* Coupon Code */}
                        <div className="space-y-2 ">
                            <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponData.code}
                                    onChange={(e) => setCouponData({ ...couponData, code: e.target.value })}
                                    className="flex-1 bg-white rounded-md border border-gray-300 px-3 py-2"
                                    placeholder="Enter Coupon Code"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={generateCouponCode}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>

                        {/* Discount Amount */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Discount Amount</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={couponData.discount}
                                    onChange={(e) => setCouponData({ ...couponData, discount: e.target.value })}
                                    className="flex-1 bg-white rounded-md border border-gray-300 px-3 py-2"
                                    placeholder="Enter Discount Amount"
                                    required
                                />
                                <select
                                    value={couponData.discountType}
                                    onChange={(e) => setCouponData({ ...couponData, discountType: e.target.value })}
                                    className="rounded-md border bg-white border-gray-300 px-3 py-2"
                                >
                                    <option value="%">%</option>
                                    <option value="$">$</option>
                                </select>
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={couponData.startDate}
                                    onChange={(e) => setCouponData({ ...couponData, startDate: e.target.value })}
                                    className="w-full bg-white rounded-md border border-gray-300 px-3 py-2"
                                    required
                                />
                                <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={couponData.endDate}
                                    onChange={(e) => setCouponData({ ...couponData, endDate: e.target.value })}
                                    className="w-full bg-white rounded-md border border-gray-300 px-3 py-2"
                                    required
                                />
                                <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
                            </div>
                        </div>

                        {/* Hour Range */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Valid Hours</label>
                            <div className="flex gap-2 items-center">
                                <div className="relative flex-1">
                                    <input
                                        type="time"
                                        value={couponData.startHour}
                                        onChange={(e) => setCouponData({ ...couponData, startHour: e.target.value })}
                                        className="w-full bg-white rounded-md border border-gray-300 px-3 py-2"
                                    />
                                    <Clock className="absolute right-3 top-2.5 text-gray-400" size={20} />
                                </div>
                                <span className="text-gray-500">to</span>
                                <div className="relative flex-1">
                                    <input
                                        type="time"
                                        value={couponData.endHour}
                                        onChange={(e) => setCouponData({ ...couponData, endHour: e.target.value })}
                                        className="w-full bg-white rounded-md border border-gray-300 px-3 py-2"
                                    />
                                    <Clock className="absolute right-3 top-2.5 text-gray-400" size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Minimum Price</label>
                            <input
                                type="number"
                                value={couponData.minimumPrice}
                                onChange={(e) => setCouponData({ ...couponData, minimumPrice: e.target.value })}
                                className="w-full bg-white rounded-md border border-gray-300 px-3 py-2"
                                placeholder="Enter Minimum Price"
                            />
                        </div>
                        {/* Price Range */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Minimum Price</label>
                            <input
                                type="number"
                                value={couponData.minimumPrice}
                                onChange={(e) => setCouponData({ ...couponData, minimumPrice: e.target.value })}
                                className="w-full bg-white rounded-md border border-gray-300 px-3 py-2"
                                placeholder="Enter Minimum Price"
                            />
                        </div>

                        {/* Status Toggle */}
                        <div className="col-span-2">
                            <label className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700">Status</span>
                                <div
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${couponData.status ? 'bg-blue-500' : 'bg-gray-200'
                                        }`}
                                    onClick={() => setCouponData({ ...couponData, status: !couponData.status })}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${couponData.status ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </div>
                            </label>
                            <p className="text-sm text-gray-500 mt-1">
                                If you enable coupon code, then please turn on this button.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}