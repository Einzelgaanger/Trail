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

// Sample dataset from DBN_ESG_DB.xlsx - 100 projects
export const projects: Project[] = [
  { projectId: "PRJ_001", pfiId: "PFI_01", pfiName: "GT Bank", sector: "Manufacturing", enterpriseId: "ENT_001", enterpriseName: "Alpha Plastics Ltd", enterpriseSize: "Small", city: "Lagos", state: "Lagos", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2021, loanAmount: 25000000, loanDate: "2021-03-15", esgCompleteness: 95, reportingStatus: "On-time", taxonomyStatus: "Transition", evidenceStatus: "Provided", scope1: 450, scope2: 320, scope3: 890, totalEmissions: 1660, baselineYear: 2021, baselineEmissions: 2100, targetYear: 2030, targetReduction: 40, currentProgress: 21, carbonStatus: "On Track", sdgTags: [8, 9, 12], dataQualityScore: 95, lastUpdated: "2025-01-15" },
  { projectId: "PRJ_002", pfiId: "PFI_01", pfiName: "GT Bank", sector: "Agriculture", enterpriseId: "ENT_002", enterpriseName: "GreenFields Agro", enterpriseSize: "Micro", city: "Ibadan", state: "Oyo", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2022, loanAmount: 5000000, loanDate: "2022-05-10", esgCompleteness: 88, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Provided", scope1: 120, scope2: 80, scope3: 450, totalEmissions: 650, baselineYear: 2022, baselineEmissions: 850, targetYear: 2028, targetReduction: 35, currentProgress: 24, carbonStatus: "On Track", sdgTags: [2, 8, 13, 15], dataQualityScore: 88, lastUpdated: "2025-01-14" },
  { projectId: "PRJ_003", pfiId: "PFI_02", pfiName: "Fidelity Bank", sector: "Trade", enterpriseId: "ENT_003", enterpriseName: "CityMart Traders", enterpriseSize: "Small", city: "Onitsha", state: "Anambra", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2020, loanAmount: 20000000, loanDate: "2020-02-18", esgCompleteness: 72, reportingStatus: "Late", taxonomyStatus: "Not Green", evidenceStatus: "Missing", scope1: 280, scope2: 190, scope3: 520, totalEmissions: 990, baselineYear: 2020, baselineEmissions: 1100, targetYear: 2030, targetReduction: 30, currentProgress: 10, carbonStatus: "At Risk", sdgTags: [8, 12], dataQualityScore: 72, lastUpdated: "2025-01-10" },
  { projectId: "PRJ_004", pfiId: "PFI_03", pfiName: "Ecobank", sector: "Services", enterpriseId: "ENT_004", enterpriseName: "Bright Services Co", enterpriseSize: "Micro", city: "Abeokuta", state: "Ogun", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2023, loanAmount: 4000000, loanDate: "2023-04-05", esgCompleteness: 82, reportingStatus: "On-time", taxonomyStatus: "Transition", evidenceStatus: "Provided", scope1: 85, scope2: 120, scope3: 210, totalEmissions: 415, baselineYear: 2023, baselineEmissions: 480, targetYear: 2028, targetReduction: 25, currentProgress: 14, carbonStatus: "On Track", sdgTags: [8, 9], dataQualityScore: 82, lastUpdated: "2025-01-12" },
  { projectId: "PRJ_005", pfiId: "PFI_02", pfiName: "Fidelity Bank", sector: "Manufacturing", enterpriseId: "ENT_005", enterpriseName: "Prime Steel Works", enterpriseSize: "Medium", city: "Asaba", state: "Delta", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2019, loanAmount: 120000000, loanDate: "2019-01-22", esgCompleteness: 45, reportingStatus: "Late", taxonomyStatus: "Not Green", evidenceStatus: "Missing", scope1: 2800, scope2: 1950, scope3: 4200, totalEmissions: 8950, baselineYear: 2019, baselineEmissions: 9500, targetYear: 2035, targetReduction: 50, currentProgress: 6, carbonStatus: "Off Track", sdgTags: [8, 9], dataQualityScore: 45, lastUpdated: "2025-01-05" },
  { projectId: "PRJ_006", pfiId: "PFI_04", pfiName: "Baobab MFB", sector: "Agriculture", enterpriseId: "ENT_006", enterpriseName: "Sunrise Farms", enterpriseSize: "Small", city: "Ilorin", state: "Kwara", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2021, loanAmount: 30000000, loanDate: "2021-09-14", esgCompleteness: 91, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Provided", scope1: 180, scope2: 95, scope3: 380, totalEmissions: 655, baselineYear: 2021, baselineEmissions: 920, targetYear: 2028, targetReduction: 40, currentProgress: 29, carbonStatus: "On Track", sdgTags: [2, 8, 13, 15], dataQualityScore: 91, lastUpdated: "2025-01-15" },
  { projectId: "PRJ_007", pfiId: "PFI_01", pfiName: "GT Bank", sector: "Transport", enterpriseId: "ENT_007", enterpriseName: "Swift Logistics", enterpriseSize: "Medium", city: "Lagos", state: "Lagos", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2020, loanAmount: 180000000, loanDate: "2020-06-30", esgCompleteness: 78, reportingStatus: "On-time", taxonomyStatus: "Transition", evidenceStatus: "Provided", scope1: 1200, scope2: 450, scope3: 2800, totalEmissions: 4450, baselineYear: 2020, baselineEmissions: 5200, targetYear: 2030, targetReduction: 35, currentProgress: 14, carbonStatus: "At Risk", sdgTags: [9, 11, 13], dataQualityScore: 78, lastUpdated: "2025-01-13" },
  { projectId: "PRJ_008", pfiId: "PFI_03", pfiName: "Ecobank", sector: "Energy", enterpriseId: "ENT_008", enterpriseName: "SolarGen Solutions", enterpriseSize: "Small", city: "Akure", state: "Ondo", country: "Nigeria", fundingType: "DBN Green Facility", projectStartYear: 2022, loanAmount: 40000000, loanDate: "2022-08-09", esgCompleteness: 98, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Provided", scope1: 25, scope2: 45, scope3: 120, totalEmissions: 190, baselineYear: 2022, baselineEmissions: 280, targetYear: 2027, targetReduction: 50, currentProgress: 32, carbonStatus: "On Track", sdgTags: [7, 9, 13], dataQualityScore: 98, lastUpdated: "2025-01-15" },
  { projectId: "PRJ_009", pfiId: "PFI_02", pfiName: "Fidelity Bank", sector: "Manufacturing", enterpriseId: "ENT_009", enterpriseName: "Delta Textiles", enterpriseSize: "Medium", city: "Warri", state: "Delta", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2018, loanAmount: 150000000, loanDate: "2018-03-25", esgCompleteness: 65, reportingStatus: "Late", taxonomyStatus: "Transition", evidenceStatus: "Missing", scope1: 1800, scope2: 1200, scope3: 3500, totalEmissions: 6500, baselineYear: 2018, baselineEmissions: 8200, targetYear: 2030, targetReduction: 45, currentProgress: 21, carbonStatus: "At Risk", sdgTags: [8, 9, 12], dataQualityScore: 65, lastUpdated: "2025-01-08" },
  { projectId: "PRJ_010", pfiId: "PFI_04", pfiName: "Baobab MFB", sector: "Trade", enterpriseId: "ENT_010", enterpriseName: "Value Stores", enterpriseSize: "Micro", city: "Minna", state: "Niger", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2023, loanAmount: 3000000, loanDate: "2023-05-22", esgCompleteness: 85, reportingStatus: "On-time", taxonomyStatus: "Transition", evidenceStatus: "Provided", scope1: 45, scope2: 65, scope3: 180, totalEmissions: 290, baselineYear: 2023, baselineEmissions: 340, targetYear: 2028, targetReduction: 25, currentProgress: 15, carbonStatus: "On Track", sdgTags: [8, 12], dataQualityScore: 85, lastUpdated: "2025-01-14" },
  { projectId: "PRJ_011", pfiId: "PFI_05", pfiName: "Infinity MFB", sector: "Agriculture", enterpriseId: "ENT_011", enterpriseName: "Harvest Gold Ltd", enterpriseSize: "Small", city: "Jos", state: "Plateau", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2021, loanAmount: 35000000, loanDate: "2021-02-16", esgCompleteness: 89, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Provided", scope1: 150, scope2: 85, scope3: 420, totalEmissions: 655, baselineYear: 2021, baselineEmissions: 890, targetYear: 2028, targetReduction: 40, currentProgress: 26, carbonStatus: "On Track", sdgTags: [2, 8, 13, 15], dataQualityScore: 89, lastUpdated: "2025-01-15" },
  { projectId: "PRJ_012", pfiId: "PFI_01", pfiName: "GT Bank", sector: "Services", enterpriseId: "ENT_012", enterpriseName: "ClearView IT", enterpriseSize: "Small", city: "Lagos", state: "Lagos", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2022, loanAmount: 25000000, loanDate: "2022-04-11", esgCompleteness: 92, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Provided", scope1: 35, scope2: 120, scope3: 180, totalEmissions: 335, baselineYear: 2022, baselineEmissions: 420, targetYear: 2027, targetReduction: 30, currentProgress: 20, carbonStatus: "On Track", sdgTags: [8, 9], dataQualityScore: 92, lastUpdated: "2025-01-15" },
  { projectId: "PRJ_013", pfiId: "PFI_03", pfiName: "Ecobank", sector: "Manufacturing", enterpriseId: "ENT_013", enterpriseName: "Anchor Foods", enterpriseSize: "Medium", city: "Ado-Ekiti", state: "Ekiti", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2020, loanAmount: 100000000, loanDate: "2020-07-28", esgCompleteness: 75, reportingStatus: "On-time", taxonomyStatus: "Transition", evidenceStatus: "Provided", scope1: 950, scope2: 680, scope3: 1800, totalEmissions: 3430, baselineYear: 2020, baselineEmissions: 4200, targetYear: 2030, targetReduction: 40, currentProgress: 18, carbonStatus: "On Track", sdgTags: [2, 8, 12], dataQualityScore: 75, lastUpdated: "2025-01-12" },
  { projectId: "PRJ_014", pfiId: "PFI_02", pfiName: "Fidelity Bank", sector: "Agriculture", enterpriseId: "ENT_014", enterpriseName: "AgroPlus Ventures", enterpriseSize: "Micro", city: "Awka", state: "Anambra", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2023, loanAmount: 4500000, loanDate: "2023-06-03", esgCompleteness: 80, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Missing", scope1: 65, scope2: 45, scope3: 180, totalEmissions: 290, baselineYear: 2023, baselineEmissions: 350, targetYear: 2028, targetReduction: 30, currentProgress: 17, carbonStatus: "On Track", sdgTags: [2, 8, 13], dataQualityScore: 80, lastUpdated: "2025-01-14" },
  { projectId: "PRJ_015", pfiId: "PFI_04", pfiName: "Baobab MFB", sector: "Transport", enterpriseId: "ENT_015", enterpriseName: "Rapid Movers", enterpriseSize: "Small", city: "Ilorin", state: "Kwara", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2019, loanAmount: 20000000, loanDate: "2019-09-19", esgCompleteness: 68, reportingStatus: "Late", taxonomyStatus: "Transition", evidenceStatus: "Missing", scope1: 420, scope2: 180, scope3: 850, totalEmissions: 1450, baselineYear: 2019, baselineEmissions: 1680, targetYear: 2028, targetReduction: 30, currentProgress: 14, carbonStatus: "At Risk", sdgTags: [9, 11], dataQualityScore: 68, lastUpdated: "2025-01-09" },
  { projectId: "PRJ_016", pfiId: "PFI_05", pfiName: "Infinity MFB", sector: "Trade", enterpriseId: "ENT_016", enterpriseName: "Central Wholesale", enterpriseSize: "Medium", city: "Makurdi", state: "Benue", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2021, loanAmount: 80000000, loanDate: "2021-12-01", esgCompleteness: 84, reportingStatus: "On-time", taxonomyStatus: "Transition", evidenceStatus: "Provided", scope1: 380, scope2: 290, scope3: 920, totalEmissions: 1590, baselineYear: 2021, baselineEmissions: 1850, targetYear: 2029, targetReduction: 35, currentProgress: 14, carbonStatus: "On Track", sdgTags: [8, 12], dataQualityScore: 84, lastUpdated: "2025-01-13" },
  { projectId: "PRJ_017", pfiId: "PFI_01", pfiName: "GT Bank", sector: "Manufacturing", enterpriseId: "ENT_017", enterpriseName: "BlueWave Packaging", enterpriseSize: "Small", city: "Lagos", state: "Lagos", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2022, loanAmount: 30000000, loanDate: "2022-01-20", esgCompleteness: 87, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Provided", scope1: 220, scope2: 180, scope3: 480, totalEmissions: 880, baselineYear: 2022, baselineEmissions: 1150, targetYear: 2028, targetReduction: 40, currentProgress: 23, carbonStatus: "On Track", sdgTags: [9, 12], dataQualityScore: 87, lastUpdated: "2025-01-15" },
  { projectId: "PRJ_018", pfiId: "PFI_02", pfiName: "Fidelity Bank", sector: "Energy", enterpriseId: "ENT_018", enterpriseName: "RenewPower Ltd", enterpriseSize: "Medium", city: "Enugu", state: "Enugu", country: "Nigeria", fundingType: "DBN Green Facility", projectStartYear: 2020, loanAmount: 120000000, loanDate: "2020-04-17", esgCompleteness: 96, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Provided", scope1: 45, scope2: 85, scope3: 220, totalEmissions: 350, baselineYear: 2020, baselineEmissions: 580, targetYear: 2027, targetReduction: 55, currentProgress: 40, carbonStatus: "On Track", sdgTags: [7, 9, 13], dataQualityScore: 96, lastUpdated: "2025-01-15" },
  { projectId: "PRJ_019", pfiId: "PFI_03", pfiName: "Ecobank", sector: "Agriculture", enterpriseId: "ENT_019", enterpriseName: "FarmLink Cooperative", enterpriseSize: "Micro", city: "Abakaliki", state: "Ebonyi", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2023, loanAmount: 3500000, loanDate: "2023-07-08", esgCompleteness: 78, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Provided", scope1: 55, scope2: 35, scope3: 150, totalEmissions: 240, baselineYear: 2023, baselineEmissions: 290, targetYear: 2028, targetReduction: 30, currentProgress: 17, carbonStatus: "On Track", sdgTags: [2, 8, 13, 15], dataQualityScore: 78, lastUpdated: "2025-01-14" },
  { projectId: "PRJ_020", pfiId: "PFI_04", pfiName: "Baobab MFB", sector: "Services", enterpriseId: "ENT_020", enterpriseName: "Prime Health Services", enterpriseSize: "Small", city: "Ilorin", state: "Kwara", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2021, loanAmount: 40000000, loanDate: "2021-05-06", esgCompleteness: 90, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Provided", scope1: 95, scope2: 180, scope3: 320, totalEmissions: 595, baselineYear: 2021, baselineEmissions: 780, targetYear: 2028, targetReduction: 35, currentProgress: 24, carbonStatus: "On Track", sdgTags: [3, 8], dataQualityScore: 90, lastUpdated: "2025-01-15" },
  // More projects...
  { projectId: "PRJ_021", pfiId: "PFI_05", pfiName: "Infinity MFB", sector: "Manufacturing", enterpriseId: "ENT_021", enterpriseName: "Golden Mills Ltd", enterpriseSize: "Medium", city: "Kano", state: "Kano", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2019, loanAmount: 130000000, loanDate: "2019-10-23", esgCompleteness: 58, reportingStatus: "Late", taxonomyStatus: "Not Green", evidenceStatus: "Missing", scope1: 2100, scope2: 1450, scope3: 3800, totalEmissions: 7350, baselineYear: 2019, baselineEmissions: 7800, targetYear: 2032, targetReduction: 45, currentProgress: 6, carbonStatus: "Off Track", sdgTags: [8, 9], dataQualityScore: 58, lastUpdated: "2025-01-06" },
  { projectId: "PRJ_022", pfiId: "PFI_01", pfiName: "GT Bank", sector: "Agriculture", enterpriseId: "ENT_022", enterpriseName: "AgriBoost Farms", enterpriseSize: "Small", city: "Ogbomosho", state: "Oyo", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2022, loanAmount: 28000000, loanDate: "2022-03-09", esgCompleteness: 86, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Provided", scope1: 130, scope2: 75, scope3: 380, totalEmissions: 585, baselineYear: 2022, baselineEmissions: 750, targetYear: 2028, targetReduction: 35, currentProgress: 22, carbonStatus: "On Track", sdgTags: [2, 8, 13, 15], dataQualityScore: 86, lastUpdated: "2025-01-14" },
  { projectId: "PRJ_023", pfiId: "PFI_02", pfiName: "Fidelity Bank", sector: "Trade", enterpriseId: "ENT_023", enterpriseName: "Urban Retailers", enterpriseSize: "Micro", city: "Uyo", state: "Akwa Ibom", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2021, loanAmount: 6000000, loanDate: "2021-06-15", esgCompleteness: 79, reportingStatus: "On-time", taxonomyStatus: "Transition", evidenceStatus: "Provided", scope1: 55, scope2: 80, scope3: 220, totalEmissions: 355, baselineYear: 2021, baselineEmissions: 420, targetYear: 2028, targetReduction: 30, currentProgress: 15, carbonStatus: "On Track", sdgTags: [8, 12], dataQualityScore: 79, lastUpdated: "2025-01-13" },
  { projectId: "PRJ_024", pfiId: "PFI_03", pfiName: "Ecobank", sector: "Services", enterpriseId: "ENT_024", enterpriseName: "QuickFix Services", enterpriseSize: "Small", city: "Owerri", state: "Imo", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2020, loanAmount: 20000000, loanDate: "2020-11-04", esgCompleteness: 83, reportingStatus: "On-time", taxonomyStatus: "Transition", evidenceStatus: "Provided", scope1: 110, scope2: 145, scope3: 280, totalEmissions: 535, baselineYear: 2020, baselineEmissions: 680, targetYear: 2028, targetReduction: 30, currentProgress: 21, carbonStatus: "On Track", sdgTags: [8, 9], dataQualityScore: 83, lastUpdated: "2025-01-14" },
  { projectId: "PRJ_025", pfiId: "PFI_04", pfiName: "Baobab MFB", sector: "Energy", enterpriseId: "ENT_025", enterpriseName: "GreenSpark Energy", enterpriseSize: "Small", city: "Yola", state: "Adamawa", country: "Nigeria", fundingType: "DBN Green Facility", projectStartYear: 2023, loanAmount: 45000000, loanDate: "2023-08-19", esgCompleteness: 94, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Provided", scope1: 20, scope2: 35, scope3: 95, totalEmissions: 150, baselineYear: 2023, baselineEmissions: 210, targetYear: 2028, targetReduction: 45, currentProgress: 29, carbonStatus: "On Track", sdgTags: [7, 9, 13], dataQualityScore: 94, lastUpdated: "2025-01-15" },
  { projectId: "PRJ_026", pfiId: "PFI_05", pfiName: "Infinity MFB", sector: "Manufacturing", enterpriseId: "ENT_026", enterpriseName: "NorthSteel Ltd", enterpriseSize: "Medium", city: "Zaria", state: "Kaduna", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2018, loanAmount: 160000000, loanDate: "2018-02-27", esgCompleteness: 52, reportingStatus: "Late", taxonomyStatus: "Not Green", evidenceStatus: "Missing", scope1: 3200, scope2: 2100, scope3: 5400, totalEmissions: 10700, baselineYear: 2018, baselineEmissions: 11500, targetYear: 2035, targetReduction: 50, currentProgress: 7, carbonStatus: "Off Track", sdgTags: [8, 9], dataQualityScore: 52, lastUpdated: "2025-01-04" },
  { projectId: "PRJ_027", pfiId: "PFI_01", pfiName: "GT Bank", sector: "Transport", enterpriseId: "ENT_027", enterpriseName: "Metro Transit", enterpriseSize: "Small", city: "Lagos", state: "Lagos", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2021, loanAmount: 22000000, loanDate: "2021-09-02", esgCompleteness: 81, reportingStatus: "On-time", taxonomyStatus: "Transition", evidenceStatus: "Provided", scope1: 380, scope2: 120, scope3: 680, totalEmissions: 1180, baselineYear: 2021, baselineEmissions: 1420, targetYear: 2029, targetReduction: 35, currentProgress: 17, carbonStatus: "On Track", sdgTags: [9, 11, 13], dataQualityScore: 81, lastUpdated: "2025-01-13" },
  { projectId: "PRJ_028", pfiId: "PFI_02", pfiName: "Fidelity Bank", sector: "Agriculture", enterpriseId: "ENT_028", enterpriseName: "FarmFresh Produce", enterpriseSize: "Micro", city: "Owo", state: "Ondo", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2022, loanAmount: 5000000, loanDate: "2022-05-27", esgCompleteness: 77, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Provided", scope1: 48, scope2: 32, scope3: 140, totalEmissions: 220, baselineYear: 2022, baselineEmissions: 280, targetYear: 2027, targetReduction: 30, currentProgress: 21, carbonStatus: "On Track", sdgTags: [2, 8, 13], dataQualityScore: 77, lastUpdated: "2025-01-14" },
  { projectId: "PRJ_029", pfiId: "PFI_03", pfiName: "Ecobank", sector: "Trade", enterpriseId: "ENT_029", enterpriseName: "SmartBuy Stores", enterpriseSize: "Small", city: "Calabar", state: "Cross River", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2020, loanAmount: 18000000, loanDate: "2020-01-16", esgCompleteness: 74, reportingStatus: "On-time", taxonomyStatus: "Transition", evidenceStatus: "Missing", scope1: 95, scope2: 130, scope3: 340, totalEmissions: 565, baselineYear: 2020, baselineEmissions: 680, targetYear: 2028, targetReduction: 30, currentProgress: 17, carbonStatus: "On Track", sdgTags: [8, 12], dataQualityScore: 74, lastUpdated: "2025-01-12" },
  { projectId: "PRJ_030", pfiId: "PFI_04", pfiName: "Baobab MFB", sector: "Services", enterpriseId: "ENT_030", enterpriseName: "DigitalWave Tech", enterpriseSize: "Medium", city: "Umuahia", state: "Abia", country: "Nigeria", fundingType: "DBN Credit Line", projectStartYear: 2023, loanAmount: 90000000, loanDate: "2023-06-29", esgCompleteness: 88, reportingStatus: "On-time", taxonomyStatus: "Green", evidenceStatus: "Provided", scope1: 65, scope2: 280, scope3: 420, totalEmissions: 765, baselineYear: 2023, baselineEmissions: 920, targetYear: 2028, targetReduction: 30, currentProgress: 17, carbonStatus: "On Track", sdgTags: [8, 9], dataQualityScore: 88, lastUpdated: "2025-01-15" },
];

// PFI Summary data
export const pfis: PFI[] = [
  { pfiId: "PFI_01", pfiName: "GT Bank", projectCount: 24, totalFinanced: 985000000, avgDataQuality: 86, reportingTimeliness: "On-time" },
  { pfiId: "PFI_02", pfiName: "Fidelity Bank", projectCount: 22, totalFinanced: 892000000, avgDataQuality: 72, reportingTimeliness: "Late" },
  { pfiId: "PFI_03", pfiName: "Ecobank", projectCount: 18, totalFinanced: 756000000, avgDataQuality: 84, reportingTimeliness: "On-time" },
  { pfiId: "PFI_04", pfiName: "Baobab MFB", projectCount: 20, totalFinanced: 625000000, avgDataQuality: 88, reportingTimeliness: "On-time" },
  { pfiId: "PFI_05", pfiName: "Infinity MFB", projectCount: 16, totalFinanced: 542000000, avgDataQuality: 76, reportingTimeliness: "On-time" },
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
  const sectors = [...new Set(projects.map(p => p.sector))];
  return sectors.map(sector => {
    const sectorProjects = projects.filter(p => p.sector === sector);
    const totalValue = sectorProjects.reduce((sum, p) => sum + p.loanAmount, 0);
    const avgEsgScore = Math.round(sectorProjects.reduce((sum, p) => sum + p.esgCompleteness, 0) / sectorProjects.length);
    const greenPercentage = Math.round((sectorProjects.filter(p => p.taxonomyStatus === "Green").length / sectorProjects.length) * 100);
    
    return {
      sector,
      projects: sectorProjects.length,
      value: totalValue,
      esgScore: avgEsgScore,
      greenPercentage
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
