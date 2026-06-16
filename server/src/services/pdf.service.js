import fs from "fs";
import path from "path";
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

    const existingPdfBytes =
      fs.readFileSync(inputPath);

    const pdfDoc =
      await PDFDocument.load(
        existingPdfBytes
      );

    const firstPage =
      pdfDoc.getPages()[0];

    let prefix = "Signed by";
    if (role === "WITNESS") {
      prefix = "Witnessed by";
    } else if (role === "AUTHENTICATOR") {
      prefix = "Authenticated by";
    }

    const yPosition = 100 + index * 40;

    firstPage.drawText(
      `${prefix}: ${signerName}`,
      {
        x: 50,
        y: yPosition,
        size: 18,
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