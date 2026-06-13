#!/usr/bin/env node
/**
 * Demo Script - Lead Research Agent
 * 
 * This script demonstrates the Lead Research Agent in action using mock data.
 * No API keys required - perfect for portfolio demonstrations.
 * 
 * Usage:
 *   npm run demo
 */

import { LeadResearchAgent } from '../agents/lead-research-agent.js';
import { MockSearchService } from '../services/mock-search-service.js';
import { ReportService } from '../services/report-service.js';
import { InMemoryLeadRepository } from '../repositories/lead-repository.js';
import type { LeadSearchInput } from '../types/lead.js';
import { logger } from '../shared/logger.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Console colors for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function printBanner(): void {
  console.log('\n' + colors.cyan + colors.bright + '╔════════════════════════════════════════════════════╗');
  console.log('║                                                    ║');
  console.log('║          Lead Research Agent - DEMO MODE           ║');
  console.log('║                                                    ║');
  console.log('║  Discovering potential customers for your SaaS    ║');
  console.log('║            No API keys required!                   ║');
  console.log('║                                                    ║');
  console.log('╚════════════════════════════════════════════════════╝' + colors.reset);
  console.log('\n');
}

function printSection(title: string): void {
  console.log(colors.blue + colors.bright + '\n▶ ' + title + colors.reset);
  console.log(colors.blue + '─'.repeat(60) + colors.reset);
}

function printSuccess(message: string): void {
  console.log(colors.green + '✓ ' + message + colors.reset);
}

function printInfo(label: string, value: string | number): void {
  console.log(`  ${colors.yellow}${label}:${colors.reset} ${value}`);
}

async function runDemo(): Promise<void> {
  printBanner();

  printSection('Configuration');
  console.log('  Using: Mock Search Service (Demo Mode)');
  console.log('  Repository: In-Memory Storage');
  console.log('  API Keys: Not Required ✓');
  
  printSection('Initializing Services');
  const searchService = new MockSearchService();
  const leadRepository = new InMemoryLeadRepository();
  const leadResearchAgent = new LeadResearchAgent(searchService);
  const reportService = new ReportService();
  printSuccess('All services initialized');

  printSection('Search Criteria');
  const searchInput: LeadSearchInput = {
    productName: 'Queue Management SaaS',
    productDescription: 'Customer queue and waiting line management system for businesses',
    targetIndustries: [
      'Auto Repair',
      'Veterinary Clinic',
      'Dental Practice',
      'Hair Salon'
    ],
    targetCountries: ['Australia'],
    targetRegions: ['Melbourne', 'Sydney', 'Brisbane'],
    maxResults: 15
  };

  printInfo('Product', searchInput.productName);
  printInfo('Target Industries', searchInput.targetIndustries.join(', '));
  printInfo('Target Countries', searchInput.targetCountries.join(', '));
  printInfo('Target Regions', searchInput.targetRegions.join(', '));
  printInfo('Max Results', searchInput.maxResults);

  printSection('Starting Lead Research');
  console.log('  Searching for businesses...\n');

  try {
    const searchResult = await leadResearchAgent.research(searchInput);
    
    printSuccess(`Research completed! Found ${searchResult.totalFound} potential leads`);
    
    printSection('Sample Leads Discovered');
    searchResult.leads.slice(0, 5).forEach((lead, index) => {
      console.log(`\n  ${colors.bright}${index + 1}. ${lead.businessName}${colors.reset}`);
      printInfo('  Industry', lead.industry);
      printInfo('  Location', `${lead.location}, ${lead.country}`);
      printInfo('  Website', lead.website);
      if (lead.phoneNumber) printInfo('  Phone', lead.phoneNumber);
      if (lead.emailAddress) printInfo('  Email', lead.emailAddress);
    });

    if (searchResult.leads.length > 5) {
      console.log(`\n  ${colors.cyan}... and ${searchResult.leads.length - 5} more leads${colors.reset}`);
    }

    printSection('Saving Leads to Repository');
    let savedCount = 0;
    let duplicateCount = 0;

    for (const lead of searchResult.leads) {
      try {
        await leadRepository.save(lead);
        savedCount++;
      } catch (error) {
        if (error instanceof Error && error.message.includes('duplicate')) {
          duplicateCount++;
        } else {
          logger.error('Failed to save lead', error, { businessName: lead.businessName });
        }
      }
    }

    printSuccess(`Saved ${savedCount} leads to repository`);
    if (duplicateCount > 0) {
      console.log(`  ${colors.yellow}Skipped ${duplicateCount} duplicate(s)${colors.reset}`);
    }

    printSection('Generating Report');
    const allLeads = await leadRepository.findAll();

    const report = reportService.generateDailyLeadReport({
      date: new Date(),
      totalAnalyzed: searchResult.totalFound,
      qualifiedLeads: savedCount,
      leads: allLeads,
      searchCriteria: searchInput.targetIndustries.join(', ')
    });

    await saveReportToFile(report);
    printSuccess('Report generated and saved');

    printSection('Demo Summary');
    printInfo('Total Leads Found', searchResult.totalFound);
    printInfo('Leads Saved', savedCount);
    printInfo('Report Location', './reports/');
    
    console.log('\n' + colors.green + colors.bright + '✨ Demo completed successfully!' + colors.reset);
    console.log(colors.cyan + '\nCheck the ./reports/ folder for the generated lead report.\n' + colors.reset);

  } catch (error) {
    console.error('\n' + colors.yellow + '❌ Demo failed:' + colors.reset, error);
    throw error;
  }
}

async function saveReportToFile(reportContent: string): Promise<void> {
  try {
    const reportsDir = join(process.cwd(), 'reports');
    
    await mkdir(reportsDir, { recursive: true });

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `demo-lead-report-${timestamp}.md`;
    const filepath = join(reportsDir, filename);

    await writeFile(filepath, reportContent, 'utf-8');

    logger.info('Report saved to file', { filepath });
  } catch (error) {
    logger.error('Failed to save report to file', error);
  }
}

// Run the demo
runDemo().catch(error => {
  console.error('Unhandled error in demo:', error);
  process.exit(1);
});
