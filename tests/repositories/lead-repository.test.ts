import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryLeadRepository } from '../../src/repositories/lead-repository.js';
import { ValidationError } from '../../src/shared/errors.js';
import {
  mockLead,
  mockLeadWithoutPhone,
  mockDuplicateByWebsite,
  mockDuplicateByName,
  mockDuplicateByPhone
} from '../fixtures/mock-leads.js';

describe('LeadRepository', () => {
  let repository: InMemoryLeadRepository;

  beforeEach(() => {
    repository = new InMemoryLeadRepository();
  });

  describe('save', () => {
    it('should save a valid lead', async () => {
      const savedLead = await repository.save(mockLead);

      expect(savedLead.id).toBeDefined();
      expect(savedLead.businessName).toBe(mockLead.businessName);
      expect(savedLead.createdAt).toBeInstanceOf(Date);
      expect(savedLead.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw ValidationError for duplicate website', async () => {
      await repository.save(mockLead);

      await expect(repository.save(mockDuplicateByWebsite)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for duplicate business name', async () => {
      await repository.save(mockLead);

      await expect(repository.save(mockDuplicateByName)).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for duplicate phone number', async () => {
      await repository.save(mockLead);

      await expect(repository.save(mockDuplicateByPhone)).rejects.toThrow(ValidationError);
    });

    it('should normalize website domains for deduplication', async () => {
      await repository.save(mockLead);

      const duplicateWithWww = {
        ...mockLead,
        businessName: 'Different Name',
        website: 'https://www.abcautorepair.com'
      };

      await expect(repository.save(duplicateWithWww)).rejects.toThrow(ValidationError);
    });

    it('should normalize business names for deduplication', async () => {
      await repository.save(mockLead);

      const duplicateWithDifferentCase = {
        ...mockLead,
        businessName: 'ABC AUTO REPAIR',
        website: 'https://www.different.com'
      };

      await expect(repository.save(duplicateWithDifferentCase)).rejects.toThrow(ValidationError);
    });

    it('should normalize phone numbers for deduplication', async () => {
      await repository.save(mockLead);

      const duplicateWithFormattedPhone = {
        ...mockLead,
        businessName: 'Different Business',
        website: 'https://www.another.com',
        phoneNumber: '61312345678'
      };

      await expect(repository.save(duplicateWithFormattedPhone)).rejects.toThrow(ValidationError);
    });
  });

  describe('findByWebsite', () => {
    it('should find lead by website', async () => {
      await repository.save(mockLead);

      const found = await repository.findByWebsite(mockLead.website);

      expect(found).not.toBeNull();
      expect(found?.businessName).toBe(mockLead.businessName);
    });

    it('should normalize website for search', async () => {
      await repository.save(mockLead);

      const found = await repository.findByWebsite('https://www.abcautorepair.com');

      expect(found).not.toBeNull();
    });

    it('should return null if not found', async () => {
      const found = await repository.findByWebsite('https://www.nonexistent.com');

      expect(found).toBeNull();
    });
  });

  describe('findByBusinessName', () => {
    it('should find lead by business name', async () => {
      await repository.save(mockLead);

      const found = await repository.findByBusinessName(mockLead.businessName);

      expect(found).not.toBeNull();
      expect(found?.website).toBe(mockLead.website);
    });

    it('should normalize business name for search', async () => {
      await repository.save(mockLead);

      const found = await repository.findByBusinessName('ABC AUTO REPAIR');

      expect(found).not.toBeNull();
    });

    it('should return null if not found', async () => {
      const found = await repository.findByBusinessName('Nonexistent Business');

      expect(found).toBeNull();
    });
  });

  describe('findByPhoneNumber', () => {
    it('should find lead by phone number', async () => {
      await repository.save(mockLead);

      const found = await repository.findByPhoneNumber(mockLead.phoneNumber!);

      expect(found).not.toBeNull();
      expect(found?.businessName).toBe(mockLead.businessName);
    });

    it('should normalize phone number for search', async () => {
      await repository.save(mockLead);

      const found = await repository.findByPhoneNumber('61312345678');

      expect(found).not.toBeNull();
    });

    it('should return null if not found', async () => {
      const found = await repository.findByPhoneNumber('+1 555 1234');

      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all leads', async () => {
      await repository.save(mockLead);
      await repository.save(mockLeadWithoutPhone);

      const allLeads = await repository.findAll();

      expect(allLeads).toHaveLength(2);
    });

    it('should return empty array when no leads exist', async () => {
      const allLeads = await repository.findAll();

      expect(allLeads).toHaveLength(0);
    });
  });

  describe('isDuplicate', () => {
    it('should return true for duplicate website', async () => {
      await repository.save(mockLead);

      const isDupe = await repository.isDuplicate(mockDuplicateByWebsite);

      expect(isDupe).toBe(true);
    });

    it('should return true for duplicate business name', async () => {
      await repository.save(mockLead);

      const isDupe = await repository.isDuplicate(mockDuplicateByName);

      expect(isDupe).toBe(true);
    });

    it('should return true for duplicate phone number', async () => {
      await repository.save(mockLead);

      const isDupe = await repository.isDuplicate(mockDuplicateByPhone);

      expect(isDupe).toBe(true);
    });

    it('should return false for unique lead', async () => {
      await repository.save(mockLead);

      const isDupe = await repository.isDuplicate(mockLeadWithoutPhone);

      expect(isDupe).toBe(false);
    });
  });
});
