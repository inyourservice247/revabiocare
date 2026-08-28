-- Source-faithful, idempotent Phytochemicals & Herbal Extracts catalogue import.
-- Reuses the existing category and preserves all existing products and relationships.
WITH raw_source AS (
  SELECT btrim(value) AS name, ordinal::integer
  FROM regexp_split_to_table($phytochemicals$
ASHWAGANDHA
BOSWELLIA SERRATA
HOLI BASIL
ANDROGRAPHIS PANICULATA
CALCIUM SENNOSIDE 10%
CALCIUM SENNOSIDE 60%
IVY LEAF
ASPARAGUS RACEMOSUS
COLCHICINE
MORINGA OLEIFERA
AZADIRACHTA INDICA SEED
CURCUMIN 95%
OCIMUM SANCTUM
BACOPA MONNIERI ROOT
GARCINIA COMBOGIA
PAPAYA LEAF
BANABA EXTRACT
GARCINIA MANGOSTANA
QUININE HCL
BELLADONNA EXTRACT
GLUCOSAMINE
QUININE SULPHATE
BERBERINE HYDROCHLORIDE
GYMNEMA SYLVESTRE
$phytochemicals$, E'\\r?\\n') WITH ORDINALITY AS rows(value, ordinal)
  WHERE btrim(value) <> ''
),
matched AS (
  SELECT raw_source.name, product.id
  FROM raw_source
  JOIN LATERAL (
    SELECT p.id
    FROM products p
    WHERE regexp_replace(lower(btrim(p.name)), '[^a-z0-9]+', '', 'g')
          = regexp_replace(lower(raw_source.name), '[^a-z0-9]+', '', 'g')
       OR p.slug = trim(both '-' from regexp_replace(lower(raw_source.name), '[^a-z0-9]+', '-', 'g'))
    ORDER BY CASE WHEN lower(btrim(p.name)) = lower(raw_source.name) THEN 0 ELSE 1 END, p.created_at
    LIMIT 1
  ) product ON true
),
inserted AS (
  INSERT INTO products (
    name, slug, category, grade, cas_number, overview, applications,
    documentation, featured, active, sort_order
  )
  SELECT raw_source.name,
         trim(both '-' from regexp_replace(lower(raw_source.name), '[^a-z0-9]+', '-', 'g')),
         categories.name,
         '{}'::text[], NULL, '', '{}'::text[], '{}'::text[],
         false, true, current_max.value + raw_source.ordinal
  FROM raw_source
  JOIN categories ON categories.slug = 'phytochemicals-herbal-extracts'
  CROSS JOIN (SELECT COALESCE(max(sort_order), 0) AS value FROM products) current_max
  LEFT JOIN matched ON matched.name = raw_source.name
  WHERE matched.id IS NULL
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
)
SELECT count(*) AS new_products_inserted FROM inserted;

WITH raw_source AS (
  SELECT btrim(value) AS name
  FROM regexp_split_to_table($phytochemicals$
ASHWAGANDHA
BOSWELLIA SERRATA
HOLI BASIL
ANDROGRAPHIS PANICULATA
CALCIUM SENNOSIDE 10%
CALCIUM SENNOSIDE 60%
IVY LEAF
ASPARAGUS RACEMOSUS
COLCHICINE
MORINGA OLEIFERA
AZADIRACHTA INDICA SEED
CURCUMIN 95%
OCIMUM SANCTUM
BACOPA MONNIERI ROOT
GARCINIA COMBOGIA
PAPAYA LEAF
BANABA EXTRACT
GARCINIA MANGOSTANA
QUININE HCL
BELLADONNA EXTRACT
GLUCOSAMINE
QUININE SULPHATE
BERBERINE HYDROCHLORIDE
GYMNEMA SYLVESTRE
$phytochemicals$, E'\\r?\\n') AS rows(value)
  WHERE btrim(value) <> ''
),
matched_products AS (
  SELECT raw_source.name, product.id
  FROM raw_source
  JOIN LATERAL (
    SELECT p.id
    FROM products p
    WHERE regexp_replace(lower(btrim(p.name)), '[^a-z0-9]+', '', 'g')
          = regexp_replace(lower(raw_source.name), '[^a-z0-9]+', '', 'g')
       OR p.slug = trim(both '-' from regexp_replace(lower(raw_source.name), '[^a-z0-9]+', '-', 'g'))
    ORDER BY CASE WHEN lower(btrim(p.name)) = lower(raw_source.name) THEN 0 ELSE 1 END, p.created_at
    LIMIT 1
  ) product ON true
),
inserted AS (
  INSERT INTO product_categories (product_id, category_id)
  SELECT matched_products.id, categories.id
  FROM matched_products
  JOIN categories ON categories.slug = 'phytochemicals-herbal-extracts'
  ON CONFLICT DO NOTHING
  RETURNING product_id
)
SELECT count(*) AS new_relationships_inserted FROM inserted;
