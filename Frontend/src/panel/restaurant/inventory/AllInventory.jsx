import { useEffect, useMemo, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "../orders/Pagination";
const API_URL = import.meta.env.VITE_API_BASE_URL;

function AllInventory() {
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  useEffect(() => {
    // Fetch items from the backend
    const fetchItems = async () => {
      try {
        const response = await fetch(`${API_URL}/items`);
        const data = await response.json();
        
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);


  const filteredItems = useMemo(() => {
    
    // Filter orders based on search query
    const filterItem = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Sort filtered orders in descending order based on orderId
    return filterItem.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [searchTerm ,items]);

  // Filter items based on search term
  
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Get paginated items
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Function to handle delete confirmation
  const confirmDelete = (id) => {
    setDeleteItemId(id);
    setIsDeleteModalOpen(true); // Open the confirmation dialog
  };
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteItemId(null);
  };

  // Delete item
  const handleDeleteConfirmed = async () => {
    try {
      const response = await fetch(`${API_URL}/items/${deleteItemId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setItems((prevItems) => prevItems.filter((item) => item._id !== deleteItemId));
        setIsDeleteModalOpen(false);
      } else {
        console.error("Failed to delete item");
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      setIsDeleteModalOpen(false);
    }
  };

  // Edit or Add item
  const handleEditOrAdd = (id) => {
    if (id) {
      navigate(`/restaurant/inventory/editmenu/${id}`); // Pass the item ID to the EditMenu component
    } else {
      navigate(`/restaurant/inventory/addmenu`); // Navigate to AddMenu component
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-xl font-semibold mb-3">Menu Item</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Item Name"
            className="pl-10 pr-4 py-2 border rounded-md bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5">🔍</span>
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md"
          onClick={() => handleEditOrAdd()}
        >
          Add New Item
        </button>
      </div>

      <div className="">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                SL
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Item
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isDeleteModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg">
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
            {paginatedItems.map((item, index) => (
              <tr key={item._id}>
                {/* Index */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>

                {/* Item with Image */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    ) : (
                      "N/A"
                    )}
                    <p className="font-semibold text-wrap">{item.name}</p>
                  </div>
                </td>

                {/* Price */}
                <td className="px-4 py-3 whitespace-nowrap">
                  &#8377;{item.price.toFixed(2)}
                </td>

                {/* Action Buttons */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <button
                    className="text-blue-600 border p-1 border-blue-500 rounded-sm hover:text-blue-900 mr-4"
                    onClick={() => handleEditOrAdd(item._id)}
                  >
                    <FaPen />
                  </button>
                  <button
                    className="text-red-600 border p-1 border-red-500 rounded-sm hover:text-red-900"
                    onClick={() => confirmDelete(item._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default AllInventory;
