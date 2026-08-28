-- Remove only verified-empty legacy categories left by the original sample catalogue.
-- The relationship guard makes this cleanup idempotent and prevents product impact.
WITH deleted AS (
  DELETE FROM categories AS category
  WHERE category.slug IN ('pharmaceutical-intermediate', 'nutraceutical-ingredient')
    AND NOT EXISTS (
      SELECT 1
      FROM product_categories relationship
      WHERE relationship.category_id = category.id
    )
    AND NOT EXISTS (
      SELECT 1
      FROM products product
      WHERE product.category = category.name
    )
  RETURNING category.slug
)
SELECT count(*) AS legacy_categories_removed FROM deleted;
