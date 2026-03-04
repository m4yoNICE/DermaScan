import { relations } from "drizzle-orm/relations";
import {
  users,
  journals,
  otp,
  skinConditions,
  skinAnalysis,
  storedImages,
  role,
  skinProfile,
  productRecommendations,
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
  skinAnalysis: many(skinAnalysis),
  skinProfile: many(skinProfile),
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

export const skinAnalysisRelations = relations(
  skinAnalysis,
  ({ one, many }) => ({
    skinCondition: one(skinConditions, {
      fields: [skinAnalysis.conditionId],
      references: [skinConditions.id],
    }),
    storedImage: one(storedImages, {
      fields: [skinAnalysis.imageId],
      references: [storedImages.id],
    }),
    user: one(users, {
      fields: [skinAnalysis.userId],
      references: [users.id],
    }),
    recommendations: many(productRecommendations),
  }),
);

export const skinConditionsRelations = relations(
  skinConditions,
  ({ many }) => ({
    skinAnalysis: many(skinAnalysis),
    conditionProducts: many(conditionProducts),
  }),
);

export const storedImagesRelations = relations(
  storedImages,
  ({ one, many }) => ({
    skinAnalysis: many(skinAnalysis),
    user: one(users, {
      fields: [storedImages.userId],
      references: [users.id],
    }),
  }),
);

export const skinProfileRelations = relations(skinProfile, ({ one }) => ({
  user: one(users, {
    fields: [skinProfile.userId],
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
    recommendations: many(productRecommendations),
    routineNotifications: many(routineNotifications),
  }),
);

export const productRecommendationsRelations = relations(
  productRecommendations,
  ({ one, many }) => ({
    analysis: one(skinAnalysis, {
      fields: [productRecommendations.analysisId],
      references: [skinAnalysis.id],
    }),
    product: one(skinCareProducts, {
      fields: [productRecommendations.productId],
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
    recommendation: one(productRecommendations, {
      fields: [routineNotifications.recommendationId],
      references: [productRecommendations.id],
    }),
    product: one(skinCareProducts, {
      fields: [routineNotifications.productId],
      references: [skinCareProducts.id],
    }),
  }),
);
