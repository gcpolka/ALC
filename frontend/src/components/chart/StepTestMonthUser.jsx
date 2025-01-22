import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import stepTestService from '../../service/stepTestService';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StepTestMonthUser = () => {
  const [stepTestData, setStepTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await stepTestService.getStepTestInfo();
        const rawData = res.data.data;

        const monthlyCounts = new Array(12).fill(0); // Initialize an array for 12 months
        rawData.forEach((item) => {
          const createdAt = new Date(item.createdAt);
          const month = createdAt.getMonth(); // Get month index (0-11)
          monthlyCounts[month]++;
        });

        setStepTestData({
          labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
          ],
          data: monthlyCounts,
        });
      } catch (error) {
        setError('Error fetching data. Please try again later.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Dependency array ensures the effect runs only once

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const data = {
    labels: stepTestData?.labels || [],
    datasets: [
      {
        label: 'จำนวนการแจ้ง STEP TEST ประจำเดือน',
        data: stepTestData?.data || [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'จำนวนการแจ้ง STEP TEST ประจำเดือน',
        font: {
          size: 18,
        },
      },
      legend: {
        display: true,
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h3>จำนวนการแจ้ง STEP TEST ประจำเดือน</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default StepTestMonthUser;
