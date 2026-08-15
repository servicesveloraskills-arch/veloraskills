import { generateOfferLetterPdf } from "../src/lib/offerLetter.js";
import fs from "fs";
import path from "path";

async function testOfferLetterPdf() {
  console.log("📄 Testing Offer Letter PDF Generation from public/template.pdf...");

  try {
    const pdfBuffer = await generateOfferLetterPdf({
      fullName: "Rahul Kumar",
      internId: "VS-2026-00101",
      domain: "Web Development",
      issueDate: "10 August 2026",
    });

    const outputPath = path.join(process.cwd(), "public", "test-offer-letter.pdf");
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`✅ Success! Generated PDF saved to: ${outputPath} (${pdfBuffer.length} bytes)`);
  } catch (error) {
    console.error("❌ PDF Generation Failed:", error);
  }
}

testOfferLetterPdf();
