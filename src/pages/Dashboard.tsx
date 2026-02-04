"use client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Leaf, 
  Flame, 
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  FileText
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { calculatePortfolioStats, formatCurrency, formatNumber } from "@/data/esgData";
import { TaxonomyPieChart, CarbonScopeChart, EsgTrendChart } from "@/components/charts/ESGCharts";
import esgSolarImage from "@/assets/esg-solar-panels.jpg";
import esgWindImage from "@/assets/esg-wind-turbines.jpg";
import esgForestImage from "@/assets/esg-forest.jpg";

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = calculatePortfolioStats();
  
  const timelinessRate = Math.round(
    (stats.reportingTimeliness.onTime / stats.reportingTimeliness.total) * 100
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="view-title">Portfolio Overview</h1>
            <p className="text-muted-foreground mt-1">
              ESG Integrated Dashboard - Development Bank of Nigeria
            </p>
          </div>
          <Button onClick={() => navigate("/reports")} className="gap-2">
            <FileText className="w-4 h-4" />
            Generate Reports
          </Button>
        </div>

        {/* Top Stats Row - 6 KPIs per documentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Portfolio Value */}
          <div className="stat-card group">
            <div className="flex justify-between items-start">
              <div>
                <p className="stat-title">Portfolio Value</p>
                <h3 className="stat-value text-lg">{formatCurrency(stats.totalPortfolioValue)}</h3>
                <p className="stat-subtitle">{stats.totalProjects} Projects</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>

          {/* ESG Completeness */}
          <div className="stat-card group">
            <div className="flex justify-between items-start">
              <div>
                <p className="stat-title">ESG Completeness</p>
                <h3 className="stat-value text-lg">{stats.avgEsgCompleteness}%</h3>
                <p className="stat-subtitle">Fields validated</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
            </div>
            <Progress value={stats.avgEsgCompleteness} className="h-2 mt-3" />
          </div>

          {/* Reporting Timeliness */}
          <div className="stat-card group">
            <div className="flex justify-between items-start">
              <div>
                <p className="stat-title">PFI Timeliness</p>
                <h3 className="stat-value text-lg">{timelinessRate}%</h3>
                <p className="stat-subtitle">
                  {stats.reportingTimeliness.onTime} On-time / {stats.reportingTimeliness.late} Late
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Clock className="w-5 h-5 text-accent" />
              </div>
            </div>
            <Progress value={timelinessRate} className="h-2 mt-3" />
          </div>

          {/* Green Taxonomy */}
          <div className="stat-card group">
            <div className="flex justify-between items-start">
              <div>
                <p className="stat-title">Green Taxonomy</p>
                <h3 className="stat-value text-lg">{stats.greenTaxonomy.greenPercentageByValue}%</h3>
                <p className="stat-subtitle">By portfolio value</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                <Leaf className="w-5 h-5 text-success" />
              </div>
            </div>
          </div>

          {/* Carbon Summary */}
          <div className="stat-card group">
            <div className="flex justify-between items-start">
              <div>
                <p className="stat-title">Carbon (tCO₂e)</p>
                <h3 className="stat-value text-lg">{formatNumber(stats.carbonSummary.total)}</h3>
                <p className="stat-subtitle">Scope 1/2/3 Total</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Flame className="w-5 h-5 text-accent" />
              </div>
            </div>
          </div>

          {/* ESG Flags */}
          <div className="stat-card group">
            <div className="flex justify-between items-start">
              <div>
                <p className="stat-title">ESG Flags (RAG)</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-destructive font-bold">{stats.esgFlags.critical}</span>
                  <span className="text-warning font-bold">{stats.esgFlags.warning}</span>
                  <span className="text-success font-bold">{stats.esgFlags.compliant}</span>
                </div>
                <p className="stat-subtitle">Critical / Warning / OK</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Green Taxonomy Chart */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-success" />
              Green Taxonomy
            </h3>
            <TaxonomyPieChart />
            <div className="flex justify-center gap-4 text-xs mt-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span>Green ({stats.greenTaxonomy.greenPercentage}%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Transition ({stats.greenTaxonomy.transitionPercentage}%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Not Green ({stats.greenTaxonomy.notGreenPercentage}%)</span>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 gap-2"
              onClick={() => navigate("/green-taxonomy")}
            >
              View Details
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Carbon Scope Chart */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Flame className="w-5 h-5 text-accent" />
              Carbon by Scope
            </h3>
            <CarbonScopeChart />
            <div className="text-center mt-2">
              <p className="text-2xl font-bold">{formatNumber(stats.carbonSummary.total)}</p>
              <p className="text-xs text-muted-foreground">Total tCO₂e</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 gap-2"
              onClick={() => navigate("/carbon-netzero")}
            >
              View Details
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>

          {/* ESG Trend Chart */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              ESG Trend
            </h3>
            <EsgTrendChart />
            <Button 
              variant="outline" 
              className="w-full mt-4 gap-2"
              onClick={() => navigate("/dashboard/insights")}
            >
              View Analytics
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Third Row - ESG Flags */}
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            ESG Status Flags
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-destructive" />
                <span className="font-medium text-foreground">Critical</span>
              </div>
              <span className="text-2xl font-bold text-destructive">{stats.esgFlags.critical}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-warning/5 rounded-lg border border-warning/20">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-warning" />
                <span className="font-medium text-foreground">Warning</span>
              </div>
              <span className="text-2xl font-bold text-warning">{stats.esgFlags.warning}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-success/5 rounded-lg border border-success/20">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-success" />
                <span className="font-medium text-foreground">Compliant</span>
              </div>
              <span className="text-2xl font-bold text-success">{stats.esgFlags.compliant}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate("/dashboard/insights")}
              className="relative overflow-hidden p-4 rounded-xl border border-primary/20 transition-all group h-32 hover:border-primary/50 hover:shadow-lg"
            >
              <img src={esgSolarImage} alt="Solar Energy" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative flex flex-col items-center justify-center gap-2 h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/80 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium">ESG Analytics</span>
              </div>
            </button>
            <button 
              onClick={() => navigate("/green-taxonomy")}
              className="relative overflow-hidden p-4 rounded-xl border border-success/20 transition-all group h-32 hover:border-success/50 hover:shadow-lg"
            >
              <img src={esgForestImage} alt="Green Forest" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative flex flex-col items-center justify-center gap-2 h-full">
                <div className="w-12 h-12 rounded-lg bg-success/80 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium">Green Taxonomy</span>
              </div>
            </button>
            <button 
              onClick={() => navigate("/carbon-netzero")}
              className="relative overflow-hidden p-4 rounded-xl border border-accent/20 transition-all group h-32 hover:border-accent/50 hover:shadow-lg"
            >
              <img src={esgWindImage} alt="Wind Energy" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative flex flex-col items-center justify-center gap-2 h-full">
                <div className="w-12 h-12 rounded-lg bg-accent/80 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium">Carbon Report</span>
              </div>
            </button>
            <button 
              onClick={() => navigate("/reports")}
              className="p-4 bg-muted hover:bg-muted/80 rounded-xl border border-border transition-all group h-32 hover:shadow-lg"
            >
              <div className="flex flex-col items-center justify-center gap-2 h-full">
                <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">Export Reports</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
