import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: number;
  changeType?: 'increase' | 'decrease';
  bgColor?: string;
  textColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType,
  bgColor = 'bg-white',
  textColor = 'text-blue-600'
}) => {
  return (
    <div className={`${bgColor} overflow-hidden rounded-lg shadow transition-all duration-300 hover:shadow-md`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${textColor} bg-opacity-10`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {change !== undefined && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className={`font-medium ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'} mr-1`}>
              {changeType === 'increase' ? '↑' : '↓'} {Math.abs(change)}%
            </span>
            <span className="text-gray-500">from last month</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;