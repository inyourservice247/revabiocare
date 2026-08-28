-- Source-faithful, idempotent four-category catalogue import.
-- Matching deliberately normalizes only case, whitespace, and punctuation.
WITH raw_source AS (
  SELECT btrim(value) AS value, ordinal
  FROM regexp_split_to_table($catalogue$
veterinary-apis|ALBENDAZOLE
veterinary-apis|HALQUINOL
veterinary-apis|RAFOXANIDE
veterinary-apis|CLOSANTEL SODIUM
veterinary-apis|NITROXYNIL
veterinary-apis|RICOBENDAZOLE
veterinary-apis|CLORSULON
veterinary-apis|OXFENDAZOLE
veterinary-apis|TOLDIMFOS SODIUM
veterinary-apis|ETHOPABATE
veterinary-apis|OXYCLOZANIDE
veterinary-apis|TRICLABENDAZOLE
veterinary-apis|FEBANTEL
veterinary-apis|PHENYLBUTAZONE
veterinary-apis|FENBENDAZOLE
veterinary-apis|PYRANTEL PAMOATE
agro-chemicals|ALPHA CYPERMETHRIN
agro-chemicals|METHAMIDOPHOS
agro-chemicals|THIAMETHOXAM
agro-chemicals|CYPERMETHRIN
agro-chemicals|METRIBUZIN
agro-chemicals|TRICYCLAZOLE
agro-chemicals|DELTAMETHRIN
agro-chemicals|PERMETHRIN
agro-chemicals|TEBUCONAZOLE
agro-chemicals|ETHION
agro-chemicals|PROFENOPHOS
agro-chemicals|THIOPHANATE METHYL
agro-chemicals|HEXACONAZOLE
agro-chemicals|TEMEPHOS
agro-chemicals|LAMBDA CYHALOTHRIN
agro-chemicals|THETA CYPERMETHRIN
pellets|DICLOFENAC SODIUM SR
pellets|LANSOPRAZOLE
pellets|PANTOPRAZOLE SODIUM
pellets|ESOMEPRAZOLE MAGNESIUM
pellets|OMEPRAZOLE
pellets|RABEPRAZOLE SODIUM
pellets|ITRACONAZOLE
pellets|ORLISTAT
pellets|TAMSULOSIN
dc-granules|CALCIUM CARBONATE
dc-granules|IBUPROFEN
dc-granules|CIPROFLOXCIN
dc-granules|METFORMIN HCL
dc-granules|COTRIMOXAZOLE (SULFA-METHOXAZOLE AND TRIMETHOPRIM)
dc-granules|PARACETAMOL
$catalogue$, E'\\r?\\n') WITH ORDINALITY AS rows(value, ordinal)
  WHERE btrim(value) <> ''
),
source AS (
  SELECT split_part(value, '|', 1) AS category_slug,
         split_part(value, '|', 2) AS name,
         row_number() OVER (ORDER BY ordinal)::integer AS ordinal
  FROM raw_source
),
matched AS (
  SELECT source.category_slug, source.name, source.ordinal, product.id
  FROM source
  JOIN LATERAL (
    SELECT p.id
    FROM products p
    WHERE regexp_replace(lower(btrim(p.name)), '[^a-z0-9]+', '', 'g')
          = regexp_replace(lower(source.name), '[^a-z0-9]+', '', 'g')
       OR p.slug = trim(both '-' from regexp_replace(lower(source.name), '[^a-z0-9]+', '-', 'g'))
    ORDER BY CASE WHEN lower(btrim(p.name)) = lower(source.name) THEN 0 ELSE 1 END, p.created_at
    LIMIT 1
  ) product ON true
),
inserted AS (
  INSERT INTO products (
    name, slug, category, grade, cas_number, overview, applications,
    documentation, featured, active, sort_order
  )
  SELECT source.name,
         trim(both '-' from regexp_replace(lower(source.name), '[^a-z0-9]+', '-', 'g')),
         categories.name,
         '{}'::text[], NULL, '', '{}'::text[], '{}'::text[],
         false, true, current_max.value + source.ordinal
  FROM source
  JOIN categories ON categories.slug = source.category_slug
  CROSS JOIN (SELECT COALESCE(max(sort_order), 0) AS value FROM products) current_max
  LEFT JOIN matched ON matched.category_slug = source.category_slug AND matched.name = source.name
  WHERE matched.id IS NULL
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
)
SELECT count(*) AS new_products_inserted FROM inserted;

