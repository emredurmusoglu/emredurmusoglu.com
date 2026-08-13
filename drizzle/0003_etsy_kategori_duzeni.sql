-- Kullanılmayan gider kategorileri çıkarıldı, işin gerçek kalemleri eklendi.
-- Kategori silinince kayıtlar durur, category_id'leri NULL olur (ON DELETE SET NULL).
DELETE FROM "etsy_categories"
WHERE "kind" = 'expense'
  AND "name" IN ('Etsy komisyon', 'Reklam', 'Yazılım / abonelik');
--> statement-breakpoint
INSERT INTO "etsy_categories" ("kind", "name", "sort") VALUES
	('expense', 'Kurye', 15),
	('expense', 'Çikolata', 25),
	('expense', 'Baskı (Tag, peçete vs.)', 35)
ON CONFLICT DO NOTHING;
