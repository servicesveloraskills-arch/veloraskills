import { generateExperienceLetterPdf } from "../src/lib/experienceLetter.js";
import fs from "fs";
import path from "path";

async function testExperienceLetter() {
  console.log("📄 Testing Experience / Completion Letter PDF Generation...");

  try {
    const pdfBuffer = await generateExperienceLetterPdf({
      fullName: "Rahul Kumar",
      internId: "VS-2026-00101",
      domain: "Web Development",
      durationWeeks: 4,
    });

    const outputPath = path.join(process.cwd(), "public", "test-experience-letter.pdf");
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`✅ Success! Generated Experience Letter PDF saved to: ${outputPath} (${pdfBuffer.length} bytes)`);
  } catch (error) {
    console.error("❌ PDF Generation Failed:", error);
  }
}

testExperienceLetter();
