import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import caseService from '../../service/caseService';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CaseWeekUser = () => {
  const [caseData, setCaseData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await caseService.getCaseInfo();
        const rawData = res.data.data;

        // Group cases by week
        const weeklyCounts = [0, 0, 0, 0];
        rawData.forEach((item) => {
          const createdAt = new Date(item.createdAt);
          const weekNumber = Math.ceil(createdAt.getDate() / 7);
          if (weekNumber >= 1 && weekNumber <= 4) {
            weeklyCounts[weekNumber - 1]++;
          }
        });

        setCaseData({
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: weeklyCounts
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: caseData?.labels || ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'จำนวนการแจ้งประจำสัปดาห์',
        data: caseData?.data || [0, 0, 0, 0],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'จำนวนการแจ้งประจำสัปดาห์'
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
      <h3>จำนวนการแจ้งจุดท่อรั่วประจำสัปดาห์</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CaseWeekUser;
