import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReservasChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(161, 161, 170, 0.2)" />
        <XAxis dataKey="name" stroke="rgb(113 113 122)" fontSize={12} />
        <YAxis allowDecimals={false} stroke="rgb(113 113 122)" fontSize={12} />
        <Tooltip cursor={{ fill: 'rgba(161, 161, 170, 0.1)' }} contentStyle={{ backgroundColor: 'rgb(24 24 27)', border: '1px solid rgb(63 63 70)', borderRadius: '0.75rem' }} />
        <Legend />
        <Bar dataKey="reservas" fill="#3b82f6" name="Reservas" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ReservasChart;