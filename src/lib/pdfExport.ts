import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Project, calculatePortfolioStats, formatCurrencyShort, projects } from "@/data/esgData";

// Extend jsPDF type for autoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

// Professional color palette
const colors = {
  primary: [25, 105, 51] as [number, number, number],      // Forest green
  primaryLight: [39, 174, 96] as [number, number, number], // Light green
  accent: [212, 143, 5] as [number, number, number],       // Gold
  dark: [15, 15, 15] as [number, number, number],          // Near black
  text: [33, 33, 33] as [number, number, number],
  textLight: [100, 100, 100] as [number, number, number],
  success: [34, 197, 94] as [number, number, number],
  warning: [234, 179, 8] as [number, number, number],
  danger: [239, 68, 68] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  gray50: [249, 250, 251] as [number, number, number],
  gray100: [243, 244, 246] as [number, number, number],
  gray200: [229, 231, 235] as [number, number, number],
};

// Helper to draw a professional cover page
const drawCoverPage = (doc: jsPDF, title: string, subtitle: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Full page gradient background
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Gold accent bar
  doc.setFillColor(...colors.accent);
  doc.rect(0, 85, pageWidth, 6, "F");

  // Decorative lighter stripe at top
  doc.setFillColor(30, 120, 60);
  doc.triangle(pageWidth - 100, 0, pageWidth, 0, pageWidth, 140, "F");

  // Logo area - Trail text
  doc.setTextColor(...colors.white);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("Trail", 20, 50);

  // Subtitle under logo
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("ESG Integrated Solution", 20, 62);

  // Main title
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, 130);

  // Subtitle
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 220, 220);
  doc.text(subtitle, 20, 145);

  // Report metadata box
  const boxY = 180;
  doc.setFillColor(35, 115, 60);
  doc.roundedRect(20, boxY, pageWidth - 40, 60, 4, 4, "F");

  doc.setTextColor(...colors.white);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("REPORT INFORMATION", 30, boxY + 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const dateStr = new Date().toLocaleDateString("en-NG", { 
    year: "numeric", 
    month: "long", 
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  doc.text(`Generated: ${dateStr}`, 30, boxY + 28);
  doc.text("Classification: Confidential", 30, boxY + 40);
  doc.text("Prepared by: DBN ESG Platform", 30, boxY + 52);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255, 0.6);
  doc.text("Development Bank of Nigeria", 20, pageHeight - 25);
  doc.text("© 2025 Trail ESG Platform. All rights reserved.", 20, pageHeight - 15);
};

// Helper to add page header
const addPageHeader = (doc: jsPDF, title: string, pageNum: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header bar
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 20, "F");

  // Gold accent line
  doc.setFillColor(...colors.accent);
  doc.rect(0, 20, pageWidth, 2, "F");

  // Title
  doc.setTextColor(...colors.white);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 13);

  // Page number
  doc.setFontSize(9);
  doc.text(`Page ${pageNum}`, pageWidth - 25, 13);
};

// Helper to add page footer
const addPageFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(...colors.gray100);
  doc.rect(0, pageHeight - 12, pageWidth, 12, "F");

  doc.setTextColor(...colors.textLight);
  doc.setFontSize(7);
  doc.text("Development Bank of Nigeria - ESG Integrated Solution | Confidential", 14, pageHeight - 5);
  doc.text(new Date().toLocaleDateString(), pageWidth - 30, pageHeight - 5);
};

