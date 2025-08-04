import React from "react";
import type { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  icon: IconType;
  value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ title, icon: Icon, value }) => {
  return (
    <div className="w-full min-w-[7.5rem] max-w-[8.5rem] sm:min-w-[9rem] sm:max-w-[9.5rem] md:min-w-[10rem] md:max-w-[10rem] bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl p-2 shadow-md hover:shadow-lg transition-transform duration-300 flex flex-col items-center space-y-1 hover:scale-[1.03]">
      <div className="text-white bg-blue-600 p-2 rounded-full shadow-md">
        <Icon size={20} className="md:size-[18px]" />
      </div>
      <h2 className="text-xs font-semibold text-blue-700 tracking-wide text-center uppercase">
        {title}
      </h2>
      <p className="text-lg sm:text-xl md:text-lg font-extrabold text-blue-900 text-center">
        {value}
      </p>
    </div>
  );
};

export default StatCard;
