import type { Lead } from '../types/lead.js';
import { logger } from '../shared/logger.js';

export interface DailyLeadReport {
  date: Date;
  totalAnalyzed: number;
  qualifiedLeads: number;
  leads: Lead[];
  searchCriteria: string;
}

export class ReportService {
  generateDailyLeadReport(report: DailyLeadReport): string {
    logger.info('Generating daily lead report', {
      date: report.date,
      totalLeads: report.leads.length
    });

    const markdown = this.buildMarkdownReport(report);
    
    logger.info('Daily lead report generated successfully');
    
    return markdown;
  }

  private buildMarkdownReport(report: DailyLeadReport): string {
    const sections: string[] = [];

    sections.push(this.buildHeader(report.date));
    sections.push(this.buildSummary(report));
    sections.push(this.buildLeadDetails(report.leads));
    sections.push(this.buildNextActions(report.leads.length));

    return sections.join('\n\n---\n\n');
  }

  private buildHeader(date: Date): string {
    return `# Daily Lead Report\n\n**Date:** ${this.formatDate(date)}`;
  }

  private buildSummary(report: DailyLeadReport): string {
    const industries = this.getTopIndustries(report.leads);
    const topLeads = report.leads.slice(0, 3);

    let summary = '## Summary\n\n';
    summary += `- **Total Businesses Analyzed:** ${report.totalAnalyzed}\n`;
    summary += `- **Qualified Opportunities:** ${report.qualifiedLeads}\n`;
    summary += `- **Search Criteria:** ${report.searchCriteria}\n\n`;

    if (industries.length > 0) {
      summary += '**Top Industries:**\n\n';
      industries.forEach(({ industry, count }) => {
        summary += `- ${industry}: ${count} leads\n`;
      });
    }

    if (topLeads.length > 0) {
      summary += '\n**Highlighted Leads:**\n\n';
      topLeads.forEach((lead, index) => {
        summary += `${index + 1}. ${lead.businessName} (${lead.industry})\n`;
      });
    }

    return summary;
  }

  private buildLeadDetails(leads: Lead[]): string {
    if (leads.length === 0) {
      return '## Lead Details\n\nNo leads discovered in this search.';
    }

    let details = '## Lead Details\n\n';

    leads.forEach((lead, index) => {
      details += this.buildLeadSection(lead, index + 1);
      
      if (index < leads.length - 1) {
        details += '\n---\n\n';
      }
    });

    return details;
  }

  private buildLeadSection(lead: Lead, index: number): string {
    let section = `### ${index}. ${lead.businessName}\n\n`;

    section += `- **Industry:** ${lead.industry}\n`;
    section += `- **Location:** ${lead.location}, ${lead.country}\n`;
    section += `- **Website:** [${lead.website}](${lead.website})\n`;

    if (lead.phoneNumber) {
      section += `- **Phone:** ${lead.phoneNumber}\n`;
    }

    if (lead.emailAddress) {
      section += `- **Email:** ${lead.emailAddress}\n`;
    }

    if (lead.description) {
      section += `\n**Description:**\n\n${lead.description}\n`;
    }

    const socialLinks: string[] = [];
    if (lead.linkedinUrl) socialLinks.push(`[LinkedIn](${lead.linkedinUrl})`);
    if (lead.facebookUrl) socialLinks.push(`[Facebook](${lead.facebookUrl})`);
    if (lead.instagramUrl) socialLinks.push(`[Instagram](${lead.instagramUrl})`);

    if (socialLinks.length > 0) {
      section += `\n**Social Media:** ${socialLinks.join(' • ')}\n`;
    }

    if (lead.contactPageUrl) {
      section += `\n**Contact Page:** [View Contact](${lead.contactPageUrl})\n`;
    }

    const metadata: string[] = [];
    if (lead.yearFounded) metadata.push(`Founded: ${lead.yearFounded}`);
    if (lead.employeeCount) metadata.push(`Employees: ${lead.employeeCount}`);

    if (metadata.length > 0) {
      section += `\n*${metadata.join(' • ')}*\n`;
    }

    return section;
  }

  private buildNextActions(leadCount: number): string {
    let actions = '## Next Actions\n\n';

    if (leadCount === 0) {
      actions += '- Refine search criteria to discover more leads\n';
      actions += '- Consider expanding to additional industries or regions\n';
    } else if (leadCount < 10) {
      actions += '- Review leads and prioritize outreach\n';
      actions += '- Research additional businesses to expand pipeline\n';
    } else {
      actions += '- Prioritize top leads for outreach\n';
      actions += '- Verify contact information before reaching out\n';
      actions += '- Research each business to personalize messaging\n';
    }

    return actions;
  }

  private getTopIndustries(leads: Lead[]): Array<{ industry: string; count: number }> {
    const industryCount = new Map<string, number>();

    leads.forEach(lead => {
      const count = industryCount.get(lead.industry) ?? 0;
      industryCount.set(lead.industry, count + 1);
    });

    return Array.from(industryCount.entries())
      .map(([industry, count]) => ({ industry, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
