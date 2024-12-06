import React from 'react';

function StatusCard({ label, count, icon: Icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className=" flex flex-wrap bg-gray-50 w-30 rounded-lg shadow-md min-h-[10vh] p-5 md:w-30">
      <div className="flex item-center justify-between gap-3 w-30  md:min-w-[15vw]">
        {/* Text Content */}
        <div className="flex flex-col items-start justify-between w-full space-y-3">
          <h3 className="text-gray-600 font-bold text-sm md:text-base">{label}</h3>
          <div className="text-lg md:text-2xl font-bold text-gray-900">{count}</div>
        </div>

        {/* Icon */}
        <div className={` flex items-start rounded-sm p-2 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 sm:h-3 sm:w-3 md:h-8 md:w-8" />
        </div>
      </div>
    </div>
  );
}

export default StatusCard;
