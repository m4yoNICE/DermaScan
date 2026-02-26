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
  foreignKey,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const journals = mysqlTable("journals", {
  id: int().autoincrement().primaryKey().notNull(),
  journalText: text("journal_text").default("NULL"),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  journalDate: date("journal_date", { mode: "string" }).notNull(),
  createdAt: datetime("created_at", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime("updated_at", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
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
  updatedAt: datetime("updated_at", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const role = mysqlTable("role", {
  id: int().autoincrement().primaryKey().notNull(),
  roleName: varchar("role_name", { length: 255 }).notNull(),
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
    conditionId: int("condition_id").references(() => skinConditions.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
    confidenceScores: double("confidence_scores"),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updated_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
);

export const skinCareProducts = mysqlTable("skin_care_products", {
  id: int().autoincrement().primaryKey().notNull(),
  productName: varchar("product_name", { length: 255 }).default("NULL"),
  productImage: varchar("product_image", { length: 255 }).default("NULL"),
  ingredient: varchar({ length: 255 }).default("NULL"),
  description: text("description").default("NULL"),
  productType: varchar("product_type", { length: 255 }).default("NULL"),
  locality: varchar({ length: 255 }).default("NULL"),
  skinType: varchar("skin_type", { length: 255 }).default("NULL"),
  dermaTested: boolean("derma_tested"),
  timeRoutine: varchar("time_routine", { length: 255 }).default("NULL"),
  createdAt: datetime("created_at", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime("updated_at", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const skinConditions = mysqlTable("skin_conditions", {
  id: int().autoincrement().primaryKey().notNull(),
  condition: varchar({ length: 255 }).notNull(),
  canRecommend: varchar("can_recommend", { length: 255 }).notNull(),
});

export const conditionProducts = mysqlTable("condition_products", {
  id: int().autoincrement().primaryKey().notNull(),
  conditionId: int("condition_id")
    .notNull()
    .references(() => skinConditions.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
      name: "cp_cond_fk",
    }),
  productId: int("product_id")
    .notNull()
    .references(() => skinCareProducts.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
      name: "cp_prod_fk",
    }),
  createdAt: datetime("created_at", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime("updated_at", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const productRecommendationsTransaction = mysqlTable(
  "product_recommendations_transaction",
  {
    id: int().autoincrement().primaryKey().notNull(),
    analysisId: int("analysis_id").notNull(),
    productId: int("product_id").notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: "prt_analysis_fk",
      columns: [table.analysisId],
      foreignColumns: [skinAnalysisTransactions.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    foreignKey({
      name: "prt_prod_fk",
      columns: [table.productId],
      foreignColumns: [skinCareProducts.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);

export const skinData = mysqlTable(
  "skin_data",
  {
    id: int().autoincrement().primaryKey().notNull(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    skinType: varchar("skin_type", { length: 255 }),
    skinSensitivity: varchar("skin_sensitivity", { length: 255 }),
    pigmentation: varchar({ length: 255 }),
    aging: varchar({ length: 255 }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updated_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
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
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    roleId: int("role_id").notNull(),
    birthdate: date({ mode: "string" }).default(sql`NULL`),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updated_at", { mode: "string", fsp: 3 }),
  },
  (table) => [unique("users_email_key").on(table.email)],
);

export const routineNotifications = mysqlTable(
  "routine_notifications",
  {
    id: int().autoincrement().primaryKey().notNull(),
    userId: int("user_id").notNull(),
    recommendationId: int("recommendation_id").notNull(),
    productId: int("product_id").notNull(),
    schedule: datetime("schedule", { mode: "string", fsp: 3 }).notNull(),
    isNotified: boolean("is_notified").notNull().default(false),
    isCompleted: boolean("is_completed").notNull().default(false),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => [
    foreignKey({
      name: "rn_user_fk",
      columns: [table.userId],
      foreignColumns: [users.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    foreignKey({
      name: "rn_rec_fk",
      columns: [table.recommendationId],
      foreignColumns: [productRecommendationsTransaction.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    foreignKey({
      name: "rn_prod_fk",
      columns: [table.productId],
      foreignColumns: [skinCareProducts.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);
