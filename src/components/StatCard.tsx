import React from "react";
import type { IconType } from "react-icons";


interface StatCardProps {
  title: string;
  icon: IconType;
  value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ title, icon: Icon, value }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-4 w-full sm:w-48 space-y-2">
      <div className="text-blue-500">
        <Icon size={32} />
      </div>
      <h2 className="text-gray-700 font-medium text-lg">{title}</h2>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default StatCard;
