"use client";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  FolderKanban,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Leaf,
  BarChart3,
  Globe,
  Flame,
  TrendingUp,
  Users,
  LogOut,
  HelpCircle,
} from "lucide-react";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ReactNode;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: "ESG Management",
    icon: <Leaf className="w-5 h-5" />,
    children: [
      { title: "ESG Analytics", href: "/dashboard/insights" },
      { title: "Green Taxonomy", href: "/green-taxonomy" },
      { title: "Carbon & Net Zero", href: "/carbon-netzero" },
      { title: "Portfolio Drilldown", href: "/projects-drilldown" },
    ],
  },
  {
    title: "Goals & Indicators",
    href: "/goals-indicator",
    icon: <Target className="w-5 h-5" />,
  },
  {
    title: "Projects",
    icon: <FolderKanban className="w-5 h-5" />,
    children: [
      { title: "All Projects", href: "/programme" },
      { title: "New Project", href: "/programme/new-programme" },
      { title: "PFI Submissions", href: "/form" },
    ],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export function Sidebar() {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(["ESG Management"]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isChildActive = (children: { title: string; href: string }[]) =>
    children.some((child) => location.pathname === child.href);

  return (
    <aside className="sidebar-nav fixed left-0 top-0 z-40 h-screen flex flex-col shadow-sidebar">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground tracking-tight">
            Trail
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={cn(
                      "sidebar-link w-full justify-between",
                      isChildActive(item.children) && "bg-sidebar-accent text-sidebar-foreground"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </span>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedItems.includes(item.title) && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className={cn(
                            "sidebar-link text-sm py-2",
                            isActive(child.href) && "active"
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href!}
                  className={cn(
                    "sidebar-link",
                    isActive(item.href!) && "active"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-sidebar-border p-2">
        <button className="sidebar-link w-full">
          <HelpCircle className="w-5 h-5" />
          <span>Help & Support</span>
        </button>
        <div className="sidebar-link mx-2 mt-2 bg-sidebar-accent/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-sidebar-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Garden Ventures
            </p>
            <p className="text-xs text-sidebar-muted truncate">Administrator</p>
          </div>
        </div>
        <Link to="/" className="sidebar-link w-full mt-2 text-destructive/80 hover:text-destructive hover:bg-destructive/10">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