// Helper to draw KPI cards
const drawKPICards = (doc: jsPDF, stats: ReturnType<typeof calculatePortfolioStats>, startY: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const cardWidth = (pageWidth - 38) / 4;
  const cardHeight = 38;

  const kpis = [
    { label: "Portfolio Value", value: `₦${(stats.totalPortfolioValue / 1000000000).toFixed(1)}B`, sub: `${stats.totalProjects} Active Projects`, color: colors.primary },
    { label: "ESG Completeness", value: `${stats.avgEsgCompleteness}%`, sub: "Average Score", color: colors.primaryLight },
    { label: "Green Taxonomy", value: `${stats.greenTaxonomy.greenPercentage}%`, sub: `${stats.greenTaxonomy.green} Projects`, color: colors.success },
    { label: "Carbon Emissions", value: `${(stats.carbonSummary.total / 1000).toFixed(1)}k`, sub: "tCO₂e Total", color: colors.accent },
  ];

  kpis.forEach((kpi, i) => {
    const x = 14 + i * (cardWidth + 3);
    
    // Card background
    doc.setFillColor(...colors.gray50);
    doc.roundedRect(x, startY, cardWidth, cardHeight, 3, 3, "F");

    // Color accent bar at top
    doc.setFillColor(...kpi.color);
    doc.roundedRect(x, startY, cardWidth, 4, 3, 3, "F");
    doc.setFillColor(...colors.gray50);
    doc.rect(x, startY + 2, cardWidth, 4, "F");

    // Label
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.textLight);
    doc.text(kpi.label, x + 8, startY + 14);

    // Value
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...kpi.color);
    doc.text(kpi.value, x + 8, startY + 27);

    // Sub text
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.textLight);
    doc.text(kpi.sub, x + 8, startY + 34);
  });

  return startY + cardHeight + 10;
};

// Section header helper
const drawSectionHeader = (doc: jsPDF, title: string, y: number) => {
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.dark);
  doc.text(title, 14, y);

  // Accent underline
  doc.setDrawColor(...colors.accent);
  doc.setLineWidth(1.5);
  doc.line(14, y + 2, 14 + doc.getTextWidth(title), y + 2);

  return y + 10;
};

