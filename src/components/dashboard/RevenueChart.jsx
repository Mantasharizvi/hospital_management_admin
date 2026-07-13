import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from 'chart.js';
import { revenueSeries } from '../../data/dashboardData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const formatCompactINR = (v) => `₹${(v / 1000).toFixed(0)}k`;

const data = {
  labels: revenueSeries.labels,
  datasets: [
    { label: 'OPD', data: revenueSeries.opd, backgroundColor: '#14899E', borderRadius: 4, maxBarThickness: 18 },
    { label: 'IPD', data: revenueSeries.ipd, backgroundColor: '#0B5566', borderRadius: 4, maxBarThickness: 18 },
    { label: 'Pharmacy', data: revenueSeries.pharmacy, backgroundColor: '#B87A17', borderRadius: 4, maxBarThickness: 18 },
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
    x: { grid: { display: false }, stacked: false },
    y: {
      grid: { color: '#E4E9ED' },
      beginAtZero: true,
      ticks: { callback: formatCompactINR },
    },
  },
};

export default function RevenueChart() {
  return (
    <div className="h-72">
      <Bar data={data} options={options} />
    </div>
  );
}
