# Coding Standards

## Purpose

This document defines the coding standards for the Lead Generation Agent project.

These standards apply to all source code, tests, scripts, workflows, and configuration files.

The goal is to keep the codebase:

* Simple
* Reliable
* Maintainable
* Testable
* Secure
* Easy for AI coding agents and developers to understand

---

# Core Principles

Write code that is easy to read, reason about, test, and change.

Prefer explicit code over clever abstractions.

Avoid unnecessary complexity.

Do not introduce new dependencies unless they provide clear value.

Keep business logic separate from infrastructure concerns.

---

# TypeScript Standards

Use TypeScript strict mode.

Required compiler settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

Do not use `any`.

If a type is unknown, use `unknown` and narrow it safely.

Bad:

```ts
const result: any = response;
```

Good:

```ts
const result: unknown = response;
```

Use explicit types for public functions, exported functions, service methods, and repository methods.

Good:

```ts
export async function findLeads(input: LeadSearchInput): Promise<LeadSearchResult[]> {
  return [];
}
```

Avoid overly clever inferred types for important boundaries.

---

# Naming Standards

Use clear, descriptive names.

Good:

```ts
const candidateBusinesses = await leadResearchService.searchBusinesses(input);
```

Bad:

```ts
const data = await svc.run(x);
```

Use:

* `camelCase` for variables and functions
* `PascalCase` for types, interfaces, classes
* `UPPER_CASE` for constants
* `kebab-case` for file names

Examples:

```text
lead-research-agent.ts
business-analyst-agent.ts
brave-search-service.ts
lead-repository.ts
```

Avoid vague names:

* `data`
* `item`
* `thing`
* `manager`
* `helper`
* `util`

Use domain names instead:

* `lead`
* `business`
* `searchResult`
* `analysisResult`
* `dailyReport`

---

# Project Structure

Use this structure unless there is a strong reason to change it:

```text
src/
  agents/
    lead-research-agent.ts
    business-analyst-agent.ts

  jobs/
    daily-lead-generation-job.ts

  services/
    brave-search-service.ts
    openai-service.ts
    email-service.ts

  repositories/
    lead-repository.ts
    report-repository.ts

  schemas/
    lead.schema.ts
    analysis.schema.ts

  types/
    lead.ts
    analysis.ts

  config/
    env.ts

  shared/
    logger.ts
    errors.ts
```

Rules:

* Agents orchestrate work.
* Services call external systems.
* Repositories handle persistence.
* Schemas validate external input/output.
* Types define internal domain contracts.
* Jobs trigger workflows.
* Shared code must remain small and generic.

---

# Agent Design

Agents should be thin orchestrators.

They should:

* Receive validated input
* Call services
* Call other agents when needed
* Return structured output

Agents should not:

* Contain HTTP client details
* Contain database queries
* Contain email provider logic
* Contain raw prompt strings mixed with business logic
* Perform unrelated responsibilities

Good:

```ts
export class LeadResearchAgent {
  constructor(private readonly searchService: SearchService) {}

  async research(input: LeadResearchInput): Promise<LeadResearchResult[]> {
    return this.searchService.searchBusinesses(input);
  }
}
```

---

# Service Design

Services should have one responsibility.

Examples:

```text
BraveSearchService
OpenAIService
EmailService
WebsiteContentService
```

Services must handle provider-specific details.

Agents should not know how Brave Search, OpenAI, Resend, or Neon work internally.

---

# Repository Design

Repositories must contain database access.

Do not write database queries inside agents, jobs, or services.

Good:

```ts
await leadRepository.saveMany(leads);
```

Bad:

```ts
await db.insert(leadsTable).values(leads);
```

outside a repository.

Repository methods should use domain-specific names.

Good:

```ts
saveDiscoveredLeads
findLeadByWebsite
markLeadAsAnalyzed
```

Bad:

```ts
insert
update
get
```

unless the repository is intentionally generic.

---

# Validation

Validate all external inputs.

External inputs include:

* Environment variables
* API responses
* LLM responses
* Search results
* Web scraped content
* GitHub Actions inputs
* Database records loaded from unknown sources

Use schema validation for important boundaries.

Recommended:

```text
Zod
```

If the project does not already use Zod, only add it if validation is required for LLM output or external API responses.

Never trust LLM output without validation.

---

# LLM Usage Standards

LLM calls must be isolated behind an LLM service.

Do not call OpenAI directly from agents or jobs.

Good:

```ts
const analysis = await llmService.analyzeBusinessFit(input);
```

Bad:

```ts
await openai.chat.completions.create(...)
```

inside an agent.

LLM prompts should be:

* Clear
* Deterministic
* Versioned where practical
* Focused on one task
* Paired with structured output validation

LLM output must be validated before being saved or used by downstream workflows.

Prefer JSON output for machine-readable responses.

Do not allow LLMs to invent missing data.

---

# Prompt Standards

Prompts should be stored separately from business logic when they become large.

Recommended:

```text
src/prompts/
  business-analysis.prompt.ts
  lead-research.prompt.ts
```

Prompts must include:

* Role
* Task
* Input format
* Output format
* Constraints
* Examples when helpful

Avoid long, vague prompts.

Avoid mixing multiple responsibilities in one prompt.

---

# Error Handling

Use explicit error handling.

