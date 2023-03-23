import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Pie } from 'react-chartjs-2';
import { Box, Grid } from '@mui/material';
import { Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { API_URL } from "./config.js"
import 'chartjs-plugin-datalabels';

const chart_category_count = 3;

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [top10, setTop10] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: []
      }
    ]
  });

  useEffect(() => {
    fetchActivities();
    fetchTop10();
    fetchChartData();
  }, []);

  const columnsActivities = [
    { field: 'id', headerName: 'ID', width: 35 },
    { field: 'createdAt', headerName: 'Time', width: 180 },
    { field: 'definition_name', headerName: 'Behaviour Name', width: 200 },
    { field: 'user_ip', headerName: 'IP Address', width: 150 },
    { field: 'current_url', headerName: 'URL', width: 240 },
  ];

  const columnsTop10 = [
    { field: 'id', headerName: 'ID', width: 35 },
    { field: 'definition_name', headerName: 'Behaviour Name', width: 350 },
    { field: 'count', headerName: 'Catch Count', width: 150 },
  ];

  const fetchActivities = async () => {
    let activityData = []

    let methodURL = API_URL + '/userlog-last/50';

    fetch(methodURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        let cnt = 0;
        for (let key in data) {
          cnt++;
          let item = {
            id: cnt,
            createdAt: data[key].createdAt,
            definition_name: data[key].definition_name,
            user_ip: data[key].user_ip,
            current_url: data[key].current_url
          };
          activityData.push(item)
        }

        setActivities(activityData);
      })
      .catch(error => {
        console.error('Error fetching list:', error);
      });

  };

  const fetchTop10 = async () => {
    let top10Data = []

    let methodURL = API_URL + '/userlog-top/10';

    fetch(methodURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        let cnt = 0;
        for (let key in data) {
          cnt++;
          let item = {
            id: cnt,
            definition_name: data[key].definition_name,
            count: data[key].count
          };
          top10Data.push(item)
        }

        setTop10(top10Data);
      })
      .catch(error => {
        console.error('Error fetching list:', error);
      });

  };

  const fetchChartData = async () => {

    let methodURL = API_URL + '/userlog-top/1000';

    fetch(methodURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(respData => {
        let cnt = 0;
        let otherTotal = 0;
        let chartCountData = []
        let chartNameData = []

        for (let key in respData) {
          cnt++;

          const categ_count = respData[key].count;

          if (cnt > chart_category_count)
            otherTotal = otherTotal + categ_count;
          else {
            chartCountData.push(categ_count);
            chartNameData.push(respData[key].definition_name);
          }
        }

        if (otherTotal > 0) {
          chartCountData.push(otherTotal);
          chartNameData.push('Others')
        }

        const data = {
          labels: chartNameData,
          datasets: [
            {
              data: chartCountData,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#70D6FF', '#FFD670', '#E0AFFF'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#70D6FF', '#FFD670', '#E0AFFF'],
            }
          ]
        };

        setChartData(prevState => ({
          ...prevState,
          labels: data.labels,
          datasets: [
            {
              ...prevState.datasets[0],
              data: data.datasets[0].data,
              backgroundColor: data.datasets[0].backgroundColor,
              hoverBackgroundColor: data.datasets[0].hoverBackgroundColor
            }
          ]
        }));

      })
      .catch(error => {
        console.error('Error fetching list:', error);
      });
  };

  const customTheme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          cell: {
            borderColor: 'rgba(0, 0, 0, 0.3)', // Customize the cell border color
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={customTheme}>
      <Grid container padding={5}>
        <Grid item xs={6}>
          <Box bgcolor="#EDBB99" pt={1} pb={1}>
            <Typography variant="h6" gutterBottom textAlign="center">
              Activities
            </Typography>
          </Box>
          <Box bgcolor="#f8e6d7" height={400} overflow="auto" mb={2} pl={1} pr={1} pb={1}>
            <DataGrid rows={activities} columns={columnsActivities} pageSize={5} />
          </Box>
          <Box bgcolor="#58D68D" pt={1} pb={1}>
            <Typography variant="h6" gutterBottom textAlign="center">
              Top 10
            </Typography>
          </Box>
          <Box bgcolor="#d7f8e6" height={400} overflow="auto" mt={2} pl={1} pr={1} pb={1}>
            <DataGrid rows={top10} columns={columnsTop10} pageSize={5} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box bgcolor="#D98880" pt={1} pb={1}>
            <Typography variant="h6" gutterBottom textAlign="center">
              Distribution of Catched Behaviours
            </Typography>
          </Box>
          <Box height="100%" display="flex" justifyContent="center" alignItems="top" p={4} padding={10} >
            <Pie data={chartData} />
          </Box>
        </Grid>

      </Grid>
    </ThemeProvider>
  );
};

export default Dashboard;
