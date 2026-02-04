// Centralized ESG Data based on DBN_ESG_DB.xlsx
// This data is consistent across all modules per documentation requirements

export interface Project {
  projectId: string;
  pfiId: string;
  pfiName: string;
  sector: string;
  enterpriseId: string;
  enterpriseName: string;
  enterpriseSize: "Micro" | "Small" | "Medium" | "Large";
  city: string;
  state: string;
  country: string;
  fundingType: string;
  projectStartYear: number;
  loanAmount: number;
  loanDate: string;
  // ESG Fields
  esgCompleteness: number;
  reportingStatus: "On-time" | "Late" | "Pending";
  taxonomyStatus: "Green" | "Transition" | "Not Green";
  evidenceStatus: "Provided" | "Missing";
  // Carbon Fields
  scope1: number;
  scope2: number;
  scope3: number;
  totalEmissions: number;
  baselineYear: number;
  baselineEmissions: number;
  targetYear: number;
  targetReduction: number;
  currentProgress: number;
  carbonStatus: "On Track" | "At Risk" | "Off Track";
  // SDG Alignment
  sdgTags: number[];
  dataQualityScore: number;
  lastUpdated: string;
}

export interface PFI {
  pfiId: string;
  pfiName: string;
  projectCount: number;
  totalFinanced: number;
  avgDataQuality: number;
  reportingTimeliness: "On-time" | "Late" | "Pending";
}

// Nigerian states and cities for realistic data
const locations = [
  { city: "Lagos", state: "Lagos" }, { city: "Ikeja", state: "Lagos" }, { city: "Victoria Island", state: "Lagos" },
  { city: "Ibadan", state: "Oyo" }, { city: "Ogbomosho", state: "Oyo" },
  { city: "Kano", state: "Kano" }, { city: "Kaduna", state: "Kaduna" }, { city: "Zaria", state: "Kaduna" },
  { city: "Port Harcourt", state: "Rivers" }, { city: "Onitsha", state: "Anambra" }, { city: "Awka", state: "Anambra" },
  { city: "Enugu", state: "Enugu" }, { city: "Aba", state: "Abia" }, { city: "Umuahia", state: "Abia" },
  { city: "Benin City", state: "Edo" }, { city: "Asaba", state: "Delta" }, { city: "Warri", state: "Delta" },
  { city: "Calabar", state: "Cross River" }, { city: "Uyo", state: "Akwa Ibom" },
  { city: "Jos", state: "Plateau" }, { city: "Ilorin", state: "Kwara" }, { city: "Abeokuta", state: "Ogun" },
  { city: "Akure", state: "Ondo" }, { city: "Ado-Ekiti", state: "Ekiti" }, { city: "Owerri", state: "Imo" },
  { city: "Minna", state: "Niger" }, { city: "Makurdi", state: "Benue" }, { city: "Yola", state: "Adamawa" },
  { city: "Bauchi", state: "Bauchi" }, { city: "Sokoto", state: "Sokoto" }, { city: "Maiduguri", state: "Borno" },
];

const sectors = ["Manufacturing", "Agriculture", "Trade", "Services", "Energy", "Transport", "Construction", "Healthcare"];
const pfiNames = ["GT Bank", "Fidelity Bank", "Ecobank", "Baobab MFB", "Infinity MFB", "Access Bank", "UBA", "Zenith Bank"];
const enterpriseNames = [
  "Alpha Plastics Ltd", "GreenFields Agro", "CityMart Traders", "Bright Services Co", "Prime Steel Works",
  "Sunrise Farms", "Swift Logistics", "SolarGen Solutions", "Delta Textiles", "Value Stores",
  "Harvest Gold Ltd", "ClearView IT", "Anchor Foods", "AgroPlus Ventures", "Rapid Movers",
  "Central Wholesale", "BlueWave Packaging", "RenewPower Ltd", "FarmLink Cooperative", "Prime Health Services",
  "Golden Mills Ltd", "AgriBoost Farms", "Urban Retailers", "QuickFix Services", "GreenSpark Energy",
  "NorthSteel Ltd", "Metro Transit", "FarmFresh Produce", "SmartBuy Stores", "DigitalWave Tech",
  "Eco Processing", "Solar Haven", "Green Harvest", "TechBridge Solutions", "CleanEnergy Systems",
  "AgriTech Innovations", "Sustainable Foods", "EcoTransport", "GreenBuild Construction", "MedCare Plus",
  "BioPower Ltd", "CropKing Farms", "EcoTrade Hub", "DataCenter Pro", "WindPower Solutions",
  "FreshMart Retail", "GreenLogistics", "HealthFirst Clinics", "SolarMax Energy", "AgroFresh Ltd",
  "TechGreen Solutions", "CleanWater Systems", "BioFuel Industries", "GreenConstruct", "EcoHealth Services",
  "RenewTech Energy", "FarmDirect", "SmartGrid Solutions", "GreenTextiles", "EcoManufacture",
  "SustainAgri", "PowerGreen Ltd", "EcoTrade Network", "GreenHealth Plus", "SolarBridge Energy",
  "AgriGreen Ventures", "CleanTech Industries", "BioEnergy Solutions", "GreenServices Hub", "EcoTransit",
  "FreshGreen Farms", "TechSustain Ltd", "GreenPower Systems", "EcoRetail Hub", "BioTech Farms",
  "SolarWind Energy", "GreenFood Processing", "EcoConstruct Ltd", "HealthGreen Services", "CleanEnergy Hub",
  "AgriPower Solutions", "GreenTech Manufacturing", "EcoServices Plus", "BioGreen Transport", "SolarFresh Ltd",
  "GreenAgri Hub", "TechEco Solutions", "CleanBuild Industries", "EcoHealth Hub", "RenewGreen Energy",
  "FarmGreen Ltd", "SmartEco Systems", "GreenManufacture Plus", "BioServices Hub", "SolarEco Ltd"
];

