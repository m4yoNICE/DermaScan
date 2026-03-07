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
  routineLogs,
  userRoutine,
  ingredients,
  conditionIngredients,
  productIngredients,
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
  routineLogs: many(routineLogs),
  userRoutine: one(userRoutine, {
    fields: [users.id],
    references: [userRoutine.userId],
  }),
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
    routineNotifications: many(routineNotifications),
  }),
);

export const skinConditionsRelations = relations(
  skinConditions,
  ({ many }) => ({
    skinAnalysis: many(skinAnalysis),
    conditionProducts: many(conditionProducts),
    conditionIngredients: many(conditionIngredients),
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
    productIngredients: many(productIngredients),
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
  ({ one, many }) => ({
    user: one(users, {
      fields: [routineNotifications.userId],
      references: [users.id],
    }),
    analysis: one(skinAnalysis, {
      fields: [routineNotifications.analysisId],
      references: [skinAnalysis.id],
    }),
    recommendation: one(productRecommendations, {
      fields: [routineNotifications.recommendationId],
      references: [productRecommendations.id],
    }),
    routineLogs: many(routineLogs),
  }),
);

export const routineLogsRelations = relations(routineLogs, ({ one }) => ({
  user: one(users, {
    fields: [routineLogs.userId],
    references: [users.id],
  }),
  notification: one(routineNotifications, {
    fields: [routineLogs.notificationId],
    references: [routineNotifications.id],
  }),
}));

export const userRoutineRelations = relations(userRoutine, ({ one }) => ({
  user: one(users, {
    fields: [userRoutine.userId],
    references: [users.id],
  }),
}));

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
  conditionIngredients: many(conditionIngredients),
  productIngredients: many(productIngredients),
}));

export const conditionIngredientsRelations = relations(
  conditionIngredients,
  ({ one }) => ({
    condition: one(skinConditions, {
      fields: [conditionIngredients.conditionId],
      references: [skinConditions.id],
    }),
    ingredient: one(ingredients, {
      fields: [conditionIngredients.ingredientId],
      references: [ingredients.id],
    }),
  }),
);

export const productIngredientsRelations = relations(
  productIngredients,
  ({ one }) => ({
    product: one(skinCareProducts, {
      fields: [productIngredients.productId],
      references: [skinCareProducts.id],
    }),
    ingredient: one(ingredients, {
      fields: [productIngredients.ingredientId],
      references: [ingredients.id],
    }),
  }),
);

export const conditionProductsRelations = relations(
  conditionProducts,
  ({ one }) => ({
    condition: one(skinConditions, {
      fields: [conditionProducts.conditionId],
      references: [skinConditions.id],
    }),
    product: one(skinCareProducts, {
      fields: [conditionProducts.productId],
      references: [skinCareProducts.id],
    }),
  }),
);
