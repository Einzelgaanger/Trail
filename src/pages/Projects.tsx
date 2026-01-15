"use client";
import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Filter,
  Download,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Project {
  id: string;
  projectId: string;
  name: string;
  sector: string;
  location: string;
  amount: number;
  startDate: string;
  endDate: string;
  taxonomyStatus: "Green" | "Transition" | "Not Green";
  esgStatus: "Complete" | "Incomplete";
  progress: number;
}

const mockProjects: Project[] = [
  {
    id: "1",
    projectId: "DBN-2024-001",
    name: "Lagos Solar Farm Development",
    sector: "Renewable Energy",
    location: "Lagos",
    amount: 2500000000,
    startDate: "2024-01-15",
    endDate: "2025-12-31",
    taxonomyStatus: "Green",
    esgStatus: "Complete",
    progress: 75,
  },
  {
    id: "2",
    projectId: "DBN-2024-002",
    name: "Kano Agricultural Expansion",
    sector: "Agriculture",
    location: "Kano",
    amount: 1800000000,
    startDate: "2024-03-01",
    endDate: "2026-02-28",
    taxonomyStatus: "Transition",
    esgStatus: "Incomplete",
    progress: 45,
  },
  {
    id: "3",
    projectId: "DBN-2024-003",
    name: "Abuja Green Building Initiative",
    sector: "Real Estate",
    location: "Abuja",
    amount: 3200000000,
    startDate: "2024-02-10",
    endDate: "2025-08-15",
    taxonomyStatus: "Green",
    esgStatus: "Complete",
    progress: 60,
  },
  {
    id: "4",
    projectId: "DBN-2024-004",
    name: "Rivers State Water Treatment",
    sector: "Water & Sanitation",
    location: "Rivers",
    amount: 1500000000,
    startDate: "2024-04-01",
    endDate: "2025-10-31",
    taxonomyStatus: "Green",
    esgStatus: "Incomplete",
    progress: 30,
  },
  {
    id: "5",
    projectId: "DBN-2023-018",
    name: "Ogun Manufacturing Hub",
    sector: "Manufacturing",
    location: "Ogun",
    amount: 4500000000,
    startDate: "2023-06-15",
    endDate: "2025-06-14",
    taxonomyStatus: "Not Green",
    esgStatus: "Complete",
    progress: 85,
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getTaxonomyColor = (status: string) => {
  switch (status) {
    case "Green":
      return "bg-success/10 text-success border-success/20";
    case "Transition":
      return "bg-warning/10 text-warning border-warning/20";
    case "Not Green":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export default function Projects() {
  const [searchText, setSearchText] = useState("");
  const [taxonomyFilter, setTaxonomyFilter] = useState<string>("all");

  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        project.projectId.toLowerCase().includes(searchText.toLowerCase()) ||
        project.sector.toLowerCase().includes(searchText.toLowerCase()) ||
        project.location.toLowerCase().includes(searchText.toLowerCase());
      const matchesTaxonomy = taxonomyFilter === "all" || project.taxonomyStatus === taxonomyFilter;
      return matchesSearch && matchesTaxonomy;
    });
  }, [searchText, taxonomyFilter]);

  const totalValue = filteredProjects.reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="view-title">Projects & Programmes</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all your funded projects
            </p>
          </div>
          <Link to="/programme/new-programme">
            <Button className="btn-primary gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="stat-card">
            <p className="stat-title">Total Projects</p>
            <p className="stat-value">{filteredProjects.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">Portfolio Value</p>
            <p className="stat-value text-lg">{formatCurrency(totalValue)}</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">Green Projects</p>
            <p className="stat-value text-success">
              {filteredProjects.filter(p => p.taxonomyStatus === "Green").length}
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-title">ESG Complete</p>
            <p className="stat-value">
              {filteredProjects.filter(p => p.esgStatus === "Complete").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {["all", "Green", "Transition", "Not Green"].map((status) => (
              <Button
                key={status}
                variant={taxonomyFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setTaxonomyFilter(status)}
                className={cn(
                  taxonomyFilter === status && "bg-primary text-primary-foreground"
                )}
              >
                {status === "all" ? "All" : status}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="dashboard-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground font-mono">{project.projectId}</p>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium border",
                  getTaxonomyColor(project.taxonomyStatus)
                )}>
                  {project.taxonomyStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{project.startDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="font-medium">{formatCurrency(project.amount)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {project.esgStatus === "Complete" ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <Clock className="w-4 h-4 text-warning" />
                  )}
                  <span>ESG {project.esgStatus}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-muted rounded text-xs">{project.sector}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
