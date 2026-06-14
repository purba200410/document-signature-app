import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

export const addSignatureToPdf = async (
inputPath,
outputPath,
signerName
) => {
const dir = path.dirname(outputPath);

if (!fs.existsSync(dir)) {
fs.mkdirSync(dir, { recursive: true });
}

const existingPdfBytes =
fs.readFileSync(inputPath);

const pdfDoc =
await PDFDocument.load(
existingPdfBytes
);

const pages = pdfDoc.getPages();

const firstPage = pages[0];

firstPage.drawText(
`Signed by: ${signerName}`,
{
x: 50,
y: 100,
size: 18,
}
);

const pdfBytes =
await pdfDoc.save();

fs.writeFileSync(
outputPath,
pdfBytes
);

return outputPath;
};
