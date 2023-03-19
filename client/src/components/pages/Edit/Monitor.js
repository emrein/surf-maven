import React, { useRef, useEffect, useState } from "react";
import "./Monitor.css";
import "react-bootstrap";
import Dashboard from "./Dashboard";

function activityDataFeed() {
  return <h1>activityDataFeedxxx</h1>
}

function behaviorsDataFeed() {
  return <h1>behaviorsDataFeedxxx</h1>
}

function Monitor() {

  const [data, setData] = useState(null);

  let cnt = 0;

  function doRefreshData() {
    let newData = {
      'activityData': { 'date': 'Data updated at' + new Date().toLocaleTimeString() },
      'top10Data': { 'rows': 12345 }
    }

    cnt += 1;

    console.log(cnt)

    if (cnt <= 10) {
      setData(newData);

      console.log('useEffect running...')
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      doRefreshData()
    }, 1000); // update data every 2 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    doRefreshData();
  };


  return (
    <div>
      <div className="d-flex justify-content-end" >
        <button onClick={handleRefresh} className="btn btn-info me-2" >Refresh</button>
      </div>
      <div>
        <Dashboard props={data} />
      </div>
    </div>
  )
};

export default Monitor;