// Generate 100 realistic projects
const generateProjects = (): Project[] => {
  const projects: Project[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const pfiIndex = (i - 1) % 8;
    const location = locations[i % locations.length];
    const sector = sectors[i % sectors.length];
    const size = i % 4 === 0 ? "Large" : i % 3 === 0 ? "Medium" : i % 2 === 0 ? "Small" : "Micro";
    
    // Realistic loan amounts based on size
    const loanBase = size === "Large" ? 150000000 : size === "Medium" ? 80000000 : size === "Small" ? 25000000 : 5000000;
    const loanAmount = loanBase + Math.floor(Math.random() * loanBase * 0.5);
    
    // ESG and carbon metrics
    const esgCompleteness = 45 + Math.floor(Math.random() * 55);
    const dataQualityScore = 40 + Math.floor(Math.random() * 60);
    
    const taxonomyOptions: ("Green" | "Transition" | "Not Green")[] = ["Green", "Transition", "Not Green"];
    const taxonomyStatus = esgCompleteness > 80 ? "Green" : esgCompleteness > 65 ? "Transition" : taxonomyOptions[Math.floor(Math.random() * 3)];
    
    const scope1 = sector === "Manufacturing" ? 500 + Math.floor(Math.random() * 3000) : 50 + Math.floor(Math.random() * 500);
    const scope2 = 50 + Math.floor(Math.random() * 500);
    const scope3 = scope1 * 1.5 + Math.floor(Math.random() * 1000);
    
    const baselineEmissions = scope1 + scope2 + scope3 + Math.floor(Math.random() * 500);
    const currentProgress = 5 + Math.floor(Math.random() * 35);
    
    const carbonStatusOptions: ("On Track" | "At Risk" | "Off Track")[] = ["On Track", "At Risk", "Off Track"];
    const carbonStatus = currentProgress > 20 ? "On Track" : currentProgress > 10 ? "At Risk" : carbonStatusOptions[Math.floor(Math.random() * 3)];
    
    const reportingOptions: ("On-time" | "Late" | "Pending")[] = ["On-time", "Late", "Pending"];
    const reportingStatus = esgCompleteness > 75 ? "On-time" : reportingOptions[Math.floor(Math.random() * 3)];
    
    const year = 2018 + Math.floor(Math.random() * 6);
    const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
    const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
    
    projects.push({
      projectId: `PRJ_${String(i).padStart(3, '0')}`,
      pfiId: `PFI_${String(pfiIndex + 1).padStart(2, '0')}`,
      pfiName: pfiNames[pfiIndex],
      sector,
      enterpriseId: `ENT_${String(i).padStart(3, '0')}`,
      enterpriseName: enterpriseNames[(i - 1) % enterpriseNames.length],
      enterpriseSize: size,
      city: location.city,
      state: location.state,
      country: "Nigeria",
      fundingType: taxonomyStatus === "Green" ? "DBN Green Facility" : "DBN Credit Line",
      projectStartYear: year,
      loanAmount,
      loanDate: `${year}-${month}-${day}`,
      esgCompleteness,
      reportingStatus,
      taxonomyStatus,
      evidenceStatus: esgCompleteness > 70 ? "Provided" : "Missing",
      scope1,
      scope2,
      scope3,
      totalEmissions: scope1 + scope2 + scope3,
      baselineYear: year,
      baselineEmissions,
      targetYear: 2028 + Math.floor(Math.random() * 7),
      targetReduction: 30 + Math.floor(Math.random() * 25),
      currentProgress,
      carbonStatus,
      sdgTags: [7, 8, 9, 12, 13].slice(0, 2 + Math.floor(Math.random() * 3)),
      dataQualityScore,
      lastUpdated: `2025-01-${String(1 + Math.floor(Math.random() * 15)).padStart(2, '0')}`,
    });
  }
  
  return projects;
};

