CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  grade text[] NOT NULL DEFAULT '{}',
  cas_number text,
  overview text NOT NULL,
  applications text[] NOT NULL DEFAULT '{}',
  documentation text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO products (
  name,
  slug,
  category,
  grade,
  cas_number,
  overview,
  applications,
  documentation,
  featured,
  active,
  sort_order
)
VALUES
  ('Sample Active Alpha', 'sample-active-alpha', 'API', ARRAY['Prototype Grade A', 'Prototype Grade B'], '12345-67-8 [DEMO]', 'Fictional prototype record for catalogue layout testing.', '{}', '{}', false, true, 1),
  ('Sample Active Beta Hydrochloride', 'sample-active-beta-hydrochloride', 'API', '{}', '23456-78-9 [DEMO]', 'Fictional prototype record for catalogue layout testing.', '{}', '{}', false, true, 2),
  ('Sample Active Ingredient With Extended Multi-Word Commercial Name', 'sample-active-ingredient-with-extended-multi-word-commercial-name', 'API', '{}', NULL, 'Fictional prototype record for catalogue layout testing.', '{}', '{}', false, true, 3),
  ('Sample Intermediate Gamma', 'sample-intermediate-gamma', 'Pharmaceutical Intermediate', ARRAY['Prototype Intermediate Grade'], '34567-89-0 [DEMO]', 'Fictional prototype record for catalogue layout testing.', '{}', '{}', false, true, 4),
  ('Sample Excipient Delta', 'sample-excipient-delta', 'Excipient', ARRAY['Prototype Compendial Grade'], '45678-90-1 [DEMO]', 'Fictional prototype record for catalogue layout testing.', '{}', '{}', false, true, 5),
  ('Sample Nutraceutical Epsilon', 'sample-nutraceutical-epsilon', 'Nutraceutical Ingredient', '{}', NULL, 'Fictional prototype record for catalogue layout testing.', '{}', '{}', false, true, 6),
  ('Sample Active Zeta Sodium', 'sample-active-zeta-sodium', 'API', '{}', '56789-01-2 [DEMO]', 'Fictional prototype record for catalogue layout testing.', '{}', '{}', false, true, 7),
  ('Sample Active Eta Monohydrate', 'sample-active-eta-monohydrate', 'API', '{}', '67890-12-3 [DEMO]', 'Fictional prototype record for catalogue layout testing.', '{}', '{}', false, true, 8),
  ('Sample Intermediate Theta', 'sample-intermediate-theta', 'Pharmaceutical Intermediate', '{}', NULL, 'Fictional prototype record for catalogue layout testing.', '{}', '{}', false, true, 9),
  ('Sample Excipient Iota', 'sample-excipient-iota', 'Excipient', '{}', '78901-23-4 [DEMO]', 'Fictional prototype record for catalogue layout testing.', '{}', '{}', false, true, 10),
  ('Sample Active Kappa', 'sample-active-kappa', 'API', '{}', '89012-34-5 [DEMO]', 'Fictional prototype record for catalogue layout testing.', '{}', '{}', false, true, 11),
  ('Sample Long-Form Ingredient Name for Responsive Pharmaceutical Catalogue Testing', 'sample-long-form-ingredient-name-for-responsive-pharmaceutical-catalogue-testing', 'API', '{}', '90123-45-6 [DEMO]', 'Fictional prototype record for catalogue layout testing.', '{}', '{}', false, true, 12)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  grade = EXCLUDED.grade,
  cas_number = EXCLUDED.cas_number,
  overview = EXCLUDED.overview,
  applications = EXCLUDED.applications,
  documentation = EXCLUDED.documentation,
  featured = EXCLUDED.featured,
  active = EXCLUDED.active,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();
