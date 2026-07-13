import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { serviceDistribution } from '../../data/reportsData';

ChartJS.register(ArcElement, Tooltip);

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const data = {
  labels: serviceDistribution.labels,
  datasets: [
    {
      data: serviceDistribution.values,
      backgroundColor: serviceDistribution.colors,
      borderWidth: 0,
      cutout: '70%',
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
        label: (ctx) => ` ${ctx.label}: ${INR.format(ctx.parsed)}`,
      },
    },
  },
};

const total = serviceDistribution.values.reduce((a, b) => a + b, 0);

export default function ServiceDistributionChart() {
  return (
    <div>
      <div className="relative h-44">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display text-lg font-semibold text-ink-900">{INR.format(total)}</span>
          <span className="text-xs text-ink-600">Total Revenue</span>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {serviceDistribution.labels.map((label, i) => {
          const value = serviceDistribution.values[i];
          const pct = ((value / total) * 100).toFixed(0);
          return (
            <li key={label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-ink-600">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: serviceDistribution.colors[i] }}
                />
                {label}
              </span>
              <span className="font-medium text-ink-900">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
