import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import stepTesstService from './../../service/stepTestService';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StepTestDay = () => {
  const [stepTestData, setStepTestData] = useState({
    labels: [],
    data: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await stepTesstService.listStepTest()
        const data = res.data.data

        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const counts = daysOfWeek.map(day => {
          const dayData = data.filter(item => {
            const itemDate = new Date(item.createdAt)
            const itemDay = itemDate.toLocaleString('en-US', { weekday: 'long' })
            return itemDay === day
          })
          return dayData.length
        })

        setStepTestData({
          labels: daysOfWeek,
          data: counts
        })
      } catch (error) {
        console.error('Error fetching case data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  })

  const chartData = {
    labels: stepTestData.labels,
    datasets: [
      {
        label: 'แจ้ง STEP TEST ประจำวัน',
        data: stepTestData.data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'แจ้ง STEP TEST ประจำวัน',
        font: {
          size: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h3>จำนวนการแจ้ง STEP TESTประจำวัน</h3>
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default StepTestDay