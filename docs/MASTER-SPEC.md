# REVA BIOCARE — MASTER SPECIFICATION

**Document:** `MASTER-SPEC.md`  
**Status:** Single source of truth for the first working Reva Biocare website  
**Repository:** `inyourservice247/revabiocare`  
**Primary deployment target:** Vercel  
**Database:** Neon PostgreSQL  
**Authentication:** Neon Auth  
**Last reconciled:** 09 August 2026

---

## 0. Purpose of this document

This document defines what Codex should build, in what order, what it must not invent, what infrastructure already exists, and what is intentionally deferred.

If an older planning note, prototype, prompt, generated page, or code comment conflicts with this document, **this document wins** unless the user explicitly overrides it later.

The immediate objective is not a perfect marketing website. The immediate objective is:

> **Deploy a real, functioning Reva Biocare website whose public pages work, whose enquiry form stores data reliably, whose private admin area can read those enquiries, and whose admin can receive browser push notifications.**

Real copy, final branding polish, production domain work, and email notification completion may follow after the functioning system is online.

---

# PART I — PRODUCT PRINCIPLES

## 1. Build philosophy

The project follows **functionality first, polish second**.

Build in this order:

1. Working application shell.
2. Public routes and navigation.
3. Working enquiry form.
4. Reliable database persistence.
5. Private admin authentication.
6. Enquiry Admin Dashboard.
7. Web Push notifications.
8. Responsive refinement, accessibility, SEO, and visual polish.
9. Replace placeholders with verified business copy and real product data.
10. Complete Resend email notifications after DNS/domain access is available.
11. Connect the final production domain.

Do not spend substantial implementation time perfecting marketing copy before the enquiry and admin system works end-to-end.

---

## 2. Human/AI division of work

The user is intentionally doing simple platform and account work manually to preserve coding-agent time and tokens.

### User handles

- account creation;
- dashboard settings;
- DNS and domain access;
- secret/API-key creation and placement in Vercel;
- approvals;
- business facts;
- product data;
- compliance evidence;
- visual/content QA;
- final publishing decisions.

### ChatGPT handles

- architecture;
- sequencing;
- specification;
- contradiction checking;
- instructions for manual setup;
- content planning;
- acceptance criteria.

### Codex handles

- coding;
- Next.js/TypeScript implementation;
- database schema and migrations;
- API/server logic;
- form validation;
- authentication integration;
- admin UI;
- Web Push implementation;
- testing;
- debugging;
- deployment fixes;
- code-level SEO/accessibility/performance work.

Codex should not waste time searching dashboards for values the user can provide or configuring services through a GUI when a one-minute manual action is sufficient.

---

## 3. V1 definition of done

V1 is considered functionally complete when all of the following are true:

- public website deploys successfully on Vercel;
- primary public routes render without errors;
- navigation works on desktop and mobile;
- enquiry form validates user input;
- successful submissions are stored in Neon PostgreSQL;
- the visitor receives a clear success response after database persistence;
- `/admin` is not linked from the public website;
- `/admin` is protected by authentication;
- an authorized administrator can log in;
- admin can see stored enquiries newest-first;
- admin can open an enquiry and mark it read/unread;
- admin can search enquiries;
- an authenticated admin can opt into Web Push notifications;
- a new enquiry can trigger a Web Push notification without affecting database reliability;
- `/admin` is excluded from indexing;
- no secrets are committed to GitHub;
- the app builds cleanly in Vercel.

Email notifications, final domain connection, and final company copy are **not blockers** for the first working V1 deployment.

---

# PART II — BRAND, AUDIENCE, AND COMMUNICATION

## 4. Brand

Brand name: **Reva Biocare**.

The website should present Reva Biocare as a credible B2B pharmaceutical business without making business-model, manufacturing, certification, regulatory, or capability claims that have not been verified by the user.

---

## 5. Primary audience

The website is B2B, not consumer-facing.

Primary visitor types may include:

- procurement professionals;
- sourcing teams;
- pharmaceutical manufacturers;
- formulation companies;
- commercial/business-development teams;
- supply-chain teams;
- qualified business partners.

The interface and copy should feel appropriate for a procurement manager evaluating whether to send a requirement.

---

## 6. Primary website conversion

The primary conversion is:

> **Send a Requirement**

The site should make it easy for a serious visitor to understand the company, review relevant offerings, assess credibility, and send an enquiry.

Do not optimize V1 for newsletter signups, social-media follows, content marketing, or consumer engagement.

---

## 7. Copy tone

Copy should be:

- clear;
- concise;
- professional;
- procurement-oriented;
- factual;
- restrained;
- easy to scan.

Avoid:

- exaggerated pharmaceutical marketing language;
- vague claims such as “world-class,” “industry-leading,” or “best quality” unless evidence exists;
- invented numbers;
- invented export markets;
- invented years of experience;
- invented customer counts;
- invented certifications;
- invented facilities;
- invented regulatory approvals;
- invented manufacturing capacity;
- invented testimonials;
- invented partner names;
- invented product registrations.

