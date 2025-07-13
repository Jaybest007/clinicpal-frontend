import React from "react";
import type { IconType } from "react-icons";


interface StatCardProps {
  title: string;
  icon: IconType;
  value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ title, icon: Icon, value }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm px-3 py-4 w-full sm:max-w-[9rem] space-y-1 sm:space-y-2">
      <div className="text-blue-500">
        <Icon size={24} className="sm:w-7 sm:h-7" />
      </div>
      <h2 className="text-gray-700 font-medium text-base sm:text-sm text-center leading-snug">
        {title}
      </h2>
      <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
    </div>

  );
};

export default StatCard;
