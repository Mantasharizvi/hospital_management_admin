import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { revenueTrend } from '../../data/reportsData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const formatCompactINR = (v) => `₹${(v / 1000).toFixed(0)}k`;

const data = {
  labels: revenueTrend.labels,
  datasets: [
    {
      label: 'OPD',
      data: revenueTrend.opd,
      borderColor: '#14899E',
      backgroundColor: '#14899E33',
      tension: 0.35,
      fill: true,
      pointRadius: 3,
    },
    {
      label: 'IPD',
      data: revenueTrend.ipd,
      borderColor: '#0B5566',
      backgroundColor: '#0B556633',
      tension: 0.35,
      fill: true,
      pointRadius: 3,
    },
    {
      label: 'Pharmacy',
      data: revenueTrend.pharmacy,
      borderColor: '#B87A17',
      backgroundColor: '#B87A1733',
      tension: 0.35,
      fill: true,
      pointRadius: 3,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'circle', font: { size: 12 } },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: ${formatCompactINR(ctx.parsed.y)}`,
      },
    },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      grid: { color: '#E4E9ED' },
      beginAtZero: true,
      ticks: { callback: formatCompactINR },
    },
  },
};

export default function RevenueTrendChart() {
  return (
    <div className="h-72">
      <Line data={data} options={options} />
    </div>
  );
}
