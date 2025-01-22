import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import stepTesstService from '../../service/stepTestService';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StepTestWeek = () => {
  const [stepTestData, setStepTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await stepTesstService.listStepTest();
        const rawData = res.data.data;

        const weeklyCounts = [0, 0, 0, 0];
        rawData.forEach((item) => {
          const createdAt = new Date(item.createdAt);
          const weekNumber = Math.ceil(createdAt.getDate() / 7); // Calculate the week number
          if (weekNumber >= 1 && weekNumber <= 4) {
            weeklyCounts[weekNumber - 1]++;
          }
        });

        setStepTestData({
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: weeklyCounts,
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
    labels: stepTestData?.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'จำนวนการแจ้ง STEP TEST ประจำสัปดาห์',
        data: stepTestData?.data || [0, 0, 0, 0],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'จำนวนการแจ้ง STEP TEST ประจำสัปดาห์',
        font: {
          size: 18,
        },
      },
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  return (
    <div>
      <h3>จำนวนการแจ้ง STEP TEST ประจำสัปดาห์</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default StepTestWeek;
