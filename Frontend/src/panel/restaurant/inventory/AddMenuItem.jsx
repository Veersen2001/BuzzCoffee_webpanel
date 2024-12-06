import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v2/dp2fmxjfb/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "menu-item"; // Replace with your upload preset
const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/dp2fmxjfb/image/upload/v1640995067/default_image.jpg"; // Replace with your default image URL

// Cloud SVG Component


function AddMenuItem() {
  const {id} = useParams();
  const [hasVariant, setHasVariant] = useState(false);
  const [menuItem, setMenuItem] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    stock: 0,
    isActive: true,
    variants: [{ name: "", price: "" }],
    addons: [],
  });
  const [notification, setNotification] = useState({ show: false, message: "", type: "" }); // Notification state
  const categories = [
    { value: "extra cheese", label: "Extra Cheese" },
    { value: "butter", label: "Butter" },
    { value: "sour cream", label: "Sour Cream" },
    { value: "guacamole", label: "Guacamole" },
    { value: "jalapenos", label: "Jalapenos" },
    { value: "bacon bits", label: "Bacon Bits" },
    { value: "chili flakes", label: "Chili Flakes" },
    { value: "olives", label: "Olives" },
  ];

  const [addOns, setAddOns] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
 
  

  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        const response = await axios.get(`${API_URL}/adons`);
        setAddOns(
          response.data.map((addon) => ({
            value: addon.name,
            label: addon.name,
            price: addon.price,
          }))
        );
      } catch (error) {
        console.error("Error fetching addons:", error);
      }
    };

    fetchAddOns();

    // Fetch the item data if editing
    if (id) {
      const fetchMenuItem = async () => {
        try {
          const response = await axios.get(`${API_URL}/items/${id}`);
          const fetchedItem = response.data;

          // Map the fetched item to match the expected `menuItem` format
          setMenuItem({
            name: fetchedItem.name,
            price: fetchedItem.price,
            description: fetchedItem.description,
            image: fetchedItem.image,
            category: categories.find((cat) => cat.value === fetchedItem.category) || "",
            stock: fetchedItem.stock,
            isActive: fetchedItem.isActive,
            variants: fetchedItem.variants || [{ name: "", price: "" }],
            addons: fetchedItem.addons.map((addon) => ({
              value: addon.name,
              label: addon.name,
              price: addon.price,
            })),
          });
        } catch (error) {
          console.error("Error fetching menu item:", error);
        }
      };

      fetchMenuItem();
    }
  }, [id]);

  const handleInputChange = (field, value) => {
    setMenuItem({ ...menuItem, [field]: value });
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...menuItem.variants];
    updatedVariants[index][field] = value;
    setMenuItem({ ...menuItem, variants: updatedVariants });
  };

  const handleAddVariant = () => {
    setMenuItem({
      ...menuItem,
      variants: [...menuItem.variants, { name: "", price: "" }],
    });
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = menuItem.variants.filter((_, i) => i !== index);
    setMenuItem({ ...menuItem, variants: updatedVariants });
  };
    // image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    setUploadingImage(true);
    try {
      const response = await axios.post("https://api.cloudinary.com/v1_1/dp2fmxjfb/image/upload", formData); 
      setMenuItem({ ...menuItem, image: response.data.secure_url });
      setNotification({ show: true, message: "Image uploaded successfully!", type: "success" });
    } catch (error) {
      console.error("Error uploading image:", error);
      setNotification({ show: true, message: "Image upload failed!", type: "error" });
    } finally {
      setUploadingImage(false);
    }
  };



  const handleSave = async () => {
    try {
      const formattedMenuItem = {
        ...menuItem,
        category: menuItem.category?.value || "",
        addons: menuItem.addons.map((addon) => ({
          name: addon.value,
          price: addon.price || 0,
        })),
      };

      const response = id
        ? await axios.put(`${API_URL}/items/${id}`, formattedMenuItem)
        : await axios.post(`${API_URL}/items`, formattedMenuItem);

      if (response.status === 200 || response.status === 201) {
        setNotification({
          message: "Menu Item Updated Successfully",
          type: "success",
        });
        setTimeout(() => {
          setNotification({ message: "", type: "" }); // Remove notification after 3 seconds
        }, 3000);
      } else {
        setNotification({
          message: "Failed to update menu item",
          type: "error",
        });
        setTimeout(() => {
          setNotification({ message: "", type: "" }); // Remove notification after 3 seconds
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
      setNotification({
        message: "Error updating menu item",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ message: "", type: "" }); // Remove notification after 3 seconds
      }, 3000);
    }
  };
  return (
    <div className="h-full w-full bg-gray-50 p-4 md:p-8">
      <h2 className="text-xl font-bold text-gray-800">{id ? "Edit Menu Item" : "Add Menu Item"}</h2>
      <div className="h-full bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu Item Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Menu Name"
                  value={menuItem.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Enter Description"
                  value={menuItem.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white focus:ring-blue-500"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menu Item Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
               
                {uploadingImage && <p>Uploading image...</p>}
                {menuItem.image && <img src={menuItem.image} alt="Menu Item" className="w-32 h-32" />}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Category
                </label>
                <Select
                  options={categories}
                  value={categories.find(
                    (cat) => cat.value === menuItem.category
                  )}
                  onChange={(selected) =>
                    handleInputChange("category", selected)
                  }
                  className="basic-select"
                  classNamePrefix="select"
                  placeholder="Select category..."
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Add Ons
                </label>
                <Select
                  options={addOns}
                  value={menuItem.addons}
                  onChange={(selected) => handleInputChange("addons", selected)}
                  isMulti
                  className="basic-multi-select bg-white"
                  classNamePrefix="select"
                  placeholder="Select add ons..."
                />
              </div>
              
            </div>
          </div>
          {/* Notification */}
          {notification.message && (
            <div
              className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 mb-4 rounded-md ${notification.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                }`}
            >
              <p>{notification.message}</p>
            </div>
          )}

          {/* Right Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Publish</h2>
              <div className="space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Save & Draft
                </button>
                <button
                  onClick={handleSave}
                  className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors"
                >
                  Save & Publish
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Pricing
              </h3>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">
                  &#8377;
                </span>
                <input
                  type="number"
                  placeholder="Enter Menu Price"
                  value={menuItem.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  readOnly={menuItem.isActive}
                  className={`w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none ${
                    menuItem.isActive
                      ? "bg-gray-100 cursor-not-allowed"
                      : "focus:ring-2 focus:ring-blue-500"
                  }`}
                />
              </div>
            </div>

            {/* <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Stock
              </h3>
              <input
                type="number"
                placeholder="Enter Stock Quantity"
                value={menuItem.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 bg-white focus:ring-blue-500"
              />
            </div> */}

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Has Variant?
                  </span>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={menuItem.isActive}
                      onChange={() =>
                        handleInputChange("isActive", !menuItem.isActive)
                      }
                      className="toggle-checkbox hidden"
                      
                    />
                    <span
                      className={`toggle-label block w-12 h-7 rounded-full cursor-pointer ${menuItem.isActive ? "bg-blue-700 " : "bg-gray-200"
                        }`}
                    ></span>
                    <span
                      className={`toggle-circle absolute w-5 h-5 rounded-full transform transition-transform ${menuItem.isActive ? "translate-x-6 bg-white" : "translate-x-1 bg-[#edb388]"
                        }`}
                    ></span>
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  If you have any variant, please turn on this toggle.
                </p>
              </div>
            </div>
           
            {menuItem.isActive?(
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Variants
              </h3>
              {menuItem.variants.map((variant, index) => (
                <div key={index} className="flex items-center space-x-4 mb-4">
                  <input
                    type="text"
                    placeholder="Variant Name"
                    value={variant.name}
                    onChange={(e) =>
                      handleVariantChange(index, "name", e.target.value)
                    }
                    className="w-1/2 px-3 py-2 border bg-white border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    placeholder="Variant Price"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(index, "price", e.target.value)
                    }
                    className="w-1/2 px-3 py-2 border bg-white border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveVariant(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddVariant}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Add Variant
              </button>
            </div>
            ):(" ")}
          </div>
        </div>
      </div>
      
    </div>
  );
}
export default AddMenuItem;
