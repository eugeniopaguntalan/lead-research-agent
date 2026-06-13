import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LeadResearchAgent } from '../../src/agents/lead-research-agent.js';
import type { SearchService, SearchResult } from '../../src/services/search-service.interface.js';
import type { LeadSearchInput } from '../../src/types/lead.js';

class MockSearchService implements SearchService {
  private mockResults: SearchResult[] = [];

  setMockResults(results: SearchResult[]): void {
    this.mockResults = results;
  }

  async search(_query: string, _maxResults: number): Promise<SearchResult[]> {
    return this.mockResults;
  }
}

describe('LeadResearchAgent', () => {
  let agent: LeadResearchAgent;
  let mockSearchService: MockSearchService;

  beforeEach(() => {
    mockSearchService = new MockSearchService();
    agent = new LeadResearchAgent(mockSearchService);
  });

  describe('research', () => {
    it('should return leads from search results', async () => {
      const mockSearchResults: SearchResult[] = [
        {
          title: 'ABC Auto Repair - Melbourne',
          url: 'https://www.abcautorepair.com',
          description: 'Auto repair shop located in Melbourne, Australia'
        },
        {
          title: 'XYZ Veterinary Clinic',
          url: 'https://www.xyzvet.com',
          description: 'Veterinary services in Sydney'
        }
      ];

      mockSearchService.setMockResults(mockSearchResults);

      const searchInput: LeadSearchInput = {
        productName: 'Queue Management',
        productDescription: 'Queue management system',
        targetIndustries: ['Auto Repair'],
        targetCountries: ['Australia'],
        maxResults: 10
      };

      const result = await agent.research(searchInput);

      expect(result.leads).toHaveLength(2);
      expect(result.totalFound).toBe(2);
      expect(result.leads[0]?.businessName).toBe('ABC Auto Repair');
    });

    it('should deduplicate leads by domain', async () => {
      const mockSearchResults: SearchResult[] = [
        {
          title: 'ABC Auto Repair',
          url: 'https://www.abcautorepair.com',
          description: 'Auto repair in Melbourne'
        },
        {
          title: 'ABC Auto Repair - Contact',
          url: 'https://www.abcautorepair.com/contact',
          description: 'Contact page'
        }
      ];

      mockSearchService.setMockResults(mockSearchResults);

      const searchInput: LeadSearchInput = {
        productName: 'Queue Management',
        productDescription: 'Queue management system',
        targetIndustries: ['Auto Repair'],
        targetCountries: ['Australia'],
        maxResults: 10
      };

      const result = await agent.research(searchInput);

      expect(result.leads).toHaveLength(1);
    });

    it('should filter out directory sites', async () => {
      const mockSearchResults: SearchResult[] = [
        {
          title: 'ABC Auto Repair on Yelp',
          url: 'https://www.yelp.com/biz/abc-auto-repair',
          description: 'Reviews for ABC Auto Repair'
        },
        {
          title: 'ABC Auto Repair',
          url: 'https://www.abcautorepair.com',
          description: 'Official website'
        }
      ];

      mockSearchService.setMockResults(mockSearchResults);

      const searchInput: LeadSearchInput = {
        productName: 'Queue Management',
        productDescription: 'Queue management system',
        targetIndustries: ['Auto Repair'],
        targetCountries: ['Australia'],
        maxResults: 10
      };

      const result = await agent.research(searchInput);

      expect(result.leads).toHaveLength(1);
      expect(result.leads[0]?.website).toBe('https://www.abcautorepair.com');
    });

    it('should respect maxResults limit', async () => {
      const mockSearchResults: SearchResult[] = Array.from({ length: 20 }, (_, i) => ({
        title: `Business ${i}`,
        url: `https://www.business${i}.com`,
        description: `Description ${i}`
      }));

      mockSearchService.setMockResults(mockSearchResults);

      const searchInput: LeadSearchInput = {
        productName: 'Queue Management',
        productDescription: 'Queue management system',
        targetIndustries: ['Auto Repair'],
        targetCountries: ['Australia'],
        maxResults: 5
      };

      const result = await agent.research(searchInput);

      expect(result.leads.length).toBeLessThanOrEqual(5);
    });

    it('should handle empty search results', async () => {
      mockSearchService.setMockResults([]);

      const searchInput: LeadSearchInput = {
        productName: 'Queue Management',
        productDescription: 'Queue management system',
        targetIndustries: ['Auto Repair'],
        targetCountries: ['Australia'],
        maxResults: 10
      };

      const result = await agent.research(searchInput);

      expect(result.leads).toHaveLength(0);
      expect(result.totalFound).toBe(0);
    });

    it('should validate search input', async () => {
      const invalidInput = {
        productName: '',
        productDescription: 'Test',
        targetIndustries: [],
        targetCountries: ['Australia'],
        maxResults: 10
      };

      await expect(agent.research(invalidInput as LeadSearchInput)).rejects.toThrow();
    });
  });
});