export const generatePortfolioPDF = () => {
  const doc = new jsPDF();
  const stats = calculatePortfolioStats();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Cover Page
  drawCoverPage(doc, "ESG Portfolio Pack", "Comprehensive ESG Performance Report");

  // Page 2 - Executive Summary
  doc.addPage();
  addPageHeader(doc, "Executive Summary", 2);

  // KPI Cards
  let currentY = drawKPICards(doc, stats, 32);

  // Executive Summary Text
  currentY = drawSectionHeader(doc, "Portfolio Overview", currentY + 5);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.text);
  const summaryText = `This report provides a comprehensive overview of the Development Bank of Nigeria's ESG portfolio comprising ${stats.totalProjects} active projects with a combined value of ₦${(stats.totalPortfolioValue / 1000000000).toFixed(2)} billion. The portfolio demonstrates strong ESG performance with an average completeness score of ${stats.avgEsgCompleteness}% and ${stats.greenTaxonomy.greenPercentage}% of projects meeting Green Taxonomy criteria.`;
  const splitText = doc.splitTextToSize(summaryText, pageWidth - 28);
  doc.text(splitText, 14, currentY);
  currentY += splitText.length * 5 + 8;

  // Green Taxonomy Classification
  currentY = drawSectionHeader(doc, "Green Taxonomy Classification", currentY);

  autoTable(doc, {
    startY: currentY,
    head: [["Classification", "Projects", "Percentage", "Portfolio Value", "Status"]],
    body: [
      ["Green", stats.greenTaxonomy.green.toString(), `${stats.greenTaxonomy.greenPercentage}%`, `${stats.greenTaxonomy.greenPercentageByValue}% of total`, "✓ Fully Aligned"],
      ["Transition", stats.greenTaxonomy.transition.toString(), `${stats.greenTaxonomy.transitionPercentage}%`, "Progressing", "→ In Progress"],
      ["Not Green", stats.greenTaxonomy.notGreen.toString(), `${stats.greenTaxonomy.notGreenPercentage}%`, "Action Required", "⚠ Review Needed"],
    ],
    headStyles: { 
      fillColor: colors.primary, 
      textColor: colors.white,
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 4,
    },
    bodyStyles: { fontSize: 9, cellPadding: 4 },
    alternateRowStyles: { fillColor: colors.gray50 },
    margin: { left: 14, right: 14 },
    tableWidth: pageWidth - 28,
    styles: { overflow: "linebreak" },
  });

  // Carbon Summary
  currentY = doc.lastAutoTable.finalY + 15;
  currentY = drawSectionHeader(doc, "Carbon Emissions Summary", currentY);

  autoTable(doc, {
    startY: currentY,
    head: [["Scope", "Emissions (tCO₂e)", "% of Total", "Description"]],
    body: [
      ["Scope 1 - Direct", stats.carbonSummary.scope1.toLocaleString(), `${Math.round((stats.carbonSummary.scope1 / stats.carbonSummary.total) * 100)}%`, "Direct emissions from owned operations"],
      ["Scope 2 - Energy", stats.carbonSummary.scope2.toLocaleString(), `${Math.round((stats.carbonSummary.scope2 / stats.carbonSummary.total) * 100)}%`, "Indirect emissions from purchased energy"],
      ["Scope 3 - Indirect", stats.carbonSummary.scope3.toLocaleString(), `${Math.round((stats.carbonSummary.scope3 / stats.carbonSummary.total) * 100)}%`, "Other indirect value chain emissions"],
      ["Total Portfolio", stats.carbonSummary.total.toLocaleString(), "100%", "Combined emissions across all scopes"],
    ],
    headStyles: { 
      fillColor: colors.primary, 
      textColor: colors.white,
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 4,
    },
    bodyStyles: { fontSize: 9, cellPadding: 4 },
    alternateRowStyles: { fillColor: colors.gray50 },
    margin: { left: 14, right: 14 },
    tableWidth: pageWidth - 28,
  });

  // ESG Status Flags
  currentY = doc.lastAutoTable.finalY + 15;
  currentY = drawSectionHeader(doc, "ESG Status Flags", currentY);

  autoTable(doc, {
    startY: currentY,
    head: [["Status Level", "Count", "Percentage", "Required Action"]],
    body: [
      ["🔴 Critical", stats.esgFlags.critical.toString(), `${Math.round((stats.esgFlags.critical / stats.totalProjects) * 100)}%`, "Immediate attention required"],
      ["🟡 Warning", stats.esgFlags.warning.toString(), `${Math.round((stats.esgFlags.warning / stats.totalProjects) * 100)}%`, "Review and address within 30 days"],
      ["🟢 Compliant", stats.esgFlags.compliant.toString(), `${Math.round((stats.esgFlags.compliant / stats.totalProjects) * 100)}%`, "No action needed - continue monitoring"],
    ],
    headStyles: { 
      fillColor: colors.primary, 
      textColor: colors.white,
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 4,
    },
    bodyStyles: { fontSize: 9, cellPadding: 4 },
    alternateRowStyles: { fillColor: colors.gray50 },
    margin: { left: 14, right: 14 },
    tableWidth: pageWidth - 28,
  });

  addPageFooter(doc);
  return doc;
};