// Sample dataset - 100 projects
export const projects: Project[] = generateProjects();

// PFI Summary data
export const pfis: PFI[] = [
  { pfiId: "PFI_01", pfiName: "GT Bank", projectCount: 13, totalFinanced: 1250000000, avgDataQuality: 86, reportingTimeliness: "On-time" },
  { pfiId: "PFI_02", pfiName: "Fidelity Bank", projectCount: 13, totalFinanced: 1180000000, avgDataQuality: 72, reportingTimeliness: "Late" },
  { pfiId: "PFI_03", pfiName: "Ecobank", projectCount: 13, totalFinanced: 980000000, avgDataQuality: 84, reportingTimeliness: "On-time" },
  { pfiId: "PFI_04", pfiName: "Baobab MFB", projectCount: 13, totalFinanced: 850000000, avgDataQuality: 88, reportingTimeliness: "On-time" },
  { pfiId: "PFI_05", pfiName: "Infinity MFB", projectCount: 12, totalFinanced: 720000000, avgDataQuality: 76, reportingTimeliness: "On-time" },
  { pfiId: "PFI_06", pfiName: "Access Bank", projectCount: 12, totalFinanced: 1350000000, avgDataQuality: 82, reportingTimeliness: "On-time" },
  { pfiId: "PFI_07", pfiName: "UBA", projectCount: 12, totalFinanced: 920000000, avgDataQuality: 79, reportingTimeliness: "On-time" },
  { pfiId: "PFI_08", pfiName: "Zenith Bank", projectCount: 12, totalFinanced: 1150000000, avgDataQuality: 85, reportingTimeliness: "On-time" },
];

// Portfolio-level calculations
export const calculatePortfolioStats = () => {
  const totalProjects = projects.length;
  const totalPortfolioValue = projects.reduce((sum, p) => sum + p.loanAmount, 0);
  const avgEsgCompleteness = Math.round(projects.reduce((sum, p) => sum + p.esgCompleteness, 0) / totalProjects);
  
  const onTimeCount = projects.filter(p => p.reportingStatus === "On-time").length;
  const lateCount = projects.filter(p => p.reportingStatus === "Late").length;
  
  const greenCount = projects.filter(p => p.taxonomyStatus === "Green").length;
  const transitionCount = projects.filter(p => p.taxonomyStatus === "Transition").length;
  const notGreenCount = projects.filter(p => p.taxonomyStatus === "Not Green").length;
  
  const greenValue = projects.filter(p => p.taxonomyStatus === "Green").reduce((sum, p) => sum + p.loanAmount, 0);
  const greenPercentageByValue = Math.round((greenValue / totalPortfolioValue) * 100);
  
  const totalScope1 = projects.reduce((sum, p) => sum + p.scope1, 0);
  const totalScope2 = projects.reduce((sum, p) => sum + p.scope2, 0);
  const totalScope3 = projects.reduce((sum, p) => sum + p.scope3, 0);
  const totalEmissions = totalScope1 + totalScope2 + totalScope3;
  
  const criticalFlags = projects.filter(p => p.dataQualityScore < 60 || p.esgCompleteness < 60).length;
  const warningFlags = projects.filter(p => (p.dataQualityScore >= 60 && p.dataQualityScore < 80) || p.evidenceStatus === "Missing").length;
  const compliantFlags = projects.filter(p => p.dataQualityScore >= 80 && p.esgCompleteness >= 80).length;
  
  return {
    totalProjects,
    totalPortfolioValue,
    avgEsgCompleteness,
    reportingTimeliness: { onTime: onTimeCount, late: lateCount, total: totalProjects },
    greenTaxonomy: { 
      green: greenCount, 
      transition: transitionCount, 
      notGreen: notGreenCount,
      greenPercentage: Math.round((greenCount / totalProjects) * 100),
      transitionPercentage: Math.round((transitionCount / totalProjects) * 100),
      notGreenPercentage: Math.round((notGreenCount / totalProjects) * 100),
      greenPercentageByValue
    },
    carbonSummary: { scope1: totalScope1, scope2: totalScope2, scope3: totalScope3, total: totalEmissions },
    esgFlags: { critical: criticalFlags, warning: warningFlags, compliant: compliantFlags },
  };
};

