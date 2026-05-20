# Ingestion Workflow for Easy Read Resource Index

This workflow governs how new sources and individual resources are added to the repository. It is designed to keep the index clinically useful, auditable, and safe for UK health, social care, SEND, neurodevelopmental, learning disability, and CAMHS contexts.

## 1. Scope

The repository should catalogue Easy Read and closely related accessible resources that are relevant to:

- NHS access and patient information
- CAMHS and young people’s mental health
- autism, ADHD, and neurodevelopmental services
- learning disability services
- medication, prescribing, monitoring, and STOMP-related work
- consent, capacity, rights, and Mental Health Act information
- safeguarding, SEND, parent/carer guidance, and inpatient CAMHS pathways

The repository is an index and curation tool. It is not a clinical guideline and does not replace local clinical governance, legal advice, prescribing guidance, or trust-approved patient information processes.

## 2. Source review standards

Prioritise sources in this order:

1. National NHS, government, regulator, or statutory bodies.
2. NHS Trusts, Integrated Care Boards, NHS Wales, NHS Scotland, and other UK public-sector health bodies.
3. Established UK charities or social enterprises with clear learning disability, autism, mental health, SEND, or accessible-information expertise.
4. Academic, professional, or NHS-linked collaborations.
5. Commercial or licensed resources only when clinically important and licence restrictions are clearly recorded.

Exclude or defer sources where:

- authorship or organisational ownership is unclear
- UK service relevance is weak
- the material appears outdated or contradicts current UK practice
- copyright or reuse terms are unclear and the item is being considered for download/rehosting
- the resource is promotional rather than patient/public information
- the content is not Easy Read, accessible HTML, plain English, symbol-supported, pictorial, audio/video-accessible, or otherwise materially accessible

## 3. URL validation rules

Before adding an individual resource to RESOURCE_INDEX.csv, confirm that the URL leads to one of the following:

- a direct PDF, MP3, video, or downloadable accessible resource
- a specific resource landing page
- a specific resource collection page with clear item-level links

Do not use generic organisational homepages as resource-level entries. Generic homepages may be recorded only in SOURCES_REGISTER.csv.

Record the date checked using ISO format: YYYY-MM-DD.

If a URL is live but access is restricted, record this in Download_Allowed and Licence_Notes.

## 4. Duplication handling

Before adding a resource:

1. Check RESOURCE_INDEX.csv for the same URL.
2. Check for near-duplicate titles from the same organisation.
3. Prefer the most authoritative or most specific version.
4. If the same resource appears on multiple websites, keep the original publisher or NHS/charity source as the main entry and mention mirrors in Notes only where useful.

Duplicate source organisations should not be added to SOURCES_REGISTER.csv unless they represent a distinct repository, sub-portal, or clinically meaningful collection.

## 5. Metadata standards

Use the exact schema in RESOURCE_INDEX.csv unless formally revised.

Recommended field practice:

- Title: use the resource title as displayed by the publisher.
- Topic: align with TOPIC_TAXONOMY.md categories.
- Subtopic: be specific, e.g. anxiety, lithium, Mental Health Act, hospital passport.
- Audience: name intended users where visible; otherwise infer cautiously.
- Age_Group: use All ages, 5-11, 12-15, 16-17, 18-25 transition, Adults, Parents/carers, or Staff as appropriate.
- Format: PDF, resource page, video, MP3, accessible HTML, toolkit, booklet, poster, checklist.
- Easy_Read_Quality: use Clear, Partial, Uncertain, or Not Easy Read.
- Download_Allowed: use Yes, No, Unclear, or Restricted.
- Licence_Notes: include visible reuse/licence/access restrictions.
- NHS_Relevant: use True or False in RESOURCE_INDEX.csv.
- CAMHS_Relevant: use True, False, Potentially, or Indirect only if the current schema allows; otherwise use True/False and explain in Notes.

## 6. CAMHS relevance criteria

Mark a resource as CAMHS-relevant when it supports any of the following:

- children, adolescents, parents, or carers
- child/adolescent mental health symptoms, assessment, treatment, crisis support, or inpatient care
- autism, ADHD, learning disability, communication needs, or sensory needs in under-18 or transition-age contexts
- medication discussions that are likely to arise in CAMHS, including psychotropics, ADHD medication, antipsychotics, antidepressants, mood stabilisers, anxiolytics, sleep medication, or medication monitoring
- consent, capacity, confidentiality, rights, Mental Health Act, safeguarding, or transition planning relevant to young people
- procedural preparation for investigations or hospital care that may reduce anxiety in neurodivergent young people

Use Potentially where the resource is adult-facing but clinically adaptable for adolescents, transition-age young people, parents/carers, or inpatient CAMHS teams.

## 7. Download and reuse guidance

Default position: link rather than download.

Download or store local copies only when:

- the publisher clearly permits download/reuse
- the material is already intended as a downloadable patient/public leaflet
- local archiving is needed for review, and copyright/reuse status is recorded
- no patient-identifiable or locally restricted material is included

Do not rehost copyrighted PDFs publicly unless reuse rights are clear.

For commercial or licensed resources, store only metadata and links unless a licence explicitly permits storage or redistribution.

## 8. Review cadence

Suggested review cycle:

- Core sources: every 3 months
- Recommended sources: every 6 months
- Supplemental sources: every 12 months
- Medication, legal rights, Mental Health Act, safeguarding, or consent/capacity resources: every 3 months or sooner after policy changes
- Local NHS Trust pages: every 6 months, or sooner if a pathway changes

Each review should update Date_Checked and add notes if the resource has moved, disappeared, changed, or been superseded.

## 9. Quality assurance workflow

For each ingestion batch:

1. Select one source category or topic area.
2. Search only reputable UK domains or sources already in SOURCES_REGISTER.csv.
3. Validate live URLs.
4. Extract metadata into the existing schema.
5. Check duplicates.
6. Add 5-10 resources per batch.
7. Commit with a clear commit message.
8. Review the CSV diff for formatting errors.
9. Flag uncertain items rather than overclaiming quality or relevance.

## 10. Exclusion criteria

Exclude or defer resources that:

- are not UK-relevant and have no clear transferable value
- are generic clinical webpages with no accessible adaptation
- lack a stable URL
- are inaccessible, broken, or blocked
- have unclear or unsafe medical advice
- are not from a reputable organisation
- appear to be outdated medication/legal/safeguarding guidance
- are duplicates of better source versions
- cannot be clearly classified

## 11. Safety notes

Always distinguish between:

- accessible patient information
- clinical guidance for professionals
- local policy
- statutory/legal information
- medication information requiring prescriber interpretation

Medication and legal-rights resources should be treated as high-review-priority entries. They should be checked against current local and national guidance before clinical use.
