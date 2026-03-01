import { db } from "../../config/db.js";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import 
{ 
    skinAnalysisTransactions,
    skinConditions,
    users
} from "../../drizzle/schema.js";

export async function getScanPerDay(req, res) {
  try {
    const scansPerDay = await db
      .select({
        date: sql`DATE(${skinAnalysisTransactions.createdAt})`,
        count: sql`COUNT(*)`,
      })
      .from(skinAnalysisTransactions)
      .groupBy(sql`DATE(${skinAnalysisTransactions.createdAt})`)
      .orderBy(sql`DATE(${skinAnalysisTransactions.createdAt})`);

    return res.status(200).json(scansPerDay);
  } catch (err) {
    console.error("Get scans per day error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getOutOfScopeStatistics(req, res) {  
    try {
        const result = await db
        .select({
        skinAnalysisTransactionsId: skinAnalysisTransactions.id,
        skinConditionsId: skinConditions.id,
        email: users.email,
        conditionName: skinConditions.condition,
        canRecommend: skinConditions.canRecommend,
        createdAt: skinConditions.createdAt,
        updatedAt: skinConditions.updatedAt,
        })
        .from(skinAnalysisTransactions)
        .leftJoin(
        skinConditions,
          eq(skinAnalysisTransactions.conditionId, skinConditions.id)
        )
        .leftJoin(
          users, 
          eq(skinAnalysisTransactions.userId, users.id))
        .where(eq(skinConditions.canRecommend, "no"));

        return res.status(200).json(result);
    }catch (err) {
        console.error("Get out of scope statistics error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}

export async function deleteOutOfScope(req, res) {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(skinConditions)
      .where(eq(skinConditions.id, Number(id)));

    return res.status(200).json({
      message: "Condition deleted successfully",
    });
  } catch (err) {
    console.error("Delete out of scope error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}