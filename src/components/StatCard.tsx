import React from "react";
import type { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  icon: IconType;
  value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ title, icon: Icon, value }) => {
  return (
    <div className="w-full max-w-[10rem] sm:max-w-[11rem] md:max-w-[12rem] bg-white border border-blue-100 rounded-xl p-4 shadow-md hover:shadow-md transition-all flex flex-col items-center space-y-2">
      <div className="text-blue-600 bg-blue-50 p-2 rounded-full">
        <Icon size={24} />
      </div>
      <h2 className="text-sm text-gray-600 font-semibold text-center">
        {title}
      </h2>
      <p className="text-xl sm:text-2xl font-bold text-blue-900 text-center">
        {value}
      </p>
    </div>
  );
};

export default StatCard;
