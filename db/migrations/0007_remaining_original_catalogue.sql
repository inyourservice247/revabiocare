-- Source-faithful, idempotent remaining original catalogue import.
-- Phytochemicals is intentionally excluded: 23 supplied names do not meet its required count of 24.
WITH raw_source AS (
  SELECT btrim(value) AS value, ordinal
  FROM regexp_split_to_table($catalogue$
preservatives|BHT
preservatives|METHYL PARABEN
preservatives|SODIUM BENZOATE
preservatives|BHA
preservatives|PROPYL PARABEN
preservatives|TBHQ
preservatives|BENZOIC ACID
preservatives|METHYL SODIUM PARABEN
preservatives|GUAICOL
preservatives|PROPYL SODIUM PARABEN
enzymes|BROMELAIN
enzymes|COENZYME Q10
enzymes|PAPAIN
enzymes|BACTERIAL ALPHA AMYLASE
enzymes|PECTINASE
essential-oils|EUCALYPTUS OIL
essential-oils|MENTHOL
essential-oils|TURPENTINE ESSENTIAL OIL
essential-oils|JASMINE ESSENTIAL OIL
essential-oils|NIAOULI OIL
essential-oils|LAVANDULA ESSENTIAL OIL
essential-oils|ROSEMARY ESSENTIAL OIL
colours-flavours|BASIC RHODAMINE B COLOUR
colours-flavours|CARMOISINE
colours-flavours|QUINOLINE YELLOW
colours-flavours|PONCEAU 4R SUPRA
colours-flavours|APPLE GREEN
colours-flavours|TARTRAZINE SUPRA
colours-flavours|BRILLIANT BLUE
excipients|BENZALKONIUM CHLORIDE
excipients|CALCIUM CHLORIDE
excipients|CALCIUM CITRATE
excipients|DIMETHICONE
excipients|DRIED ALUMINIUM HYDROXIDE GEL
excipients|DRIED FERROUS SULPHATE
excipients|FERRIC PHYROPHOSPHATE
excipients|FERROUS FUMARATE
excipients|FERROUS GLUCONATE
excipients|GUAR GUM
excipients|MAGALDRATE
excipients|MAGNESIUM CARBONATE LIGHT/HEAVY
excipients|MAGNESIUM CHLORIDE
excipients|MAGNESIUM CITRATE
excipients|CASTOR OIL
excipients|MAGNESIUM HYDROXIDE
excipients|MAGNESIUM STEARATE
excipients|MAGNESIUM SULPHATE
excipients|MAGNESIUM TRISILICATE
excipients|METHYL PARABEN
excipients|METHYL PARABEN SODIUM
excipients|MICROCRYSTALLINE CELLULOSE
excipients|POLYSORBATE
excipients|POTASSIUM CHLORIDE
excipients|POTASSIUM CITRATE
excipients|PROPYL PARABEN
excipients|PROPYL PARABEN SODIUM
excipients|PROPYLENE GLYCOL
excipients|PSYLLIUM HUSK
excipients|SIMETHICONE
excipients|SIMETHICONE EMULSION
excipients|SODIUM CHLORIDE
excipients|SODIUM CITRATE
excipients|SODIUM STEARYL FUMARATE
excipients|SODIUM STRACH GLYCOLATE
excipients|TALC
excipients|ZINC CITRATE
excipients|ZINC OXIDE
excipients|ZINC STEARATE
excipients|ZINC SULPHATE MONOHYDRATE
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
preservatives|BHT
preservatives|METHYL PARABEN
preservatives|SODIUM BENZOATE
preservatives|BHA
preservatives|PROPYL PARABEN
preservatives|TBHQ
preservatives|BENZOIC ACID
preservatives|METHYL SODIUM PARABEN
preservatives|GUAICOL
preservatives|PROPYL SODIUM PARABEN
enzymes|BROMELAIN
enzymes|COENZYME Q10
enzymes|PAPAIN
enzymes|BACTERIAL ALPHA AMYLASE
enzymes|PECTINASE
essential-oils|EUCALYPTUS OIL
essential-oils|MENTHOL
essential-oils|TURPENTINE ESSENTIAL OIL
essential-oils|JASMINE ESSENTIAL OIL
essential-oils|NIAOULI OIL
essential-oils|LAVANDULA ESSENTIAL OIL
essential-oils|ROSEMARY ESSENTIAL OIL
colours-flavours|BASIC RHODAMINE B COLOUR
colours-flavours|CARMOISINE
colours-flavours|QUINOLINE YELLOW
colours-flavours|PONCEAU 4R SUPRA
colours-flavours|APPLE GREEN
colours-flavours|TARTRAZINE SUPRA
colours-flavours|BRILLIANT BLUE
excipients|BENZALKONIUM CHLORIDE
excipients|CALCIUM CHLORIDE
excipients|CALCIUM CITRATE
excipients|DIMETHICONE
excipients|DRIED ALUMINIUM HYDROXIDE GEL
excipients|DRIED FERROUS SULPHATE
excipients|FERRIC PHYROPHOSPHATE
excipients|FERROUS FUMARATE
excipients|FERROUS GLUCONATE
excipients|GUAR GUM
excipients|MAGALDRATE
excipients|MAGNESIUM CARBONATE LIGHT/HEAVY
excipients|MAGNESIUM CHLORIDE
excipients|MAGNESIUM CITRATE
excipients|CASTOR OIL
excipients|MAGNESIUM HYDROXIDE
excipients|MAGNESIUM STEARATE
excipients|MAGNESIUM SULPHATE
excipients|MAGNESIUM TRISILICATE
excipients|METHYL PARABEN
excipients|METHYL PARABEN SODIUM
excipients|MICROCRYSTALLINE CELLULOSE
excipients|POLYSORBATE
excipients|POTASSIUM CHLORIDE
excipients|POTASSIUM CITRATE
excipients|PROPYL PARABEN
excipients|PROPYL PARABEN SODIUM
excipients|PROPYLENE GLYCOL
excipients|PSYLLIUM HUSK
excipients|SIMETHICONE
excipients|SIMETHICONE EMULSION
excipients|SODIUM CHLORIDE
excipients|SODIUM CITRATE
excipients|SODIUM STEARYL FUMARATE
excipients|SODIUM STRACH GLYCOLATE
excipients|TALC
excipients|ZINC CITRATE
excipients|ZINC OXIDE
excipients|ZINC STEARATE
excipients|ZINC SULPHATE MONOHYDRATE
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

