import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import path from "path";
import { getAllProducts } from "../services/skinCareProductsService.js";
import { getAllUsersProcess } from "../services/adminUserServices.js";
import { getAllAnalysis } from "../services/analysisServices.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(
  __dirname,
  "../../../../Admin/src/assets/DermaScanLogo.png",
);

function drawHeader(doc, title) {
  try {
    doc.image(logoPath, 40, 30, { width: 60 });
  } catch (err) {
    console.log("Logo failed:", logoPath);
  }

  doc.fontSize(20).font("Helvetica-Bold").text("DermaScan+", 110, 40);
  doc.fontSize(10).font("Helvetica").text("Official Report", 110, 60);

  if (title) {
    doc.moveDown(2);
    doc.fontSize(14).font("Helvetica-Bold").text(title, { align: "center" });
  }
  doc.font("Helvetica").fontSize(10);

  const generatedDate = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  doc.moveDown(0.5);
  doc.fontSize(9).font("Helvetica").fillColor("gray")
    .text(`Date Generated: ${generatedDate}`, { align: "center" });
  doc.fillColor("black");

  doc.moveDown(1.5);
}

function formatIngredients(text, limit = 6) {
  if (!text) return "N/A";
  if (Array.isArray(text)) {
    return text.length > limit
      ? text.slice(0, limit).join(", ") + ", ..."
      : text.join(", ");
  }
  const words = text.split(",").map((i) => i.trim()).filter(Boolean);
  return words.length > limit
    ? words.slice(0, limit).join(", ") + ", ..."
    : words.join(", ");
}

function getLineCount(doc, text, width) {
  const lineHeight = 12;
  return doc.heightOfString(String(text || ""), { width }) / lineHeight;
}

// ─── Table Header Drawers ─────────────────────────────────────────────────────

function drawProductTableHeader(doc, col, widths, y, startX) {
  doc.font("Helvetica-Bold").fontSize(10);
  doc.text("Product",      col.name,       y, { width: widths.name });
  doc.text("Brand",        col.brand,      y, { width: widths.brand });
  doc.text("Type",         col.type,       y, { width: widths.type });
  doc.text("Ingredient",   col.ingredient, y, { width: widths.ingredient });
  doc.text("Skin Type",    col.skinType,   y, { width: widths.skinType });
  doc.text("Derma Tested", col.derma,      y, { width: widths.derma });
  doc.text("Routine",      col.routine,    y, { width: widths.routine });
  doc.text("Freq.",        col.freq,       y, { width: widths.freq });
  doc.text("Date Added",   col.date,       y, { width: widths.date });
  doc.font("Helvetica").fontSize(10);
  const lineY = y + 20;
  doc.moveTo(startX, lineY).lineTo(555, lineY).stroke();
  return lineY;
}

function drawUserTableHeader(doc, col, widths, y, startX) {
  doc.font("Helvetica-Bold").fontSize(10);
  doc.text("ID",         col.id,      y);
  doc.text("Name",       col.name,    y);
  doc.text("Email",      col.email,   y);
  doc.text("Role",       col.role,    y);
  doc.text("Created At", col.created, y);
  doc.font("Helvetica").fontSize(10);
  const lineY = y + 20;
  doc.moveTo(startX, lineY).lineTo(555, lineY).stroke();
  return lineY;
}

function drawAnalysisTableHeader(doc, col, rowHeight, startX, y) {
  doc.font("Helvetica-Bold").fontSize(10);
  doc.text("Email",       col.name,      y, { width: 145 });
  doc.text("Condition",   col.condition, y, { width: 110 });
  doc.text("Status",      col.status,    y, { width: 60 });
  doc.text("Score",       col.score,     y, { width: 60 });
  doc.text("Recommended", col.recommend, y, { width: 60 });
  doc.text("Created At",  col.created,   y, { width: 80 });
  doc.font("Helvetica").fontSize(10);
  const lineY = y + rowHeight;
  doc.moveTo(startX, lineY).lineTo(565, lineY).stroke();
  return lineY;
}

// ─── Product Report ───────────────────────────────────────────────────────────

