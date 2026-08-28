UPDATE categories
SET name = 'Human Active Pharmaceutical Ingredients',
    slug = 'human-active-pharmaceutical-ingredients',
    active = true,
    sort_order = 1,
    updated_at = now()
WHERE lower(name) = 'api' OR slug = 'api';

UPDATE categories
SET name = 'Excipients',
    slug = 'excipients',
    active = true,
    sort_order = 11,
    updated_at = now()
WHERE lower(name) = 'excipient' OR slug = 'excipient';

INSERT INTO categories (name, slug, active, sort_order)
VALUES
  ('Human Active Pharmaceutical Ingredients', 'human-active-pharmaceutical-ingredients', true, 1),
  ('Veterinary APIs', 'veterinary-apis', true, 2),
  ('Agro Chemicals', 'agro-chemicals', true, 3),
  ('Pellets', 'pellets', true, 4),
  ('DC Granules', 'dc-granules', true, 5),
  ('Preservatives', 'preservatives', true, 6),
  ('Enzymes', 'enzymes', true, 7),
  ('Phytochemicals & Herbal Extracts', 'phytochemicals-herbal-extracts', true, 8),
  ('Essential Oils', 'essential-oils', true, 9),
  ('Colours & Flavours', 'colours-flavours', true, 10),
  ('Excipients', 'excipients', true, 11)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  active = true,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- Retained legacy categories remain available for their existing assignments,
-- but sit after the authoritative catalogue sequence.
UPDATE categories
SET sort_order = CASE name
      WHEN 'Pharmaceutical Intermediate' THEN 1001
      WHEN 'Nutraceutical Ingredient' THEN 1002
    END,
    updated_at = now()
WHERE name IN ('Pharmaceutical Intermediate', 'Nutraceutical Ingredient');

UPDATE products p
SET category = c.name, updated_at = now()
FROM product_categories pc
JOIN categories c ON c.id = pc.category_id
WHERE p.id = pc.product_id
  AND c.slug IN ('human-active-pharmaceutical-ingredients', 'excipients');

DELETE FROM categories c
WHERE c.name IN ('Pharmaceutical Intermediate', 'Nutraceutical Ingredient')
  AND NOT EXISTS (SELECT 1 FROM product_categories pc WHERE pc.category_id = c.id);
