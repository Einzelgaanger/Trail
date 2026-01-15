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
  TrendingDown,
  ArrowUpRight,
  BarChart3
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock ESG Data
const mockESGData = {
  portfolioValue: 12500000000,
  projectCount: 42,
  esgCompleteness: 87,
  reportingTimeliness: { onTime: 38, late: 4, total: 42 },
  greenTaxonomy: { green: 65, transition: 25, notGreen: 10 },
  carbonSummary: { scope1: 12450, scope2: 8750, scope3: 32100, total: 53300 },
  esgFlags: { critical: 3, warning: 7, compliant: 32 },
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-NG").format(value);
};

export default function Dashboard() {
  const timelinessRate = Math.round(
    (mockESGData.reportingTimeliness.onTime / mockESGData.reportingTimeliness.total) * 100
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="view-title">Portfolio Overview</h1>
          <p className="text-muted-foreground mt-1">
            ESG Integrated Dashboard - Development Bank of Nigeria
          </p>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Portfolio Value */}
          <div className="stat-card group">
            <div className="flex justify-between items-start">
              <div>
                <p className="stat-title">Portfolio Value</p>
                <h3 className="stat-value text-xl">{formatCurrency(mockESGData.portfolioValue)}</h3>
                <p className="stat-subtitle">{mockESGData.projectCount} Projects/Facilities</p>
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
                <h3 className="stat-value text-xl">{mockESGData.esgCompleteness}%</h3>
                <p className="stat-subtitle">Fields validated</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
            </div>
            <Progress value={mockESGData.esgCompleteness} className="h-2 mt-3" />
          </div>

          {/* Reporting Timeliness */}
          <div className="stat-card group">
            <div className="flex justify-between items-start">
              <div>
                <p className="stat-title">Reporting Timeliness</p>
                <h3 className="stat-value text-xl">{timelinessRate}%</h3>
                <p className="stat-subtitle">
                  {mockESGData.reportingTimeliness.onTime} On-time / {mockESGData.reportingTimeliness.late} Late
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
                <h3 className="stat-value text-xl">{mockESGData.greenTaxonomy.green}%</h3>
                <p className="stat-subtitle">Green classification</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                <Leaf className="w-5 h-5 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Green Taxonomy Breakdown */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-success" />
              Green Taxonomy Classification
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-success">Green</span>
                  <span className="text-sm font-medium">{mockESGData.greenTaxonomy.green}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success rounded-full transition-all duration-500"
                    style={{ width: `${mockESGData.greenTaxonomy.green}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-warning">Transition</span>
                  <span className="text-sm font-medium">{mockESGData.greenTaxonomy.transition}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-warning rounded-full transition-all duration-500"
                    style={{ width: `${mockESGData.greenTaxonomy.transition}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-destructive">Not Green</span>
                  <span className="text-sm font-medium">{mockESGData.greenTaxonomy.notGreen}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-destructive rounded-full transition-all duration-500"
                    style={{ width: `${mockESGData.greenTaxonomy.notGreen}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Carbon Footprint */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-accent" />
              Carbon Footprint Summary
            </h3>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-foreground">
                {formatNumber(mockESGData.carbonSummary.total)}
              </p>
              <p className="text-sm text-muted-foreground">Total tCO₂e</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(mockESGData.carbonSummary.scope1)}
                </p>
                <p className="text-xs text-muted-foreground">Scope 1</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(mockESGData.carbonSummary.scope2)}
                </p>
                <p className="text-xs text-muted-foreground">Scope 2</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-lg font-semibold text-foreground">
                  {formatNumber(mockESGData.carbonSummary.scope3)}
                </p>
                <p className="text-xs text-muted-foreground">Scope 3</p>
              </div>
            </div>
          </div>

          {/* ESG Flags */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              ESG Status Flags
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="font-medium text-foreground">Critical</span>
                </div>
                <span className="text-xl font-bold text-destructive">{mockESGData.esgFlags.critical}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-warning/5 rounded-lg border border-warning/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="font-medium text-foreground">Warning</span>
                </div>
                <span className="text-xl font-bold text-warning">{mockESGData.esgFlags.warning}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="font-medium text-foreground">Compliant</span>
                </div>
                <span className="text-xl font-bold text-success">{mockESGData.esgFlags.compliant}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity / Quick Actions */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-primary/5 hover:bg-primary/10 rounded-xl border border-primary/20 transition-all group">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm font-medium">View Analytics</span>
              </div>
            </button>
            <button className="p-4 bg-success/5 hover:bg-success/10 rounded-xl border border-success/20 transition-all group">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <Leaf className="w-6 h-6 text-success" />
                </div>
                <span className="text-sm font-medium">Green Taxonomy</span>
              </div>
            </button>
            <button className="p-4 bg-accent/5 hover:bg-accent/10 rounded-xl border border-accent/20 transition-all group">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Flame className="w-6 h-6 text-accent" />
                </div>
                <span className="text-sm font-medium">Carbon Report</span>
              </div>
            </button>
            <button className="p-4 bg-muted hover:bg-muted/80 rounded-xl border border-border transition-all group">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">Export Report</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
