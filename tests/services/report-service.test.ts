import { describe, it, expect } from 'vitest';
import { ReportService } from '../../src/services/report-service.js';
import { mockLead, mockLeadWithoutPhone } from '../fixtures/mock-leads.js';

describe('ReportService', () => {
  const reportService = new ReportService();

  describe('generateDailyLeadReport', () => {
    it('should generate a markdown report with leads', () => {
      const report = reportService.generateDailyLeadReport({
        date: new Date('2024-01-15'),
        totalAnalyzed: 50,
        qualifiedLeads: 2,
        leads: [mockLead, mockLeadWithoutPhone],
        searchCriteria: 'Auto Repair, Veterinary Clinic'
      });

      expect(report).toContain('# Daily Lead Report');
      expect(report).toContain('## Summary');
      expect(report).toContain('**Total Businesses Analyzed:** 50');
      expect(report).toContain('**Qualified Opportunities:** 2');
      expect(report).toContain('ABC Auto Repair');
      expect(report).toContain('XYZ Veterinary Clinic');
    });

    it('should handle empty leads list', () => {
      const report = reportService.generateDailyLeadReport({
        date: new Date('2024-01-15'),
        totalAnalyzed: 10,
        qualifiedLeads: 0,
        leads: [],
        searchCriteria: 'Auto Repair'
      });

      expect(report).toContain('No leads discovered');
    });

    it('should include contact information when available', () => {
      const report = reportService.generateDailyLeadReport({
        date: new Date('2024-01-15'),
        totalAnalyzed: 1,
        qualifiedLeads: 1,
        leads: [mockLead],
        searchCriteria: 'Auto Repair'
      });

      expect(report).toContain(mockLead.phoneNumber!);
      expect(report).toContain(mockLead.emailAddress!);
    });

    it('should not include contact fields when null', () => {
      const report = reportService.generateDailyLeadReport({
        date: new Date('2024-01-15'),
        totalAnalyzed: 1,
        qualifiedLeads: 1,
        leads: [mockLeadWithoutPhone],
        searchCriteria: 'Veterinary Clinic'
      });

      expect(report).not.toContain('**Phone:**');
      expect(report).not.toContain('**Email:**');
    });

    it('should include next actions section', () => {
      const report = reportService.generateDailyLeadReport({
        date: new Date('2024-01-15'),
        totalAnalyzed: 10,
        qualifiedLeads: 5,
        leads: [mockLead],
        searchCriteria: 'Auto Repair'
      });

      expect(report).toContain('## Next Actions');
    });
  });
});
