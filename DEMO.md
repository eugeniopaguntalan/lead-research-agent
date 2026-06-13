# 🎯 Demo Mode - Portfolio Showcase

This document explains how to run the Lead Research Agent in demo mode without needing any API keys or external services.

## Why Demo Mode?

Demo mode is perfect for:

- **Portfolio Demonstrations**: Show the full functionality without API setup
- **Testing**: Validate the workflow without consuming API credits
- **Development**: Work on features without external dependencies
- **Onboarding**: Let team members explore the system risk-free

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Demo

```bash
npm run demo
```

That's it! No API keys, no configuration, no database setup required.

## What Happens in Demo Mode?

The demo script (`src/demo/run-demo.ts`) demonstrates the complete lead research workflow:

### 1. **Search Phase**
- Uses `MockSearchService` instead of Brave Search API
- Returns realistic business search results
- Simulates network latency for authentic experience

### 2. **Data Extraction**
- Extracts business information from mock results
- Includes: names, websites, phone numbers, emails, locations
- Demonstrates the parsing and extraction logic

### 3. **Deduplication**
- Checks for duplicate businesses by domain
- Shows the quality control mechanisms
- Mirrors production behavior

### 4. **Storage**
- Saves leads to in-memory repository
- No database required
- Full CRUD operations demonstrated

### 5. **Report Generation**
- Creates formatted markdown report
- Saves to `./reports/` directory
- Includes all discovered leads with details

## Demo Output

After running `npm run demo`, you'll see:

```
╔════════════════════════════════════════════════════╗
║                                                    ║
║          Lead Research Agent - DEMO MODE           ║
║                                                    ║
║  Discovering potential customers for your SaaS    ║
║            No API keys required!                   ║
║                                                    ║
╚════════════════════════════════════════════════════╝

▶ Configuration
─────────────────────────────────────────────────────
  Using: Mock Search Service (Demo Mode)
  Repository: In-Memory Storage
  API Keys: Not Required ✓

▶ Search Criteria
─────────────────────────────────────────────────────
  Product: Queue Management SaaS
  Target Industries: Auto Repair, Veterinary Clinic, Dental Practice, Hair Salon
  Target Countries: Australia
  Target Regions: Melbourne, Sydney, Brisbane
  Max Results: 15

▶ Starting Lead Research
─────────────────────────────────────────────────────
  Searching for businesses...

✓ Research completed! Found 15 potential leads

▶ Sample Leads Discovered
─────────────────────────────────────────────────────

  1. Melbourne Premium Auto Repair
    Industry: Auto Repair
    Location: Melbourne, Australia
    Website: https://www.melbourneautorepair.com.au
    Phone: (03) 9876 5432
    Email: info@melbourneautorepair.com.au

  ... and 10 more leads

▶ Saving Leads to Repository
─────────────────────────────────────────────────────
✓ Saved 15 leads to repository

▶ Generating Report
─────────────────────────────────────────────────────
✓ Report generated and saved

▶ Demo Summary
─────────────────────────────────────────────────────
  Total Leads Found: 15
  Leads Saved: 15
  Report Location: ./reports/

✨ Demo completed successfully!

Check the ./reports/ folder for the generated lead report.
```

## Mock Data

The demo uses realistic mock data stored in:

### `MockSearchService`
Location: `src/services/mock-search-service.ts`

Provides search results for various industries:
- Auto Repair shops
- Veterinary Clinics  
- Dental Practices
- Restaurants/Cafes
- Accounting firms
- Real Estate agencies
- Gyms/Fitness centers
- Hair Salons
- Plumbing services

Each result includes:
- Business name
- Website URL
- Description with contact details (phone, email)
- Location information

### Mock Search Results
Location: `tests/fixtures/mock-search-results.ts`

Pre-configured search results used in tests and demos.

### Mock Leads
Location: `tests/fixtures/mock-leads.ts`

Sample lead objects demonstrating the complete data structure.

## Configuration

### Environment Variables (Demo Mode)

Create a `.env` file with:

```bash
# Enable demo mode
DEMO_MODE=true

# Optional
NODE_ENV=development
```

When `DEMO_MODE=true`:
- All API keys become optional
- Database defaults to SQLite in-memory
- Email services are disabled
- Mock services are used automatically

### Customizing the Demo

Edit `src/demo/run-demo.ts` to customize:

- **Search criteria**: Change industries, locations, max results
- **Product description**: Modify the target product
- **Output formatting**: Adjust console colors and formatting
- **Report location**: Change where reports are saved

Example customization:

```typescript
const searchInput: LeadSearchInput = {
  productName: 'Your Product Name',
  productDescription: 'Your product description',
  targetIndustries: [
    'Industry 1',
    'Industry 2',
    'Industry 3'
  ],
  targetCountries: ['Australia', 'New Zealand'],
  targetRegions: ['Sydney', 'Auckland'],
  maxResults: 20
};
```

## Switching Between Demo and Production

### Demo Mode (No API Keys)

```bash
# .env
DEMO_MODE=true
```

```bash
npm run demo
```

### Production Mode (Requires API Keys)

```bash
# .env
DEMO_MODE=false
BRAVE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
DATABASE_URL=postgresql://...
RESEND_API_KEY=your_key_here
REPORT_RECIPIENT_EMAIL=your@email.com
```

```bash
npm run leads:daily
```

## Architecture Differences

| Component | Demo Mode | Production Mode |
|-----------|-----------|-----------------|
| **Search** | MockSearchService | BraveSearchService |
| **Database** | InMemoryRepository | PostgresRepository |
| **Email** | Disabled | ResendService |
| **API Keys** | Not required | Required |
| **Data** | Realistic mock data | Live API responses |

## For Portfolio Reviewers

This demo showcases:

1. **Clean Architecture**: Services implement interfaces, making mock/prod swapping trivial
2. **Type Safety**: Full TypeScript with Zod validation
3. **Error Handling**: Retry logic, validation, deduplication
4. **Testing**: Mock fixtures support comprehensive testing
5. **Developer Experience**: Run the full app without external dependencies

## Files to Review

Key files demonstrating the demo system:

- `src/demo/run-demo.ts` - Demo script with pretty output
- `src/services/mock-search-service.ts` - Mock service implementation  
- `src/services/search-service.interface.ts` - Service interface
- `src/schemas/env.schema.ts` - Environment validation with demo support
- `tests/fixtures/mock-*.ts` - Mock data fixtures
- `.env.example` - Configuration examples

## Questions?

The demo mode is production code that uses dependency injection to swap implementations. The same agent, repository, and report service run in both modes - only the search service changes.

This demonstrates:
- Interface-based design
- Dependency injection
- Testable architecture
- Clean separation of concerns

Perfect for portfolios, interviews, and collaborative development!
