import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { appointmentStatusData } from '../../data/dashboardData';

ChartJS.register(ArcElement, Tooltip);

const data = {
  labels: appointmentStatusData.labels,
  datasets: [
    {
      data: appointmentStatusData.values,
      backgroundColor: appointmentStatusData.colors,
      borderWidth: 0,
      cutout: '72%',
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.label}: ${ctx.parsed}`,
      },
    },
  },
};

const total = appointmentStatusData.values.reduce((a, b) => a + b, 0);

export default function AppointmentChart() {
  return (
    <div>
      <div className="relative h-44">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display text-xl font-semibold text-ink-900">{total}</span>
          <span className="text-xs text-ink-600">Appointments</span>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {appointmentStatusData.labels.map((label, i) => (
          <li key={label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink-600">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: appointmentStatusData.colors[i] }}
              />
              {label}
            </span>
            <span className="font-medium text-ink-900">{appointmentStatusData.values[i]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
