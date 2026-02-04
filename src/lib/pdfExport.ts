import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Project, calculatePortfolioStats, formatCurrencyShort, projects } from "@/data/esgData";

// Extend jsPDF type for autoTable
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

const primaryColor: [number, number, number] = [25, 105, 51]; // Forest green
const accentColor: [number, number, number] = [212, 143, 5]; // Gold
const textColor: [number, number, number] = [33, 33, 33];

export const generatePortfolioPDF = () => {
  const doc = new jsPDF();
  const stats = calculatePortfolioStats();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 35, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("DBN ESG Portfolio Report", 14, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}`, 14, 28);

  // Executive Summary Section
  doc.setTextColor(...textColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 14, 48);

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.5);
  doc.line(14, 51, 80, 51);

  // KPI Cards
  const kpiY = 58;
  const kpiWidth = 42;
  const kpiHeight = 28;
  const kpiGap = 4;

  // Portfolio Value
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, kpiY, kpiWidth, kpiHeight, 3, 3, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Portfolio Value", 16, kpiY + 8);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text(`₦${(stats.totalPortfolioValue / 1000000000).toFixed(1)}B`, 16, kpiY + 18);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(`${stats.totalProjects} Projects`, 16, kpiY + 24);

  // ESG Completeness
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14 + kpiWidth + kpiGap, kpiY, kpiWidth, kpiHeight, 3, 3, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("ESG Completeness", 16 + kpiWidth + kpiGap, kpiY + 8);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(39, 174, 96);
  doc.text(`${stats.avgEsgCompleteness}%`, 16 + kpiWidth + kpiGap, kpiY + 18);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text("Fields Validated", 16 + kpiWidth + kpiGap, kpiY + 24);

  // Green Taxonomy
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14 + (kpiWidth + kpiGap) * 2, kpiY, kpiWidth, kpiHeight, 3, 3, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Green Taxonomy", 16 + (kpiWidth + kpiGap) * 2, kpiY + 8);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(39, 174, 96);
  doc.text(`${stats.greenTaxonomy.greenPercentage}%`, 16 + (kpiWidth + kpiGap) * 2, kpiY + 18);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text("Green Classification", 16 + (kpiWidth + kpiGap) * 2, kpiY + 24);

  // Carbon Emissions
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14 + (kpiWidth + kpiGap) * 3, kpiY, kpiWidth, kpiHeight, 3, 3, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Carbon Emissions", 16 + (kpiWidth + kpiGap) * 3, kpiY + 8);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...accentColor);
  doc.text(`${(stats.carbonSummary.total / 1000).toFixed(1)}k`, 16 + (kpiWidth + kpiGap) * 3, kpiY + 18);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text("tCO₂e Total", 16 + (kpiWidth + kpiGap) * 3, kpiY + 24);

  // Green Taxonomy Breakdown
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColor);
  doc.text("Green Taxonomy Classification", 14, 100);

  autoTable(doc, {
    startY: 105,
    head: [["Classification", "Projects", "Percentage", "Status"]],
    body: [
      ["Green", stats.greenTaxonomy.green.toString(), `${stats.greenTaxonomy.greenPercentage}%`, "Aligned"],
      ["Transition", stats.greenTaxonomy.transition.toString(), `${stats.greenTaxonomy.transitionPercentage}%`, "Progressing"],
      ["Not Green", stats.greenTaxonomy.notGreen.toString(), `${stats.greenTaxonomy.notGreenPercentage}%`, "Action Required"],
    ],
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    styles: { fontSize: 9 },
    margin: { left: 14 },
    tableWidth: pageWidth - 28,
  });

  // Carbon Summary
  const carbonY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColor);
  doc.text("Carbon Emissions Summary (tCO₂e)", 14, carbonY);

  autoTable(doc, {
    startY: carbonY + 5,
    head: [["Scope", "Emissions (tCO₂e)", "% of Total", "Description"]],
    body: [
      ["Scope 1", stats.carbonSummary.scope1.toLocaleString(), `${Math.round((stats.carbonSummary.scope1 / stats.carbonSummary.total) * 100)}%`, "Direct emissions"],
      ["Scope 2", stats.carbonSummary.scope2.toLocaleString(), `${Math.round((stats.carbonSummary.scope2 / stats.carbonSummary.total) * 100)}%`, "Energy indirect"],
      ["Scope 3", stats.carbonSummary.scope3.toLocaleString(), `${Math.round((stats.carbonSummary.scope3 / stats.carbonSummary.total) * 100)}%`, "Other indirect"],
      ["Total", stats.carbonSummary.total.toLocaleString(), "100%", "All scopes"],
    ],
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    styles: { fontSize: 9 },
    margin: { left: 14 },
    tableWidth: pageWidth - 28,
  });

  // ESG Flags
  const flagsY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...textColor);
  doc.text("ESG Status Flags", 14, flagsY);

  autoTable(doc, {
    startY: flagsY + 5,
    head: [["Status", "Count", "Action Required"]],
    body: [
      ["Critical", stats.esgFlags.critical.toString(), "Immediate attention required"],
      ["Warning", stats.esgFlags.warning.toString(), "Review and address"],
      ["Compliant", stats.esgFlags.compliant.toString(), "No action needed"],
    ],
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    styles: { fontSize: 9 },
    margin: { left: 14 },
    tableWidth: pageWidth - 28,
  });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFillColor(...primaryColor);
  doc.rect(0, footerY - 5, pageWidth, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Development Bank of Nigeria - ESG Integrated Solution", 14, footerY + 3);
  doc.text("Confidential Report", pageWidth - 40, footerY + 3);

  return doc;
};

export const generateProjectListPDF = (projectList: Project[] = projects) => {
  const doc = new jsPDF("landscape");
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 25, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Portfolio Drilldown Report", 14, 15);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 60, 15);

  // Projects Table
  autoTable(doc, {
    startY: 32,
    head: [["Project ID", "PFI", "Enterprise", "Sector", "State", "Amount (₦)", "Taxonomy", "ESG %", "Scope 1", "Scope 2", "Scope 3", "Status"]],
    body: projectList.slice(0, 25).map((p) => [
      p.projectId,
      p.pfiName,
      p.enterpriseName.slice(0, 15) + (p.enterpriseName.length > 15 ? "..." : ""),
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
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontSize: 7 },
    styles: { fontSize: 7, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 22 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 18 },
      5: { cellWidth: 22 },
      6: { cellWidth: 20 },
      7: { cellWidth: 15 },
      8: { cellWidth: 15 },
      9: { cellWidth: 15 },
      10: { cellWidth: 15 },
      11: { cellWidth: 20 },
    },
  });

  return doc;
};

export const generateCarbonReportPDF = () => {
  const doc = new jsPDF();
  const stats = calculatePortfolioStats();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 35, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Carbon & Net Zero Summary", 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  // Summary
  doc.setTextColor(...textColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Emissions Overview", 14, 50);

  // Carbon breakdown table
  autoTable(doc, {
    startY: 55,
    head: [["Metric", "Value", "Notes"]],
    body: [
      ["Total Emissions", `${stats.carbonSummary.total.toLocaleString()} tCO₂e`, "Portfolio total"],
      ["Scope 1 (Direct)", `${stats.carbonSummary.scope1.toLocaleString()} tCO₂e`, "Direct emissions from operations"],
      ["Scope 2 (Energy)", `${stats.carbonSummary.scope2.toLocaleString()} tCO₂e`, "Indirect from purchased energy"],
      ["Scope 3 (Indirect)", `${stats.carbonSummary.scope3.toLocaleString()} tCO₂e`, "Value chain emissions"],
      ["Net Zero Target", "2050", "Portfolio-wide commitment"],
      ["Interim Target", "40% reduction by 2030", "From 2020 baseline"],
    ],
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
    styles: { fontSize: 10 },
    margin: { left: 14 },
    tableWidth: pageWidth - 28,
  });

  // Project carbon data
  const projectY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Project Carbon Performance", 14, projectY);

  autoTable(doc, {
    startY: projectY + 5,
    head: [["Project", "Sector", "Total (tCO₂e)", "Target Year", "Progress", "Status"]],
    body: projects.slice(0, 12).map((p) => [
      p.enterpriseName.slice(0, 20),
      p.sector,
      p.totalEmissions.toLocaleString(),
      p.targetYear.toString(),
      `${p.currentProgress}%`,
      p.carbonStatus,
    ]),
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
    margin: { left: 14 },
    tableWidth: pageWidth - 28,
  });

  return doc;
};

export const generateTaxonomyReportPDF = () => {
  const doc = new jsPDF();
  const stats = calculatePortfolioStats();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 35, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Green Taxonomy Report", 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  // Classification Summary
  doc.setTextColor(...textColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Classification Summary", 14, 50);

  autoTable(doc, {
    startY: 55,
    head: [["Classification", "Count", "Percentage", "Portfolio Value"]],
    body: [
      ["Green", stats.greenTaxonomy.green.toString(), `${stats.greenTaxonomy.greenPercentage}%`, `${stats.greenTaxonomy.greenPercentageByValue}% of value`],
      ["Transition", stats.greenTaxonomy.transition.toString(), `${stats.greenTaxonomy.transitionPercentage}%`, "Progressing"],
      ["Not Green", stats.greenTaxonomy.notGreen.toString(), `${stats.greenTaxonomy.notGreenPercentage}%`, "Action Required"],
    ],
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
    styles: { fontSize: 10 },
    margin: { left: 14 },
    tableWidth: pageWidth - 28,
  });

  // Projects by classification
  const projectY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Project Classifications", 14, projectY);

  autoTable(doc, {
    startY: projectY + 5,
    head: [["Project ID", "Enterprise", "Sector", "Classification", "Evidence", "Last Updated"]],
    body: projects.slice(0, 15).map((p) => [
      p.projectId,
      p.enterpriseName.slice(0, 20),
      p.sector,
      p.taxonomyStatus,
      p.evidenceStatus,
      p.lastUpdated,
    ]),
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
    margin: { left: 14 },
    tableWidth: pageWidth - 28,
  });

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
