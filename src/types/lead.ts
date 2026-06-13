export interface Lead {
  id?: number | undefined;
  businessName: string;
  industry: string;
  website: string;
  location: string;
  country: string;
  sourceUrl: string;
  phoneNumber: string | null;
  emailAddress: string | null;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  contactPageUrl: string | null;
  description: string | null;
  yearFounded: string | null;
  employeeCount: string | null;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export interface LeadSearchInput {
  productName: string;
  productDescription: string;
  targetIndustries: string[];
  targetCountries: string[];
  targetRegions?: string[];
  maxResults: number;
}

export interface LeadSearchResult {
  leads: Lead[];
  totalFound: number;
  searchQuery: string;
}