// Sector breakdown calculations
export const calculateSectorBreakdown = () => {
  const sectorList = [...new Set(projects.map(p => p.sector))];
  return sectorList.map(sector => {
    const sectorProjects = projects.filter(p => p.sector === sector);
    const totalValue = sectorProjects.reduce((sum, p) => sum + p.loanAmount, 0);
    const avgEsgScore = Math.round(sectorProjects.reduce((sum, p) => sum + p.esgCompleteness, 0) / sectorProjects.length);
    const greenPercentage = Math.round((sectorProjects.filter(p => p.taxonomyStatus === "Green").length / sectorProjects.length) * 100);
    const totalEmissions = sectorProjects.reduce((sum, p) => sum + p.totalEmissions, 0);
    
    return {
      sector,
      projects: sectorProjects.length,
      value: totalValue,
      esgScore: avgEsgScore,
      greenPercentage,
      totalEmissions
    };
  }).sort((a, b) => b.value - a.value);
};

// Region breakdown calculations
export const calculateRegionBreakdown = () => {
  const states = [...new Set(projects.map(p => p.state))];
  return states.map(state => {
    const stateProjects = projects.filter(p => p.state === state);
    const totalValue = stateProjects.reduce((sum, p) => sum + p.loanAmount, 0);
    
    return {
      region: state,
      projects: stateProjects.length,
      value: totalValue
    };
  }).sort((a, b) => b.value - a.value).slice(0, 10);
};

// Carbon trend data for charts
export const getCarbonTrendData = () => {
  return [
    { year: "2019", scope1: 45000, scope2: 28000, scope3: 72000, total: 145000 },
    { year: "2020", scope1: 42000, scope2: 26000, scope3: 68000, total: 136000 },
    { year: "2021", scope1: 38000, scope2: 24000, scope3: 62000, total: 124000 },
    { year: "2022", scope1: 35000, scope2: 22000, scope3: 58000, total: 115000 },
    { year: "2023", scope1: 32000, scope2: 20000, scope3: 54000, total: 106000 },
    { year: "2024", scope1: 28000, scope2: 18000, scope3: 48000, total: 94000 },
  ];
};

// ESG Completeness trend data
export const getEsgTrendData = () => {
  return [
    { month: "Jul", completeness: 72, quality: 68 },
    { month: "Aug", completeness: 74, quality: 70 },
    { month: "Sep", completeness: 76, quality: 72 },
    { month: "Oct", completeness: 78, quality: 75 },
    { month: "Nov", completeness: 80, quality: 78 },
    { month: "Dec", completeness: 82, quality: 80 },
    { month: "Jan", completeness: 85, quality: 82 },
  ];
};

// Taxonomy classification rules
export const taxonomyRules = [
  { category: "Climate Change Mitigation", criteria: "Activities that contribute to climate change mitigation through emission reduction", evidenceRequired: "Carbon footprint assessment, GHG inventory" },
  { category: "Climate Change Adaptation", criteria: "Activities that support adaptation to climate change impacts", evidenceRequired: "Climate risk assessment, adaptation plan" },
  { category: "Water & Marine Resources", criteria: "Sustainable use and protection of water resources", evidenceRequired: "Water usage assessment, discharge permits" },
  { category: "Circular Economy", criteria: "Transition to circular economy principles", evidenceRequired: "Waste management plan, recycling metrics" },
  { category: "Pollution Prevention", criteria: "Activities preventing or controlling pollution", evidenceRequired: "Environmental impact assessment, permits" },
  { category: "Biodiversity Protection", criteria: "Protection and restoration of biodiversity", evidenceRequired: "Biodiversity assessment, conservation plan" },
  { category: "Do No Significant Harm", criteria: "Activity does not harm other environmental objectives", evidenceRequired: "DNSH assessment checklist" },
  { category: "Minimum Social Safeguards", criteria: "Compliance with labor and human rights standards", evidenceRequired: "Social compliance certification" },
  { category: "Technical Screening", criteria: "Meeting sector-specific technical thresholds", evidenceRequired: "Technical assessment report" },
  { category: "Substantial Contribution", criteria: "Making substantial contribution to at least one objective", evidenceRequired: "Contribution assessment" },
];

// Export format utilities
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCurrencyShort = (value: number) => {
  if (value >= 1000000000) {
    return `₦${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `₦${(value / 1000000).toFixed(0)}M`;
  }
  return `₦${(value / 1000).toFixed(0)}K`;
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-NG").format(value);
};
