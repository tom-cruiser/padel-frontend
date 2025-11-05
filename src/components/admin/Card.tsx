interface CardProps {
  title: string;
  value: number | string;
  icon: string;
  trend: string;
}

export function Card({ title, value, icon, trend }: CardProps) {
  const trendIsPositive = trend.startsWith('+');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <span className={`text-sm font-medium ${
          trendIsPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend}
        </span>
      </div>
    </div>
  );
}