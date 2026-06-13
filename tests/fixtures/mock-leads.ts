import type { Lead } from '../../src/types/lead.js';

export const mockLead: Lead = {
  businessName: 'ABC Auto Repair',
  industry: 'Auto Repair',
  website: 'https://www.abcautorepair.com',
  location: 'Melbourne',
  country: 'Australia',
  sourceUrl: 'https://www.abcautorepair.com',
  phoneNumber: '+61 3 1234 5678',
  emailAddress: 'contact@abcautorepair.com',
  linkedinUrl: null,
  facebookUrl: null,
  instagramUrl: null,
  contactPageUrl: 'https://www.abcautorepair.com/contact',
  description: 'Premium auto repair services in Melbourne',
  yearFounded: '2010',
  employeeCount: '15'
};

export const mockLeadWithoutPhone: Lead = {
  ...mockLead,
  businessName: 'XYZ Veterinary Clinic',
  industry: 'Veterinary Clinic',
  website: 'https://www.xyzvet.com',
  sourceUrl: 'https://www.xyzvet.com',
  phoneNumber: null,
  emailAddress: null
};

export const mockDuplicateByWebsite: Lead = {
  ...mockLead,
  businessName: 'Different Name',
  website: 'https://abcautorepair.com'
};

export const mockDuplicateByName: Lead = {
  ...mockLead,
  website: 'https://www.different-website.com'
};

export const mockDuplicateByPhone: Lead = {
  ...mockLead,
  businessName: 'Different Business',
  website: 'https://www.another-site.com',
  phoneNumber: '+61 3 1234 5678'
};
