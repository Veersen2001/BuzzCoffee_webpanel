import React, { useEffect, useMemo, useState } from 'react';
import { Edit, ChevronDown, Search, Plus, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPen, FaTrash } from "react-icons/fa";
import { deleteCoupon, getAllCoupons } from '../../../redux/slice/CouponSlice';
import Pagination from '../orders/Pagination';


export default function CouponList({ onEdit, onAddNew }) {
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const dispatch = useDispatch();
    const { couponData, loading } = useSelector((state) => state.coupon);

    useEffect(() => {
        dispatch(getAllCoupons());
    }, [dispatch]);
    console.log(couponData);
    

    const filteredCoupon = useMemo(() => {

        // Filter orders based on search query
        const filterItem = couponData.filter(
            (coupon) =>
                coupon.code.includes(searchTerm.toLowerCase())
        );
        // Sort filtered orders in descending order based on orderId
        return filterItem.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [searchTerm, couponData]);

    const totalPages = Math.ceil(filteredCoupon.length / itemsPerPage);
    const paginatedCoupon = filteredCoupon.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    // console.log(couponData);

    // Delete confirmation logic
    const confirmDelete = (id) => {
        setDeleteItemId(id);
        setIsDeleteModalOpen(true); // Open the confirmation dialog
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setDeleteItemId(null);
    };

    const handleDeleteConfirmed = async () => {
        try {
            // Dispatch the delete action
            await dispatch(deleteCoupon(deleteItemId));
            // Close the delete modal
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting coupon:", error);
            setIsDeleteModalOpen(false);
        }
    };



    if (loading) return <p>Loading...</p>;
    return (
        <div className="bg-white rounded-lg max-w-[92vw] md:w-full shadow-md md:p-6 md:mt-6 p-4">
            <h1 className=" md:text-2xl text-md font-bold">Coupon List</h1>
            <div className="flex justify-between items-center mb-6">
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="relative">
                        <Search
                            className="absolute bg-white left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search Coupon..."
                            className="pl-10 pr-4 py-2 bg-white border rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    onClick={onAddNew}
                    className="bg-[#f4b88a] font-bold text-white md:px-4 md:py-2 text-nowrap px-2 py-2 rounded-md flex items-center md:gap-2"
                >
                    <Plus className="font-bold" size={20} />
                    Add New
                </button>
            </div>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white  p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
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
            {/* Add horizontal scrolling for smaller devices */}

            <div className="overflow-x-auto ">
                <table className="w-full ">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                NO.
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                COUPON CODE
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                VALID HOURS
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                START DATE
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                EXPIRY DATE
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                USAGE LIMIT
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                STATUS
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ACTION
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedCoupon.map((coupon, index) => (
                            <tr key={coupon._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {coupon.code}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {coupon.startHour && coupon.endHour ? (
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} className="text-gray-400" />
                                            {coupon.startHour} - {coupon.endHour}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">All Day</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {coupon.startDate || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {coupon.endDate || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {coupon.usageLimit || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.status
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {coupon.status ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <button
                                        className="text-blue-600 border p-1 border-blue-500 rounded-sm hover:text-blue-900 mr-4"
                                        onClick={() => onEdit(coupon)}
                                    >
                                        <FaPen />
                                    </button>
                                    <button
                                        className="text-red-600 border p-1 border-red-500 rounded-sm hover:text-red-900"
                                        onClick={() => confirmDelete(coupon._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
           
        </div>




    );
}