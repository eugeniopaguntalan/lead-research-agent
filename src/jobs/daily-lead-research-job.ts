import { LeadResearchAgent } from '../agents/lead-research-agent.js';
import { BraveSearchService } from '../services/brave-search-service.js';
import { ReportService } from '../services/report-service.js';
import { InMemoryLeadRepository } from '../repositories/lead-repository.js';
import type { LeadSearchInput } from '../types/lead.js';
import { logger } from '../shared/logger.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

async function runDailyLeadResearchJob(): Promise<void> {
  logger.info('Starting daily lead research job');

  const searchService = new BraveSearchService();
  const leadRepository = new InMemoryLeadRepository();
  const leadResearchAgent = new LeadResearchAgent(searchService);
  const reportService = new ReportService();

  const searchInput: LeadSearchInput = {
    productName: 'Queue Management SaaS',
    productDescription: 'Customer queue and waiting line management system for businesses',
    targetIndustries: [
      'Auto Repair',
      'Veterinary Clinic',
      'Salon',
      'Medical Clinic'
    ],
    targetCountries: ['Australia'],
    targetRegions: ['Melbourne', 'Sydney', 'Brisbane'],
    maxResults: 20
  };

  try {
    const searchResult = await leadResearchAgent.research(searchInput);
    
    logger.info('Lead research completed', {
      totalFound: searchResult.totalFound,
      leadsDiscovered: searchResult.leads.length
    });

    let savedCount = 0;
    let duplicateCount = 0;

    for (const lead of searchResult.leads) {
      try {
        await leadRepository.save(lead);
        savedCount++;
      } catch (error) {
        if (error instanceof Error && error.message.includes('duplicate')) {
          duplicateCount++;
          logger.debug('Skipping duplicate lead', { businessName: lead.businessName });
        } else {
          logger.error('Failed to save lead', error, { businessName: lead.businessName });
        }
      }
    }

    logger.info('Lead persistence completed', {
      saved: savedCount,
      duplicates: duplicateCount
    });

    const allLeads = await leadRepository.findAll();

    const report = reportService.generateDailyLeadReport({
      date: new Date(),
      totalAnalyzed: searchResult.totalFound,
      qualifiedLeads: savedCount,
      leads: allLeads,
      searchCriteria: searchInput.targetIndustries.join(', ')
    });

    await saveReportToFile(report);

    logger.info('Daily lead research job completed successfully');
  } catch (error) {
    logger.error('Daily lead research job failed', error);
    throw error;
  }
}

async function saveReportToFile(reportContent: string): Promise<void> {
  try {
    const reportsDir = join(process.cwd(), 'reports');
    
    await mkdir(reportsDir, { recursive: true });

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `daily-lead-report-${timestamp}.md`;
    const filepath = join(reportsDir, filename);

    await writeFile(filepath, reportContent, 'utf-8');

    logger.info('Report saved to file', { filepath });
  } catch (error) {
    logger.error('Failed to save report to file', error);
  }
}

runDailyLeadResearchJob().catch(error => {
  logger.error('Unhandled error in daily job', error);
  process.exit(1);
});
