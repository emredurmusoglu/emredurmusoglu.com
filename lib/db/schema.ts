import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const projectStatus = pgEnum("project_status", [
  "idea",
  "active",
  "paused",
  "shipped",
]);

export const taskStatus = pgEnum("task_status", ["todo", "doing", "done"]);

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 80 }).notNull().unique(),
    title: varchar("title", { length: 160 }).notNull(),
    description: text("description"),
    status: projectStatus("status").notNull().default("idea"),
    /** Public sitede kartın alt çizgisi için tailwind gradient sınıfı */
    accent: varchar("accent", { length: 120 }),
    /** Public sitede kartta gösterilecek ikon (public/ altındaki yol) */
    iconUrl: varchar("icon_url", { length: 255 }),
    url: varchar("url", { length: 500 }),
    /** Ana sayfada görünsün mü */
    isPublic: boolean("is_public").notNull().default(false),
    sort: integer("sort").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("projects_public_sort_idx").on(t.isPublic, t.sort)],
);

export const tasks = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    title: varchar("title", { length: 300 }).notNull(),
    note: text("note"),
    status: taskStatus("status").notNull().default("todo"),
    /** 0 = normal, 1 = önemli, 2 = acil */
    priority: integer("priority").notNull().default(0),
    dueDate: timestamp("due_date", { withTimezone: true }),
    doneAt: timestamp("done_at", { withTimezone: true }),
    sort: integer("sort").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("tasks_status_idx").on(t.status, t.sort),
    index("tasks_project_idx").on(t.projectId),
  ],
);

export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    title: varchar("title", { length: 300 }).notNull(),
    /** Blog listesinde görünen özet; boşsa içerikten türetilir */
    excerpt: text("excerpt"),
    content: text("content").notNull().default(""),
    tags: text("tags").array().notNull().default([]),
    isPublic: boolean("is_public").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("notes_public_published_idx").on(t.isPublic, t.publishedAt),
    index("notes_project_idx").on(t.projectId),
  ],
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
