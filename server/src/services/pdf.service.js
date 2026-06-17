import fs from "fs";
import path from "path";
import axios from "axios";
import { PDFDocument } from "pdf-lib";

export const addSignatureToPdf = async (
  inputPath,
  outputPath,
  signerName,
  role = "SIGNER",
  index = 0
) => {
  try {
    console.log("INPUT:", inputPath);
    console.log("OUTPUT:", outputPath);

    const dir = path.dirname(outputPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }

    let existingPdfBytes;

    // Local file
    if (
      inputPath.startsWith("uploads") ||
      inputPath.startsWith("signed")
    ) {
      existingPdfBytes =
        fs.readFileSync(inputPath);
    }

    // Supabase URL
    else if (
      inputPath.startsWith("http")
    ) {
      const response =
        await axios.get(inputPath, {
          responseType: "arraybuffer",
        });

      existingPdfBytes =
        response.data;
    }

    else {
      throw new Error(
        "Unsupported PDF source"
      );
    }

    const pdfDoc =
      await PDFDocument.load(
        existingPdfBytes
      );

    const pages = pdfDoc.getPages();

    const lastPage =
      pages[pages.length - 1];

    let prefix = "Signed by";

    if (role === "WITNESS") {
      prefix = "Witnessed by";
    }

    if (role === "AUTHENTICATOR") {
      prefix = "Authenticated by";
    }

    const yPosition =
      50 + index * 40;

    lastPage.drawText(
      `${prefix}: ${signerName}`,
      {
        x: 300,
        y: yPosition,
        size: 14,
      }
    );

    const pdfBytes =
      await pdfDoc.save();

    fs.writeFileSync(
      outputPath,
      pdfBytes
    );

    console.log(
      "SIGNED FILE WRITTEN:",
      outputPath
    );

    return outputPath;
  } catch (err) {
    console.error(
      "PDF SIGN ERROR:",
      err
    );

    throw err;
  }
};