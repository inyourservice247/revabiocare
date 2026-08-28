-- Source-faithful, idempotent Nutraceutical Ingredients Portfolio import.
-- The separate unresolved 24-product original phytochemical source is intentionally untouched.
WITH category_source(name, slug, ordinal) AS (
  VALUES
    ('Specialty Ingredients', 'specialty-ingredients', 1),
    ('Vitamins & Coenzymes', 'vitamins-coenzymes', 2),
    ('Amino Acids & Protein Derivatives', 'amino-acids-protein-derivatives', 3),
    ('Joint, Skin & Bone Health', 'joint-skin-bone-health', 4),
    ('Digestive & Urinary Health Ingredients', 'digestive-urinary-health-ingredients', 5),
    ('Sweeteners (Food & Beverage Applications)', 'sweeteners-food-beverage-applications', 6),
    ('Antioxidants & Specialty Nutraceuticals', 'antioxidants-specialty-nutraceuticals', 7),
    ('Sports Nutrition Ingredients', 'sports-nutrition-ingredients', 8),
    ('Eye Health Ingredients', 'eye-health-ingredients', 9),
    ('Excipients & Functional Ingredients', 'excipients-functional-ingredients', 10),
    ('Omega & Specialty Lipids', 'omega-specialty-lipids', 11)
),
inserted AS (
  INSERT INTO categories (name, slug, active, sort_order)
  SELECT category_source.name,
         category_source.slug,
         true,
         current_max.value + category_source.ordinal
  FROM category_source
  CROSS JOIN (SELECT COALESCE(max(sort_order), 0) AS value FROM categories) current_max
  WHERE NOT EXISTS (
    SELECT 1
    FROM categories existing
    WHERE regexp_replace(lower(btrim(existing.name)), '[^a-z0-9]+', '', 'g')
          = regexp_replace(lower(category_source.name), '[^a-z0-9]+', '', 'g')
       OR existing.slug = category_source.slug
  )
  ON CONFLICT DO NOTHING
  RETURNING id
)
SELECT count(*) AS new_categories_inserted FROM inserted;

