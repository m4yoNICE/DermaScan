import PDFDocument from "pdfkit";
import { getAllProducts } from "../services/skinCareProductsService.js";
import { getAllUsersProcess } from "../services/adminUserServices.js";
import { getAllAnalysis } from "../services/analysisServices.js";

function formatIngredients(text, limit = 6) {
  if (!text) return "N/A";

  const str = Array.isArray(text) ? text.join(", ") : text;

  const words = str.split(", ").map(i => i.trim());

  return words.length > limit
    ? words.slice(0, limit).join(", ") + ", ..."
    : str;
}

// helper: count wrapped lines properly
function getLineCount(doc, text, width) {
  const lineHeight = 12;
  return doc.heightOfString(text, { width }) / lineHeight;
}

export async function generateProductReport(req, res) {
  try {
    const products = await getAllProducts();

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=products.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("DermaScan+", { align: "center" });
    doc.moveDown(2);

    const startX = 40;
    let y = doc.y + 20;

    const col = {
      name: 40,
      type: 150,
      ingredient: 230,
      skinType: 340,
      derma: 430,
      routine: 490,
    };

    const widths = {
      name: 100,
      type: 70,
      ingredient: 100,
      skinType: 80,
      derma: 60,
      routine: 60,
    };

    doc.font("Helvetica-Bold").fontSize(10);

    doc.text("Product", col.name, y);
    doc.text("Type", col.type, y);
    doc.text("Ingredient", col.ingredient, y);
    doc.text("Skin Type", col.skinType, y);
    doc.text("Derma Tested", col.derma, y);
    doc.text("Routine", col.routine, y);

    y += 20;

    doc.moveTo(startX, y).lineTo(555, y).stroke();

    doc.font("Helvetica");

    products.forEach((p) => {
      const product = p.productName || "N/A";
      const type = p.productType || "N/A";
      const ingredient = formatIngredients(p.ingredient, 6);

      const skinTypes = p.skinType
        ? p.skinType.split(",").map((t) => t.trim()).join("\n")
        : "N/A";

      const derma = p.dermaTested ? "Yes" : "No";
      const routine = p.timeRoutine || "N/A";

      const dynamicRowHeight = Math.max(
        getLineCount(doc, product, widths.name),
        getLineCount(doc, type, widths.type),
        getLineCount(doc, ingredient, widths.ingredient),
        getLineCount(doc, skinTypes, widths.skinType),
        getLineCount(doc, derma, widths.derma),
        getLineCount(doc, routine, widths.routine)
      ) * 12 + 10;

      y += 8;

      const rowY = y;

      doc.text(product, col.name, rowY, { width: widths.name });
      doc.text(type, col.type, rowY, { width: widths.type });
      doc.text(ingredient, col.ingredient, rowY, { width: widths.ingredient });
      doc.text(skinTypes, col.skinType, rowY, { width: widths.skinType });
      doc.text(derma, col.derma, rowY, { width: widths.derma });
      doc.text(routine, col.routine, rowY, { width: widths.routine });

      y += dynamicRowHeight;

      doc.moveTo(startX, y).lineTo(555, y).stroke();

      if (y > 770) {
        doc.addPage();
        y = 50;
      }
    });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}

export async function generateUserReport(req, res) {
  try {
    const users = await getAllUsersProcess();

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=users.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("DermaScan+ Users", { align: "center" });
    doc.moveDown(2);

    const startX = 40;
    let y = doc.y + 20;

    const col = {
      id: 40,
      name: 80,
      email: 240,
      role: 410,
      created: 480,
    };

    const widths = {
      id: 30,
      name: 150,
      email: 170,
      role: 60,
      created: 80,
    };

    const LINE_HEIGHT = 12;

    const getLineCount = (doc, text, width) => {
      return doc.heightOfString(text || "N/A", { width }) / LINE_HEIGHT;
    };

    doc.font("Helvetica-Bold").fontSize(10);

    doc.text("ID", col.id, y);
    doc.text("Name", col.name, y);
    doc.text("Email", col.email, y);
    doc.text("Role", col.role, y);
    doc.text("Created At", col.created, y);

    y += 20;

    doc.moveTo(startX, y).lineTo(555, y).stroke();

    doc.font("Helvetica");

    users.forEach((u) => {
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "N/A";
      const email = u.email || "N/A";
      const roleName = u.role?.roleName || "N/A";
      const createdDate = new Date(u.createdAt).toLocaleDateString();

      const rowHeight = Math.max(
        getLineCount(doc, u.id, widths.id),
        getLineCount(doc, fullName, widths.name),
        getLineCount(doc, email, widths.email),
        getLineCount(doc, roleName, widths.role),
        getLineCount(doc, createdDate, widths.created)
      ) * LINE_HEIGHT + 10;

      const rowY = y + 8;

      doc.text(u.id || "N/A", col.id, rowY, { width: widths.id });
      doc.text(fullName, col.name, rowY, { width: widths.name });
      doc.text(email, col.email, rowY, { width: widths.email });
      doc.text(roleName, col.role, rowY, { width: widths.role });
      doc.text(createdDate, col.created, rowY, { width: widths.created });

      y += rowHeight;

      doc.moveTo(startX, y).lineTo(555, y).stroke();

      if (y > 750) {
        doc.addPage();
        y = 50;
      }
    });

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate user report" });
  }
}

export async function generateAnalysisReport(req, res) {
  try {
    const analysisData = await getAllAnalysis();

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=analysis.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("DermaScan+ Analysis Report", { align: "center" });
    doc.moveDown(1.5);

    const startX = 40;
    let y = doc.y + 20;

    const rowHeight = 22;

    const col = {
      name: startX,
      condition: startX + 170,
      status: startX + 290,
      score: startX + 350,
      recommend: startX + 400,
      created: startX + 480,
    };

    // ================= HEADER =================
    doc.font("Helvetica-Bold").fontSize(10);

    doc.text("Email", col.name, y, { width: 150 });
    doc.text("Condition", col.condition, y, { width: 110 });
    doc.text("Status", col.status, y, { width: 60 });
    doc.text("Score", col.score, y, { width: 50 });

    doc.text("Recommended", col.recommend, y, {
      width: 90,
      lineBreak: false,
    });

    doc.text("Created At", col.created, y, { width: 80 });

    y += rowHeight;

    doc.moveTo(startX, y).lineTo(565, y).stroke();

    // ================= ROWS =================
    doc.font("Helvetica");

    analysisData.forEach((item) => {
      y += 6;

      doc.text(item.email || "N/A", col.name, y, {
        width: 150,
        ellipsis: true,
      });

      doc.text(item.conditionName || "N/A", col.condition, y, {
        width: 110,
        ellipsis: true,
      });

      doc.text(item.status || "N/A", col.status, y, { width: 60 });

      doc.text(String(item.confidenceScores ?? "N/A"), col.score, y, {
        width: 50,
      });

      doc.text(item.canRecommend ? "Yes" : "No", col.recommend, y, {
        width: 90,
      });

      const createdDate = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "N/A";

      doc.text(createdDate, col.created, y, { width: 80 });

      y += rowHeight;

      doc.moveTo(startX, y).lineTo(565, y).stroke();

      if (y > 750) {
        doc.addPage();
        y = 50;
      }
    });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate analysis PDF" });
  }
}