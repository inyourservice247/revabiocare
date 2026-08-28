CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_categories (
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  PRIMARY KEY (product_id, category_id)
);

INSERT INTO categories (name, slug, active, sort_order)
SELECT category,
       trim(both '-' from regexp_replace(lower(category), '[^a-z0-9]+', '-', 'g')),
       true,
       row_number() OVER (ORDER BY min(sort_order), category)::integer
FROM products
GROUP BY category
ON CONFLICT DO NOTHING;

INSERT INTO product_categories (product_id, category_id)
SELECT products.id, categories.id
FROM products
JOIN categories ON categories.name = products.category
ON CONFLICT DO NOTHING;
