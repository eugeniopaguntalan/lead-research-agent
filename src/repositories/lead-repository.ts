import type { Lead } from '../types/lead.js';
import { LeadSchema } from '../schemas/lead.schema.js';
import { ValidationError, DatabaseError } from '../shared/errors.js';
import { logger } from '../shared/logger.js';

export interface LeadRepository {
  save(lead: Lead): Promise<Lead>;
  findByWebsite(website: string): Promise<Lead | null>;
  findByBusinessName(businessName: string): Promise<Lead | null>;
  findByPhoneNumber(phoneNumber: string): Promise<Lead | null>;
  findAll(): Promise<Lead[]>;
  isDuplicate(lead: Lead): Promise<boolean>;
}

export class InMemoryLeadRepository implements LeadRepository {
  private leads: Map<number, Lead> = new Map();
  private nextId = 1;

  async save(lead: Lead): Promise<Lead> {
    try {
      const validated = LeadSchema.parse(lead);
      
      const leadForCheck: Lead = {
        ...validated,
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined
      };
      
      if (await this.isDuplicate(leadForCheck)) {
        logger.warn('Duplicate lead detected, skipping save', {
          businessName: validated.businessName,
          website: validated.website
        });
        throw new ValidationError('Lead already exists (duplicate detected)');
      }

      const now = new Date();
      const savedLead: Lead = {
        ...validated,
        id: this.nextId++,
        createdAt: now,
        updatedAt: now
      };

      this.leads.set(savedLead.id!, savedLead);
      logger.info('Lead saved successfully', { id: savedLead.id, businessName: savedLead.businessName });
      
      return savedLead;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      logger.error('Failed to save lead', error);
      throw new DatabaseError('Failed to save lead');
    }
  }

  findByWebsite(website: string): Promise<Lead | null> {
    const normalizedWebsite = this.normalizeWebsite(website);
    
    for (const lead of this.leads.values()) {
      if (this.normalizeWebsite(lead.website) === normalizedWebsite) {
        return Promise.resolve(lead);
      }
    }
    
    return Promise.resolve(null);
  }

  findByBusinessName(businessName: string): Promise<Lead | null> {
    const normalizedName = this.normalizeBusinessName(businessName);
    
    for (const lead of this.leads.values()) {
      if (this.normalizeBusinessName(lead.businessName) === normalizedName) {
        return Promise.resolve(lead);
      }
    }
    
    return Promise.resolve(null);
  }

  findByPhoneNumber(phoneNumber: string): Promise<Lead | null> {
    const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
    
    for (const lead of this.leads.values()) {
      if (lead.phoneNumber && this.normalizePhoneNumber(lead.phoneNumber) === normalizedPhone) {
        return Promise.resolve(lead);
      }
    }
    
    return Promise.resolve(null);
  }

  findAll(): Promise<Lead[]> {
    return Promise.resolve(Array.from(this.leads.values()));
  }

  async isDuplicate(lead: Lead): Promise<boolean> {
    const byWebsite = await this.findByWebsite(lead.website);
    if (byWebsite) {
      return true;
    }

    const byName = await this.findByBusinessName(lead.businessName);
    if (byName) {
      return true;
    }

    if (lead.phoneNumber) {
      const byPhone = await this.findByPhoneNumber(lead.phoneNumber);
      if (byPhone) {
        return true;
      }
    }

    return false;
  }

  private normalizeWebsite(website: string): string {
    try {
      const url = new URL(website);
      return url.hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      return website.toLowerCase();
    }
  }

  private normalizeBusinessName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '');
  }

  private normalizePhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  clear(): void {
    this.leads.clear();
    this.nextId = 1;
  }
}
