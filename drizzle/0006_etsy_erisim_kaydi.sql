CREATE TYPE "public"."etsy_access_event" AS ENUM('login', 'visit');--> statement-breakpoint
CREATE TABLE "etsy_access_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(40) NOT NULL,
	"event" "etsy_access_event" DEFAULT 'visit' NOT NULL,
	"path" varchar(200),
	"device" varchar(80),
	"ip" varchar(60),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "etsy_access_log_created_idx" ON "etsy_access_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "etsy_access_log_user_idx" ON "etsy_access_log" USING btree ("username","created_at");