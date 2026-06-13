# Lead Research Agent

An AI-powered lead discovery system that automatically finds businesses matching a target customer profile and generates actionable lead reports.

The project is designed to help founders, consultants, agencies, and sales teams discover potential customers without manually researching businesses.

## Features

### Lead Discovery

* Discover businesses by industry
* Discover businesses by location
* Discover businesses by product fit criteria
* Search across publicly available business sources
* Collect business contact information when available

### Data Collection

Collects:

* Business Name
* Industry
* Website
* Location
* Country
* Contact Page
* LinkedIn Profile
* Facebook Page
* Phone Number
* Email Address
* Business Description

### Data Quality

* Deduplicates businesses
* Validates collected data
* Excludes closed businesses
* Uses verifiable public sources
* Prefers official business websites

### Reporting

Generate:

* Daily Lead Reports
* Weekly Opportunity Reports
* Industry Reports

## Current Scope

Version 1 focuses exclusively on lead discovery.

The system:

* Finds businesses
* Collects business information
* Stores discovered leads
* Generates reports

The system does not currently:

* Score leads
* Analyze product fit
* Generate outreach messages
* Send sales emails
* Integrate with CRMs

These features may be added in future versions.

---

## Example Workflow

```text
GitHub Actions
        ↓
Lead Research Job
        ↓
Lead Research Agent
        ↓
Business Search
        ↓
Business Data Collection
        ↓
Deduplication
        ↓
Database
        ↓
Daily Report
```

---

## Technology Stack

### Runtime

* Node.js 20+
* TypeScript 5.3+

### Dependencies

* **Zod** - Runtime validation
* **Brave Search API** - Business discovery
* **Neon Postgres** - Lead storage (future)
* **Vitest** - Testing framework

---

## Installation

### Prerequisites

* Node.js 20 or higher
* npm or yarn
* Brave Search API key
* OpenAI API key (future use)

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd lead-research-agent
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

```
BRAVE_API_KEY=your_brave_api_key
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://...
RESEND_API_KEY=your_resend_api_key
REPORT_RECIPIENT_EMAIL=your@email.com
```

---

## Usage

### Run Daily Lead Research

```bash
npm run leads:daily
```

This will:
1. Search for businesses matching the configured criteria
2. Validate and deduplicate results
3. Save leads to the repository
4. Generate a daily report in `reports/`

### Development Mode

```bash
npm run dev
```

### Run Tests

```bash
npm test
```

### Type Check

```bash
npm run typecheck
```

### Build Project

```bash
npm run build
```

---

## Project Structure

```
src/
  agents/
    lead-research-agent.ts       # Orchestrates lead discovery workflow
  
  jobs/
    daily-lead-research-job.ts   # Daily execution job
  
  services/
    brave-search-service.ts      # Brave Search integration
    report-service.ts            # Report generation
    search-service.interface.ts  # Search service abstraction
  
  repositories/
    lead-repository.ts           # Lead persistence with deduplication
  
  schemas/
    lead.schema.ts               # Lead validation schemas
    env.schema.ts                # Environment validation
  
  types/
    lead.ts                      # Domain types
  
  config/
    env.ts                       # Environment configuration
  
  shared/
    logger.ts                    # Logging utilities
    errors.ts                    # Custom error types

tests/
  agents/                        # Agent tests
  repositories/                  # Repository tests
  schemas/                       # Validation tests
  services/                      # Service tests
  fixtures/                      # Test fixtures
```

---

## Configuration

Search criteria can be modified in [src/jobs/daily-lead-research-job.ts](src/jobs/daily-lead-research-job.ts):

```typescript
const searchInput: LeadSearchInput = {
  productName: 'Queue Management SaaS',
  productDescription: 'Customer queue management system',
  targetIndustries: ['Auto Repair', 'Veterinary Clinic', 'Salon'],
  targetCountries: ['Australia'],
  targetRegions: ['Melbourne', 'Sydney'],
  maxResults: 20
};
```

---

## Testing

The project includes comprehensive unit tests:

* **Repository tests** - Deduplication logic
* **Validation tests** - Schema validation
* **Agent tests** - Orchestration logic
* **Service tests** - Report generation

Run tests:

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
```

---

## Lead Deduplication

Leads are automatically deduplicated using:

1. **Website Domain** - Normalized to exclude www and protocol
2. **Business Name** - Normalized to lowercase, trimmed, punctuation removed
3. **Phone Number** - Normalized to digits only

All three checks must pass for a lead to be saved.

---

## Reports

Daily reports are generated in Markdown format and saved to the `reports/` directory.

Report includes:

* Summary statistics
* Top industries
* Lead details with contact information
* Next action recommendations

Example: `reports/daily-lead-report-2024-01-15.md`

---

## Development Standards

This project follows strict coding standards:

* **TypeScript strict mode** enabled
* **No `any` types** allowed
* **Explicit typing** for public APIs
* **Thin agents** focused on orchestration
* **Services** for external integrations
* **Repositories** for data persistence

See [skills/coding-standards.md](skills/coding-standards.md) for complete guidelines.

---

## Future Enhancements

Planned features (not yet implemented):

* Lead scoring and analysis
* Product-market fit evaluation
* Outreach message generation
* CRM integrations
* Email automation
* Web scraping for detailed business data
* PostgreSQL persistence
* GitHub Actions automation

---

## License

MIT

## Roadmap

### Version 1

* Lead discovery
* Business data collection
* Deduplication
* Reporting

### Version 2

* Business Analyst Agent
* Lead scoring
* Opportunity ranking

### Version 3

* Outreach Agent
* Personalized email drafts
* LinkedIn message generation

### Version 4

* CRM integration
* Pipeline tracking
* Conversion reporting

---

## Documentation

Project instructions:

```text
CLAUDE.md
```

Development guide:

```text
DEVELOPER.md
```

Skills:

```text
skills/lead-research.md
skills/coding-standards.md
skills/reporting.md
```

---

## License

MIT