export const generateProjectListPDF = (projectList: Project[] = projects) => {
  const doc = new jsPDF("landscape");
  const pageWidth = doc.internal.pageSize.getWidth();
  const stats = calculatePortfolioStats();

  // Cover Page
  drawCoverPage(doc, "Portfolio Drilldown", "Detailed Project-Level Analysis Report");

  // Page 2 - Summary
  doc.addPage("landscape");
  addPageHeader(doc, "Project Overview", 2);

  // Mini KPI row
  const miniKPIs = [
    { label: "Total Projects", value: stats.totalProjects.toString() },
    { label: "Portfolio Value", value: `₦${(stats.totalPortfolioValue / 1000000000).toFixed(1)}B` },
    { label: "Green Projects", value: stats.greenTaxonomy.green.toString() },
    { label: "Avg ESG Score", value: `${stats.avgEsgCompleteness}%` },
  ];

  let kpiX = 14;
  miniKPIs.forEach((kpi) => {
    doc.setFillColor(...colors.gray50);
    doc.roundedRect(kpiX, 28, 60, 22, 2, 2, "F");
    
    doc.setFontSize(7);
    doc.setTextColor(...colors.textLight);
    doc.text(kpi.label, kpiX + 5, 36);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.primary);
    doc.text(kpi.value, kpiX + 5, 46);
    
    kpiX += 68;
  });

  // Projects Table
  autoTable(doc, {
    startY: 58,
    head: [["Project ID", "PFI", "Enterprise", "Sector", "State", "Amount", "Taxonomy", "ESG %", "Scope 1", "Scope 2", "Scope 3", "Carbon Status"]],
    body: projectList.slice(0, 30).map((p) => [
      p.projectId,
      p.pfiName,
      p.enterpriseName.length > 18 ? p.enterpriseName.slice(0, 18) + "..." : p.enterpriseName,
      p.sector,
      p.state,
      formatCurrencyShort(p.loanAmount),
      p.taxonomyStatus,
      `${p.esgCompleteness}%`,
      p.scope1.toString(),
      p.scope2.toString(),
      p.scope3.toString(),
      p.carbonStatus,
    ]),
    headStyles: { 
      fillColor: colors.primary, 
      textColor: colors.white, 
      fontSize: 7,
      fontStyle: "bold",
      cellPadding: 3,
    },
    bodyStyles: { fontSize: 7, cellPadding: 2.5 },
    alternateRowStyles: { fillColor: colors.gray50 },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 20 },
      2: { cellWidth: 35 },
      3: { cellWidth: 22 },
      4: { cellWidth: 18 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 },
      7: { cellWidth: 15 },
      8: { cellWidth: 15 },
      9: { cellWidth: 15 },
      10: { cellWidth: 15 },
      11: { cellWidth: 22 },
    },
    didParseCell: (data) => {
      // Color code taxonomy status
      if (data.column.index === 6 && data.section === "body") {
        const value = data.cell.raw as string;
        if (value === "Green") data.cell.styles.textColor = colors.success;
        else if (value === "Transition") data.cell.styles.textColor = colors.warning;
        else if (value === "Not Green") data.cell.styles.textColor = colors.danger;
      }
      // Color code carbon status
      if (data.column.index === 11 && data.section === "body") {
        const value = data.cell.raw as string;
        if (value === "On Track") data.cell.styles.textColor = colors.success;
        else if (value === "At Risk") data.cell.styles.textColor = colors.warning;
        else if (value === "Off Track") data.cell.styles.textColor = colors.danger;
      }
    },
  });

  addPageFooter(doc);
  return doc;
};

