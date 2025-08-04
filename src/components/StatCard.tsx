import React from "react";
import type { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  icon: IconType;
  value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ title, icon: Icon, value }) => {
  return (
    <div className="w-full min-w-[10rem] max-w-[10.5rem] sm:min-w-[11rem] sm:max-w-[11.5rem] md:min-w-[12rem] md:max-w-[12rem] bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-transform duration-300 flex flex-col items-center space-y-2 hover:scale-[1.02]">
      <div className="text-white bg-blue-600 p-3 rounded-full shadow-md hover:animate-pulse">
        <Icon size={24} className="md:size-[20px]" />
      </div>
      <h2 className="text-sm font-semibold text-blue-700 tracking-wide text-center uppercase">
        {title}
      </h2>
      <p className="text-xl sm:text-2xl md:text-xl font-extrabold text-blue-900 text-center">
        {value}
      </p>
    </div>
  );
};


export default StatCard;
