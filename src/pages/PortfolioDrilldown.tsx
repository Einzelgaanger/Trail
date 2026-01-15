"use client";
import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download,
  Filter,
  BarChart3,
  MapPin,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const portfolioSummary = {
  totalValue: 12500000000,
  totalProjects: 42,
  avgEsgScore: 78,
  greenPercentage: 65,
};

const sectorData = [
  { sector: "Renewable Energy", projects: 12, value: 4500000000, esgScore: 92, greenPercentage: 95 },
  { sector: "Agriculture", projects: 8, value: 2800000000, esgScore: 75, greenPercentage: 72 },
  { sector: "Manufacturing", projects: 10, value: 3200000000, esgScore: 65, greenPercentage: 45 },
  { sector: "Real Estate", projects: 7, value: 1500000000, esgScore: 82, greenPercentage: 68 },
  { sector: "Water & Sanitation", projects: 5, value: 500000000, esgScore: 88, greenPercentage: 90 },
];

const regionData = [
  { region: "South West", projects: 15, value: 4200000000 },
  { region: "North Central", projects: 10, value: 3500000000 },
  { region: "South South", projects: 8, value: 2800000000 },
  { region: "North West", projects: 5, value: 1200000000 },
  { region: "South East", projects: 4, value: 800000000 },
];

const projectDetails = [
  { id: "1", name: "Lagos Solar Farm", sector: "Renewable Energy", region: "South West", value: 2500000000, esgScore: 95, status: "Green" },
  { id: "2", name: "Kano Agri Hub", sector: "Agriculture", region: "North West", value: 1800000000, esgScore: 75, status: "Transition" },
  { id: "3", name: "Abuja Green Building", sector: "Real Estate", region: "North Central", value: 3200000000, esgScore: 88, status: "Green" },
  { id: "4", name: "Rivers Water Treatment", sector: "Water & Sanitation", region: "South South", value: 1500000000, esgScore: 92, status: "Green" },
  { id: "5", name: "Ogun Manufacturing", sector: "Manufacturing", region: "South West", value: 4500000000, esgScore: 45, status: "Not Green" },
];

const formatCurrency = (value: number) => {
  if (value >= 1000000000) {
    return `₦${(value / 1000000000).toFixed(1)}B`;
  }
  return `₦${(value / 1000000).toFixed(0)}M`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Green": return "bg-success text-white";
    case "Transition": return "bg-warning text-white";
    case "Not Green": return "bg-destructive text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function PortfolioDrilldown() {
  const [searchText, setSearchText] = useState("");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return projectDetails.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesSector = !selectedSector || project.sector === selectedSector;
      const matchesRegion = !selectedRegion || project.region === selectedRegion;
      return matchesSearch && matchesSector && matchesRegion;
    });
  }, [searchText, selectedSector, selectedRegion]);

  const breadcrumb = [
    "Portfolio",
    selectedSector,
    selectedRegion,
  ].filter(Boolean);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="view-title">Portfolio Drilldown</h1>
            <p className="text-muted-foreground mt-1">
              Detailed analytical view with drill-down capabilities
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Breadcrumb */}
        {(selectedSector || selectedRegion) && (
          <div className="flex items-center gap-2 text-sm">
            {breadcrumb.map((item, idx) => (
              <span key={idx} className="flex items-center gap-2">
                {idx > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                <button 
                  onClick={() => {
                    if (idx === 0) {
                      setSelectedSector(null);
                      setSelectedRegion(null);
                    } else if (idx === 1) {
                      setSelectedRegion(null);
                    }
                  }}
                  className={cn(
                    "hover:text-primary transition-colors",
                    idx === breadcrumb.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item}
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <p className="stat-title">Total Value</p>
            </div>
            <p className="stat-value">{formatCurrency(portfolioSummary.totalValue)}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-primary" />
              <p className="stat-title">Total Projects</p>
            </div>
            <p className="stat-value">{portfolioSummary.totalProjects}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <p className="stat-title">Avg ESG Score</p>
            </div>
            <p className="stat-value">{portfolioSummary.avgEsgScore}%</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-success" />
              <p className="stat-title">Green Aligned</p>
            </div>
            <p className="stat-value text-success">{portfolioSummary.greenPercentage}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sector Breakdown */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Breakdown by Sector
            </h3>
            <div className="space-y-3">
              {sectorData.map((sector) => (
                <button
                  key={sector.sector}
                  onClick={() => setSelectedSector(sector.sector)}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-all hover:shadow-md",
                    selectedSector === sector.sector 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{sector.sector}</h4>
                      <p className="text-sm text-muted-foreground">{sector.projects} projects</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(sector.value)}</p>
                      <p className="text-sm text-success">{sector.greenPercentage}% Green</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success rounded-full"
                      style={{ width: `${sector.greenPercentage}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Region Breakdown */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Breakdown by Region
            </h3>
            <div className="space-y-3">
              {regionData.map((region) => (
                <button
                  key={region.region}
                  onClick={() => setSelectedRegion(region.region)}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-all hover:shadow-md",
                    selectedRegion === region.region 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{region.region}</h4>
                      <p className="text-sm text-muted-foreground">{region.projects} projects</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(region.value)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="dashboard-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold">Project Details</h3>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Project</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Sector</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Region</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">Value</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">ESG Score</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors">
                    <td className="py-3 font-medium">{project.name}</td>
                    <td className="py-3 text-sm">{project.sector}</td>
                    <td className="py-3 text-sm">{project.region}</td>
                    <td className="py-3 text-right font-medium">{formatCurrency(project.value)}</td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "font-medium",
                        project.esgScore >= 80 ? "text-success" : 
                        project.esgScore >= 60 ? "text-warning" : "text-destructive"
                      )}>
                        {project.esgScore}%
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        getStatusColor(project.status)
                      )}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