WITH raw_source AS (
  SELECT btrim(value) AS value
  FROM regexp_split_to_table($catalogue$
veterinary-apis|ALBENDAZOLE
veterinary-apis|HALQUINOL
veterinary-apis|RAFOXANIDE
veterinary-apis|CLOSANTEL SODIUM
veterinary-apis|NITROXYNIL
veterinary-apis|RICOBENDAZOLE
veterinary-apis|CLORSULON
veterinary-apis|OXFENDAZOLE
veterinary-apis|TOLDIMFOS SODIUM
veterinary-apis|ETHOPABATE
veterinary-apis|OXYCLOZANIDE
veterinary-apis|TRICLABENDAZOLE
veterinary-apis|FEBANTEL
veterinary-apis|PHENYLBUTAZONE
veterinary-apis|FENBENDAZOLE
veterinary-apis|PYRANTEL PAMOATE
agro-chemicals|ALPHA CYPERMETHRIN
agro-chemicals|METHAMIDOPHOS
agro-chemicals|THIAMETHOXAM
agro-chemicals|CYPERMETHRIN
agro-chemicals|METRIBUZIN
agro-chemicals|TRICYCLAZOLE
agro-chemicals|DELTAMETHRIN
agro-chemicals|PERMETHRIN
agro-chemicals|TEBUCONAZOLE
agro-chemicals|ETHION
agro-chemicals|PROFENOPHOS
agro-chemicals|THIOPHANATE METHYL
agro-chemicals|HEXACONAZOLE
agro-chemicals|TEMEPHOS
agro-chemicals|LAMBDA CYHALOTHRIN
agro-chemicals|THETA CYPERMETHRIN
pellets|DICLOFENAC SODIUM SR
pellets|LANSOPRAZOLE
pellets|PANTOPRAZOLE SODIUM
pellets|ESOMEPRAZOLE MAGNESIUM
pellets|OMEPRAZOLE
pellets|RABEPRAZOLE SODIUM
pellets|ITRACONAZOLE
pellets|ORLISTAT
pellets|TAMSULOSIN
dc-granules|CALCIUM CARBONATE
dc-granules|IBUPROFEN
dc-granules|CIPROFLOXCIN
dc-granules|METFORMIN HCL
dc-granules|COTRIMOXAZOLE (SULFA-METHOXAZOLE AND TRIMETHOPRIM)
dc-granules|PARACETAMOL
$catalogue$, E'\\r?\\n') AS rows(value)
  WHERE btrim(value) <> ''
),
source AS (
  SELECT split_part(value, '|', 1) AS category_slug,
         split_part(value, '|', 2) AS name
  FROM raw_source
),
matched_products AS (
  SELECT source.category_slug, source.name, product.id
  FROM source
  JOIN LATERAL (
    SELECT p.id
    FROM products p
    WHERE regexp_replace(lower(btrim(p.name)), '[^a-z0-9]+', '', 'g')
          = regexp_replace(lower(source.name), '[^a-z0-9]+', '', 'g')
       OR p.slug = trim(both '-' from regexp_replace(lower(source.name), '[^a-z0-9]+', '-', 'g'))
    ORDER BY CASE WHEN lower(btrim(p.name)) = lower(source.name) THEN 0 ELSE 1 END, p.created_at
    LIMIT 1
  ) product ON true
),
inserted AS (
  INSERT INTO product_categories (product_id, category_id)
  SELECT matched_products.id, categories.id
  FROM matched_products
  JOIN categories ON categories.slug = matched_products.category_slug
  ON CONFLICT DO NOTHING
  RETURNING product_id
)
SELECT count(*) AS new_relationships_inserted FROM inserted;