---

## 8. Placeholder policy

During prototype/first deployment, placeholder content is allowed.

Use either:

- neutral placeholder copy; or
- clearly marked `[PLACEHOLDER — VERIFY BEFORE PRODUCTION]` content.

Lorem Ipsum is acceptable during layout construction, but must not remain on the final production website.

Placeholder copy must never accidentally imply a real certification, manufacturing capability, regulatory approval, client relationship, export history, or product availability.

---

## 9. Claim-verification rule

**Only claims that can be proven go live.**

Before publishing a factual claim, the user must be able to support it with business records, certificates, product documentation, contracts, licenses, partner documentation, or other appropriate evidence.

If proof is not available, either:

- remove the claim;
- soften it to an accurate description; or
- leave a placeholder until verified.

---

# PART III — SITE ARCHITECTURE

## 10. Public primary navigation

V1 primary navigation is locked to:

1. Home
2. About
3. Products
4. Services
5. Quality & Compliance
6. Contact

Primary CTA: **Send a Requirement**.

---

## 11. V1 exclusions from primary navigation

Do not add these to V1 primary navigation unless explicitly approved later:

- Careers
- News
- Blog
- Media
- Investor Relations
- customer portal
- public admin login

---

## 12. Public routes

Required public routes:

- `/`
- `/about`
- `/products`
- `/services`
- `/quality-compliance`
- `/contact`

Legal/supporting route:

- `/privacy`

The Privacy page may appear in the footer rather than primary navigation.

---

## 13. Private route

Required private route:

- `/admin`

Optional implementation subroutes may exist under `/admin`, for example:

- `/admin/login`
- `/admin/enquiries`
- `/admin/enquiries/[id]`

These are implementation details and do not appear in public navigation.

---

## 14. Admin-route visibility rule

There must be **no public-facing Admin or Login link** in:

- header;
- footer;
- mobile menu;
- public CTA area;
- sitemap;
- public page content.

The URL being unadvertised is only a convenience, not a security mechanism. Authentication is mandatory.

---

# PART IV — INFORMATION ARCHITECTURE BY PAGE

## 15. Home page purpose

The Home page should answer, quickly:

1. Who is Reva Biocare?
2. What can a business visitor source or discuss here?
3. Why is it worth contacting Reva?
4. What is the next action?

The page must not become crowded. Use strong hierarchy and generous spacing.

---

## 16. Home — hero

Recommended structure:

- Reva Biocare brand/name;
- one concise positioning line;
- short supporting sentence;
- primary CTA: **Send a Requirement**;
- secondary CTA: **View Products** or **Explore Products**;
- restrained pharmaceutical/business visual.

The hero should not contain a paragraph-heavy company history.

If the exact positioning statement is not yet verified, use a placeholder rather than inventing one.

---

## 17. Home — credibility snapshot

Provide a compact section that can eventually communicate verified strengths such as:

- product/sourcing scope;
- documentation approach;
- partner/manufacturer network;
- response process;
- business coverage.

Until facts are verified, use neutral placeholders and avoid fake statistics.

Do not use decorative counters with fabricated numbers.

---

## 18. Home — featured products

Show a small selection of products or product categories.

During the first build:

- use clearly marked placeholder product entries if real Reva product data is incomplete;
- do not copy Ambica Pharmachem’s product portfolio into Reva unless the user explicitly confirms that those products belong to Reva;
- do not invent CAS numbers, grades, pharmacopoeial status, regulatory status, MOQ, stock status, or lead times.

CTA: **View All Products**.

---

## 19. Home — services preview

Show a concise preview of the approved Reva service categories.

Because Reva’s exact business scope must be verified, the code should make service cards easy to edit or remove.

“Indenting” is a known candidate service from prior planning, but it must only be presented as a current Reva service if the user confirms it applies.

Do not turn candidate services into factual claims merely because they appeared in competitor research or planning notes.

---

## 20. Home — Quality / Documentation / Compliance preview

Use a section headed in the spirit of:

> **Quality / Documentation / Compliance**

Its purpose is to communicate process discipline without inventing certifications.

Safe first-build messaging may describe that documentation and compliance information will be supplied according to the applicable product/business arrangement, but specific claims must be verified before production.

CTA: **Quality & Compliance**.

---

## 21. Home — process section

A simple 3–4 step visual can explain the commercial journey, for example:

1. Send requirement
2. Requirement review
3. Product/document discussion
4. Commercial follow-up

Exact wording may be refined once Reva’s real sales process is confirmed.

Avoid claiming guaranteed timelines unless approved.

---

## 22. Home — final CTA

Close the page with a strong requirement CTA.

Suggested action label:

> **Send a Requirement**

The CTA should lead to `/contact` and/or directly focus the enquiry form.

---

## 23. About page purpose

The About page should establish:

- what Reva Biocare is;
- how it works;
- its business values;
- its approach to customers and suppliers/partners;
- why a procurement contact should consider engaging.

