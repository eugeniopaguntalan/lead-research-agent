import { describe, it, expect } from 'vitest';
import { LeadSchema, LeadSearchInputSchema } from '../../src/schemas/lead.schema.js';
import { mockLead } from '../fixtures/mock-leads.js';

describe('Lead Schema Validation', () => {
  describe('LeadSchema', () => {
    it('should validate a valid lead', () => {
      const result = LeadSchema.safeParse(mockLead);

      expect(result.success).toBe(true);
    });

    it('should reject lead without business name', () => {
      const invalidLead = { ...mockLead, businessName: '' };

      const result = LeadSchema.safeParse(invalidLead);

      expect(result.success).toBe(false);
    });

    it('should reject lead with invalid website URL', () => {
      const invalidLead = { ...mockLead, website: 'not-a-url' };

      const result = LeadSchema.safeParse(invalidLead);

      expect(result.success).toBe(false);
    });

    it('should reject lead with invalid email', () => {
      const invalidLead = { ...mockLead, emailAddress: 'not-an-email' };

      const result = LeadSchema.safeParse(invalidLead);

      expect(result.success).toBe(false);
    });

    it('should accept null values for optional fields', () => {
      const leadWithNulls = {
        ...mockLead,
        phoneNumber: null,
        emailAddress: null,
        linkedinUrl: null,
        description: null
      };

      const result = LeadSchema.safeParse(leadWithNulls);

      expect(result.success).toBe(true);
    });
  });

  describe('LeadSearchInputSchema', () => {
    it('should validate valid search input', () => {
      const searchInput = {
        productName: 'Queue Management SaaS',
        productDescription: 'Customer queue management system',
        targetIndustries: ['Auto Repair', 'Salon'],
        targetCountries: ['Australia'],
        maxResults: 50
      };

      const result = LeadSearchInputSchema.safeParse(searchInput);

      expect(result.success).toBe(true);
    });

    it('should reject search input without industries', () => {
      const invalidInput = {
        productName: 'Test Product',
        productDescription: 'Test Description',
        targetIndustries: [],
        targetCountries: ['Australia'],
        maxResults: 50
      };

      const result = LeadSearchInputSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should reject search input with maxResults over 200', () => {
      const invalidInput = {
        productName: 'Test Product',
        productDescription: 'Test Description',
        targetIndustries: ['Auto Repair'],
        targetCountries: ['Australia'],
        maxResults: 300
      };

      const result = LeadSearchInputSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should reject search input with negative maxResults', () => {
      const invalidInput = {
        productName: 'Test Product',
        productDescription: 'Test Description',
        targetIndustries: ['Auto Repair'],
        targetCountries: ['Australia'],
        maxResults: -5
      };

      const result = LeadSearchInputSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });
  });
});
