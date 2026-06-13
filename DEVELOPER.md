# Developer Guide

## Project Overview

This project is a TypeScript-based Lead Research Agent.

The goal is to discover businesses that may be potential customers for a target product or service.

The first use case is discovering potential customers for a Generic Queue Management SaaS.

The Lead Research Agent only performs factual business research and data collection.

It does not perform business analysis, lead scoring, outreach generation, or automated sales actions.

---

## Tech Stack

* TypeScript
* Node.js
* GitHub Actions
* Brave Search API
* OpenAI API
* Neon Postgres
* Resend

---

## Core Workflow

```text
GitHub Actions Cron
        ↓
Daily Lead Research Job
        ↓
Lead Research Agent
        ↓
Search Service
        ↓
Website / Source Extraction
        ↓
Deduplication
        ↓
Database Save
        ↓
Markdown Report
        ↓
Email Report
```

---

## Project Structure

```text
src/
  agents/
    lead-research-agent.ts

  jobs/
    daily-lead-research-job.ts

  services/
    brave-search-service.ts
    openai-service.ts
    email-service.ts
    website-content-service.ts

  repositories/
    lead-repository.ts
    report-repository.ts

  schemas/
    lead.schema.ts
    env.schema.ts

  types/
    lead.ts

  config/
    env.ts

  shared/
    logger.ts
    errors.ts
```

---

## Responsibilities

## Agents

Agents orchestrate workflows.

Agents should not contain:

* Raw API calls
* Database queries
* Provider-specific logic
* Email sending logic

---

## Services

Services integrate with external systems.

Examples:

* Brave Search
* OpenAI
* Resend
* Website content extraction

---

## Repositories

Repositories handle database persistence.

Database access must stay inside repository files.

---

## Schemas

Schemas validate:

* Environment variables
* API responses
* LLM responses
* Lead data before saving

---

## Configuration

Environment variables are loaded and validated in:

```text
src/config/env.ts
```

Required variables:

```text
OPENAI_API_KEY
BRAVE_API_KEY
DATABASE_URL
RESEND_API_KEY
REPORT_RECIPIENT_EMAIL
```

Do not read `process.env` directly outside `env.ts`.

---

## Commands

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Run daily job manually:

```bash
npm run leads:daily
```

Run tests:

```bash
npm test
```

Run type check:

```bash
npm run typecheck
```

Run lint:

```bash
npm run lint
```

---

## GitHub Actions

The daily lead research job runs through GitHub Actions.

The workflow should support:

* Scheduled execution
* Manual execution

Example schedule:

```yaml
on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
```

GitHub Actions cron uses UTC.

`0 0 * * *` runs at 8:00 AM Philippines time.

---

## Data Flow

Input:

```json
{
  "productName": "Queue Management SaaS",
  "targetIndustries": ["Veterinary Clinic", "Auto Repair", "Salon"],
  "targetCountries": ["Australia"],
  "maxResults": 50
}
```

Output:

```json
{
  "businessName": "ABC Veterinary Clinic",
  "industry": "Veterinary Clinic",
  "website": "https://example.com",
  "location": "Melbourne",
  "country": "Australia",
  "phoneNumber": null,
  "emailAddress": null,
  "sourceUrl": "https://example.com"
}
```

---

## Database Notes

Store discovered leads with enough information to prevent duplicates.

Recommended deduplication fields:

* Website domain
* Business name
* Phone number

Use `null` for unknown values.

Do not use empty strings for missing data.

---

## Development Rules

Follow:

```text
skills/coding-standards.md
skills/lead-research.md
skills/reporting.md
```

Before completing work:

* Run type checks
* Run tests
* Confirm no secrets are committed
* Confirm no `any` was introduced
* Confirm output is structured and validated
* Confirm agent responsibilities remain separated

---

## Current Scope

In scope:

* Lead research
* Business discovery
* Public business data collection
* Deduplication
* Report generation
* Email report delivery

Out of scope:

* Business analysis
* Lead scoring
* Outreach generation
* Automated email sending to leads
* LinkedIn automation
* CRM integrations

---

## Future Scope

Possible future additions:

* Business Analyst Agent
* Lead scoring
* Outreach draft generation
* CRM export
* Dashboard
* Competitor detection
* Reply tracking