Do not use generic “vision/mission” filler unless the user supplies or approves meaningful statements.

---

## 24. About — company overview

Use concise, factual language.

If the company’s exact legal structure, founding year, office location, manufacturing status, and market footprint are not yet confirmed, keep them out of production copy.

---

## 25. About — operating model

This section must reflect Reva’s actual operating model once verified.

Do **not** casually label Reva as a manufacturer if it is acting as supplier, sourcing partner, exporter, indenting business, marketing company, or another model.

The distinction matters commercially and legally.

---

## 26. About — values

Values should be short and operational rather than decorative.

Potential themes may include reliability, clarity, documentation discipline, responsiveness, and long-term relationships, but only approved wording should ship.

---

## 27. Products page purpose

The Products page should let a procurement visitor quickly determine whether Reva may handle the substance/product they need and provide an obvious path to enquire.

---

## 28. Products data model

Product content should be data-driven so that the list can be replaced later without rebuilding page markup.

Each product record may support:

- display name;
- category;
- grade/pharmacopoeia, if verified;
- CAS number, if verified;
- short note, if verified;
- enquiry CTA.

Do not require every field.

Unknown values should be omitted rather than displayed as “N/A” everywhere.

---

## 29. Product placeholders

If real product data is incomplete, use unmistakable demo entries or generic placeholders.

Do not publish fake API names as though they are Reva’s commercial portfolio.

---

## 30. Product search/filter

For a small initial product list, a simple responsive grid is sufficient.

If the list becomes large, add lightweight client-side search/filtering by product name/category.

Do not add a complex search service or external search vendor for V1.

---

## 31. Product enquiry behavior

Each product card may provide a **Send Requirement** action.

When clicked, it may open the contact page/form with the product name prefilled into the requirement field or passed as context.

The visitor must still be able to edit the requirement text.

---

## 32. Individual product pages

Individual product detail routes are **not required to block V1**.

They may be added later when accurate, meaningful product data exists.

Do not generate thin SEO pages full of invented or generic pharmaceutical text.

---

## 33. Services page purpose

The Services page explains the actual commercial services Reva offers.

It must be modular so unsupported service sections can be deleted without redesigning the page.

---

## 34. Services content rule

Only approved services may be presented as active offerings.

Examples from planning or competitor sites are references, not facts.

Where service scope is not yet confirmed, use placeholder section headings and mark them for verification.

---

## 35. Indenting

“Indenting” has appeared in prior Reva planning and may be retained as a candidate service module.

Before production publication, confirm:

- that Reva actually provides indenting;
- how Reva defines the service;
- the geography/products it applies to;
- whether any regulatory wording is needed.

---

## 36. Quality & Compliance page purpose

This page should demonstrate process seriousness while remaining strictly evidence-based.

Possible content categories:

- quality approach;
- documentation handling;
- partner/manufacturer qualification approach;
- applicable compliance/document availability;
- enquiry/document request pathway.

---

## 37. Quality & Compliance — prohibited fabrication

Never invent or imply possession of:

- WHO-GMP;
- EU-GMP;
- USFDA approval;
- CEP;
- DMF;
- COS;
- ISO certification;
- GMP facility status;
- regulatory registrations;
- audit history;
- manufacturing licenses;
- export licenses;
- testing facilities;
- stability data;
- any other certificate or approval.

These may appear only when tied to verified Reva/partner/product evidence and phrased accurately.

---

## 38. Manufacturing-partner wording

Prior planning included wording similar to “We work with qualified manufacturing partners.”

Treat this as **unverified draft copy** until the user confirms:

- that Reva uses manufacturing partners;
- what “qualified” means operationally;
- whether Reva can substantiate the claim.

Do not publish it merely because it sounds credible.

---

## 39. Contact page purpose

The Contact page is the primary conversion page.

It should be simple, direct, and low-friction.

---

## 40. Public contact information

Known email inbox:

- `mail@revabiocare.com`
- - `+918655149141`

Do not invent phone numbers, addresses, office locations, WhatsApp numbers, business hours, or legal entity information.

If those values are missing, the layout must remain visually complete without them.

---

# PART V — ENQUIRY SYSTEM

## 41. Enquiry form — required visible fields

The first working enquiry form contains exactly these primary fields:

1. **Name**
2. **Email**
3. **Phone / WhatsApp**
4. **What are you looking for?**

Do not turn the first form into a lengthy RFQ questionnaire.

---

## 42. Enquiry field behavior

### Name

- required;
- reasonable length limit;
- trim whitespace.

### Email

- required;
- validate syntactically on client and server;
- normalize casing where appropriate.

### Phone / WhatsApp

- retain as user-entered text;
- allow international formats;
- do not impose India-only validation unless the business later requests it.

### What are you looking for?

- required;
- multiline;
- large enough for useful requirement detail;
- apply a sensible maximum length.

---

## 43. Enquiry submission authority

The **server** is authoritative.

Client-side validation exists for user experience only.

