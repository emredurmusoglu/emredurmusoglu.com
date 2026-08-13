import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
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
    /** Web adresi — mağazası olmayan ürünler için (ör. Davetiva) */
    url: varchar("url", { length: 500 }),
    iosUrl: varchar("ios_url", { length: 500 }),
    androidUrl: varchar("android_url", { length: 500 }),
    /**
     * Henüz yayında değil. Kart görünür ama tıklanmaz, "Yakında" rozeti çıkar.
     * `status` ile karıştırma: o iç takip için, bu kartın dışarıya nasıl
     * göründüğünü belirliyor.
     */
    comingSoon: boolean("coming_soon").notNull().default(false),
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

/* ---------------------------------------------------------------- etsy defteri */

export const etsyEntryKind = pgEnum("etsy_entry_kind", ["income", "expense"]);

export const etsyCategories = pgTable(
  "etsy_categories",
  {
    id: serial("id").primaryKey(),
    kind: etsyEntryKind("kind").notNull().default("expense"),
    name: varchar("name", { length: 80 }).notNull(),
    sort: integer("sort").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique("etsy_categories_kind_name_key").on(t.kind, t.name)],
);

export const etsyEntries = pgTable(
  "etsy_entries",
  {
    id: serial("id").primaryKey(),
    kind: etsyEntryKind("kind").notNull(),
    categoryId: integer("category_id").references(() => etsyCategories.id, {
      onDelete: "set null",
    }),
    /** Tutar ₺ cinsinden. numeric — kuruş yuvarlama hatası olmasın diye. */
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    note: varchar("note", { length: 300 }),
    /**
     * Kaydın ait olduğu gün. Saat/zaman dilimi taşımayan düz bir `date`:
     * ay filtresi böylece sunucunun saatinden bağımsız çalışıyor.
     */
    occurredOn: date("occurred_on", { mode: "string" }).notNull(),
    /** Girişi yapan kullanıcı adı (lib/auth/users.ts) */
    createdBy: varchar("created_by", { length: 40 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("etsy_entries_occurred_idx").on(t.occurredOn),
    index("etsy_entries_kind_idx").on(t.kind, t.occurredOn),
  ],
);

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type EtsyCategory = typeof etsyCategories.$inferSelect;
export type EtsyEntry = typeof etsyEntries.$inferSelect;
