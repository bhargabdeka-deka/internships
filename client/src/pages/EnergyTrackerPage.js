import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './EnergyTrackerPage.css';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function EnergyTrackerPage() {
  const [meterNumber, setMeterNumber] = useState('');
  const [usageData, setUsageData] = useState(null);

const fetchMonthlyUsage = async () => {
  if (meterNumber.length !== 12) {
    alert('Meter number must be 12 digits.');
    return;
  }

  try {
    const res = await axios.get(`/api/users/usage/${meterNumber}`); // 🔧 Fixed path!
    setUsageData(res.data);
  } catch (err) {
    console.error('Error fetching usage:', err);
    alert('Could not fetch usage data.');
  }
};

  const chartData = usageData && {
    labels: usageData.map(m => m.month),
    datasets: [{
      label: 'Monthly Energy Consumption (kWh)',
      data: usageData.map(m => m.units),
      backgroundColor: usageData.map(u =>
        u.units <= 250 ? '#4caf50' :
        u.units <= 300 ? '#ff9800' :
        '#f44336'
      ),
      borderRadius: 6
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Monthly Usage for Meter ${meterNumber}`,
        color: '#007bff',
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const level =
              value <= 250 ? 'Low' :
              value <= 300 ? 'Moderate' : 'High';
            return `Usage: ${value} kWh (${level})`;
          }
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Units (kWh)',
          color: '#333'
        },
        ticks: {
          color: '#333'
        }
      },
      x: {
        ticks: {
          color: '#333'
        }
      }
    }
  };

  return (
    <div className="tracker-container">
      <h2>📊 Monthly Energy Usage Tracker</h2>
      <input
        type="text"
        placeholder="🔢 Enter 12-digit Meter Number"
        value={meterNumber}
        onChange={(e) => setMeterNumber(e.target.value)}
        maxLength={12}
      />
      <button onClick={fetchMonthlyUsage}>Show Monthly Graph</button>

      {usageData && (
        <>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <p className="energy-message">
            📆 Data reflects your monthly usage history. Energy saved today builds a brighter tomorrow!
          </p>
        </>
      )}
    </div>
  );
}

export default EnergyTrackerPage;