Every submission must be validated again server-side before database insertion.

---

## 44. Enquiry persistence principle

The database is the **source of truth**.

A submission counts as received only after the enquiry is successfully stored in Neon PostgreSQL.

Push notification or future email notification failure must never cause a successfully stored enquiry to appear failed to the customer.

---

## 45. Enquiry success behavior

After successful database persistence:

- show a clear success state;
- do not expose database details;
- do not promise a specific response time unless the user approves the claim;
- avoid automatically sending a customer acknowledgement email in the first working build.

---

## 46. Enquiry failure behavior

If database insertion fails:

- show a polite generic error;
- keep the visitor’s typed content where practical;
- allow retry;
- log the server-side failure without leaking secrets or stack traces to the visitor.

---

## 47. Spam protection

V1 should use lightweight protections without introducing unnecessary paid services.

Recommended baseline:

- server-side validation;
- honeypot field invisible to normal visitors;
- reasonable request-size limit;
- basic rate limiting/throttling;
- reject obviously malformed input;
- escape/safely render all stored user content.

Do not add CAPTCHA unless spam becomes a real problem or a stronger control is explicitly requested.

---

## 48. Enquiry database table

Codex should create a migration for an `enquiries` table with a minimal schema equivalent to:

- `id` — UUID primary key;
- `name` — text;
- `email` — text;
- `phone` — text;
- `requirement` — text;
- `is_read` — boolean, default false;
- `created_at` — timestamp with timezone;
- `updated_at` — timestamp with timezone.

Optional implementation-only fields may be added when justified, but the table must remain simple.

Do not build CRM concepts into this table.

---

## 49. Data minimization

Store only what the website needs.

Do not silently collect unnecessary sensitive data, detailed tracking profiles, or marketing analytics fields.

If IP-based abuse prevention requires retaining an IP-derived identifier, prefer a one-way salted hash or another privacy-conscious mechanism rather than displaying raw IPs in the admin UI.

---

# PART VI — PRIVATE ENQUIRY ADMIN DASHBOARD

## 50. Correct product name

The private interface is called:

> **Enquiry Admin Dashboard**

It is an internal interface over website enquiries, **not a CRM**.

---

## 51. Admin location

The dashboard remains inside the same GitHub repository, Next.js application, and Vercel deployment as the public website.

It is accessed through `/admin`.

There is no separate admin website or separate repository in V1.

---

## 52. Authentication

Use **Neon Auth** for the private admin area.

Authentication is already enabled at the Neon project level.

V1 should support an authorized admin account protected by password authentication.

Do not hardcode passwords in source code.

Do not store plaintext passwords in the application database.

---

## 53. Authorization

Authentication answers “who are you?”; authorization answers “are you allowed into this admin area?”

Codex must ensure that only approved admin users can access enquiry data.

Do not assume that possession of a valid generic account automatically grants admin rights if Neon Auth permits broader signup.

The simplest safe V1 approach is acceptable, provided authorization is enforced server-side and can be manually controlled.

---

## 54. Public signup

Do not expose a public “Create admin account” flow on the Reva website.

Admin accounts should be provisioned intentionally.

---

## 55. Admin no-index policy

All `/admin` routes must be excluded from search indexing.

Use appropriate metadata/robots controls.

Do not include admin routes in the public sitemap.

---

## 56. Admin dashboard — V1 features

Required:

- newest enquiries first;
- unread indicator;
- unread count;
- search;
- open/read enquiry;
- mark read;
- mark unread;
- show submission timestamp;
- display name, email, phone/WhatsApp, and requirement;
- sign out.

---

## 57. Admin search

Search should work across useful enquiry fields such as:

- name;
- email;
- phone;
- requirement text.

For the expected small V1 dataset, simple database-backed search is sufficient.

Do not add an external search engine.

---

## 58. Admin features explicitly out of V1

Do not build the following unless later requested:

- sales pipelines;
- lead scoring;
- deal stages;
- quotations;
- invoices;
- task assignment;
- customer accounts;
- email campaigns;
- automated follow-up sequences;
- contact-company relationship management;
- complex roles/permissions;
- analytics dashboards;
- full audit-history UI.

These belong to a future CRM or operations system, not the first enquiry dashboard.

---

## 59. Admin interface style

The admin UI should be functional and clean rather than heavily branded.

Priorities:

1. readability;
2. speed;
3. clear unread state;
4. usable search;
5. mobile-safe layout;
6. reliable authentication.

---

# PART VII — WEB PUSH NOTIFICATIONS

## 60. Web Push definition

V1 should support **true Web Push Notifications** for authorized admins.

This means the browser/device can receive a notification even when the admin page is not currently open, subject to browser/OS permission and platform support.

This is different from an in-page toast.

---

## 61. Push audience

Only authenticated/authorized admins should be offered the ability to subscribe to enquiry push notifications.

Do not ask public website visitors to enable notifications.

---

## 62. Web Push architecture

Codex should implement the normal standards-based Web Push flow:

1. service worker registration;
2. admin permission request;
3. push subscription creation in the browser;
4. subscription stored server-side;
5. VAPID-authenticated push delivery when a new enquiry is stored;
6. notification click opens the admin area/relevant enquiry.

---

## 63. VAPID credentials

Expected environment variables:

- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`

Codex may generate the key pair as part of implementation and instruct the user exactly which values to place in Vercel.

The private key must never be committed to GitHub or exposed to the browser.

`VAPID_SUBJECT` should use an appropriate `mailto:` or site URI once production identity details are finalized.

---

## 64. Push subscription storage

Create a minimal `push_subscriptions` table or equivalent persistent model containing the data required to send standards-based Web Push messages.

It should support:

- subscription endpoint;
- required encryption keys;
- link to authorized admin user where practical;
- created/updated timestamps;
- removal/disable of expired subscriptions.

Do not store subscriptions only in memory because Vercel instances are ephemeral.

---

## 65. Push message privacy

Notifications may appear on a locked device.

Default payload should therefore be restrained, for example:

> **New Reva Biocare website enquiry**

Optionally include the sender name if acceptable, but avoid exposing the full requirement text or sensitive commercial details on the lock screen.

Clicking the notification should take an authenticated admin to the relevant admin view.

---

## 66. Push failure rule

Database persistence is primary.

Notification sending occurs after successful insertion.

If Web Push fails:

- do not roll back the enquiry;
- do not tell the website visitor their submission failed;
- clean up expired subscriptions when appropriate;
- log the notification error for debugging.

---

# PART VIII — EMAIL NOTIFICATIONS (RETAINED, DEFERRED)

## 67. Email remains part of the architecture

Email notification is **not removed** from the project.

It is deferred until Reva’s domain/DNS access is available for sender-domain verification.

---

## 68. Email service

Service: **Resend**.

The Resend account exists and `RESEND_API_KEY` has already been placed in Vercel environment variables.

Do not expose the key in code, prompts, logs, or documentation.

---

## 69. Intended email flow

Later, after domain verification:

- new enquiry stored successfully;
- internal notification email sent to `mail@revabiocare.com`;
- email is an alert only;
- Neon remains the source of truth.

No customer confirmation email is required for the initial implementation unless explicitly added later.

---

## 70. Intended sender domain

Preferred future structure from planning:

- automated sender domain: `notify.revabiocare.com`
- example sender: `website@notify.revabiocare.com`

This is a plan, not a currently verified DNS configuration.

Do not block V1 on it.

---

# PART IX — INFRASTRUCTURE

## 71. GitHub

Repository:

`https://github.com/inyourservice247/revabiocare.git`

GitHub is the source-code and version-history home for the project.

Codex should work against this repository.

---

## 72. Vercel

Vercel project: **revabiocare**.

Known temporary/stable Vercel URL:

`https://revabiocare.vercel.app/`

Vercel is the deployment and hosting platform.

The project is already connected to GitHub.

---

## 73. Neon

Database provider: **Neon PostgreSQL**.

Neon project: **revabiocare**.

PostgreSQL database connection is already available to Vercel through:

`DATABASE_URL`

Codex must read this through the environment and must not ask the user to paste the connection string into code or chat.

---

## 74. Neon Auth

Neon Auth is already enabled for the Neon project.

Codex should integrate it into `/admin` rather than creating a separate home-grown password database.

Use Neon’s supported/current integration approach at implementation time.

---

## 75. Environment variable policy

Secrets belong in Vercel Environment Variables and local `.env.local` files that are gitignored.

Never commit real secret values.

A `.env.example` may contain names only.

Known/planned variables include:

```text
DATABASE_URL=
RESEND_API_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=
NEXT_PUBLIC_SITE_URL=

```

Neon Auth may require additional variables according to its current official integration. Codex should add variable **names** to `.env.example` and tell the user what to configure, without committing secret values.

---

## 76. Production domain

The final public domain is intended to be:

`revabiocare.com`

Domain/DNS management access is not currently part of the immediate build path.

Use the Vercel domain for the functioning prototype/deployment.

Connect the real domain later.

---

# PART X — TECHNICAL IMPLEMENTATION

## 77. Application stack

Preferred application architecture:

- Next.js;
- TypeScript;
- App Router-style route structure;
- server-side capabilities for form/database/admin logic;
- responsive CSS using a maintainable approach suitable for the repo;
- Neon PostgreSQL;
- Neon Auth;
- standards-based Web Push;
- Vercel deployment.

Use supported stable packages and APIs available at implementation time.

Do not add infrastructure merely because it is fashionable.

---

## 78. Dependency discipline

Keep dependencies limited.

A new package must provide clear value for:

- database access/migrations;
- validation;
- authentication;
- Web Push;
- UI implementation;
- testing.

Avoid installing large UI systems, CMSs, state-management frameworks, CRMs, queues, or analytics stacks unless actually needed.

---

## 79. Database access

All database writes and privileged reads occur server-side.