export const generateCarbonReportPDF = () => {
  const doc = new jsPDF();
  const stats = calculatePortfolioStats();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Cover Page
  drawCoverPage(doc, "Carbon & Net Zero", "Emissions Tracking & Progress Report");

  // Page 2 - Summary
  doc.addPage();
  addPageHeader(doc, "Emissions Overview", 2);

  // Carbon KPIs
  const carbonKPIs = [
    { label: "Total Emissions", value: `${(stats.carbonSummary.total / 1000).toFixed(1)}k`, sub: "tCO₂e" },
    { label: "Scope 1", value: `${(stats.carbonSummary.scope1 / 1000).toFixed(1)}k`, sub: "Direct" },
    { label: "Scope 2", value: `${(stats.carbonSummary.scope2 / 1000).toFixed(1)}k`, sub: "Energy" },
    { label: "Scope 3", value: `${(stats.carbonSummary.scope3 / 1000).toFixed(1)}k`, sub: "Indirect" },
  ];

  const cardWidth = (pageWidth - 38) / 4;
  carbonKPIs.forEach((kpi, i) => {
    const x = 14 + i * (cardWidth + 3);
    
    doc.setFillColor(...colors.gray50);
    doc.roundedRect(x, 32, cardWidth, 35, 3, 3, "F");
    
    doc.setFillColor(...colors.accent);
    doc.roundedRect(x, 32, cardWidth, 4, 3, 3, "F");
    doc.setFillColor(...colors.gray50);
    doc.rect(x, 34, cardWidth, 4, "F");

    doc.setFontSize(8);
    doc.setTextColor(...colors.textLight);
    doc.text(kpi.label, x + 8, 44);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.primary);
    doc.text(kpi.value, x + 8, 57);

    doc.setFontSize(7);
    doc.setTextColor(...colors.textLight);
    doc.text(kpi.sub, x + 8, 63);
  });

  // Net Zero Targets Section
  let currentY = drawSectionHeader(doc, "Net Zero Commitments", 82);

  autoTable(doc, {
    startY: currentY,
    head: [["Target", "Year", "Reduction", "Status", "Notes"]],
    body: [
      ["Interim Target", "2030", "40%", "In Progress", "From 2020 baseline"],
      ["Net Zero Target", "2050", "100%", "Committed", "Portfolio-wide commitment"],
      ["Science-Based", "2035", "55%", "Planned", "Aligned with SBTi pathway"],
    ],
    headStyles: { 
      fillColor: colors.primary, 
      textColor: colors.white,
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 4,
    },
    bodyStyles: { fontSize: 9, cellPadding: 4 },
    alternateRowStyles: { fillColor: colors.gray50 },
    margin: { left: 14, right: 14 },
    tableWidth: pageWidth - 28,
  });

  // Project Carbon Performance
  currentY = doc.lastAutoTable.finalY + 15;
  currentY = drawSectionHeader(doc, "Project Carbon Performance", currentY);

  autoTable(doc, {
    startY: currentY,
    head: [["Project", "Sector", "Total (tCO₂e)", "Target Year", "Progress", "Status"]],
    body: projects.slice(0, 15).map((p) => [
      p.enterpriseName.length > 22 ? p.enterpriseName.slice(0, 22) + "..." : p.enterpriseName,
      p.sector,
      p.totalEmissions.toLocaleString(),
      p.targetYear.toString(),
      `${p.currentProgress}%`,
      p.carbonStatus,
    ]),
    headStyles: { 
      fillColor: colors.primary, 
      textColor: colors.white,
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 3,
    },
    bodyStyles: { fontSize: 8, cellPadding: 3 },
    alternateRowStyles: { fillColor: colors.gray50 },
    margin: { left: 14, right: 14 },
    tableWidth: pageWidth - 28,
    didParseCell: (data) => {
      if (data.column.index === 5 && data.section === "body") {
        const value = data.cell.raw as string;
        if (value === "On Track") data.cell.styles.textColor = colors.success;
        else if (value === "At Risk") data.cell.styles.textColor = colors.warning;
        else if (value === "Off Track") data.cell.styles.textColor = colors.danger;
      }
    },
  });

  addPageFooter(doc);
  return doc;
};

