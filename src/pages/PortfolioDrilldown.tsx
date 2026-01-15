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
  Layers,
  XCircle,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Extended mock data per Documentation
interface Project {
  id: string;
  projectId: string;
  pfiName: string;
  sector: string;
  location: string;
  amount: number;
  startDate: string;
  endDate: string;
  taxonomyStatus: "Green" | "Transition" | "Not Green";
  esgStatus: "Complete" | "Incomplete";
  esgRagStatus: "Compliant" | "Warning" | "Critical";
  scope1: boolean;
  scope2: boolean;
  scope3: boolean;
  dataQualityScore: number;
}

const projectDetails: Project[] = [
  { id: "1", projectId: "DBN-2024-001", pfiName: "Lagos Solar Farm", sector: "Renewable Energy", location: "Lagos", amount: 2500000000, startDate: "2024-01-15", endDate: "2025-12-31", taxonomyStatus: "Green", esgStatus: "Complete", esgRagStatus: "Compliant", scope1: true, scope2: true, scope3: false, dataQualityScore: 95 },
  { id: "2", projectId: "DBN-2024-002", pfiName: "Kano Agri Hub", sector: "Agriculture", location: "Kano", amount: 1800000000, startDate: "2024-03-01", endDate: "2026-02-28", taxonomyStatus: "Transition", esgStatus: "Incomplete", esgRagStatus: "Warning", scope1: true, scope2: true, scope3: true, dataQualityScore: 72 },
  { id: "3", projectId: "DBN-2024-003", pfiName: "Abuja Green Building", sector: "Real Estate", location: "Abuja", amount: 3200000000, startDate: "2024-02-10", endDate: "2025-08-15", taxonomyStatus: "Green", esgStatus: "Complete", esgRagStatus: "Compliant", scope1: true, scope2: true, scope3: true, dataQualityScore: 88 },
  { id: "4", projectId: "DBN-2024-004", pfiName: "Rivers Water Treatment", sector: "Water & Sanitation", location: "Rivers", amount: 1500000000, startDate: "2024-04-01", endDate: "2025-10-31", taxonomyStatus: "Green", esgStatus: "Complete", esgRagStatus: "Compliant", scope1: true, scope2: true, scope3: false, dataQualityScore: 92 },
  { id: "5", projectId: "DBN-2023-018", pfiName: "Ogun Manufacturing", sector: "Manufacturing", location: "Ogun", amount: 4500000000, startDate: "2023-06-15", endDate: "2025-06-14", taxonomyStatus: "Not Green", esgStatus: "Complete", esgRagStatus: "Critical", scope1: true, scope2: true, scope3: true, dataQualityScore: 45 },
  { id: "6", projectId: "DBN-2024-005", pfiName: "Kaduna Wind Farm", sector: "Renewable Energy", location: "Kaduna", amount: 2100000000, startDate: "2024-05-01", endDate: "2026-05-01", taxonomyStatus: "Green", esgStatus: "Incomplete", esgRagStatus: "Warning", scope1: true, scope2: true, scope3: false, dataQualityScore: 78 },
];

const sectorData = [
  { sector: "Renewable Energy", projects: 12, value: 4500000000, esgScore: 92, greenPercentage: 95 },
  { sector: "Agriculture", projects: 8, value: 2800000000, esgScore: 75, greenPercentage: 72 },
  { sector: "Manufacturing", projects: 10, value: 3200000000, esgScore: 65, greenPercentage: 45 },
  { sector: "Real Estate", projects: 7, value: 1500000000, esgScore: 82, greenPercentage: 68 },
  { sector: "Water & Sanitation", projects: 5, value: 500000000, esgScore: 88, greenPercentage: 90 },
];

const regionData = [
  { region: "Lagos", projects: 15, value: 4200000000 },
  { region: "Abuja", projects: 10, value: 3500000000 },
  { region: "Rivers", projects: 8, value: 2800000000 },
  { region: "Kano", projects: 5, value: 1200000000 },
  { region: "Ogun", projects: 4, value: 800000000 },
];

