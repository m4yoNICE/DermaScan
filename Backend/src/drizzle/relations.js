import { relations } from "drizzle-orm/relations";
import {
  users,
  journals,
  otp,
  skinConditions,
  skinAnalysisTransactions,
  storedImages,
  skinData,
  role,
  productRecommendationsTransaction,
  skinCareProducts,
  conditionProducts,
  routineNotifications,
} from "./schema.js";

export const journalsRelations = relations(journals, ({ one }) => ({
  user: one(users, {
    fields: [journals.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  journals: many(journals),
  otps: many(otp),
  skinAnalysisTransactions: many(skinAnalysisTransactions),
  skinData: many(skinData),
  storedImages: many(storedImages),
  routineNotifications: many(routineNotifications),
  role: one(role, {
    fields: [users.roleId],
    references: [role.id],
  }),
}));

export const otpRelations = relations(otp, ({ one }) => ({
  user: one(users, {
    fields: [otp.userId],
    references: [users.id],
  }),
}));

export const skinAnalysisTransactionsRelations = relations(
  skinAnalysisTransactions,
  ({ one, many }) => ({
    skinCondition: one(skinConditions, {
      fields: [skinAnalysisTransactions.conditionId],
      references: [skinConditions.id],
    }),
    storedImage: one(storedImages, {
      fields: [skinAnalysisTransactions.imageId],
      references: [storedImages.id],
    }),
    user: one(users, {
      fields: [skinAnalysisTransactions.userId],
      references: [users.id],
    }),
    recommendations: many(productRecommendationsTransaction),
  }),
);

export const skinConditionsRelations = relations(
  skinConditions,
  ({ many }) => ({
    skinAnalysisTransactions: many(skinAnalysisTransactions),
    conditionProducts: many(conditionProducts),
  }),
);

export const storedImagesRelations = relations(
  storedImages,
  ({ one, many }) => ({
    skinAnalysisTransactions: many(skinAnalysisTransactions),
    user: one(users, {
      fields: [storedImages.userId],
      references: [users.id],
    }),
  }),
);

export const skinDataRelations = relations(skinData, ({ one }) => ({
  user: one(users, {
    fields: [skinData.userId],
    references: [users.id],
  }),
}));

export const roleRelations = relations(role, ({ many }) => ({
  users: many(users),
}));

export const skinCareProductsRelations = relations(
  skinCareProducts,
  ({ many }) => ({
    conditionProducts: many(conditionProducts),
    recommendations: many(productRecommendationsTransaction),
    routineNotifications: many(routineNotifications),
  }),
);

export const productRecommendationsTransactionRelations = relations(
  productRecommendationsTransaction,
  ({ one, many }) => ({
    analysis: one(skinAnalysisTransactions, {
      fields: [productRecommendationsTransaction.analysisId],
      references: [skinAnalysisTransactions.id],
    }),
    product: one(skinCareProducts, {
      fields: [productRecommendationsTransaction.productId],
      references: [skinCareProducts.id],
    }),
    routineNotifications: many(routineNotifications),
  }),
);

export const routineNotificationsRelations = relations(
  routineNotifications,
  ({ one }) => ({
    user: one(users, {
      fields: [routineNotifications.userId],
      references: [users.id],
    }),
    recommendation: one(productRecommendationsTransaction, {
      fields: [routineNotifications.recommendationId],
      references: [productRecommendationsTransaction.id],
    }),
    product: one(skinCareProducts, {
      fields: [routineNotifications.productId],
      references: [skinCareProducts.id],
    }),
  }),
);
