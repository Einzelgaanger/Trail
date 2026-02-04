"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  Clock, 
  Leaf,
  AlertTriangle,
  BarChart3,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import esgWindImage from "@/assets/esg-wind-turbines.jpg";

// Mock data for ESG Analytics
const keyTrends = [
  { title: "ESG Completeness Score", current: 87, previous: 82, change: 5, trend: "up" },
  { title: "Green Taxonomy Alignment", current: 65, previous: 58, change: 7, trend: "up" },
  { title: "Reporting Timeliness", current: 90, previous: 85, change: 5, trend: "up" },
  { title: "Carbon Reduction Progress", current: 27, previous: 22, change: 5, trend: "up" },
];

const sectorBreakdown = [
  { sector: "Renewable Energy", projects: 12, value: 4500000000, greenPercentage: 92 },
  { sector: "Agriculture", projects: 8, value: 2800000000, greenPercentage: 75 },
  { sector: "Manufacturing", projects: 10, value: 3200000000, greenPercentage: 45 },
  { sector: "Real Estate", projects: 7, value: 1500000000, greenPercentage: 68 },
  { sector: "Water & Sanitation", projects: 5, value: 500000000, greenPercentage: 88 },
];

const topPerformers = [
  { name: "Lagos Solar Farm Development", sector: "Renewable Energy", score: 95, status: "Excellent" },
  { name: "Rivers State Water Treatment", sector: "Water & Sanitation", score: 92, status: "Excellent" },
  { name: "Abuja Green Building Initiative", sector: "Real Estate", score: 88, status: "Good" },
  { name: "Kano Agricultural Expansion", sector: "Agriculture", score: 85, status: "Good" },
  { name: "Ogun Clean Energy Hub", sector: "Renewable Energy", score: 82, status: "Good" },
];

const riskAreas = [
  { area: "Missing Carbon Data", projects: 8, severity: "High" },
  { area: "Incomplete ESG Documentation", projects: 12, severity: "Medium" },
  { area: "Delayed Reporting", projects: 4, severity: "High" },
  { area: "Non-compliant Taxonomy", projects: 6, severity: "Medium" },
  { area: "Pending Validations", projects: 15, severity: "Low" },
];

const formatCurrency = (value: number) => {
  if (value >= 1000000000) {
    return `₦${(value / 1000000000).toFixed(1)}B`;
  }
  return `₦${(value / 1000000).toFixed(0)}M`;
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "High": return "bg-destructive/10 text-destructive border-destructive/20";
    case "Medium": return "bg-warning/10 text-warning border-warning/20";
    case "Low": return "bg-primary/10 text-primary border-primary/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Excellent": return "bg-success text-white";
    case "Good": return "bg-primary text-white";
    case "Fair": return "bg-warning text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function ESGAnalytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-xl h-40 mb-2">
          <img src={esgWindImage} alt="Wind Turbines" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
          <div className="relative z-10 flex items-center justify-between h-full px-6">
            <div className="text-white">
              <h1 className="text-2xl font-bold">ESG Analytics</h1>
              <p className="text-white/80 mt-1">
                Comprehensive analytics and insights into ESG performance
              </p>
            </div>
            <Button variant="secondary" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Trends */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyTrends.map((trend) => (
            <div key={trend.title} className="stat-card">
              <p className="stat-title">{trend.title}</p>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-2xl font-bold">{trend.current}%</span>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium mb-1",
                  trend.trend === "up" ? "text-success" : "text-destructive"
                )}>
                  {trend.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {trend.change}%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs. previous period ({trend.previous}%)</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sector Breakdown */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Sector Breakdown
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Sector</th>
                    <th className="text-center py-3 text-sm font-medium text-muted-foreground">Projects</th>
                    <th className="text-right py-3 text-sm font-medium text-muted-foreground">Value</th>
                    <th className="text-right py-3 text-sm font-medium text-muted-foreground">Green %</th>
                  </tr>
                </thead>
                <tbody>
                  {sectorBreakdown.map((sector) => (
                    <tr key={sector.sector} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors">
                      <td className="py-3 font-medium">{sector.sector}</td>
                      <td className="py-3 text-center">{sector.projects}</td>
                      <td className="py-3 text-right">{formatCurrency(sector.value)}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-success rounded-full"
                              style={{ width: `${sector.greenPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-10">{sector.greenPercentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Performers */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Top Performers
            </h3>
            <div className="space-y-3">
              {topPerformers.map((performer, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{performer.name}</p>
                    <p className="text-sm text-muted-foreground">{performer.sector}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-lg font-bold">{performer.score}%</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getStatusColor(performer.status)
                    )}>
                      {performer.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Areas */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Risk Areas Requiring Attention
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {riskAreas.map((risk, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all",
                  getSeverityColor(risk.severity)
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{risk.area}</h4>
                    <p className="text-sm mt-1">{risk.projects} projects affected</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-background/50">
                    {risk.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
