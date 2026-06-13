import { z } from 'zod';

export interface SearchService {
  search(query: string, maxResults: number): Promise<SearchResult[]>;
}

export interface SearchResult {
  title: string;
  url: string;
  description: string;
}

const BraveWebSearchResultSchema = z.object({
  type: z.literal('search'),
  title: z.string(),
  url: z.string(),
  description: z.string().optional()
});

const BraveSearchResponseSchema = z.object({
  web: z.object({
    results: z.array(BraveWebSearchResultSchema).optional()
  }).optional()
});

export { BraveWebSearchResultSchema, BraveSearchResponseSchema };
