import React from 'react';
import { Icon} from 'lucide-react';



export function ReportCard({ title, value, subtitle, icon: Icon }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-500" />
                </div>
                
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
            <p className="text-2xl font-semibold text-gray-900 mb-1">{value}</p>
            <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
    );
}