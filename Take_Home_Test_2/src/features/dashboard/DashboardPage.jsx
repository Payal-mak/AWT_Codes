import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const sampleData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
];

/**
 * DashboardPage — feature-level component for /dashboard.
 * Demonstrates recharts usage within the features layer.
 */
export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Monthly Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
