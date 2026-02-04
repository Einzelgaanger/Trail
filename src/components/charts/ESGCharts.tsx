"use client";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend } from "recharts";
import { calculatePortfolioStats, calculateSectorBreakdown, getCarbonTrendData, getEsgTrendData } from "@/data/esgData";

const COLORS = {
  green: "hsl(var(--success))",
  transition: "hsl(var(--warning))",
  notGreen: "hsl(var(--destructive))",
  primary: "hsl(var(--primary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted-foreground))",
};

// Taxonomy Pie Chart
export function TaxonomyPieChart() {
  const stats = calculatePortfolioStats();
  const data = [
    { name: "Green", value: stats.greenTaxonomy.green, color: "#22c55e" },
    { name: "Transition", value: stats.greenTaxonomy.transition, color: "#eab308" },
    { name: "Not Green", value: stats.greenTaxonomy.notGreen, color: "#ef4444" },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number, name: string) => [`${value} projects`, name]}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Carbon Scope Bar Chart
export function CarbonScopeChart() {
  const stats = calculatePortfolioStats();
  const data = [
    { name: "Scope 1", value: stats.carbonSummary.scope1, fill: "#166534" },
    { name: "Scope 2", value: stats.carbonSummary.scope2, fill: "#ca8a04" },
    { name: "Scope 3", value: stats.carbonSummary.scope3, fill: "#dc2626" },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
        <Tooltip 
          formatter={(value: number) => [`${value.toLocaleString()} tCO₂e`]}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px'
          }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Sector Breakdown Bar Chart
export function SectorBreakdownChart() {
  const sectorData = calculateSectorBreakdown().slice(0, 6);
  const chartData = sectorData.map(s => ({
    name: s.sector.length > 10 ? s.sector.substring(0, 10) + '...' : s.sector,
    value: s.value / 1000000,
    green: s.greenPercentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₦${v}M`} />
        <Tooltip 
          formatter={(value: number) => [`₦${value.toFixed(0)}M`]}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px'
          }}
        />
        <Bar dataKey="value" fill="#166534" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Carbon Trend Line Chart
export function CarbonTrendChart() {
  const data = getCarbonTrendData();

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
        <Tooltip 
          formatter={(value: number, name: string) => [`${value.toLocaleString()} tCO₂e`, name]}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px'
          }}
        />
        <Legend wrapperStyle={{ fontSize: '11px' }} />
        <Area type="monotone" dataKey="scope1" stackId="1" stroke="#166534" fill="#166534" fillOpacity={0.8} name="Scope 1" />
        <Area type="monotone" dataKey="scope2" stackId="1" stroke="#ca8a04" fill="#ca8a04" fillOpacity={0.8} name="Scope 2" />
        <Area type="monotone" dataKey="scope3" stackId="1" stroke="#dc2626" fill="#dc2626" fillOpacity={0.8} name="Scope 3" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ESG Completeness Trend
export function EsgTrendChart() {
  const data = getEsgTrendData();

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
        <Tooltip 
          formatter={(value: number, name: string) => [`${value}%`, name]}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px'
          }}
        />
        <Legend wrapperStyle={{ fontSize: '11px' }} />
        <Line type="monotone" dataKey="completeness" stroke="#166534" strokeWidth={2} dot={{ r: 4 }} name="Completeness" />
        <Line type="monotone" dataKey="quality" stroke="#ca8a04" strokeWidth={2} dot={{ r: 4 }} name="Data Quality" />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Emissions by Sector
export function EmissionsBySectorChart() {
  const sectorData = calculateSectorBreakdown();
  const chartData = sectorData.map(s => ({
    name: s.sector.length > 12 ? s.sector.substring(0, 12) + '...' : s.sector,
    emissions: s.totalEmissions,
  })).slice(0, 5);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
        <Tooltip 
          formatter={(value: number) => [`${value.toLocaleString()} tCO₂e`]}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px'
          }}
        />
        <Bar dataKey="emissions" fill="#ca8a04" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
