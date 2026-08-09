REVA BIOCARE — BUILD CONTEXT

GitHub Repository:
https://github.com/inyourservice247/revabiocare.git

Master Specification:
/docs/MASTER-SPEC.md

Vercel Project:
revabiocare

Current Vercel Domain:
https://revabiocare.vercel.app/

Database:
Neon PostgreSQL

Neon Project:
revabiocare

Database Environment Variable:
DATABASE_URL

DATABASE_URL is already configured in Vercel.
Do not ask for or hardcode the database connection string.

Authentication:
Neon Auth is enabled.

Admin Area:
/admin

Admin requirements:
- private route
- no public navigation link
- password/authentication required
- contains website enquiries only
- acts as an interface for the enquiry database
- not a CRM

Email:
Resend account created.
RESEND_API_KEY is already configured in Vercel.
Email notifications remain planned but are NOT a priority for the first working deployment.
Domain verification will be completed later.

Web Push:
Required.
Not configured yet.
Codex should implement Web Push notifications after the core enquiry/database/admin flow works.

FIRST BUILD PRIORITY:

1. Deploy a functioning website.
2. Public pages/routes work.
3. Enquiry form works.
4. Enquiries are stored in Neon.
5. /admin is protected.
6. /admin displays stored enquiries.
7. Add Web Push notifications.
8. Polish design/content afterward.
9. Complete Resend email notification afterward.
10. Connect final production domain afterward.

IMPORTANT:

Functionality first.

Lorem Ipsum and clearly marked placeholder content are acceptable during the first working build.

Do not spend time perfecting copy before the application architecture and enquiry system work.

Do not fabricate company facts, certifications, products, regulatory claims, statistics, testimonials, or manufacturing capabilities.

Use /docs/MASTER-SPEC.md as the source of truth for website architecture and design direction.