Do not swallow errors silently.

Bad:

```ts
try {
  await runJob();
} catch {}
```

Good:

```ts
try {
  await runJob();
} catch (error) {
  logger.error("Daily lead generation job failed", { error });
  throw error;
}
```

Use custom errors only when they improve clarity.

Example:

```ts
export class ExternalServiceError extends Error {}
export class ValidationError extends Error {}
```

Do not overuse custom error classes.

---

# Logging

Use structured logging.

Log:

* Job start
* Job completion
* Number of leads found
* Number of leads saved
* Number of leads skipped
* External service failures
* Validation failures

Do not log:

* API keys
* Secrets
* Full email contents
* Sensitive personal information
* Large raw LLM responses unless required for debugging

Good:

```ts
logger.info("Lead research completed", {
  leadCount: leads.length,
  industry: input.industry,
  country: input.country
});
```

---

# Configuration

Environment variables must be read in one place.

Recommended file:

```text
src/config/env.ts
```

Validate required environment variables at startup.

Required values may include:

```text
OPENAI_API_KEY
BRAVE_API_KEY
DATABASE_URL
RESEND_API_KEY
REPORT_RECIPIENT_EMAIL
```

Never read `process.env` directly across the codebase.

Bad:

```ts
const apiKey = process.env.OPENAI_API_KEY;
```

Good:

```ts
const apiKey = env.OPENAI_API_KEY;
```

---

# Security Standards

Never commit secrets.

Never hardcode API keys.

Never log secrets.

Never store unnecessary personal data.

Only collect publicly available business information.

Respect website terms and rate limits.

Avoid aggressive scraping.

Use official APIs where possible.

---

# Data Standards

Use normalized data where practical.

Deduplicate leads by:

* Website domain
* Business name
* Phone number

Use null for missing values.

Do not use empty strings for unknown values.

Good:

```json
{
  "emailAddress": null
}
```

Bad:

```json
{
  "emailAddress": ""
}
```

Store source URLs whenever possible.

---

# Async Code Standards

Use `async` and `await`.

Avoid deeply nested promise chains.

Good:

```ts
const leads = await leadResearchAgent.research(input);
```

Bad:

```ts
leadResearchAgent.research(input).then(...).catch(...);
```

Use concurrency carefully.

Do not fire unlimited parallel requests.

Use batching or concurrency limits when calling external APIs.

---

# External API Standards

All external API calls must:

* Have timeouts
* Handle non-200 responses
* Handle rate limits
* Return typed responses
* Validate important response data

Do not assume third-party APIs always return expected data.

---

# Testing Standards

Write tests for:

* Lead deduplication
* Business analysis scoring
* Schema validation
* Prompt output parsing
* Repository behavior
* Job orchestration

Prefer unit tests for business logic.

Use integration tests for repositories and external API wrappers when practical.

Mock external APIs in unit tests.

Do not call OpenAI, Brave Search, Resend, or live databases in unit tests.

---

# GitHub Actions Standards

GitHub Actions workflows must:

* Use repository secrets
* Avoid printing secrets
* Support manual execution with `workflow_dispatch`
* Use scheduled execution with cron when needed
* Fail clearly when required environment variables are missing

Example:

```yaml
on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
```

Remember that GitHub Actions cron uses UTC.

---

# Dependency Standards

Do not add dependencies casually.

Before adding a dependency, consider:

* Is it actively maintained?
* Does it solve a real problem?
* Can the same result be achieved simply without it?
* Does it increase bundle or runtime complexity?
* Does it introduce security risk?

Prefer small, focused dependencies.

Avoid large frameworks unless clearly justified.

---

# Code Style

Use consistent formatting.

Recommended:

```text
Prettier
ESLint
```

Rules:

* No unused variables
* No unused imports
* No console logs in production code
* No dead code
* No commented-out code
* No magic strings when constants are clearer
* No large functions

Functions should usually do one thing.

If a function becomes difficult to read, split it.

---

# Comments

Do not add comments for obvious code.

Bad:

```ts
// Save the lead
await leadRepository.save(lead);
```

Good comments explain why, not what.

Good:

```ts
// Brave Search may return the same business from multiple directory pages.
const deduplicatedLeads = deduplicateLeads(leads);
```

---

# Output Standards

Agent outputs must be:

* Structured
* Predictable
* Validated
* Machine-readable where possible

Prefer:

```json
{
  "leads": []
}
```

over unstructured text.

Reports may be Markdown, but source data should remain structured.

---

# Date and Time Standards

Use ISO 8601 timestamps.

Store times in UTC.

Convert to local time only for display.

Good:

```text
2026-06-13T08:00:00.000Z
```

---

# Review Checklist

Before completing any task, verify:

* TypeScript compiles
* Tests pass
* No `any` was introduced
* No secrets were added
* External inputs are validated
* Agent responsibilities remain separated
* Business logic is testable
* Output format is consistent
* Errors are handled clearly
* Logs are useful and safe

---

# Non-Negotiable Rules

Never fabricate business data.

Never hardcode secrets.

Never trust LLM output without validation.

Never mix unrelated responsibilities in one file.

Never place database queries inside agents.

Never place provider-specific API logic inside agents.

Never send outreach automatically without explicit approval.

Never commit generated reports containing sensitive or unnecessary personal data.
