import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generateOfferLetterPdf({ fullName, internId, domain, issueDate }) {
  const templatePath = path.join(process.cwd(), "public", "template.pdf");

  let pdfDoc;
  if (fs.existsSync(templatePath)) {
    const templateBytes = fs.readFileSync(templatePath);
    pdfDoc = await PDFDocument.load(templateBytes);
  } else {
    pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([595, 842]); // A4 size
  }

  const pages = pdfDoc.getPages();
  const page = pages[0] || pdfDoc.addPage([595, 842]);
  const { height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const formattedDate =
    issueDate ||
    new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Draw overlay text onto the PDF template
  // Date
  page.drawText(`Date: ${formattedDate}`, {
    x: 60,
    y: height - 140,
    size: 10,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Name
  page.drawText(`Dear ${fullName},`, {
    x: 60,
    y: height - 175,
    size: 14,
    font: fontBold,
    color: rgb(0.08, 0.15, 0.35),
  });

  // Intern ID & Domain info pill
  page.drawText(`INTERN ID: ${internId}   |   DOMAIN: ${domain.toUpperCase()}`, {
    x: 60,
    y: height - 200,
    size: 11,
    font: fontBold,
    color: rgb(0.2, 0.45, 0.95),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
