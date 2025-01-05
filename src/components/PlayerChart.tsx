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
          tickFormatter={(value) => value.toFixed(0)}
        />
        <YAxis 
          dataKey="name" 
          type="category"
          width={90}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value: number) => value.toFixed(2)}
          labelStyle={{ color: 'black' }}
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px'
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
  );
}; 