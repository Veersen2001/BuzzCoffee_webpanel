import { useEffect, useState } from "react";
import Select from "react-select";

function AddonsTable({ data, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: data._id || null,
    name: data.name || "",
    price: data.price || "",
    categories: data.categories || [],
  });

  useEffect(() => {
    setFormData({
      id: data._id || null,
      name: data.name || "",
      price: data.price || "",
      categories: data.categories || [],
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      categories: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const defaultCategories = [
    { value: "extra cheese", label: "Extra Cheese" },
    { value: "butter", label: "Butter" },
    { value: "sour cream", label: "Sour Cream" },
    { value: "guacamole", label: "Guacamole" },
    { value: "jalapenos", label: "Jalapenos" },
    { value: "bacon bits", label: "Bacon Bits" },
    { value: "chili flakes", label: "Chili Flakes" },
    { value: "olives", label: "Olives" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">
          {formData.id ? "Edit Add-On" : "Add New Add-On"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border rounded-md"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-white rounded-md"
              placeholder="Enter price"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Categories
            </label>
            <Select
              isMulti
              value={defaultCategories.filter((category) =>
                formData.categories.includes(category.value)
              )}
              onChange={handleCategoryChange}
              options={defaultCategories}
              className="w-full"
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
            />
          </div> */}
          <div className="flex w-full justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 flex items-center justify-center py-1 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddonsTable;
