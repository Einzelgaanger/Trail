"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Download,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calculatePortfolioStats, calculateSectorBreakdown } from "@/data/esgData";
import { CarbonTrendChart, SectorBreakdownChart, EmissionsBySectorChart, EsgTrendChart } from "@/components/charts/ESGCharts";
import esgWindImage from "@/assets/esg-wind-turbines.jpg";

const stats = calculatePortfolioStats();
const sectorData = calculateSectorBreakdown();

// Key trends data
const keyTrends = [
  { title: "ESG Completeness", current: stats.avgEsgCompleteness, previous: stats.avgEsgCompleteness - 5, change: 5, trend: "up" },
  { title: "Green Taxonomy", current: stats.greenTaxonomy.greenPercentage, previous: stats.greenTaxonomy.greenPercentage - 7, change: 7, trend: "up" },
  { title: "On-time Reporting", current: Math.round((stats.reportingTimeliness.onTime / stats.reportingTimeliness.total) * 100), previous: 85, change: 5, trend: "up" },
  { title: "Carbon Reduction", current: 27, previous: 22, change: 5, trend: "up" },
];

const topPerformers = sectorData.slice(0, 5).map((s, idx) => ({
  name: s.sector,
  projects: s.projects,
  score: s.esgScore,
  status: s.esgScore >= 85 ? "Excellent" : s.esgScore >= 70 ? "Good" : "Fair"
}));

const riskAreas = [
  { area: "Missing Carbon Data", projects: stats.esgFlags.critical, severity: "High" },
  { area: "Incomplete Documentation", projects: stats.esgFlags.warning, severity: "Medium" },
  { area: "Delayed Reporting", projects: stats.reportingTimeliness.late, severity: "High" },
  { area: "Non-compliant Taxonomy", projects: stats.greenTaxonomy.notGreen, severity: "Medium" },
  { area: "Pending Validations", projects: Math.round(stats.totalProjects * 0.15), severity: "Low" },
];

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
                  +{trend.change}%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs. previous period ({trend.previous}%)</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Carbon Trend */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Carbon Emissions Trend
            </h3>
            <CarbonTrendChart />
          </div>

          {/* ESG Trend */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              ESG Completeness Trend
            </h3>
            <EsgTrendChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sector Breakdown Chart */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Portfolio Value by Sector
            </h3>
            <SectorBreakdownChart />
          </div>

          {/* Emissions by Sector */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Carbon Emissions by Sector
            </h3>
            <EmissionsBySectorChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Top Performing Sectors
            </h3>
            <div className="space-y-3">
              {topPerformers.map((performer, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{performer.name}</p>
                    <p className="text-sm text-muted-foreground">{performer.projects} projects</p>
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

          {/* Risk Areas */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Risk Areas
            </h3>
            <div className="space-y-3">
              {riskAreas.map((risk, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all flex items-center justify-between",
                    getSeverityColor(risk.severity)
                  )}
                >
                  <div>
                    <h4 className="font-medium text-sm">{risk.area}</h4>
                    <p className="text-xs mt-0.5">{risk.projects} projects affected</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-background/50">
                    {risk.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
