import React from "react";
import type { IconType } from "react-icons";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { motion } from "framer-motion";

export type StatVariant = "primary" | "success" | "warning" | "danger" | "info";

interface StatCardProps {
  title: string;
  icon: IconType;
  value: number | string;
  subtitle?: string;
  variant?: StatVariant;
  trend?: {
    value: number;
    isUpGood?: boolean;
  };
  loading?: boolean;
  onClick?: () => void;
}

const variants = {
  primary: {
    bg: "from-white to-blue-50",
    border: "border-blue-100",
    icon: "bg-blue-600",
    title: "text-blue-700",
    value: "text-blue-900",
  },
  success: {
    bg: "from-white to-green-50",
    border: "border-green-100",
    icon: "bg-green-600",
    title: "text-green-700",
    value: "text-green-900",
  },
  warning: {
    bg: "from-white to-amber-50",
    border: "border-amber-100",
    icon: "bg-amber-500",
    title: "text-amber-700",
    value: "text-amber-900",
  },
  danger: {
    bg: "from-white to-red-50",
    border: "border-red-100",
    icon: "bg-red-600",
    title: "text-red-700",
    value: "text-red-900",
  },
  info: {
    bg: "from-white to-cyan-50",
    border: "border-cyan-100",
    icon: "bg-cyan-600",
    title: "text-cyan-700",
    value: "text-cyan-900",
  },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  icon: Icon,
  value,
  subtitle,
  variant = "primary",
  trend,
  loading = false,
  onClick,
}) => {
  const colors = variants[variant];
  const isTrendUp = trend ? trend.value >= 0 : false;
  const isTrendPositive = trend ? (trend.isUpGood ? isTrendUp : !isTrendUp) : false;
  
  const trendColor = isTrendPositive 
    ? "text-green-600" 
    : "text-red-600";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full min-w-[7.5rem] max-w-[8.5rem] sm:min-w-[9rem] sm:max-w-[9.5rem] md:min-w-[10rem] md:max-w-[10.5rem] 
        bg-gradient-to-br ${colors.bg} ${colors.border} rounded-xl p-3 shadow-md 
        transition-all duration-300 flex flex-col items-center space-y-2
        ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
        relative overflow-hidden`}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-black/5"></div>
        <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-black/5"></div>
      </div>
      
      {/* Icon */}
      <div className={`text-white ${colors.icon} p-2.5 rounded-full shadow-md z-10`}>
        <Icon size={22} className="md:size-[20px]" />
      </div>
      
      {/* Title */}
      <h2 className={`text-xs font-semibold ${colors.title} tracking-wide text-center uppercase z-10`}>
        {title}
      </h2>
      
      {/* Value */}
      <div className="flex flex-col items-center z-10">
        {loading ? (
          <div className="h-7 w-16 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className={`text-lg sm:text-xl md:text-2xl font-extrabold ${colors.value} text-center leading-none`}>
            {value}
          </p>
        )}
        
        {/* Subtitle or Trend */}
        {subtitle && !trend && (
          <span className="text-xs text-gray-500 mt-1">{subtitle}</span>
        )}
        
        {trend && (
          <div className={`flex items-center space-x-1 mt-1 ${trendColor}`}>
            {isTrendUp ? (
              <FiArrowUp className="w-3 h-3" />
            ) : (
              <FiArrowDown className="w-3 h-3" />
            )}
            <span className="text-xs font-medium">
              {Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
