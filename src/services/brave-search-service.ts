import { env } from '../config/env.js';
import { ExternalServiceError } from '../shared/errors.js';
import { logger } from '../shared/logger.js';
import {
  type SearchService,
  type SearchResult,
  BraveSearchResponseSchema
} from './search-service.interface.js';

export class BraveSearchService implements SearchService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.search.brave.com/res/v1/web/search';
  private readonly maxRetries = 3;
  private readonly retryDelayMs = 1000;

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? env.BRAVE_API_KEY;
  }

  async search(query: string, maxResults: number = 10): Promise<SearchResult[]> {
    logger.info('Performing Brave search', { query, maxResults });

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const results = await this.executeSearch(query, maxResults);
        logger.info('Brave search completed', { resultsCount: results.length });
        return results;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        logger.warn(`Brave search attempt ${attempt} failed`, { error: lastError.message });

        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelayMs * attempt);
        }
      }
    }

    throw new ExternalServiceError(
      lastError?.message ?? 'Search failed after retries',
      'BraveSearch'
    );
  }

  private async executeSearch(query: string, maxResults: number): Promise<SearchResult[]> {
    const url = new URL(this.baseUrl);
    url.searchParams.append('q', query);
    url.searchParams.append('count', Math.min(maxResults, 20).toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': this.apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Brave API returned ${response.status}: ${errorText}`);
    }

    const data: unknown = await response.json();
    const validated = BraveSearchResponseSchema.parse(data);

    const webResults = validated.web?.results ?? [];
    
    return webResults.map(result => ({
      title: result.title,
      url: result.url,
      description: result.description ?? ''
    }));
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
