import type { SearchResult } from '../../src/services/search-service.interface.js';

/**
 * Realistic mock search results for different industries.
 * Used for testing and demo purposes.
 */

export const autoRepairSearchResults: SearchResult[] = [
  {
    title: 'Melbourne Premium Auto Repair - Expert Car Service',
    url: 'https://www.melbourneautorepair.com.au',
    description: 'Professional auto repair and maintenance services in Melbourne. Over 20 years of experience. Contact us at (03) 9876 5432 or email info@melbourneautorepair.com.au'
  },
  {
    title: 'Sydney Car Care Centre | Auto Repair & Servicing',
    url: 'https://www.sydneycarcare.com.au',
    description: 'Full-service auto repair shop in Sydney. Established 2005. Family-owned business with 25 employees. Phone: (02) 9123 4567.'
  },
  {
    title: 'Brisbane Auto Solutions - Your Trusted Mechanic',
    url: 'https://www.brisbaneautosolutions.com.au',
    description: 'Complete automotive repair services in Brisbane. Founded in 2012. Visit us at 123 Queen St or call (07) 3456 7890.'
  }
];

export const veterinarySearchResults: SearchResult[] = [
  {
    title: 'Melbourne Animal Hospital | 24/7 Veterinary Care',
    url: 'https://www.melbourneanimalhosp.com.au',
    description: 'Leading veterinary clinic in Melbourne providing comprehensive pet care. Founded 1998. Staff of 30 including 8 vets. Phone: (03) 9111 2222.'
  },
  {
    title: 'Sydney Pet Clinic - Compassionate Veterinary Care',
    url: 'https://www.sydneypetclinic.com.au',
    description: 'Family-run veterinary practice in Sydney since 2008. Modern facilities with 12 staff members. Contact us: (02) 9333 4444'
  }
];

export const dentalSearchResults: SearchResult[] = [
  {
    title: 'Melbourne Smile Dental - Cosmetic & General Dentistry',
    url: 'https://www.melbournesmile.com.au',
    description: 'Premium dental practice in Melbourne CBD. Established 2005 with 25 staff. Contact: (03) 9222 3333 or appointments@melbournesmile.com.au'
  },
  {
    title: 'Sydney Dental Care | Family Dentistry',
    url: 'https://www.sydneydentalcare.com.au',
    description: 'Family-friendly dental clinic in Sydney. Founded 2010. Team of 20 professionals. Phone: (02) 9444 5555.'
  }
];
