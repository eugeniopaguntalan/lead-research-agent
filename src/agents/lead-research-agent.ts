import type { LeadSearchInput, Lead, LeadSearchResult } from '../types/lead.js';
import type { SearchService } from '../services/search-service.interface.js';
import { LeadSearchInputSchema } from '../schemas/lead.schema.js';
import { logger } from '../shared/logger.js';

export class LeadResearchAgent {
  constructor(private readonly searchService: SearchService) {}

  async research(input: LeadSearchInput): Promise<LeadSearchResult> {
    logger.info('Starting lead research', {
      industries: input.targetIndustries,
      countries: input.targetCountries,
      maxResults: input.maxResults
    });

    const validatedInput = LeadSearchInputSchema.parse(input);

    const leads: Lead[] = [];
    const seenDomains = new Set<string>();

    for (const industry of validatedInput.targetIndustries) {
      for (const country of validatedInput.targetCountries) {
        const query = this.buildSearchQuery(
          industry,
          country,
          validatedInput.targetRegions
        );

        logger.info('Searching for leads', { query, industry, country });

        try {
          const searchResults = await this.searchService.search(
            query,
            Math.ceil(validatedInput.maxResults / validatedInput.targetIndustries.length)
          );

          for (const result of searchResults) {
            const lead = this.extractLeadFromSearchResult(result, industry, country);
            
            if (lead) {
              const domain = this.extractDomain(lead.website);
              
              if (!seenDomains.has(domain)) {
                seenDomains.add(domain);
                leads.push(lead);
                
                if (leads.length >= validatedInput.maxResults) {
                  break;
                }
              }
            }
          }

          if (leads.length >= validatedInput.maxResults) {
            break;
          }
        } catch (error) {
          logger.error('Search failed for query', error, { query, industry, country });
        }
      }

      if (leads.length >= validatedInput.maxResults) {
        break;
      }
    }

    logger.info('Lead research completed', { totalLeads: leads.length });

    return {
      leads,
      totalFound: leads.length,
      searchQuery: this.buildSearchQuery(
        validatedInput.targetIndustries.join(', '),
        validatedInput.targetCountries.join(', '),
        validatedInput.targetRegions
      )
    };
  }

  private buildSearchQuery(
    industry: string,
    country: string,
    regions?: string[]
  ): string {
    const regionPart = regions && regions.length > 0 
      ? ` ${regions.join(' OR ')}` 
      : '';
    
    return `${industry} businesses in ${country}${regionPart}`;
  }

  private extractLeadFromSearchResult(
    result: { title: string; url: string; description: string },
    industry: string,
    country: string
  ): Lead | null {
    try {
      const url = new URL(result.url);
      
      if (this.isDirectoryOrListingSite(url.hostname)) {
        return null;
      }

      const businessName = this.extractBusinessName(result.title);
      const location = this.extractLocation(result.description, country);

      return {
        businessName,
        industry,
        website: result.url,
        location: location ?? country,
        country,
        sourceUrl: result.url,
        phoneNumber: null,
        emailAddress: null,
        linkedinUrl: null,
        facebookUrl: null,
        instagramUrl: null,
        contactPageUrl: null,
        description: result.description || null,
        yearFounded: null,
        employeeCount: null
      };
    } catch (error) {
      logger.warn('Failed to extract lead from search result', { error, url: result.url });
      return null;
    }
  }

  private extractBusinessName(title: string): string {
    return title
      .replace(/\s*[-–|]\s*.+$/, '')
      .trim();
  }

  private extractLocation(description: string, _country: string): string | null {
    const cityPattern = /(?:in|located in|based in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i;
    const match = description.match(cityPattern);
    
    return match?.[1] ?? null;
  }

  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  private isDirectoryOrListingSite(hostname: string): boolean {
    const directories = [
      'yelp.com',
      'yellowpages.com',
      'google.com',
      'facebook.com',
      'linkedin.com',
      'tripadvisor.com',
      'bbb.org',
      'foursquare.com'
    ];

    return directories.some(dir => hostname.includes(dir));
  }
}
