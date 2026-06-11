import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function ChartsGrid({ chartData }) {
  return (
    <div className="charts-grid">
      <ChartBox title="Attribute Gap Insights" badge="Top 8" badgeStyle={{ background: "#e0e7ff", color: "#3730a3" }}>
        <Bar data={chartData.frequency} options={frequencyOptions} />
      </ChartBox>
      <ChartBox title="Priority distribution" badge="By SKU count" badgeStyle={{ background: "#fee2e2", color: "#991b1b" }}>
        <Doughnut data={chartData.priority} options={circleOptions} />
      </ChartBox>
      <ChartBox title="Gaps by product category" badge="All categories" badgeStyle={{ background: "#dcfce7", color: "#166534" }}>
        <Bar data={chartData.category} options={categoryOptions} />
      </ChartBox>
      <ChartBox title="Suggestion status" badge="Review pipeline" badgeStyle={{ background: "#fef9c3", color: "#854d0e" }}>
        <Pie data={chartData.status} options={circleOptions} />
      </ChartBox>
    </div>
  );
}

function ChartBox({ title, badge, badgeStyle, children }) {
  return (
    <div className="chart-box">
      <div className="chart-title">
        {title}{" "}
        <span className="ct-badge" style={badgeStyle}>
          {badge}
        </span>
      </div>
      <div className="chart">{children}</div>
    </div>
  );
}

const frequencyOptions = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { beginAtZero: true, grid: { color: "#f1f5f9" } },
    y: { ticks: { font: { size: 11 } } },
  },
};

const categoryOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: "#f1f5f9" } },
    x: { ticks: { font: { size: 11 } } },
  },
};

const circleOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom" } },
};

export default ChartsGrid;
