import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

/**
 * Generates an Internship Completion & Experience Letter PDF Buffer.
 */
export async function generateExperienceLetterPdf({
  fullName,
  internId,
  domain,
  issueDate,
  durationWeeks = 4,
}) {
  const templatePath = path.join(process.cwd(), "public", "template.pdf");

  let pdfDoc;
  if (fs.existsSync(templatePath)) {
    const templateBytes = fs.readFileSync(templatePath);
    pdfDoc = await PDFDocument.load(templateBytes);
  } else {
    pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([595, 842]); // A4 size: 595 x 842 pt
  }

  const pages = pdfDoc.getPages();
  const page = pages[0] || pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const formattedDate =
    issueDate ||
    new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Top Right Date
  page.drawText(`Date: ${formattedDate}`, {
    x: width - 200,
    y: height - 120,
    size: 10,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Certificate / Experience Title
  const titleText = "INTERNSHIP EXPERIENCE & COMPLETION CERTIFICATE";
  page.drawText(titleText, {
    x: 60,
    y: height - 160,
    size: 14,
    font: fontBold,
    color: rgb(0.08, 0.15, 0.35),
  });

  // Subheader Line
  page.drawRectangle({
    x: 60,
    y: height - 168,
    width: width - 120,
    height: 2,
    color: rgb(0.25, 0.45, 0.95),
  });

  // Salutation
  page.drawText(`TO WHOM IT MAY CONCERN`, {
    x: 60,
    y: height - 200,
    size: 12,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Intern Details Meta Box
  page.drawRectangle({
    x: 60,
    y: height - 265,
    width: width - 120,
    height: 50,
    color: rgb(0.95, 0.97, 1.0),
    borderColor: rgb(0.8, 0.88, 0.98),
    borderWidth: 1,
  });

  page.drawText(`INTERN NAME: ${fullName.toUpperCase()}`, {
    x: 75,
    y: height - 238,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.2, 0.4),
  });

  page.drawText(`INTERN ID: ${internId}    |    DOMAIN: ${domain.toUpperCase()}`, {
    x: 75,
    y: height - 256,
    size: 10,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Main Letter Body Text
  const bodyText1 = `This is to certify that ${fullName} (Intern ID: ${internId}) has successfully completed a ${durationWeeks}-week Virtual Internship program in ${domain} at VeloraSkills.`;

  page.drawText(bodyText1, {
    x: 60,
    y: height - 300,
    size: 11,
    font,
    color: rgb(0.2, 0.2, 0.2),
    maxWidth: width - 120,
    lineHeight: 16,
  });

  const bodyText2 = `During this internship, ${fullName} demonstrated outstanding performance, dedication, technical aptitude, and problem-solving skills while completing all assigned projects and practical assessments.`;

  page.drawText(bodyText2, {
    x: 60,
    y: height - 350,
    size: 11,
    font,
    color: rgb(0.2, 0.2, 0.2),
    maxWidth: width - 120,
    lineHeight: 16,
  });

  const bodyText3 = `We appreciate their effort and contribution to our learning community and wish them great success in all future professional endeavors.`;

  page.drawText(bodyText3, {
    x: 60,
    y: height - 400,
    size: 11,
    font,
    color: rgb(0.2, 0.2, 0.2),
    maxWidth: width - 120,
    lineHeight: 16,
  });

  // Signature Block
  page.drawText(`For VeloraSkills Learning Technologies`, {
    x: 60,
    y: height - 470,
    size: 11,
    font: fontBold,
    color: rgb(0.1, 0.15, 0.35),
  });

  page.drawText(`Authorized Signatory`, {
    x: 60,
    y: height - 520,
    size: 10,
    font: fontOblique,
    color: rgb(0.4, 0.4, 0.4),
  });

  page.drawText(`Certificate Verification: https://veloraskills.tech/verify/${internId}`, {
    x: 60,
    y: height - 550,
    size: 9,
    font,
    color: rgb(0.25, 0.45, 0.95),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
