CREATE TYPE "public"."kickbox_session_kind" AS ENUM('lesson', 'training');--> statement-breakpoint
ALTER TABLE "kickbox_lessons" ADD COLUMN "kind" "kickbox_session_kind" DEFAULT 'lesson' NOT NULL;