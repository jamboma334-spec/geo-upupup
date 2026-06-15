"use client";

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { trendData } from "@/mocks/data";

export function TrendChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={trendData} margin={{ left: -20, right: 10, top: 10 }}>
        <CartesianGrid stroke="#edf2ef" vertical={false} />
        <XAxis dataKey="batch" tickLine={false} axisLine={false} tick={{ fill: "#718077", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#718077", fontSize: 12 }} unit="%" />
        <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e4ebe7" }} />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" name="提及率" dataKey="mention" stroke="#16825d" strokeWidth={3} dot={{ r: 4 }} />
        <Line type="monotone" name="推荐率" dataKey="recommend" stroke="#e5a438" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ShareChart() {
  const data = [
    { name: "远途汽车", share: 31 },
    { name: "智行汽车", share: 42 },
    { name: "跃界汽车", share: 22 },
    { name: "其他", share: 13 },
  ];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 12, right: 20, top: 8 }}>
        <CartesianGrid stroke="#edf2ef" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#526159", fontSize: 12 }} width={70} />
        <Tooltip cursor={{ fill: "#f5f7f6" }} contentStyle={{ borderRadius: 12, borderColor: "#e4ebe7" }} />
        <Bar dataKey="share" name="答案份额" fill="#16825d" radius={[0, 8, 8, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