Never expose `DATABASE_URL` or privileged database credentials to client-side JavaScript.

Use parameterized queries/ORM-safe query methods.

Create reproducible migrations committed to the repository.

---

## 80. API/server design

The form submission endpoint/action should:

1. validate request size and fields;
2. apply abuse controls;
3. insert the enquiry;
4. return success after persistence;
5. trigger notification fan-out without making notifications authoritative.

Admin reads/updates must verify authentication and authorization on the server.

---

## 81. Validation

Use a shared validation schema where practical so client and server rules do not drift.

Server validation is mandatory regardless of client validation.

Render user-provided requirement text as text, never as raw HTML.

---

## 82. Security baseline

V1 security requirements:

- authentication on all admin data routes;
- server-side authorization;
- secure cookies/session handling through the auth provider;
- no plaintext passwords;
- no secrets in Git;
- input validation;
- output escaping;
- request-size limits;
- anti-spam controls;
- no admin indexing;
- appropriate security headers where supported;
- no stack traces or secret values in visitor-facing errors.

Do not mistake a hidden `/admin` URL for access control.

---

## 83. Privacy

The enquiry form collects business contact information.

Provide a concise Privacy page explaining, once finalized:

- what form data is collected;
- why it is collected;
- that it is used to respond to business enquiries;
- how to contact Reva regarding the data.

Do not invent legal promises or retention periods before the user approves them.

---

## 84. Accessibility

Implement normal accessibility fundamentals:

- semantic headings;
- labelled form controls;
- visible focus states;
- keyboard-usable navigation;
- sufficient contrast;
- alt text for meaningful images;
- reduced-motion respect where applicable;
- accessible error and success messages;
- mobile navigation that is keyboard/screen-reader usable.

---

## 85. Performance

Keep the site fast.

Priorities:

- optimize images;
- avoid large client bundles;
- use server-rendered/static output where appropriate;
- load scripts only when needed;
- avoid background video unless specifically approved;
- avoid huge animation libraries for decorative effects;
- prevent layout shift;
- use performant fonts/assets.

---

# PART XI — VISUAL DESIGN

## 86. Overall direction

The desired feel is:

- clean;
- spacious;
- credible;
- modern B2B pharmaceutical;
- restrained;
- premium without looking luxurious for its own sake;
- easy for procurement visitors to scan.

The user rejected crowded sample layouts. Whitespace and hierarchy are important.

---

## 87. Competitor references

Prior visual/business references include:

- `sspharma.org`
- `yaksh-pharma.com`

Use them as inspiration/context only.

Do not clone their layout, copy, assets, claims, product lists, certifications, or branding.

---

## 88. Visual anti-patterns

Avoid:

- overcrowded homepages;
- too many cards in one viewport;
- excessive gradients;
- generic “AI startup” aesthetics;
- neon effects;
- random molecular decorations everywhere;
- heavy carousels;
- autoplay video;
- stock-photo overload;
- tiny text;
- long unbroken paragraphs;
- decorative counters with fake metrics;
- animation that delays information.

---

## 89. Layout system

Use:

- consistent max-width container;
- strong vertical rhythm;
- generous section spacing;
- responsive grid;
- clear text hierarchy;
- reusable section components;
- consistent buttons and form controls.

The site should feel intentionally composed on both laptop and phone screens.

---

## 90. Header

Header requirements:

- Reva Biocare identity/logo area;
- primary navigation;
- prominent **Send a Requirement** CTA;
- responsive mobile menu;
- sticky behavior only if it improves usability;
- no Admin/Login link.

---

## 91. Footer

Footer may contain:

- Reva Biocare name/logo;
- primary public links;
- `mail@revabiocare.com`;
- Privacy link;
- a concise business descriptor once verified;
- copyright.

Do not add unverified addresses, registrations, certifications, or social links.

---

## 92. Photography and imagery

Prefer imagery that supports credibility and the pharmaceutical supply/business context.

Avoid images that falsely imply Reva owns a manufacturing plant, laboratory, warehouse, clean room, or equipment unless the imagery is explicitly generic/illustrative and cannot reasonably be mistaken as Reva’s facility.

If there is risk of misrepresentation, use abstract/product-neutral imagery instead.

---

# PART XII — SEO AND INDEXING

## 93. Staging indexing

Until content and claims are approved, staging/preview deployments should not be intentionally promoted to search engines.

Where practical, use noindex for unfinished staging content.

---

## 94. Production SEO baseline

When production-ready, public pages should have:

- unique titles;
- concise meta descriptions;
- canonical URLs;
- logical H1/H2 hierarchy;
- crawlable text;
- sitemap for public pages;
- robots configuration;
- Open Graph metadata;
- clean URLs.

Do not write keyword-stuffed pharmaceutical copy.

---

## 95. Structured data

Use only structured data that accurately represents the business.

Basic Organization/Website structured data may be added when verified information is available.

Do not add manufacturer, product, medical, review, rating, or location schema with fabricated data.

---

