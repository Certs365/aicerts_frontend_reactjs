import CryptoJS from 'crypto-js';
import { PDFDocument } from 'pdf-lib';
// Debounced function to fetch suggestions
const secretKey = process.env.NEXT_PUBLIC_BASE_ENCRYPTION_KEY;
  // @ts-ignore: Implicit any for children prop
   const encryptData = (data) => {
  // @ts-ignore: Implicit any for children prop
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encrypted;
};
  // @ts-ignore: Implicit any for children prop

const createPdfFromImage = async (imageUrl) => {
  // Fetch the image data
  const imageResponse = await fetch(imageUrl);
  const imageArrayBuffer = await imageResponse.arrayBuffer();
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Embed the image into the PDF document
  const image = await pdfDoc.embedPng(imageArrayBuffer); // Change to embedJpg for JPG images
  const page = pdfDoc.addPage([image.width, image.height]);
  
  // Draw the image on the page
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });

  // Serialize the PDFDocument to bytes (Uint8Array)
  const pdfBytes = await pdfDoc.save();
  
  // Create a Blob URL for the PDF
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};
export {encryptData, createPdfFromImage}
