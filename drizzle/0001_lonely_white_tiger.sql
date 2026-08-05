ALTER TABLE "projects" ADD COLUMN "ios_url" varchar(500);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "android_url" varchar(500);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "coming_soon" boolean DEFAULT false NOT NULL;