# PART XIII — TESTING AND QUALITY CONTROL

## 96. Minimum automated checks

Codex should leave the repository in a state where normal project checks pass, including the equivalent of:

- install;
- type check;
- lint;
- production build.

Add focused tests for high-value server logic where practical, especially validation and authorization boundaries.

---

## 97. Enquiry end-to-end test

Before calling the system complete, manually verify:

1. open public site;
2. submit a valid test enquiry;
3. receive visible success response;
4. confirm row exists in Neon;
5. log into `/admin`;
6. see test enquiry;
7. mark it read;
8. mark it unread;
9. search for it;
10. verify no unauthorized visitor can view it.

---

## 98. Push end-to-end test

After Web Push is implemented:

1. admin logs in;
2. admin enables notifications;
3. subscription is stored;
4. close/navigate away from admin page as supported;
5. submit a new test enquiry from the public site;
6. notification arrives;
7. clicking it opens the admin area;
8. enquiry remains stored even if push is deliberately broken.

---

## 99. Responsive test

Check at minimum:

- common desktop width;
- laptop width;
- tablet width;
- narrow phone width.

No horizontal overflow, clipped buttons, inaccessible menus, unreadable tables, or form controls should remain.

The admin enquiry list must remain usable on mobile, even if it changes from a table to stacked cards.

---

# PART XIV — DEPLOYMENT AND WORKFLOW

## 100. Deployment flow

GitHub is the code source.

Vercel builds/deploys the connected repository.

Codex should make code changes in a way compatible with the existing GitHub→Vercel workflow.

The user does not need to perform low-level Git operations manually unless necessary.

---

## 101. Preview vs production

Use Vercel preview deployments for work-in-progress review where available.

Production should reflect approved code from the primary production branch.

Do not treat a successful build alone as proof that the enquiry/admin system works; run functional checks.

---

## 102. Logging

For V1, Vercel/server logs are sufficient unless a real observability problem emerges.

Log enough to diagnose:

- database insertion errors;
- auth errors;
- push delivery errors;
- unexpected server failures.

Never log passwords, database URLs, API keys, raw auth tokens, or unnecessary enquiry content.

---

# PART XV — NON-GOALS

## 103. Explicit V1 non-goals

Unless later approved, do not build:

- full CRM;
- customer login portal;
- ecommerce;
- shopping cart;
- online payments;
- automated quotations;
- inventory/stock management;
- ERP integration;
- vendor portal;
- customer document vault;
- public certificate library;
- blog/CMS;
- careers system;
- newsletter platform;
- social feed;
- complex analytics suite;
- multi-language site;
- mobile app.

---

# PART XVI — CONTENT REQUIRED BEFORE FINAL PRODUCTION

## 104. Business facts still requiring confirmation

The working prototype may proceed without these, but final production copy should not be approved until relevant facts are supplied:

- exact legal/company description;
- legal entity name if different from brand;
- whether Reva is manufacturer, supplier, exporter, indenting business, sourcing partner, marketer, or another combination;
- founding year, if it will be displayed;
- real office address;
- real phone/WhatsApp number;
- real service list;
- real product list;
- product grades/specifications;
- certifications/licenses;
- partner/manufacturer claims;
- documentation available per product;
- markets/geographies served;
- logo/brand assets;
- approved legal/privacy wording.

Missing data is not permission to invent it.

---

## 105. Product-data handoff format

When real product data becomes available, prefer a structured list/table containing:

- product name;
- category;
- grade/pharmacopoeia;
- CAS number;
- relevant documentation status;
- short approved description;
- whether publicly displayable;
- any enquiry notes.

Codex should be able to replace placeholder data with this source cleanly.

---

# PART XVII — IMPLEMENTATION ORDER FOR CODEX

## 106. Phase 1 — establish the application

Codex should first inspect the repository and preserve any valid existing work.

Then:

- establish a clean Next.js/TypeScript project if not already present;
- set up route structure;
- create reusable layout/header/footer primitives;
- ensure Vercel can build and deploy.

Do not begin by writing thousands of words of marketing copy.

---

## 107. Phase 2 — public functional shell

Build:

- Home;
- About;
- Products;
- Services;
- Quality & Compliance;
- Contact;
- Privacy.

Use restrained placeholders where real content is missing.

Navigation and mobile layout must work.

---

## 108. Phase 3 — enquiry database path

Implement:

- migration/schema;
- server validation;
- enquiry insertion;
- success/error behavior;
- baseline anti-spam protections.

Test directly against the configured Neon database.

This phase is the first major functional milestone.

---

## 109. Phase 4 — admin

Implement:

- Neon Auth integration;
- server-side authorization;
- `/admin` login flow;
- enquiry list;
- enquiry detail;
- search;
- read/unread state;
- sign out;
- noindex protection.

Test unauthorized access explicitly.

---

## 110. Phase 5 — Web Push

Implement:

- service worker;
- VAPID configuration;
- admin subscription UI;
- subscription persistence;
- new-enquiry push fan-out;
- expired-subscription cleanup;
- notification click behavior.

