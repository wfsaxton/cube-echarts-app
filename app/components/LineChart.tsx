import React from "react";
import ReactECharts from "echarts-for-react";
import { useCubeQuery } from "@cubejs-client/react";
import Loader from "./Loader";
import { Card } from "react-bootstrap";

function LineChart() {
  const { resultSet, isLoading, error, progress } = useCubeQuery({
    measures: ["products.count"],
    dimensions: ["product_categories.name"],
    order: [["products.count", "asc"]],
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

  const test = resultSet.serialize().loadResponse.results[0]
  const workingData = results[0].data;

  const productCount = workingData.map((item) => item["products.count"]);
  const productCategoryNames = workingData.map(
    (item) => item["product_categories.name"]
  );

  const options = {
    legend: {
      data: ["Product count"],
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      data: productCategoryNames,
    },
    yAxis: {},
    series: [
      {
        name: "Product count",
        data: productCount,
        type: "line",
        // areaStyle: {},
      },
    ],
  };

  return (
    <Card className='m-4'>
      <Card.Body>
        <Card.Title>User Trend</Card.Title>
        <div>TEST DIV</div>
        <ReactECharts option={options} />
      </Card.Body>
    </Card>
  );
}

export default LineChart;
