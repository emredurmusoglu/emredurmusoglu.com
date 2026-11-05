CREATE TABLE "kickbox_lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"note" varchar(200),
	"done_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "kickbox_lessons_starts_idx" ON "kickbox_lessons" USING btree ("starts_at");