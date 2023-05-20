import React from "react";
import ReactECharts from "echarts-for-react";
import { useCubeQuery } from "@cubejs-client/react";
import dayjs from "dayjs";
import Loader from "./Loader";
import { Card } from "react-bootstrap";

function StackedBarChart() {
  const { resultSet, isLoading, error, progress } = useCubeQuery({
    measures: ["orders.count"],
    timeDimensions: [
      {
        dimension: "orders.created_at",
        granularity: "month",
      },
    ],
    order: [
      ["orders.count", "desc"],
      ["orders.created_at", "asc"],
    ],
    dimensions: ["orders.status"],
    filters: [],
  });

  if (error) {
    return <p>{error.toString()}</p>;
  }
  if (isLoading) {
    return <div>{(progress && progress.stage) || <Loader />}</div>;
  }

  if (!resultSet) {
    return null;
  }

  const results = resultSet.serialize().loadResponse.results;

  if (! results[0]) {
    return null;
  }

  // First, we sort the data by month
  const returnedData = results[0].data.sort((first, second) =>
      dayjs(first["orders.created_at.month"]).diff(
        dayjs(second["orders.created_at.month"])
      )
    );

  // Then, we filter the data by order status
  const filterOrderStatusBy = (type: string) =>
    returnedData
      .filter((order) => order["orders.status"] === type)
      .map((order) => order["orders.count"]);

  const ordersProcessing = filterOrderStatusBy("processing");
  const ordersCompleted = filterOrderStatusBy("completed");
  const ordersShipped = filterOrderStatusBy("shipped");

  // Finally, we get the months and remove duplicates
  const orderMonths = [
    ...new Set(
      returnedData.map((order) => {
        return dayjs(order["orders.created_at.month"]).format("MMM YYYY");
      })
    ),
  ];

  const options = {
    legend: {
      data: [
        "Processing orders count",
        "Completed orders count",
        "Shipped orders count",
      ],
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      data: orderMonths,
    },
    yAxis: {},
    series: [
      {
        name: "Processing orders count",
        data: ordersProcessing,
        type: "bar",
        stack: "x",
      },
      {
        name: "Completed orders count",
        data: ordersCompleted,
        type: "bar",
        stack: "x",
      },
      {
        name: "Shipped orders count",
        data: ordersShipped,
        type: "bar",
        stack: "x",
      },
    ],
  };

  return (
    <Card className='m-4'>
      <Card.Body>
        <Card.Title>orders by Status Over Time</Card.Title>
        <ReactECharts option={options} />
      </Card.Body>
    </Card>
  );
}

export default StackedBarChart;
