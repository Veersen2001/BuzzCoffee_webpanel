import axios from "axios";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "../orders/Pagination";
import AddonsTable from "./AddonsTable";
const API_URL = import.meta.env.VITE_API_BASE_URL;
function Addons() {
  const [addons, setAddons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); 

  const itemsPerPage = 5;
  const navigate = useNavigate();
  const startIndex = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = async () => {
    try {
      const response = await axios.get(`${API_URL}/adons`);
      setAddons(response.data);
    } catch (error) {
      console.error("Error fetching addons:", error);
    }
  };

 

  // Function to handle delete confirmation
  const confirmDelete = (id) => {
    setDeleteItemId(id);
    setIsDeleteModalOpen(true); // Open the confirmation dialog
  };

  // Function to delete item after confirmation
  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`${API_URL}/adons/${deleteItemId}`);
      setAddons((prevAddons) =>
        prevAddons.filter((addon) => addon._id !== deleteItemId)
      );
      setIsDeleteModalOpen(false); // Close the dialog
    } catch (error) {
      console.error("Error deleting addon:", error);
      setIsDeleteModalOpen(false);
    }
  };

  // Function to cancel the delete operation
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteItemId(null);
  };

  const handleEdit = (addon) => {
    setModalData(addon);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setModalData({
      id: null,
      name: "",
      price: "",
      categories: [],
      status: "Active",
    });
    setIsModalOpen(true);
  };

  

  const handleSave = async (data) => {
    try {
      // Check if the item with the same name already exists
      const duplicate = addons.find(
        (addon) => addon.name.toLowerCase() === data.name.toLowerCase() && addon._id !== data.id
      );

      if (duplicate) {
        setErrorMessage("Item is already present."); // Set the error message
        setTimeout(() => {
          setErrorMessage(""); // Clear the message after 3 seconds
        }, 3000);
        return; // Exit the function to prevent saving the duplicate
      }

      if (data.id) {
        // Update existing record
        const response = await axios.put(`${API_URL}/adons/${data.id}`, data);
        setAddons((prev) =>
          prev.map((addon) => (addon._id === data.id ? response.data : addon))
        );
      } else {
        // Create a new record
        const response = await axios.post(`${API_URL}/adons`, data);
        setAddons((prev) => [...prev, response.data]);
      }

      setIsModalOpen(false); // Close the modal after saving
      setErrorMessage(""); // Clear any error messages after successful save
    } catch (error) {
      console.error("Error saving addon:", error);
      setErrorMessage("Failed to save the item."); // Display a generic error message
      setTimeout(() => {
        setErrorMessage(""); // Clear the message after 3 seconds
      }, 3000);
    }
  };

  const filOrders = addons.filter((addon) =>
    addon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filOrders.length / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-xl font-semibold mb-5">Manage Add-Ons</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Item Title"
            className="pl-10 pr-4 py-2 border rounded-md bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5">🔍</span>
        </div>
      </div>
      <div className="flex items-end justify-end w-full">
        <button
          className="w-auto mb-5 flex items-center justify-center gap-2 bg-[#e2b492] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleAddNew}
        >
          <Plus className="h-5 w-5" />
          Add New
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
              {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Categories
              </th> */}
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {errorMessage && (
              <div className="fixed top-10 right-10 bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded shadow-md">
                <p>{errorMessage}</p>
              </div>
            )}
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

            {filOrders
              .slice(startIndex, startIndex + itemsPerPage)
              .map((addon, index) => (
                <tr key={addon._id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="font-semibold text-wrap">{addon.name}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    &#8377;{addon.price.toFixed(2)}
                  </td>
                  {/* <td className="px-4 py-3 whitespace-nowrap">
                    {addon.categories.join(", ")}
                  </td> */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      className="text-blue-600 border p-1 border-blue-500 rounded-sm hover:text-blue-900 mr-4"
                      onClick={() => handleEdit(addon)}
                    >
                      <FaPen />
                    </button>
                    <button
                      className="text-red-600 border p-1 border-red-500 rounded-sm hover:text-red-900"
                      onClick={() => confirmDelete(addon._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
       
        {isModalOpen && (
          <AddonsTable
            data={modalData}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Addons;