export const generateTaxonomyReportPDF = () => {
  const doc = new jsPDF();
  const stats = calculatePortfolioStats();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Cover Page
  drawCoverPage(doc, "Green Taxonomy", "Classification & Alignment Report");

  // Page 2 - Summary
  doc.addPage();
  addPageHeader(doc, "Taxonomy Classification", 2);

  // Classification Summary KPIs
  const taxKPIs = [
    { label: "Green", value: stats.greenTaxonomy.green.toString(), pct: `${stats.greenTaxonomy.greenPercentage}%`, color: colors.success },
    { label: "Transition", value: stats.greenTaxonomy.transition.toString(), pct: `${stats.greenTaxonomy.transitionPercentage}%`, color: colors.warning },
    { label: "Not Green", value: stats.greenTaxonomy.notGreen.toString(), pct: `${stats.greenTaxonomy.notGreenPercentage}%`, color: colors.danger },
    { label: "Total", value: stats.totalProjects.toString(), pct: "100%", color: colors.primary },
  ];

  const cardWidth = (pageWidth - 38) / 4;
  taxKPIs.forEach((kpi, i) => {
    const x = 14 + i * (cardWidth + 3);
    
    doc.setFillColor(...colors.gray50);
    doc.roundedRect(x, 32, cardWidth, 38, 3, 3, "F");
    
    doc.setFillColor(...kpi.color);
    doc.roundedRect(x, 32, cardWidth, 4, 3, 3, "F");
    doc.setFillColor(...colors.gray50);
    doc.rect(x, 34, cardWidth, 4, "F");

    doc.setFontSize(8);
    doc.setTextColor(...colors.textLight);
    doc.text(kpi.label, x + 8, 46);

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...kpi.color);
    doc.text(kpi.value, x + 8, 60);

    doc.setFontSize(9);
    doc.setTextColor(...colors.textLight);
    doc.text(kpi.pct, x + 8, 68);
  });

  // Classification Criteria
  let currentY = drawSectionHeader(doc, "Classification Summary", 85);

  autoTable(doc, {
    startY: currentY,
    head: [["Classification", "Count", "Portfolio %", "Value %", "Criteria"]],
    body: [
      ["Green", stats.greenTaxonomy.green.toString(), `${stats.greenTaxonomy.greenPercentage}%`, `${stats.greenTaxonomy.greenPercentageByValue}%`, "Meets all environmental objectives"],
      ["Transition", stats.greenTaxonomy.transition.toString(), `${stats.greenTaxonomy.transitionPercentage}%`, "-", "Progressing towards green criteria"],
      ["Not Green", stats.greenTaxonomy.notGreen.toString(), `${stats.greenTaxonomy.notGreenPercentage}%`, "-", "Does not meet current criteria"],
    ],
    headStyles: { 
      fillColor: colors.primary, 
      textColor: colors.white,
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 4,
    },
    bodyStyles: { fontSize: 9, cellPadding: 4 },
    alternateRowStyles: { fillColor: colors.gray50 },
    margin: { left: 14, right: 14 },
    tableWidth: pageWidth - 28,
    didParseCell: (data) => {
      if (data.column.index === 0 && data.section === "body") {
        const value = data.cell.raw as string;
        if (value === "Green") data.cell.styles.textColor = colors.success;
        else if (value === "Transition") data.cell.styles.textColor = colors.warning;
        else if (value === "Not Green") data.cell.styles.textColor = colors.danger;
      }
    },
  });

  // Project Classifications
  currentY = doc.lastAutoTable.finalY + 15;
  currentY = drawSectionHeader(doc, "Project Classifications", currentY);

  autoTable(doc, {
    startY: currentY,
    head: [["Project ID", "Enterprise", "Sector", "Classification", "Evidence", "Last Updated"]],
    body: projects.slice(0, 18).map((p) => [
      p.projectId,
      p.enterpriseName.length > 20 ? p.enterpriseName.slice(0, 20) + "..." : p.enterpriseName,
      p.sector,
      p.taxonomyStatus,
      p.evidenceStatus,
      p.lastUpdated,
    ]),
    headStyles: { 
      fillColor: colors.primary, 
      textColor: colors.white,
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 3,
    },
    bodyStyles: { fontSize: 8, cellPadding: 3 },
    alternateRowStyles: { fillColor: colors.gray50 },
    margin: { left: 14, right: 14 },
    tableWidth: pageWidth - 28,
    didParseCell: (data) => {
      if (data.column.index === 3 && data.section === "body") {
        const value = data.cell.raw as string;
        if (value === "Green") data.cell.styles.textColor = colors.success;
        else if (value === "Transition") data.cell.styles.textColor = colors.warning;
        else if (value === "Not Green") data.cell.styles.textColor = colors.danger;
      }
    },
  });

  addPageFooter(doc);
  return doc;
};

export const exportPDF = (type: "portfolio" | "projects" | "carbon" | "taxonomy") => {
  let doc: jsPDF;
  let filename: string;
  const date = new Date().toISOString().split("T")[0];

  switch (type) {
    case "portfolio":
      doc = generatePortfolioPDF();
      filename = `DBN_ESG_Portfolio_Pack_${date}.pdf`;
      break;
    case "projects":
      doc = generateProjectListPDF();
      filename = `DBN_Portfolio_Drilldown_${date}.pdf`;
      break;
    case "carbon":
      doc = generateCarbonReportPDF();
      filename = `DBN_Carbon_NetZero_Summary_${date}.pdf`;
      break;
    case "taxonomy":
      doc = generateTaxonomyReportPDF();
      filename = `DBN_Green_Taxonomy_Report_${date}.pdf`;
      break;
    default:
      doc = generatePortfolioPDF();
      filename = `DBN_Report_${date}.pdf`;
  }

  doc.save(filename);
};
