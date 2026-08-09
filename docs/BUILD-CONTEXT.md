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

### V1 ADMIN AUTHENTICATION OVERRIDE

Although Neon Auth is enabled on the Neon project, DO NOT use Neon Auth for V1 admin authentication.

For V1, `/admin` must use simple username + password authentication using the existing Vercel environment variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

Both credentials must be validated server-side.

Requirements:
- Never hardcode either credential.
- Never expose `ADMIN_PASSWORD` to client-side JavaScript.
- `/admin` must not appear in public navigation, footer, sitemap, or other public-facing links.
- Unauthenticated visitors must not be able to access admin pages or enquiry data.
- Successful login should create a secure session.
- Provide logout functionality.
- No signup, email verification, password reset, user management, roles, or permissions system is required for V1.

Neon Auth may remain enabled in Neon but is unused for V1.

THIS SECTION OVERRIDES ANY CONFLICTING ADMIN AUTHENTICATION REQUIREMENTS IN `/docs/MASTER-SPEC.md`.
  - Email notification functionality is deferred until the Reva Biocare sending domain can be verified.
  - Do not prioritize Resend during the initial functional build.
