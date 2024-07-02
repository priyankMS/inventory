import React, { memo, useEffect, useState } from "react";

import { Chart } from "@berryv/g2-react";

import { useGetAllOrderlistQuery } from "../../services/Orderlist";

const DashboardChart: React.FC = () => {
  const { data: orderlist } = useGetAllOrderlistQuery(
    {
      page: 0,
      limit: 0,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Transform the data
    const transformedData = orderlist?.reduce((acc, order) => {
      const company = order.companyname.trim();
      const totalQuantity = order.orderdetail.reduce(
        (sum, detail) => sum + detail.quantity,
        0
      );

      const existingCompany = acc.find((item) => item.companyname === company);
      if (existingCompany) {
        existingCompany.quantity += totalQuantity;
      } else {
        acc.push({ companyname: company, quantity: totalQuantity });
      }
      return acc;
    }, []);

    setChartData(transformedData);
  }, [orderlist]);

  return (
    <div className=" dark:text-white " id="container">
      <Chart
        options={{
          type: "interval",
          width: 350,
          height: 300,
          data: chartData,
          encode: {
            x: "companyname",
            y: "quantity",
            color: "companyname",
          },
          animate: {
            enter: {
              type: "scaleInY",
              duration: 1000,
            },
          },
        }}
      />
    </div>
  );
};

export default memo(DashboardChart);
