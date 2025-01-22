import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import caseService from '../../service/caseService';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CaseMonthUser = () => {
  const [caseData, setCaseData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await caseService.getCaseInfo();
        const rawData = res.data.data;

        // Group cases by month
        const monthlyCounts = Array(12).fill(0); // 12 months
        rawData.forEach((item) => {
          const createdAt = new Date(item.createdAt);
          const month = createdAt.getMonth();
          monthlyCounts[month]++;
        });

        setCaseData({
          labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ],
          data: monthlyCounts
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
    labels: caseData?.labels || [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'จำนวนการแจ้งประจำเดือน',
        data: caseData?.data || Array(12).fill(0),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'จำนวนการแจ้งประจำเดือน'
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
      <h3>จำนวนการแจ้งจุดท่อรั่วประจำเดือน</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CaseMonthUser;
