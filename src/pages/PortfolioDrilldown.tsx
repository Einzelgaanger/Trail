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
  CheckCircle,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { projects, calculateSectorBreakdown, calculateRegionBreakdown, formatCurrencyShort } from "@/data/esgData";
import { exportPDF } from "@/lib/pdfExport";

const getTaxonomyColor = (status: string) => {
  switch (status) {
    case "Green": return "bg-success text-white";
    case "Transition": return "bg-warning text-white";
    case "Not Green": return "bg-destructive text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

const getEsgStatusColor = (completeness: number) => {
  return completeness >= 80 ? "bg-success/10 text-success" : "bg-warning/10 text-warning";
};

const getRagColor = (status: string) => {
  switch (status) {
    case "On Track": return "bg-success/10 text-success border-success/20";
    case "At Risk": return "bg-warning/10 text-warning border-warning/20";
    case "Off Track": return "bg-destructive/10 text-destructive border-destructive/20";
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

  const sectorData = calculateSectorBreakdown();
  const regionData = calculateRegionBreakdown();

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.enterpriseName.toLowerCase().includes(searchText.toLowerCase()) ||
        project.projectId.toLowerCase().includes(searchText.toLowerCase()) ||
        project.sector.toLowerCase().includes(searchText.toLowerCase()) ||
        project.state.toLowerCase().includes(searchText.toLowerCase()) ||
        project.pfiName.toLowerCase().includes(searchText.toLowerCase());
      const matchesSector = !selectedSector || project.sector === selectedSector;
      const matchesRegion = !selectedRegion || project.state === selectedRegion;
      const matchesTaxonomy = taxonomyFilter === "all" || project.taxonomyStatus === taxonomyFilter;
      const matchesEsgStatus = esgStatusFilter === "all" || 
        (esgStatusFilter === "Complete" ? project.esgCompleteness >= 80 : project.esgCompleteness < 80);
      const matchesRag = ragFilter === "all" || project.carbonStatus === ragFilter;
      return matchesSearch && matchesSector && matchesRegion && matchesTaxonomy && matchesEsgStatus && matchesRag;
    });
  }, [searchText, selectedSector, selectedRegion, taxonomyFilter, esgStatusFilter, ragFilter]);

  const stats = useMemo(() => ({
    totalProjects: filteredProjects.length,
    totalValue: filteredProjects.reduce((sum, p) => sum + p.loanAmount, 0),
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
    
    const headers = ["Project ID", "PFI Name", "Enterprise", "Sector", "State", "Amount (₦)", "Start Year", "Taxonomy Status", "ESG %", "Carbon Status", "Scope 1", "Scope 2", "Scope 3", "Data Quality"];
    const rows = filteredProjects.map(p => [
      p.projectId,
      p.pfiName,
      p.enterpriseName,
      p.sector,
      p.state,
      p.loanAmount,
      p.projectStartYear,
      p.taxonomyStatus,
      p.esgCompleteness,
      p.carbonStatus,
      p.scope1,
      p.scope2,
      p.scope3,
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
              Detailed project view with drill-down capabilities
            </p>
          </div>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Clear
              </Button>
            )}
            <Button onClick={() => exportPDF("projects")} variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
            <Button onClick={exportToCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
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

        {/* Statistics Cards */}
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
            <p className="stat-value">{formatCurrencyShort(stats.totalValue)}</p>
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
              {sectorData.slice(0, 6).map((sector) => (
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
                      <p className="font-semibold">{formatCurrencyShort(sector.value)}</p>
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
              Breakdown by State
            </h3>
            <div className="space-y-3">
              {regionData.slice(0, 6).map((region) => (
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
                    <p className="font-semibold">{formatCurrencyShort(region.value)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Full Table */}
        <div className="dashboard-card">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Project ID, PFI, Enterprise, Sector..."
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
                <option value="Complete">Complete (≥80%)</option>
                <option value="Incomplete">Incomplete (&lt;80%)</option>
              </select>
              <select 
                value={ragFilter} 
                onChange={(e) => setRagFilter(e.target.value)}
                className="h-9 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="all">All Carbon Status</option>
                <option value="On Track">On Track</option>
                <option value="At Risk">At Risk</option>
                <option value="Off Track">Off Track</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground sticky left-0 bg-card">Project ID</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">PFI</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Enterprise</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Sector</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">State</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Taxonomy</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">ESG %</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Carbon Status</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Scope 1/2/3</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Quality</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.slice(0, 20).map((project) => (
                  <tr key={project.projectId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-mono text-sm sticky left-0 bg-card">{project.projectId}</td>
                    <td className="py-3 text-sm">{project.pfiName}</td>
                    <td className="py-3 font-medium text-sm">{project.enterpriseName}</td>
                    <td className="py-3 text-sm text-muted-foreground">{project.sector}</td>
                    <td className="py-3 text-sm text-muted-foreground">{project.state}</td>
                    <td className="py-3 text-right text-sm font-medium">{formatCurrencyShort(project.loanAmount)}</td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        getTaxonomyColor(project.taxonomyStatus)
                      )}>
                        {project.taxonomyStatus}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        getEsgStatusColor(project.esgCompleteness)
                      )}>
                        {project.esgCompleteness}%
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium border",
                        getRagColor(project.carbonStatus)
                      )}>
                        {project.carbonStatus}
                      </span>
                    </td>
                    <td className="py-3 text-center text-xs text-muted-foreground">
                      {project.scope1} / {project.scope2} / {project.scope3}
                    </td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        getQualityColor(project.dataQualityScore)
                      )}>
                        {project.dataQualityScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProjects.length > 20 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Showing 20 of {filteredProjects.length} projects. Export to see all.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
