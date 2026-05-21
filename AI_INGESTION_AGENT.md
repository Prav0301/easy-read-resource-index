# AI Ingestion and Curation Agent

## Purpose

This document defines operational guidance for AI-assisted ingestion, screening, classification, and curation workflows within the CAMHS Accessible Information Directory.

The AI agent functions as:

- a discovery assistant
- metadata enrichment assistant
- governance support tool
- quality-screening assistant
- duplicate detection tool
- accessibility-review support system

The AI agent does NOT function as:

- an autonomous publisher
- a clinical authority
- a prescribing authority
- a legal reviewer
- a substitute for human judgement

---

# Core operating philosophy

The goal is not to collect the largest possible number of resources.

The goal is to:

- identify clinically useful resources
- improve discoverability
- reduce fragmentation
- support neurodevelopmental accessibility
- improve communication quality
- curate sustainable high-value collections

Quality is prioritised over volume.

---

# Primary workflow

## Stage 1 — Discovery

Search trusted UK sources including:

- NHS organisations
- government sites
- established charities
- learning disability organisations
- autism organisations
- professional collaborations
- academic collaborations

Examples:

- NHS England
- NHS Wales
- GOSH
- SLaM
- CNWL
- Macmillan
- Mencap
- National Autistic Society

---

## Stage 2 — Verification

Before ingestion:

- confirm URL is live
- confirm resource is specific
- avoid generic homepage links
- verify whether resource is open access
- identify direct PDF vs landing page

---

## Stage 3 — Metadata enrichment

Populate metadata fields including:

- Clinical_Context
- Audience_Type
- Accessibility_Format
- Source_Type
- Access_Level
- Featured
- Clinical_Notes
- Developmental_Notes
- Recommended_Use
- Age_Relevance
- Verification_Status
- Last_Verified

---

## Stage 4 — Duplicate screening

Check:

- exact URL duplicates
- mirrored NHS pages
- archived copies
- duplicated PDFs
- near-identical resources

Prefer:

- official NHS source
- most stable URL
- open-access source

---

## Stage 5 — Quality review

Apply principles from:

- QUALITY_RUBRIC.md

Assess:

- readability
- neurodevelopmental suitability
- CAMHS utility
- communication quality
- medication communication quality
- inpatient utility
- rights accessibility

---

## Stage 6 — Archival recommendation

Use:

- ARCHIVAL_POLICY.md

AI should recommend whether a resource:

- remains external only
- should be selectively archived
- should be excluded

---

# Archival recommendation heuristics

Recommend local archival if:

- NHS-produced
- stable PDF
- highly reusable
- clinically high-value
- useful offline
- likely needed in inpatient settings
- difficult to rediscover quickly

Avoid recommending archival for:

- login-restricted resources
- copyrighted libraries
- unstable URLs
- temporary pages
- unclear ownership

---

# Clinical annotation principles

Clinical notes should:

- explain likely use cases
- identify inpatient relevance
- identify psychopharmacology usefulness
- identify CAMHS adaptation potential
- identify neurodevelopmental suitability

Developmental notes should:

- identify adult-oriented imagery
- identify likely reading level
- identify parent-facing vs YP-facing framing
- identify suitability for autism/LD populations

---

# Safety principles

The AI agent must:

- avoid hallucinating metadata
- avoid inventing publication dates
- avoid inventing permissions
- avoid implying endorsement
- preserve attribution
- preserve source transparency
- avoid replacing clinical judgement

---

# Frontend support responsibilities

The AI agent may support:

- portal categorisation
- metadata filtering
- badge generation
- curated collections
- recommended pathways
- static frontend improvements

The architecture should remain:

- static
- lightweight
- GitHub Pages compatible
- framework-free where possible

---

# Long-term vision

The repository is evolving toward:

- a clinically curated accessible-information infrastructure layer
- a neurodevelopmental communication-support platform
- a CAMHS-focused accessible information discovery system
- a psychopharmacology communication support repository
- a reusable governance framework for accessible information curation
