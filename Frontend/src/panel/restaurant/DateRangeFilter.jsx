import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';


function DateRangeFilter({ selectedBranch, onBranchChange }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <select
            className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value)}
          >
            <option>All Branch</option>
            <option>Main Branch</option>
            <option>Second Branch</option>
            <option>Third Branch</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="relative">
          <input
            type="date"
            placeholder="Start Date"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="relative">
          <input
            type="date"
            placeholder="End Date"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors">
            Show Data
          </button>
          <button className="flex-1 bg-gray-100 text-gray-600 rounded-lg px-4 py-2 hover:bg-gray-200 transition-colors">
            Clear
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default DateRangeFilter;