WITH raw_source AS (
  SELECT btrim(value) AS value, ordinal
  FROM regexp_split_to_table($nutraceutical$
specialty-ingredients|Sodium Hyaluronate
specialty-ingredients|Alpha Lipoic Acid
specialty-ingredients|5-HTP (5-Hydroxytryptophan)
specialty-ingredients|NMN (Beta-Nicotinamide Mononucleotide)
specialty-ingredients|NAD (Nicotinamide Adenine Dinucleotide)
specialty-ingredients|Alpha GPC
specialty-ingredients|Melatonin
specialty-ingredients|Berberine Extract 97%
vitamins-coenzymes|Vitamin A Acetate 500 CWS
vitamins-coenzymes|Vitamin B6
vitamins-coenzymes|Pyridoxal 5 Phosphate
vitamins-coenzymes|Vitamin D2
vitamins-coenzymes|Vitamin K1
vitamins-coenzymes|Calcium D-Pantothenate (Vitamin B5)
amino-acids-protein-derivatives|L-Arginine Base
amino-acids-protein-derivatives|L-Arginine HCL
amino-acids-protein-derivatives|L-Tyrosine
amino-acids-protein-derivatives|L-Citrulline DL Malate 2:1
amino-acids-protein-derivatives|L-Citrulline Base
amino-acids-protein-derivatives|L-Cysteine (Base / HCL Mono)
amino-acids-protein-derivatives|L-Leucine
amino-acids-protein-derivatives|L-Isoleucine
amino-acids-protein-derivatives|L-Valine
amino-acids-protein-derivatives|L-Phenylalanine
amino-acids-protein-derivatives|L-Tryptophan
amino-acids-protein-derivatives|L-Proline
amino-acids-protein-derivatives|L-Histidine HCL Mono
amino-acids-protein-derivatives|L-Theanine
amino-acids-protein-derivatives|L-Glutamine
amino-acids-protein-derivatives|Beta-Alanine
amino-acids-protein-derivatives|N-Acetyl L-Cysteine (NAC)
phytochemicals-herbal-extracts|Quercetin (Sophora japonica extract)
phytochemicals-herbal-extracts|Resveratrol
phytochemicals-herbal-extracts|Trans Resveratrol
phytochemicals-herbal-extracts|Resveratrol 50%
phytochemicals-herbal-extracts|Ginseng Extract 20% HPLC
phytochemicals-herbal-extracts|Ginkgo Biloba Extract 24%
phytochemicals-herbal-extracts|Silymarin (70% / 80%)
phytochemicals-herbal-extracts|Grape Seed Extract OPC 95%
phytochemicals-herbal-extracts|Troxerutin
phytochemicals-herbal-extracts|Rutin
joint-skin-bone-health|Glucosamine HCL / Sulphate
joint-skin-bone-health|Chondroitin Sulphate
joint-skin-bone-health|MSM (Methyl Sulfonyl Methane)
digestive-urinary-health-ingredients|D-Mannose
sweeteners-food-beverage-applications|Stevia Rebaudioside A 98%
sweeteners-food-beverage-applications|Mannitol IP/BP/USP
sweeteners-food-beverage-applications|Xylitol
antioxidants-specialty-nutraceuticals|Alpha Lipoic Acid
antioxidants-specialty-nutraceuticals|Astaxanthin 10%
antioxidants-specialty-nutraceuticals|Glutathione (Reduced – Fermented / Enzymatic)
antioxidants-specialty-nutraceuticals|D-Chiro Inositol
sports-nutrition-ingredients|L-Carnitine Base
sports-nutrition-ingredients|BCAAs (Leucine, Isoleucine, Valine)
eye-health-ingredients|Lutein 10% / Lutein Ester
eye-health-ingredients|Zeaxanthin 10%
eye-health-ingredients|Beta Carotene (Powder / Liquid)
excipients-functional-ingredients|HPC LH 11
excipients-functional-ingredients|HPC LH 21
excipients-functional-ingredients|Sorbitol Powder USP
excipients-functional-ingredients|D Xylose
excipients-functional-ingredients|Fumed Silica USP/EP
excipients-functional-ingredients|Hydroxypropyl Betadex (Cyclodextrin)
omega-specialty-lipids|Veg DHA 10%
$nutraceutical$, E'\\r?\\n') WITH ORDINALITY AS rows(value, ordinal)
  WHERE btrim(value) <> ''
),
source_relationships AS (
  SELECT split_part(value, '|', 1) AS category_slug,
         split_part(value, '|', 2) AS name,
         ordinal::integer
  FROM raw_source
),
global_products AS (
  SELECT DISTINCT ON (regexp_replace(lower(name), '[^a-z0-9]+', '', 'g'))
         name,
         regexp_replace(lower(name), '[^a-z0-9]+', '', 'g') AS normalized_name,
         min(ordinal) OVER (PARTITION BY regexp_replace(lower(name), '[^a-z0-9]+', '', 'g'))::integer AS ordinal,
         first_value(category_slug) OVER (
           PARTITION BY regexp_replace(lower(name), '[^a-z0-9]+', '', 'g')
           ORDER BY ordinal
         ) AS primary_category_slug
  FROM source_relationships
  ORDER BY regexp_replace(lower(name), '[^a-z0-9]+', '', 'g'), ordinal
),
matched AS (
  SELECT global_products.normalized_name, product.id
  FROM global_products
  JOIN LATERAL (
    SELECT p.id
    FROM products p
    WHERE regexp_replace(lower(btrim(p.name)), '[^a-z0-9]+', '', 'g') = global_products.normalized_name
       OR p.slug = trim(both '-' from regexp_replace(lower(global_products.name), '[^a-z0-9]+', '-', 'g'))
    ORDER BY CASE WHEN lower(btrim(p.name)) = lower(global_products.name) THEN 0 ELSE 1 END, p.created_at
    LIMIT 1
  ) product ON true
),
inserted AS (
  INSERT INTO products (
    name, slug, category, grade, cas_number, overview, applications,
    documentation, featured, active, sort_order
  )
  SELECT global_products.name,
         trim(both '-' from regexp_replace(lower(global_products.name), '[^a-z0-9]+', '-', 'g')),
         categories.name,
         '{}'::text[], NULL, '', '{}'::text[], '{}'::text[],
         false, true, current_max.value + global_products.ordinal
  FROM global_products
  JOIN categories ON categories.slug = global_products.primary_category_slug
  CROSS JOIN (SELECT COALESCE(max(sort_order), 0) AS value FROM products) current_max
  LEFT JOIN matched ON matched.normalized_name = global_products.normalized_name
  WHERE matched.id IS NULL
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
)
SELECT count(*) AS new_products_inserted FROM inserted;