export async function generateProductReport(req, res) {
  try {
    const products = await getAllProducts();

    let statsMap = {};
    try {
      const statsRes = await fetch("http://localhost:3000/api/admin/products/getProductRecommendationStats");
      const statsJson = await statsRes.json();
      (statsJson.data || []).forEach((s) => {
        statsMap[s.productId] = {
          count: s.recommendationCount ?? 0,
          selected: s.selected ?? false,
        };
      });
    } catch (e) {
      console.warn("Could not fetch recommendation stats:", e.message);
    }

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=products.pdf");

    doc.pipe(res);

    drawHeader(doc, "Products Report");

    const startX = 40;

    const col = {
      name: 40,
      brand: 120,
      type: 180,
      ingredient: 238,
      skinType: 325,
      derma: 373,
      routine: 413,
      freq: 460,
      date: 490,
    };

    const widths = {
      name: 75,
      brand: 55,
      type: 53,
      ingredient: 82,
      skinType: 43,
      derma: 35,
      routine: 42,
      freq: 25,
      date: 60,
    };

    let y = drawProductTableHeader(doc, col, widths, doc.y + 10, startX);

    products.forEach((p) => {
      const product = p.productName || "N/A";
      const brand = p.productBrand || "N/A";
      const type = p.productType || "N/A";
      const ingredient = formatIngredients(p.ingredient, 6);
      const skinTypes = p.skinType ? p.skinType.split(",").map(t => t.trim()).join("\n") : "N/A";
      const derma = p.dermaTested ? "Yes" : "No";
      const routine = p.timeRoutine || "N/A";
      const dateAdded = p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A";

      const stat = statsMap[p.productId] || statsMap[p.id];
      const freq = stat?.selected ? String(stat.count) : "-";

      const dynamicRowHeight =
        Math.max(
          getLineCount(doc, product, widths.name),
          getLineCount(doc, brand, widths.brand),
          getLineCount(doc, type, widths.type),
          getLineCount(doc, ingredient, widths.ingredient),
          getLineCount(doc, skinTypes, widths.skinType),
          getLineCount(doc, derma, widths.derma),
          getLineCount(doc, routine, widths.routine),
          getLineCount(doc, freq, widths.freq),
          getLineCount(doc, dateAdded, widths.date)
        ) * 12 + 18;

      if (y + dynamicRowHeight > 770) {
        doc.addPage();
        drawHeader(doc, "Products Report");
        y = drawProductTableHeader(doc, col, widths, doc.y + 10, startX);
      }

      const rowY = y + 8;

      doc.text(product, col.name, rowY, { width: widths.name });
      doc.text(brand, col.brand, rowY, { width: widths.brand });
      doc.text(type, col.type, rowY, { width: widths.type });
      doc.text(ingredient, col.ingredient, rowY, { width: widths.ingredient });
      doc.text(skinTypes, col.skinType, rowY, { width: widths.skinType });
      doc.text(derma, col.derma, rowY, { width: widths.derma });
      doc.text(routine, col.routine, rowY, { width: widths.routine });
      doc.text(freq, col.freq, rowY, { width: widths.freq });
      doc.text(dateAdded, col.date, rowY, { width: widths.date });

      y = rowY + dynamicRowHeight;
      doc.moveTo(startX, y).lineTo(555, y).stroke();
    });

    y += 15;

    if (y + 30 > 770) {
      doc.addPage();
      y = 40;
    }

    doc.font("Helvetica-Bold").fontSize(10)
      .text(`Total Products: ${products.length}`, startX, y);

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}

// ─── User Report ──────────────────────────────────────────────────────────────

export async function generateUserReport(req, res) {
  try {
    const users = await getAllUsersProcess();

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=users.pdf");

    doc.pipe(res);

    drawHeader(doc, "Users Report");

    const startX = 40;

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

    let y = drawUserTableHeader(doc, col, widths, doc.y + 10, startX);

    users.forEach((u) => {
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "N/A";
      const email = u.email || "N/A";
      const roleName = u.role?.roleName || "N/A";
      const createdDate = new Date(u.createdAt).toLocaleDateString();

      const rowHeight =
        Math.max(
          getLineCount(doc, String(u.id ?? "N/A"), widths.id),
          getLineCount(doc, fullName, widths.name),
          getLineCount(doc, email, widths.email),
          getLineCount(doc, roleName, widths.role),
          getLineCount(doc, createdDate, widths.created)
        ) * LINE_HEIGHT + 10;

      if (y + rowHeight > 750) {
        doc.addPage();
        drawHeader(doc, "Users Report");
        y = drawUserTableHeader(doc, col, widths, doc.y + 10, startX);
      }

      const rowY = y + 8;

      doc.text(String(u.id ?? "N/A"), col.id, rowY, { width: widths.id });
      doc.text(fullName, col.name, rowY, { width: widths.name });
      doc.text(email, col.email, rowY, { width: widths.email });
      doc.text(roleName, col.role, rowY, { width: widths.role });
      doc.text(createdDate, col.created, rowY, { width: widths.created });

      y += rowHeight;
      doc.moveTo(startX, y).lineTo(555, y).stroke();
    });

    y += 15;

    if (y + 30 > 770) {
      doc.addPage();
      y = 40;
    }

    doc.font("Helvetica-Bold")
      .fontSize(10)
      .text(`Total Users: ${users.length}`, startX, y);

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate user report" });
  }
}

// ─── Analysis Report ──────────────────────────────────────────────────────────

export async function generateAnalysisReport(req, res) {
  try {
    const analysisData = await getAllAnalysis();

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=analysis.pdf");

    doc.pipe(res);

    drawHeader(doc, "Analysis Report");

    const startX = 40;
    const rowHeight = 22;

    const col = {
      name: startX,
      condition: startX + 155,
      status: startX + 275,
      score: startX + 340,
      recommend: startX + 405,
      created: startX + 470,
    };

    let y = drawAnalysisTableHeader(doc, col, rowHeight, startX, doc.y + 10);

    analysisData.forEach((item) => {
      if (y + rowHeight > 750) {
        doc.addPage();
        drawHeader(doc, "Analysis Report");
        y = drawAnalysisTableHeader(doc, col, rowHeight, startX, doc.y + 10);
      }

      y += 6;

      const recommended = item.canRecommend === "Yes" ? "Yes" : "No";

      doc.text(item.email || "N/A", col.name, y, { width: 145, ellipsis: true });
      doc.text(item.conditionName || "N/A", col.condition, y, { width: 110, ellipsis: true });
      doc.text(item.status || "N/A", col.status, y, { width: 60 });
      doc.text(
        item.confidenceScores != null ? Number(item.confidenceScores).toFixed(4) : "N/A",
        col.score,
        y,
        { width: 60 }
      );
      doc.text(recommended, col.recommend, y, { width: 60 });
      doc.text(
        item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
        col.created,
        y,
        { width: 80 }
      );

      y += rowHeight;
      doc.moveTo(startX, y).lineTo(565, y).stroke();
    });

    y += 15;

    if (y + 30 > 770) {
      doc.addPage();
      y = 40;
    }

    doc.font("Helvetica-Bold")
      .fontSize(10)
      .text(`Total Scans: ${analysisData.length}`, startX, y);

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate analysis PDF" });
  }
}