Ensure push failures never invalidate a stored enquiry.

---

## 111. Phase 6 — hardening and polish

Then improve:

- responsive details;
- accessibility;
- loading/error states;
- performance;
- metadata;
- staging noindex behavior;
- production build cleanliness;
- visual consistency.

---

## 112. Phase 7 — content replacement

After the user provides verified business information:

- replace Lorem Ipsum/placeholders;
- insert real products;
- insert approved service descriptions;
- insert verified quality/compliance wording;
- insert real contact/location information;
- finalize metadata.

Run a claim-verification review before production approval.

---

## 113. Phase 8 — deferred email

After DNS/domain access is available:

- verify `notify.revabiocare.com` or approved sender domain in Resend;
- configure sender;
- send internal new-enquiry notifications to `mail@revabiocare.com`;
- preserve Neon as source of truth;
- test failure behavior;
- do not expose secrets.

---

## 114. Phase 9 — production domain

Finally:

- connect `revabiocare.com` to Vercel;
- verify DNS;
- set production canonical/site URL;
- verify HTTPS;
- update Web Push/Resend settings where origin/domain matters;
- re-run enquiry/admin/push tests;
- remove staging-only noindex from approved public pages.

---

# PART XVIII — ACCEPTANCE RULES FOR CODEX

## 115. Do not silently change scope

If Codex finds a technical reason to alter a locked architectural decision, it should explain the issue and propose the smallest change rather than silently replacing the architecture.

Examples of locked intent:

- Neon remains the enquiry database;
- `/admin` remains private and within the same application;
- no public admin link;
- Web Push remains planned for V1;
- Resend email remains planned but deferred;
- functionality comes before copy polish;
- public pages remain the six-page primary architecture.

---

## 116. Do not fabricate missing business information

When a required content field is unknown, Codex should use a placeholder or omit the block.

It must not “fill in” plausible pharmaceutical claims from industry convention.

---

## 117. Do not expose credentials

Codex should refer to environment variable **names**, not values.

Never write actual secrets into:

- GitHub;
- Markdown docs;
- source files;
- client bundles;
- example screenshots;
- logs.

---

## 118. Keep the project understandable

The user is not a programmer.

Code structure should therefore be conventional and documented enough that future Codex sessions can resume quickly.

Prefer clear names over clever abstractions.

For any manual action Codex needs from the user, give exact dashboard instructions one action at a time.

---

# PART XIX — CURRENT INFRASTRUCTURE STATE

## 119. Confirmed complete

At the time of this specification:

- GitHub repository exists;
- `/docs/MASTER-SPEC.md` exists;
- GitHub is connected to Vercel;
- Vercel project `revabiocare` exists;
- Vercel deployment/domain exists;
- Neon plugin/service is connected;
- Neon project `revabiocare` exists;
- `DATABASE_URL` is configured in Vercel;
- Neon Auth is enabled;
- Resend account exists;
- Resend API key exists;
- `RESEND_API_KEY` is configured in Vercel.

---

## 120. Confirmed pending/deferred

- Resend sender-domain verification — deferred until DNS access;
- real production domain connection — later;
- Web Push VAPID keys — to be created during implementation;
- push subscription storage — to be coded;
- public application — to be coded;
- enquiry database table — to be coded/migrated;
- admin integration — to be coded;
- final verified business copy — later;
- final product/service dataset — later.

---

# PART XX — FINAL CODING BRIEF

## 121. One-paragraph brief for Codex

Build Reva Biocare as a clean, responsive B2B pharmaceutical website in the existing GitHub repository, deployed through Vercel. Use the six locked public navigation pages: Home, About, Products, Services, Quality & Compliance, and Contact, plus a minimal Privacy page. Placeholder copy is acceptable while business facts remain incomplete, but never fabricate products, certifications, manufacturing status, regulatory claims, statistics, partners, or capabilities. The Contact page must contain a short enquiry form with Name, Email, Phone/WhatsApp, and What are you looking for? Validate submissions server-side and store them in Neon PostgreSQL using the existing `DATABASE_URL`; Neon is the source of truth. Build a private, unlinked, password-authenticated Enquiry Admin Dashboard at `/admin` using Neon Auth, with newest-first enquiries, search, detail view, unread/read state, and sign out. Then implement authenticated admin Web Push notifications using a service worker, VAPID keys, persistent subscriptions, and failure isolation so notification failure never loses an enquiry. Resend email notification remains in the architecture but is deferred until sender-domain DNS access is available. Functionality first; copy and production-domain polish later.

---

# PART XXI — SOURCE-OF-TRUTH PRECEDENCE

## 122. Precedence

When future instructions conflict, use this order:

1. **latest explicit user instruction**;
2. this `MASTER-SPEC.md`;
3. approved business data/content supplied by the user;
4. existing implementation details;
5. older planning notes/prototypes.

A later explicit user decision may amend this document.

---

# END OF MASTER SPECIFICATION
