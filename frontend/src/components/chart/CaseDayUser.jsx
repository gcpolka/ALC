import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import caseService from '../../service/caseService';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CaseDayUser = () => {
  const [caseData, setCaseData] = useState({
    labels: [],
    data: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await caseService.getCaseInfo();
        const data = res.data.data;

        // Process the data to extract labels and counts for each day
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const counts = daysOfWeek.map(day => {
          const dayData = data.filter(item => {
            const itemDate = new Date(item.createdAt); // Convert timestamp to Date
            const itemDay = itemDate.toLocaleString('en-US', { weekday: 'long' }); // Get weekday
            return itemDay === day;
          });
          return dayData.length;
        });

        setCaseData({
          labels: daysOfWeek,
          data: counts
        });
      } catch (error) {
        console.error('Error fetching case data:', error);
      }finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: caseData.labels,
    datasets: [
      {
        label: 'แจ้งจุดท่อรั่วประจำวัน',
        data: caseData.data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'แจ้งจุดท่อรั่วประจำวัน'
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw} cases`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h3>จำนวนการแจ้งจุดท่อรั่วประจำวัน</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CaseDayUser;
