"use client";
import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Leaf,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaxonomyProject {
  id: string;
  name: string;
  sector: string;
  status: "Green" | "Transition" | "Not Green";
  alignmentPercentage: number;
  classificationDate: string;
  criteriaMet: number;
  totalCriteria: number;
}

const mockProjects: TaxonomyProject[] = [
  { id: "1", name: "Lagos Solar Farm Development", sector: "Renewable Energy", status: "Green", alignmentPercentage: 95, classificationDate: "2024-12-15", criteriaMet: 12, totalCriteria: 12 },
  { id: "2", name: "Rivers State Water Treatment", sector: "Water & Sanitation", status: "Green", alignmentPercentage: 88, classificationDate: "2024-11-20", criteriaMet: 10, totalCriteria: 12 },
  { id: "3", name: "Abuja Green Building Initiative", sector: "Real Estate", status: "Green", alignmentPercentage: 82, classificationDate: "2024-10-05", criteriaMet: 9, totalCriteria: 12 },
  { id: "4", name: "Kano Agricultural Expansion", sector: "Agriculture", status: "Transition", alignmentPercentage: 65, classificationDate: "2024-09-18", criteriaMet: 7, totalCriteria: 12 },
  { id: "5", name: "Ogun Manufacturing Hub", sector: "Manufacturing", status: "Not Green", alignmentPercentage: 35, classificationDate: "2024-08-22", criteriaMet: 4, totalCriteria: 12 },
  { id: "6", name: "Kaduna Wind Farm Project", sector: "Renewable Energy", status: "Green", alignmentPercentage: 92, classificationDate: "2024-12-01", criteriaMet: 11, totalCriteria: 12 },
  { id: "7", name: "Enugu Clean Transport", sector: "Transportation", status: "Transition", alignmentPercentage: 58, classificationDate: "2024-07-15", criteriaMet: 6, totalCriteria: 12 },
  { id: "8", name: "Delta Oil Remediation", sector: "Environmental Services", status: "Not Green", alignmentPercentage: 25, classificationDate: "2024-06-10", criteriaMet: 3, totalCriteria: 12 },
];

const taxonomyCriteria = [
  "Climate Change Mitigation",
  "Climate Change Adaptation", 
  "Water & Marine Resources Protection",
  "Circular Economy Transition",
  "Pollution Prevention & Control",
  "Biodiversity & Ecosystems Protection",
  "Do No Significant Harm (DNSH)",
  "Minimum Social Safeguards",
  "Technical Screening Criteria",
  "Substantial Contribution",
  "Environmental Impact Assessment",
  "Social Impact Assessment",
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Green": return "bg-success text-white";
    case "Transition": return "bg-warning text-white";
    case "Not Green": return "bg-destructive text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Green": return <CheckCircle className="w-4 h-4" />;
    case "Transition": return <AlertCircle className="w-4 h-4" />;
    case "Not Green": return <XCircle className="w-4 h-4" />;
    default: return null;
  }
};

export default function GreenTaxonomy() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        project.sector.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchText, statusFilter]);

  // Calculate overview stats
  const overviewStats = useMemo(() => {
    const total = mockProjects.length;
    const green = mockProjects.filter(p => p.status === "Green").length;
    const transition = mockProjects.filter(p => p.status === "Transition").length;
    const notGreen = mockProjects.filter(p => p.status === "Not Green").length;
    return {
      total,
      green,
      transition,
      notGreen,
      greenPercentage: Math.round((green / total) * 100),
      transitionPercentage: Math.round((transition / total) * 100),
      notGreenPercentage: Math.round((notGreen / total) * 100),
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="view-title">Green Taxonomy</h1>
            <p className="text-muted-foreground mt-1">
              View and manage green taxonomy classifications for projects
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Taxonomy Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="stat-card">
            <p className="stat-title">Total Projects</p>
            <p className="stat-value">{overviewStats.total}</p>
          </div>
          <div className="stat-card border-l-4 border-l-success">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-success" />
              <p className="stat-title">Green</p>
            </div>
            <p className="stat-value text-success">{overviewStats.green}</p>
            <p className="text-xs text-muted-foreground">{overviewStats.greenPercentage}% of portfolio</p>
          </div>
          <div className="stat-card border-l-4 border-l-warning">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-warning" />
              <p className="stat-title">Transition</p>
            </div>
            <p className="stat-value text-warning">{overviewStats.transition}</p>
            <p className="text-xs text-muted-foreground">{overviewStats.transitionPercentage}% of portfolio</p>
          </div>
          <div className="stat-card border-l-4 border-l-destructive">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-destructive" />
              <p className="stat-title">Not Green</p>
            </div>
            <p className="stat-value text-destructive">{overviewStats.notGreen}</p>
            <p className="text-xs text-muted-foreground">{overviewStats.notGreenPercentage}% of portfolio</p>
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
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  statusFilter === status && "bg-primary text-primary-foreground"
                )}
              >
                {status === "all" ? "All" : status}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Table */}
          <div className="lg:col-span-2 dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-success" />
              Projects by Taxonomy Status
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Project Name</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Sector</th>
                    <th className="text-center py-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-center py-3 text-sm font-medium text-muted-foreground">Alignment</th>
                    <th className="text-center py-3 text-sm font-medium text-muted-foreground">Criteria</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors">
                      <td className="py-3">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-muted-foreground">{project.classificationDate}</div>
                      </td>
                      <td className="py-3 text-sm">{project.sector}</td>
                      <td className="py-3 text-center">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
                          getStatusColor(project.status)
                        )}>
                          {getStatusIcon(project.status)}
                          {project.status}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                project.alignmentPercentage >= 70 ? "bg-success" : 
                                project.alignmentPercentage >= 50 ? "bg-warning" : "bg-destructive"
                              )}
                              style={{ width: `${project.alignmentPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{project.alignmentPercentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-sm">
                        {project.criteriaMet}/{project.totalCriteria}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Taxonomy Criteria */}
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Taxonomy Criteria
            </h3>
            <div className="space-y-2">
              {taxonomyCriteria.map((criteria, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                    {idx + 1}
                  </div>
                  <span className="text-sm">{criteria}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
