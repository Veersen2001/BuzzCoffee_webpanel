import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

function BulkImport() {
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            console.log('Uploading file:', file);
        }
    };

    const handleReset = () => {
        setFile(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
                <FaCloudUploadAlt className="text-2xl mr-2" />
                <h2 className="text-2xl font-bold">Bulk Import</h2>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Download the format file and fill it with proper data.</li>
                    <li>You can download the example file to understand how the data must be filled.</li>
                    <li>Once you have downloaded and filled the format file upload it in the form below and submit.</li>
                    <li>After uploading products you need to edit them and set product's images and choices.</li>
                    <li>You can get category and sub-category id from their list please input the right ids.</li>
                </ol>
            </div>

            <div className="mb-6">
                <p className="text-center mb-2">Do not have the template?{' '}
                    <a href="#" className="text-blue-500 hover:text-blue-700">Download Here</a>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="text-center">
                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2">Click here to import the .xlsx file here</p>
                        <input
                            type="file"
                            accept=".xlsx"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files[0])}
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="mt-2 inline-block cursor-pointer text-sm text-blue-500 hover:text-blue-700"
                        >
                            {file ? file.name : 'No file chosen'}
                        </label>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-[#c7a78e] text-white rounded-md hover:bg-teal-700"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BulkImport;