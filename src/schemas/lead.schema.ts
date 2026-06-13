import { z } from 'zod';

export const LeadSchema = z.object({
  id: z.number().optional(),
  businessName: z.string().min(1, 'Business name is required'),
  industry: z.string().min(1, 'Industry is required'),
  website: z.string().url('Website must be a valid URL'),
  location: z.string().min(1, 'Location is required'),
  country: z.string().min(1, 'Country is required'),
  sourceUrl: z.string().url('Source URL must be a valid URL'),
  phoneNumber: z.string().nullable(),
  emailAddress: z.string().email('Email must be valid').nullable().or(z.literal(null)),
  linkedinUrl: z.string().url('LinkedIn URL must be valid').nullable().or(z.literal(null)),
  facebookUrl: z.string().url('Facebook URL must be valid').nullable().or(z.literal(null)),
  instagramUrl: z.string().url('Instagram URL must be valid').nullable().or(z.literal(null)),
  contactPageUrl: z.string().url('Contact page URL must be valid').nullable().or(z.literal(null)),
  description: z.string().nullable(),
  yearFounded: z.string().nullable(),
  employeeCount: z.string().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const LeadSearchInputSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  productDescription: z.string().min(1, 'Product description is required'),
  targetIndustries: z.array(z.string()).min(1, 'At least one target industry is required'),
  targetCountries: z.array(z.string()).min(1, 'At least one target country is required'),
  targetRegions: z.array(z.string()).optional(),
  maxResults: z.number().int().positive().max(200, 'Max results cannot exceed 200')
});

export const LeadSearchResultSchema = z.object({
  leads: z.array(LeadSchema),
  totalFound: z.number().int().nonnegative(),
  searchQuery: z.string()
});

export type LeadSchemaType = z.infer<typeof LeadSchema>;
export type LeadSearchInputSchemaType = z.infer<typeof LeadSearchInputSchema>;
export type LeadSearchResultSchemaType = z.infer<typeof LeadSearchResultSchema>;
