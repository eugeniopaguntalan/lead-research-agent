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

* Node.js
* TypeScript

### AI

* OpenAI API

### Search

* Brave Search API

### Storage

* Neon Postgres

### Email

* Resend

### Automation

* GitHub Actions

---

## Project Structure

```text
.
├── CLAUDE.md
├── README.md
├── DEVELOPER.md
├── skills
│   ├── coding-standards.md
│   ├── lead-research.md
│   └── reporting.md
│
├── src
│   ├── agents
│   ├── jobs
│   ├── services
│   ├── repositories
│   ├── schemas
│   ├── types
│   ├── config
│   └── shared
│
└── tests
```

---

## Installation

### Prerequisites

* Node.js 22+
* npm
* OpenAI API Key
* Brave Search API Key
* Neon Database
* Resend Account

### Install

```bash
npm install
```

---

## Environment Variables

Create a `.env` file:

```env
OPENAI_API_KEY=
BRAVE_API_KEY=
DATABASE_URL=
RESEND_API_KEY=
REPORT_RECIPIENT_EMAIL=
```

---

## Development

Run locally:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

Run type checking:

```bash
npm run typecheck
```

---

## Running Lead Discovery

Execute the daily lead discovery workflow:

```bash
npm run leads:daily
```

Example input:

```json
{
  "productName": "Queue Management SaaS",
  "targetIndustries": [
    "Veterinary Clinic",
    "Medical Clinic",
    "Auto Repair Shop"
  ],
  "targetCountries": [
    "Australia"
  ],
  "maxResults": 50
}
```

---

## Example Output

```json
{
  "businessName": "ABC Veterinary Clinic",
  "industry": "Veterinary Clinic",
  "website": "https://example.com",
  "location": "Melbourne",
  "country": "Australia",
  "phoneNumber": "+61 3 1234 5678",
  "emailAddress": "info@example.com",
  "sourceUrl": "https://example.com"
}
```

---

## GitHub Actions

The project supports scheduled execution using GitHub Actions.

Example:

```yaml
on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
```

This enables automatic lead discovery and report generation.

---

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
