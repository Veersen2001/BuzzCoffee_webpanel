import React, { useState } from 'react';
import { FaFileExport } from 'react-icons/fa';

function BulkExport() {
    const [exportType, setExportType] = useState('Date Wise');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleExport = () => {
        console.log('Exporting:', { exportType, fromDate, toDate });
    };

    const handleClear = () => {
        setFromDate('');
        setToDate('');
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-8">
                <FaFileExport className="text-2xl mr-2" />
                <h2 className="text-2xl font-bold">Products Bulk Export</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4 text-center">STEP 1</h3>
                    <p className="text-center text-gray-600 mb-4">Select Data Type</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                            value={exportType}
                            onChange={(e) => setExportType(e.target.value)}
                            className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md"
                        >
                            <option value="All Data">All Data</option>
                            <option value="Date Wise">Date Wise</option>
                        </select>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4 text-center">STEP 2</h3>
                    <p className="text-center text-gray-600 mb-4">Select Data Range and Export</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="w-full bg-white  px-3 py-2 border border-gray-300 rounded-md"
                                disabled={exportType !== 'Date Wise'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className=" bg-white w-full px-3 py-2 border border-gray-300 rounded-md"
                                disabled={exportType !== 'Date Wise'}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
                <button
                    onClick={handleClear}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Clear
                </button>
                <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-[#c7a78e] text-white rounded-md hover:bg-teal-700"
                >
                    Export
                </button>
            </div>
        </div>
    );
}

export default BulkExport;