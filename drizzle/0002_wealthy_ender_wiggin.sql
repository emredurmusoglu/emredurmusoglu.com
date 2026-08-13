CREATE TYPE "public"."etsy_entry_kind" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "etsy_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" "etsy_entry_kind" DEFAULT 'expense' NOT NULL,
	"name" varchar(80) NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "etsy_categories_kind_name_key" UNIQUE("kind","name")
);
--> statement-breakpoint
CREATE TABLE "etsy_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" "etsy_entry_kind" NOT NULL,
	"category_id" integer,
	"amount" numeric(12, 2) NOT NULL,
	"note" varchar(300),
	"occurred_on" date NOT NULL,
	"created_by" varchar(40) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "etsy_entries" ADD CONSTRAINT "etsy_entries_category_id_etsy_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."etsy_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "etsy_entries_occurred_idx" ON "etsy_entries" USING btree ("occurred_on");--> statement-breakpoint
CREATE INDEX "etsy_entries_kind_idx" ON "etsy_entries" USING btree ("kind","occurred_on");--> statement-breakpoint
INSERT INTO "etsy_categories" ("kind", "name", "sort") VALUES
	('expense', 'Etsy komisyon', 10),
	('expense', 'Reklam', 20),
	('expense', 'Kargo', 30),
	('expense', 'Malzeme', 40),
	('expense', 'Ambalaj', 50),
	('expense', 'Üretim', 60),
	('expense', 'Yazılım / abonelik', 70),
	('expense', 'İade', 80),
	('expense', 'Vergi', 90),
	('expense', 'Diğer', 999),
	('income', 'Etsy satış', 10),
	('income', 'Diğer', 999)
ON CONFLICT DO NOTHING;