WITH raw_source AS (
  SELECT btrim(value) AS value
  FROM regexp_split_to_table($nutraceutical$
specialty-ingredients|Sodium Hyaluronate
specialty-ingredients|Alpha Lipoic Acid
specialty-ingredients|5-HTP (5-Hydroxytryptophan)
specialty-ingredients|NMN (Beta-Nicotinamide Mononucleotide)
specialty-ingredients|NAD (Nicotinamide Adenine Dinucleotide)
specialty-ingredients|Alpha GPC
specialty-ingredients|Melatonin
specialty-ingredients|Berberine Extract 97%
vitamins-coenzymes|Vitamin A Acetate 500 CWS
vitamins-coenzymes|Vitamin B6
vitamins-coenzymes|Pyridoxal 5 Phosphate
vitamins-coenzymes|Vitamin D2
vitamins-coenzymes|Vitamin K1
vitamins-coenzymes|Calcium D-Pantothenate (Vitamin B5)
amino-acids-protein-derivatives|L-Arginine Base
amino-acids-protein-derivatives|L-Arginine HCL
amino-acids-protein-derivatives|L-Tyrosine
amino-acids-protein-derivatives|L-Citrulline DL Malate 2:1
amino-acids-protein-derivatives|L-Citrulline Base
amino-acids-protein-derivatives|L-Cysteine (Base / HCL Mono)
amino-acids-protein-derivatives|L-Leucine
amino-acids-protein-derivatives|L-Isoleucine
amino-acids-protein-derivatives|L-Valine
amino-acids-protein-derivatives|L-Phenylalanine
amino-acids-protein-derivatives|L-Tryptophan
amino-acids-protein-derivatives|L-Proline
amino-acids-protein-derivatives|L-Histidine HCL Mono
amino-acids-protein-derivatives|L-Theanine
amino-acids-protein-derivatives|L-Glutamine
amino-acids-protein-derivatives|Beta-Alanine
amino-acids-protein-derivatives|N-Acetyl L-Cysteine (NAC)
phytochemicals-herbal-extracts|Quercetin (Sophora japonica extract)
phytochemicals-herbal-extracts|Resveratrol
phytochemicals-herbal-extracts|Trans Resveratrol
phytochemicals-herbal-extracts|Resveratrol 50%
phytochemicals-herbal-extracts|Ginseng Extract 20% HPLC
phytochemicals-herbal-extracts|Ginkgo Biloba Extract 24%
phytochemicals-herbal-extracts|Silymarin (70% / 80%)
phytochemicals-herbal-extracts|Grape Seed Extract OPC 95%
phytochemicals-herbal-extracts|Troxerutin
phytochemicals-herbal-extracts|Rutin
joint-skin-bone-health|Glucosamine HCL / Sulphate
joint-skin-bone-health|Chondroitin Sulphate
joint-skin-bone-health|MSM (Methyl Sulfonyl Methane)
digestive-urinary-health-ingredients|D-Mannose
sweeteners-food-beverage-applications|Stevia Rebaudioside A 98%
sweeteners-food-beverage-applications|Mannitol IP/BP/USP
sweeteners-food-beverage-applications|Xylitol
antioxidants-specialty-nutraceuticals|Alpha Lipoic Acid
antioxidants-specialty-nutraceuticals|Astaxanthin 10%
antioxidants-specialty-nutraceuticals|Glutathione (Reduced – Fermented / Enzymatic)
antioxidants-specialty-nutraceuticals|D-Chiro Inositol
sports-nutrition-ingredients|L-Carnitine Base
sports-nutrition-ingredients|BCAAs (Leucine, Isoleucine, Valine)
eye-health-ingredients|Lutein 10% / Lutein Ester
eye-health-ingredients|Zeaxanthin 10%
eye-health-ingredients|Beta Carotene (Powder / Liquid)
excipients-functional-ingredients|HPC LH 11
excipients-functional-ingredients|HPC LH 21
excipients-functional-ingredients|Sorbitol Powder USP
excipients-functional-ingredients|D Xylose
excipients-functional-ingredients|Fumed Silica USP/EP
excipients-functional-ingredients|Hydroxypropyl Betadex (Cyclodextrin)
omega-specialty-lipids|Veg DHA 10%
$nutraceutical$, E'\\r?\\n') AS rows(value)
  WHERE btrim(value) <> ''
),
source_relationships AS (
  SELECT split_part(value, '|', 1) AS category_slug,
         split_part(value, '|', 2) AS name
  FROM raw_source
),
matched_products AS (
  SELECT source_relationships.category_slug, source_relationships.name, product.id
  FROM source_relationships
  JOIN LATERAL (
    SELECT p.id
    FROM products p
    WHERE regexp_replace(lower(btrim(p.name)), '[^a-z0-9]+', '', 'g')
          = regexp_replace(lower(source_relationships.name), '[^a-z0-9]+', '', 'g')
       OR p.slug = trim(both '-' from regexp_replace(lower(source_relationships.name), '[^a-z0-9]+', '-', 'g'))
    ORDER BY CASE WHEN lower(btrim(p.name)) = lower(source_relationships.name) THEN 0 ELSE 1 END, p.created_at
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