const formatCurrency = (value: number) => {
  if (value >= 1000000000) {
    return `₦${(value / 1000000000).toFixed(1)}B`;
  }
  return `₦${(value / 1000000).toFixed(0)}M`;
};

const getTaxonomyColor = (status: string) => {
  switch (status) {
    case "Green": return "bg-success text-white";
    case "Transition": return "bg-warning text-white";
    case "Not Green": return "bg-destructive text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

const getEsgStatusColor = (status: string) => {
  return status === "Complete" ? "bg-success/10 text-success" : "bg-warning/10 text-warning";
};

const getRagColor = (status: string) => {
  switch (status) {
    case "Compliant": return "bg-success/10 text-success border-success/20";
    case "Warning": return "bg-warning/10 text-warning border-warning/20";
    case "Critical": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const getQualityColor = (score: number) => {
  if (score >= 80) return "bg-success text-white";
  if (score >= 60) return "bg-warning text-white";
  return "bg-destructive text-white";
};

export default function PortfolioDrilldown() {
  const [searchText, setSearchText] = useState("");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [taxonomyFilter, setTaxonomyFilter] = useState<string>("all");
  const [esgStatusFilter, setEsgStatusFilter] = useState<string>("all");
  const [ragFilter, setRagFilter] = useState<string>("all");

  const filteredProjects = useMemo(() => {
    return projectDetails.filter((project) => {
      const matchesSearch = project.pfiName.toLowerCase().includes(searchText.toLowerCase()) ||
        project.projectId.toLowerCase().includes(searchText.toLowerCase()) ||
        project.sector.toLowerCase().includes(searchText.toLowerCase()) ||
        project.location.toLowerCase().includes(searchText.toLowerCase());
      const matchesSector = !selectedSector || project.sector === selectedSector;
      const matchesRegion = !selectedRegion || project.location === selectedRegion;
      const matchesTaxonomy = taxonomyFilter === "all" || project.taxonomyStatus === taxonomyFilter;
      const matchesEsgStatus = esgStatusFilter === "all" || project.esgStatus === esgStatusFilter;
      const matchesRag = ragFilter === "all" || project.esgRagStatus === ragFilter;
      return matchesSearch && matchesSector && matchesRegion && matchesTaxonomy && matchesEsgStatus && matchesRag;
    });
  }, [searchText, selectedSector, selectedRegion, taxonomyFilter, esgStatusFilter, ragFilter]);

  const stats = useMemo(() => ({
    totalProjects: filteredProjects.length,
    totalValue: filteredProjects.reduce((sum, p) => sum + p.amount, 0),
    greenProjects: filteredProjects.filter(p => p.taxonomyStatus === "Green").length,
    avgDataQuality: filteredProjects.length > 0 
      ? Math.round(filteredProjects.reduce((sum, p) => sum + p.dataQualityScore, 0) / filteredProjects.length)
      : 0
  }), [filteredProjects]);

  const clearFilters = () => {
    setSearchText("");
    setSelectedSector(null);
    setSelectedRegion(null);
    setTaxonomyFilter("all");
    setEsgStatusFilter("all");
    setRagFilter("all");
  };

  const exportToCSV = () => {
    const date = new Date().toISOString().split('T')[0];
    const filename = `Portfolio_Drilldown_Projects_${date}.csv`;
    
    const headers = ["Project ID", "PFI Name", "Sector", "Location", "Amount (₦)", "Start Date", "End Date", "Taxonomy Status", "ESG Status", "ESG RAG", "Scope 1", "Scope 2", "Scope 3", "Data Quality Score"];
    const rows = filteredProjects.map(p => [
      p.projectId,
      p.pfiName,
      p.sector,
      p.location,
      p.amount,
      p.startDate,
      p.endDate,
      p.taxonomyStatus,
      p.esgStatus,
      p.esgRagStatus,
      p.scope1 ? "Yes" : "No",
      p.scope2 ? "Yes" : "No",
      p.scope3 ? "Yes" : "No",
      p.dataQualityScore
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const breadcrumb = ["Portfolio", selectedSector, selectedRegion].filter(Boolean);
  const hasActiveFilters = selectedSector || selectedRegion || taxonomyFilter !== "all" || esgStatusFilter !== "all" || ragFilter !== "all" || searchText;

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
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Clear
              </Button>
            )}
            <Button onClick={exportToCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export to CSV
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
                    if (idx === 0) { setSelectedSector(null); setSelectedRegion(null); }
                    else if (idx === 1) { setSelectedRegion(null); }
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

        {/* Statistics Cards per Documentation */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-primary" />
              <p className="stat-title">Total Projects</p>
            </div>
            <p className="stat-value">{stats.totalProjects}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <p className="stat-title">Total Portfolio Value</p>
            </div>
            <p className="stat-value">{formatCurrency(stats.totalValue)}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <p className="stat-title">Green Projects</p>
            </div>
            <p className="stat-value text-success">{stats.greenProjects} <span className="text-sm text-muted-foreground">/ {stats.totalProjects}</span></p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="stat-title">Avg Data Quality</p>
            </div>
            <p className="stat-value">{stats.avgDataQuality}%</p>
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
                    selectedSector === sector.sector ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
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
                    <div className="h-full bg-success rounded-full" style={{ width: `${sector.greenPercentage}%` }} />
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
                    selectedRegion === region.region ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
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

        {/* Full Table per Documentation */}
        <div className="dashboard-card">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Project ID, PFI Name, Sector, Location..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            {/* Filters Row */}
            <div className="flex flex-wrap gap-2">
              <select 
                value={taxonomyFilter} 
                onChange={(e) => setTaxonomyFilter(e.target.value)}
                className="h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All Taxonomy</option>
                <option value="Green">Green</option>
                <option value="Transition">Transition</option>
                <option value="Not Green">Not Green</option>
              </select>
              <select 
                value={esgStatusFilter} 
                onChange={(e) => setEsgStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All ESG Status</option>
                <option value="Complete">Complete</option>
                <option value="Incomplete">Incomplete</option>
              </select>
              <select 
                value={ragFilter} 
                onChange={(e) => setRagFilter(e.target.value)}
                className="h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All RAG Status</option>
                <option value="Compliant">Compliant</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground sticky left-0 bg-card">Project ID</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">PFI Name</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Sector</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Location</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground">Amount (₦) ↕</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Start Date</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">End Date</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Taxonomy</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">ESG Status</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Carbon Status</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground">Data Quality ↕</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors">
                    <td className="py-3 font-mono text-sm sticky left-0 bg-card">{project.projectId}</td>
                    <td className="py-3 font-medium">{project.pfiName}</td>
                    <td className="py-3 text-sm">{project.sector}</td>
                    <td className="py-3 text-sm">{project.location}</td>
                    <td className="py-3 text-right font-medium">{formatCurrency(project.amount)}</td>
                    <td className="py-3 text-center text-sm">{project.startDate}</td>
                    <td className="py-3 text-center text-sm">{project.endDate}</td>
                    <td className="py-3 text-center">
                      <span className={cn("px-2 py-1 rounded text-xs font-medium", getTaxonomyColor(project.taxonomyStatus))}>
                        {project.taxonomyStatus}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn("px-2 py-0.5 rounded text-xs font-medium", getEsgStatusColor(project.esgStatus))}>
                          {project.esgStatus}
                        </span>
                        <span className={cn("px-2 py-0.5 rounded text-xs font-medium border", getRagColor(project.esgRagStatus))}>
                          {project.esgRagStatus}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className={cn("px-1.5 py-0.5 rounded text-xs", project.scope1 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>S1</span>
                        <span className={cn("px-1.5 py-0.5 rounded text-xs", project.scope2 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>S2</span>
                        <span className={cn("px-1.5 py-0.5 rounded text-xs", project.scope3 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>S3</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className={cn("px-2 py-1 rounded text-xs font-medium", getQualityColor(project.dataQualityScore))}>
                        {project.dataQualityScore}%
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
