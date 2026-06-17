import fs from "fs";
import { supabase } from "../config/supabase.js";

export const uploadPdfToStorage = async (
  fileBuffer,
  fileName
) => {
  const { error } = await supabase.storage
    .from("doc-sign-platform-bucket")
    .upload(fileName, fileBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("doc-sign-platform-bucket")
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const uploadLocalPdfToStorage =
  async (localPath, fileName) => {
    const fileBuffer =
      fs.readFileSync(localPath);

    return await uploadPdfToStorage(
      fileBuffer,
      fileName
    );
  };