import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a base64 image or PDF to Cloudinary.
 * Returns the secure URL, or null if no input.
 */
export const uploadToCloudinary = async (base64String, folder = "medimentor", isPDF = false) => {
  if (!base64String) return null;
  if (process.env.NODE_ENV === "test") return null; // skip in test env

  // Already a URL (already uploaded) — return as-is
  if (base64String.startsWith("http")) return base64String;

  const dataUri = base64String.startsWith("data:")
    ? base64String
    : `data:${isPDF ? "application/pdf" : "image/jpeg"};base64,${base64String}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: isPDF ? "raw" : "image",
    transformation: isPDF ? undefined : [{ width: 400, crop: "limit", quality: "auto", fetch_format: "auto" }],
  });

  return result.secure_url;
};

/**
 * Delete an image from Cloudinary by URL.
 */
export const deleteFromCloudinary = async (url) => {
  if (!url || !url.includes("cloudinary")) return;
  // Extract public_id from URL: .../medimentor/filename.ext
  const parts = url.split("/");
  const filename = parts[parts.length - 1].split(".")[0];
  const folder = parts[parts.length - 2];
  await cloudinary.uploader.destroy(`${folder}/${filename}`).catch(() => {});
};
