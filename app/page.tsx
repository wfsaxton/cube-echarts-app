"use client";
import React from "react";
import { CubeProvider } from "@cubejs-client/react";
import cubejs from "@cubejs-client/core";
import { Navbar, Container, Row, Col } from "react-bootstrap";
import AreaChart from "./components/AreaChart";
import LineChart from "./components/LineChart";
import StackedBarChart from "./components/StackedBarChart";
import { UserButton } from "@clerk/nextjs";

export const cubejsApi = cubejs(process.env.REACT_APP_CUBEJS_TOKEN!, {
  apiUrl: "https://large-ringling.aws-us-east-2.cubecloudapp.dev/cubejs-api/v1",
});

const App = () => {
  return (
    <div className='bg-gray'>
      <div>
        <UserButton afterSignOutUrl='/' />
      </div>
      <CubeProvider cubejsApi={cubejsApi}>
        <LineChart />
      </CubeProvider>
    </div>
  );
};

export default App;
