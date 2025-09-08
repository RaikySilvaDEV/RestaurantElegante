import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  pendente: '#f59e0b', // amber-500
  confirmada: '#22c55e', // green-500
  cancelada: '#ef4444', // red-500
};

const StatusChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: 'rgb(24 24 27)', border: '1px solid rgb(63 63 70)', borderRadius: '0.75rem' }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StatusChart;