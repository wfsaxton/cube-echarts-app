import React from "react";
import ReactECharts from "echarts-for-react";
import { useCubeQuery } from "@cubejs-client/react";
import Loader from "./Loader";
import { Card } from "react-bootstrap";
import dayjs from "dayjs";
import { ResultSet, Series } from "@cubejs-client/core";

function AreaChart() {
  const { resultSet, isLoading, error, progress } = useCubeQuery({
    measures: ["users.count"],
    timeDimensions: [
      {
        dimension: "users.created_at",
        granularity: "year",
      },
    ],
    order: {
      "users.created_at": "asc",
    },
  });

  if (error) {
    return <p>{error.toString()}</p>;
  }

  if (isLoading) {
    return (
      <div>
        {/* {(progress && progress.stage && progress.stage.stage) || <Loader />} */}
        {(progress && progress.stage) || <Loader />}
      </div>
    );
  }

  if (!resultSet) {
    return null;
  }

  //   const workingData = resultSet.loadResponse.results[0].data;
  const workingData = resultSet.serialize().loadResponse.results[0].data;

  const userCount = workingData.map((item) => item["users.count"]);
  const userCreationDate = workingData.map((item) =>
    dayjs(item["users.created_at.year"]).format("YYYY")
  );

  const options = {
    legend: {
      data: ["User count"],
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      data: userCreationDate,
    },
    yAxis: {},
    series: [
      {
        name: "User count",
        data: userCount,
        type: "line",
        areaStyle: {},
      },
    ],
  };

  return (
    <Card className='m-4'>
      <Card.Body>
        <Card.Title>User Trend</Card.Title>
        <ReactECharts option={options} />
      </Card.Body>
    </Card>
  );
}

export default AreaChart;
