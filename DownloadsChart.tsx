"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function DownloadsChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            tickFormatter={(v) => v.slice(5)}
            stroke="rgba(255,255,255,0.1)"
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            stroke="rgba(255,255,255,0.1)"
          />
          <Tooltip
            contentStyle={{
              background: "#111118",
              border: "1px solid rgba(168,85,247,0.3)",
              borderRadius: 12,
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#A855F7"
            strokeWidth={2}
            dot={{ fill: "#FACC15", r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
