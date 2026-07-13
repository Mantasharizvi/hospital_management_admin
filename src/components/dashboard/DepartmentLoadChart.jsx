import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { departmentLoadData } from '../../data/dashboardData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const data = {
  labels: departmentLoadData.labels,
  datasets: [
    {
      data: departmentLoadData.values,
      backgroundColor: '#14899E',
      borderRadius: 4,
      barThickness: 14,
    },
  ],
};

const options = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.x} patients` } },
  },
  scales: {
    x: { grid: { color: '#E4E9ED' }, beginAtZero: true },
    y: { grid: { display: false } },
  },
};

export default function DepartmentLoadChart() {
  return (
    <div className="h-56">
      <Bar data={data} options={options} />
    </div>
  );
}
