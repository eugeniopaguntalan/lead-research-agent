import { logger } from '../shared/logger.js';
import type { SearchService, SearchResult } from './search-service.interface.js';

/**
 * Mock search service for demo/portfolio purposes.
 * Returns realistic search results without requiring API keys.
 */
export class MockSearchService implements SearchService {
  private readonly mockData: Map<string, SearchResult[]> = new Map();

  constructor() {
    this.initializeMockData();
  }

  async search(query: string, maxResults: number = 10): Promise<SearchResult[]> {
    logger.info('Performing mock search', { query, maxResults });

    // Simulate network delay
    await this.delay(300 + Math.random() * 200);

    const results = this.findRelevantResults(query);
    const limitedResults = results.slice(0, maxResults);

    logger.info('Mock search completed', { resultsCount: limitedResults.length });
    return limitedResults;
  }

  private findRelevantResults(query: string): SearchResult[] {
    const lowerQuery = query.toLowerCase();
    
    // Try to match based on keywords in the query
    for (const [key, results] of this.mockData.entries()) {
      if (lowerQuery.includes(key)) {
        return results;
      }
    }

    // Return a default set if no match found
    return this.mockData.get('auto repair') ?? [];
  }

  private initializeMockData(): void {
    // Auto Repair Businesses
    this.mockData.set('auto repair', [
      {
        title: 'Melbourne Premium Auto Repair - Expert Car Service',
        url: 'https://www.melbourneautorepair.com.au',
        description: 'Professional auto repair and maintenance services in Melbourne. Over 20 years of experience. Contact us at (03) 9876 5432 or email info@melbourneautorepair.com.au'
      },
      {
        title: 'Sydney Car Care Centre | Auto Repair & Servicing',
        url: 'https://www.sydneycarcare.com.au',
        description: 'Full-service auto repair shop in Sydney. Established 2005. Family-owned business with 25 employees. Phone: (02) 9123 4567. Visit our contact page for more information.'
      },
      {
        title: 'Brisbane Auto Solutions - Your Trusted Mechanic',
        url: 'https://www.brisbaneautosolutions.com.au',
        description: 'Complete automotive repair services in Brisbane. Founded in 2012. Visit us at 123 Queen St or call (07) 3456 7890. Email: service@brisbaneautosolutions.com.au'
      },
      {
        title: 'Perth Motors Workshop - Auto Repair Specialists',
        url: 'https://www.perthmotors.com.au',
        description: 'Expert car repairs and maintenance in Perth. 15 certified mechanics on staff. Contact: (08) 6789 0123 or contact@perthmotors.com.au'
      },
      {
        title: 'Adelaide Auto Tech - Modern Car Servicing',
        url: 'https://www.adelaideautotech.com.au',
        description: 'State-of-the-art auto repair facility in Adelaide since 2010. Team of 20+ professionals. Get in touch: (08) 8234 5678'
      }
    ]);

    // Veterinary Clinics
    this.mockData.set('veterinary', [
      {
        title: 'Melbourne Animal Hospital | 24/7 Veterinary Care',
        url: 'https://www.melbourneanimalhosp.com.au',
        description: 'Leading veterinary clinic in Melbourne providing comprehensive pet care. Founded 1998. Staff of 30 including 8 vets. Phone: (03) 9111 2222. Email: reception@melbourneanimalhosp.com.au'
      },
      {
        title: 'Sydney Pet Clinic - Compassionate Veterinary Care',
        url: 'https://www.sydneypetclinic.com.au',
        description: 'Family-run veterinary practice in Sydney since 2008. Modern facilities with 12 staff members. Contact us: (02) 9333 4444 or info@sydneypetclinic.com.au'
      },
      {
        title: 'Brisbane Vet Centre | Professional Animal Care',
        url: 'https://www.brisbanevetcentre.com.au',
        description: 'Expert veterinary services in Brisbane. Established 2015. Team of 15 dedicated professionals. Call (07) 3555 6666 for appointments.'
      },
      {
        title: 'Perth Veterinary Hospital - Advanced Pet Care',
        url: 'https://www.perthvethospital.com.au',
        description: 'Comprehensive veterinary services in Perth. 20 years of experience. Contact: (08) 6777 8888 or admin@perthvethospital.com.au'
      },
      {
        title: 'Adelaide Pet Wellness Clinic',
        url: 'https://www.adelaidepetclinic.com.au',
        description: 'Holistic veterinary care in Adelaide. Founded 2012 with 18 team members. Phone: (08) 8999 0000'
      }
    ]);

    // Dental Practices
    this.mockData.set('dental', [
      {
        title: 'Melbourne Smile Dental - Cosmetic & General Dentistry',
        url: 'https://www.melbournesmile.com.au',
        description: 'Premium dental practice in Melbourne CBD. Established 2005 with 25 staff. Contact: (03) 9222 3333 or appointments@melbournesmile.com.au'
      },
      {
        title: 'Sydney Dental Care | Family Dentistry',
        url: 'https://www.sydneydentalcare.com.au',
        description: 'Family-friendly dental clinic in Sydney. Founded 2010. Team of 20 professionals. Phone: (02) 9444 5555. Visit our contact page.'
      },
      {
        title: 'Brisbane City Dentist - Complete Dental Solutions',
        url: 'https://www.brisbanecitydentist.com.au',
        description: 'Modern dental practice in Brisbane since 2013. 15 experienced staff members. Call (07) 3666 7777 or email info@brisbanecitydentist.com.au'
      },
      {
        title: 'Perth Dental Studio - Advanced Dental Care',
        url: 'https://www.perthdentalstudio.com.au',
        description: 'State-of-the-art dental facility in Perth. 18 years of excellence. Contact: (08) 6888 9999'
      },
      {
        title: 'Adelaide Dental Group',
        url: 'https://www.adelaidedentalgroup.com.au',
        description: 'Comprehensive dental services in Adelaide. Founded 2007. Team of 22 professionals. Phone: (08) 8111 2222 or contact@adelaidedentalgroup.com.au'
      }
    ]);

    // Restaurants/Cafes
    this.mockData.set('restaurant', [
      {
        title: 'The Melbourne Bistro | Fine Dining Experience',
        url: 'https://www.melbournebistro.com.au',
        description: 'Award-winning restaurant in Melbourne. Established 2000. Staff of 35. Reservations: (03) 9333 4444 or bookings@melbournebistro.com.au'
      },
      {
        title: 'Sydney Harbour Grill - Waterfront Dining',
        url: 'https://www.sydneyharborgrill.com.au',
        description: 'Premium seafood restaurant in Sydney. Founded 2008. Team of 40+ professionals. Contact: (02) 9555 6666'
      },
      {
        title: 'Brisbane River Cafe - Modern Australian Cuisine',
        url: 'https://www.brisbanerivercafe.com.au',
        description: 'Contemporary cafe and restaurant in Brisbane since 2012. 28 staff members. Phone: (07) 3777 8888 or info@brisbanerivercafe.com.au'
      },
      {
        title: 'Perth Ocean Restaurant | Fresh Seafood',
        url: 'https://www.perthoceanrestaurant.com.au',
        description: 'Coastal dining experience in Perth. Established 2015. Contact: (08) 6999 0000 or reservations@perthoceanrestaurant.com.au'
      }
    ]);

    // Accounting/Bookkeeping
    this.mockData.set('accounting', [
      {
        title: 'Melbourne Accounting Partners - Business Advisory',
        url: 'https://www.melbourneaccounting.com.au',
        description: 'Professional accounting services in Melbourne. Established 1995. Team of 45 CPAs. Contact: (03) 9444 5555 or enquiries@melbourneaccounting.com.au'
      },
      {
        title: 'Sydney Tax & Accounting Solutions',
        url: 'https://www.sydneytaxsolutions.com.au',
        description: 'Comprehensive tax and accounting services in Sydney since 2003. 35 qualified accountants. Phone: (02) 9666 7777'
      },
      {
        title: 'Brisbane Bookkeeping Services | Small Business Specialists',
        url: 'https://www.brisbanebookkeeping.com.au',
        description: 'Expert bookkeeping for small businesses in Brisbane. Founded 2010. Staff of 18. Email: info@brisbanebookkeeping.com.au or call (07) 3888 9999'
      },
      {
        title: 'Perth Financial Group - Accounting & Advisory',
        url: 'https://www.perthfinancialgroup.com.au',
        description: 'Full-service accounting firm in Perth. 25 years of experience. Team of 50+. Contact: (08) 6000 1111'
      }
    ]);

    // Real Estate Agencies
    this.mockData.set('real estate', [
      {
        title: 'Melbourne Property Group - Premium Real Estate',
        url: 'https://www.melbournepropertygroup.com.au',
        description: 'Leading real estate agency in Melbourne. Established 1988. 60 agents and staff. Contact: (03) 9555 6666 or sales@melbournepropertygroup.com.au'
      },
      {
        title: 'Sydney Realty Partners | Residential & Commercial',
        url: 'https://www.sydneyrealtypartners.com.au',
        description: 'Trusted real estate services in Sydney since 1995. Team of 75 professionals. Phone: (02) 9777 8888'
      },
      {
        title: 'Brisbane Homes & Land - Property Specialists',
        url: 'https://www.brisbanehomesland.com.au',
        description: 'Expert property sales and rentals in Brisbane. Founded 2005. 40 dedicated staff. Email: info@brisbanehomesland.com.au or call (07) 3999 0000'
      }
    ]);

    // Gyms/Fitness Centers
    this.mockData.set('gym', [
      {
        title: 'Melbourne Fitness Hub - Premium Gym & Training',
        url: 'https://www.melbournefitnesshub.com.au',
        description: '24/7 fitness facility in Melbourne. Established 2010. Staff of 30 trainers. Memberships: (03) 9666 7777 or join@melbournefitnesshub.com.au'
      },
      {
        title: 'Sydney Active Gym | Personal Training',
        url: 'https://www.sydneyactivegym.com.au',
        description: 'State-of-the-art gym in Sydney since 2012. Team of 25 certified trainers. Contact: (02) 9888 9999'
      },
      {
        title: 'Brisbane Strength & Fitness Centre',
        url: 'https://www.brisbanestrength.com.au',
        description: 'Complete fitness center in Brisbane. Founded 2015. 20+ professional trainers. Phone: (07) 3000 1111 or info@brisbanestrength.com.au'
      }
    ]);

    // Hair Salons
    this.mockData.set('hair salon', [
      {
        title: 'Melbourne Hair Studio - Premium Hairdressing',
        url: 'https://www.melbournehairstudio.com.au',
        description: 'Award-winning hair salon in Melbourne. Established 2008. Team of 22 stylists. Bookings: (03) 9777 8888 or book@melbournehairstudio.com.au'
      },
      {
        title: 'Sydney Style Hair Salon | Expert Stylists',
        url: 'https://www.sydneystylehair.com.au',
        description: 'Contemporary hair salon in Sydney since 2010. 18 experienced stylists. Contact: (02) 9999 0000'
      },
      {
        title: 'Brisbane Beauty & Hair Lounge',
        url: 'https://www.brisbanebeautyhair.com.au',
        description: 'Full-service hair and beauty salon in Brisbane. Founded 2013. Staff of 15. Phone: (07) 3111 2222 or info@brisbanebeautyhair.com.au'
      }
    ]);

    // Plumbing Services
    this.mockData.set('plumbing', [
      {
        title: 'Melbourne Plumbing Pros - 24/7 Emergency Service',
        url: 'https://www.melbourneplumbingpros.com.au',
        description: 'Professional plumbing services in Melbourne. Established 2005. Team of 20 licensed plumbers. Emergency: (03) 9888 9999 or admin@melbourneplumbingpros.com.au'
      },
      {
        title: 'Sydney Plumbing Solutions | Residential & Commercial',
        url: 'https://www.sydneyplumbingsolutions.com.au',
        description: 'Trusted plumbing company in Sydney since 1998. 25 qualified plumbers. Contact: (02) 9000 1111'
      },
      {
        title: 'Brisbane Master Plumbers',
        url: 'https://www.brisbanemasterplumbers.com.au',
        description: 'Expert plumbing services in Brisbane. Founded 2008. Staff of 18. Phone: (07) 3222 3333 or service@brisbanemasterplumbers.com.au'
      }
    ]);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
