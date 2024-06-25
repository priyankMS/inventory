import React from 'react';
import { Statistic } from 'antd';

interface DashboardShowProps {
  title: string;
  value: number;
  icon: any;
  bgColor: string;
}

const DashboardShow: React.FC<DashboardShowProps> = ({ title, value, icon, bgColor }) => {
  return (
    <div className="mx:flex  justify-center items-center w-full lg:p-2">
      <div className={`shadow-md cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-2xl ${bgColor} w-full`}>
        <div className="flex items-center xl:p-3">
          <div className="md:flex hidden   justify-center items-center bg-white text-blue-500 rounded-full xl:w-12 h-12 xl:mr-4">
            {icon}
          </div>
          <div>
            <Statistic
              title={<span className="font-semibold text-gray-700 text-sm sm:text-base">{title}</span>}
              value={value}
              valueStyle={{ color: '#3b82f6', fontSize: '18px', fontWeight: 'bold' }}
               className=' flex  md:flex-col  p-1 md:p-0  gap-2 justify-center items-center  '
           />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardShow;
