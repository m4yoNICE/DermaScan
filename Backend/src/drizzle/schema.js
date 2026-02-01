import {
  mysqlTable,
  int,
  text,
  date,
  datetime,
  varchar,
  double,
  unique,
  boolean,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const journals = mysqlTable("journals", {
  id: int().autoincrement().primaryKey().notNull(),
  journalText: text("journal_text").default("NULL"),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  // you can use { mode: 'date' }, if you want to have Date as type for this column
  journalDate: date("journal_date", { mode: "string" }).notNull(),
  createdAt: datetime("created_at", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime("updated_at", { mode: "string", fsp: 3 }).notNull(),
});

export const otp = mysqlTable("otp", {
  id: int().autoincrement().primaryKey().notNull(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  otpCode: varchar("otp_code", { length: 255 }).notNull(),
  isUsed: boolean("isUsed").notNull(),
  expiresAt: datetime({ mode: "string", fsp: 3 }).notNull(),
  createdAt: datetime("created_at", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const role = mysqlTable("role", {
  id: int().autoincrement().primaryKey().notNull(),
  roleName: varchar("role_name", { length: 255 }).notNull(),
  createdAt: datetime("created_at", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime("updated_at", { mode: "string", fsp: 3 }).notNull(),
});

export const skinAnalysisTransactions = mysqlTable(
  "skin_analysis_transactions",
  {
    id: int().autoincrement().primaryKey().notNull(),
    imageId: int("image_id").references(() => storedImages.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    status: varchar({ length: 255 }).notNull(),
    conditionId: int("condition_id")
      .notNull()
      .references(() => skinConditions.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    confidenceScores: double("confidence_scores").notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
);

export const skinCareProducts = mysqlTable("skin_care_products", {
  id: int().autoincrement().primaryKey().notNull(),
  productName: varchar("product_name", { length: 255 }).default("NULL"),
  productImage: varchar("product_image", { length: 255 }).default("NULL"),
  ingredient: varchar({ length: 255 }).default("NULL"),
  description: varchar({ length: 255 }).default("NULL"),
  productType: varchar("product_type", { length: 255 }).default("NULL"),
  locality: varchar({ length: 255 }).default("NULL"),
  skinType: varchar("skin_type", { length: 255 }).default("NULL"),
  dermaTested: boolean("derma_tested"),
  timeRoutine: varchar("time_routine", { length: 255 }).default("NULL"),
  createdAt: datetime("created_at", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime("updated_at", { mode: "string", fsp: 3 }).notNull(),
});

export const skinConditions = mysqlTable("skin_conditions", {
  id: int().autoincrement().primaryKey().notNull(),
  condition: varchar({ length: 255 }).default("NULL"),
  canRecommend: varchar("can_recommend", { length: 255 }).default("NULL"),
  createdAt: datetime("created_at", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime("updated_at", { mode: "string", fsp: 3 }).notNull(),
});

export const skinData = mysqlTable(
  "skin_data",
  {
    id: int().autoincrement().primaryKey().notNull(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    skinType: varchar("skin_type", { length: 255 }).default("NULL"),
    skinSensitivity: varchar("skin_sensitivity", { length: 255 }).default(
      "NULL",
    ),
    pigmentation: varchar({ length: 255 }).default("NULL"),
    aging: varchar({ length: 255 }).default("NULL"),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updated_at", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => [unique("Skin_data_user_id_key").on(table.userId)],
);

export const storedImages = mysqlTable("stored_images", {
  id: int().autoincrement().primaryKey().notNull(),
  photoUrl: varchar({ length: 255 }).notNull(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: datetime("created_at", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const users = mysqlTable(
  "users",
  {
    id: int().autoincrement().primaryKey().notNull(),
    firstName: varchar("first_name", { length: 255 }).default("NULL"),
    lastName: varchar("last_name", { length: 255 }).default("NULL"),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    roleId: int("role_id")
      .notNull()
      .references(() => role.id, { onDelete: "restrict", onUpdate: "cascade" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    birthdate: date({ mode: "string" }).default(sql`NULL`),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updated_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => [unique("users_email_key").on(table.email)],
);
