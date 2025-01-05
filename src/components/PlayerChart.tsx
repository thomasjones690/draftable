import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartData } from '../types';

interface Props {
  chartData: ChartData[];
}

export const PlayerChart: React.FC<Props> = ({ chartData }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white">Available Players Comparison</h2>
      <div className="h-[calc(100%-4rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 20,
              right: 30,
              left: 100,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis 
              type="number" 
              domain={[0, 'dataMax + 5']}
              stroke="#9CA3AF"
              tickFormatter={(value) => value.toFixed(0)}
            />
            <YAxis 
              dataKey="name" 
              type="category"
              width={90}
              tick={{ fontSize: 12 }}
              stroke="#9CA3AF"
            />
            <Tooltip
              formatter={(value: number) => value.toFixed(2)}
              labelStyle={{ color: 'black' }}
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="score" 
              fill="#3b82f6" 
              name="Score"
              radius={[0, 4, 4, 0]}
            />
            <Bar 
              dataKey="probability" 
              fill="#10b981" 
              name="Probability"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 