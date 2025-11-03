// controllers/uploadController.js
import bucket from "../firebase.js";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image");

/**
 * POST /api/upload
 * Upload file to Firebase Storage (supports new .firebasestorage.app buckets)
 */
export const uploadImage = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  upload(req, res, async (err) => {
    if (err)
      return res.status(400).json({ success: false, message: err.message });
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    try {
      const file = req.file;
      const ext = path.extname(file.originalname) || ".jpg";
      const fileName = `uploads/${uuidv4()}-${Date.now()}${ext}`;
      const blob = bucket.file(fileName);

      // ✅ Determine proper MIME type
      let contentType = file.mimetype;
      if (!contentType || contentType === "application/octet-stream") {
        if (ext.match(/\.png$/i)) contentType = "image/png";
        else if (ext.match(/\.jpe?g$/i)) contentType = "image/jpeg";
        else if (ext.match(/\.gif$/i)) contentType = "image/gif";
        else contentType = "application/octet-stream";
      }

      // ✅ Upload directly (non-resumable)
      await blob.save(file.buffer, {
        metadata: { contentType, cacheControl: "public, max-age=31536000" },
        resumable: false,
      });

      // ✅ Make file public
      await blob.makePublic();

      // ✅ Proper URL for new Firebase domains
      const encodedPath = encodeURIComponent(fileName);
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media`;

      console.log("✅ Uploaded:", fileName);
      console.log("🌐 URL:", publicUrl);

      res.status(200).json({ success: true, url: publicUrl });
    } catch (error) {
      console.error("🔥 Upload failed:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
};

/**
 * DELETE /api/upload
 * Delete image by its public URL
 */
export const deleteByUrl = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const { url } = req.body;
    if (!url)
      return res
        .status(400)
        .json({ success: false, message: "Missing 'url' in request body" });

    const decoded = decodeURIComponent(url);
    const match = decoded.match(/\/o\/(.+)\?alt=media/);
    if (match && match[1]) {
      const filePath = match[1];
      await bucket.file(filePath).delete({ ignoreNotFound: true });
      console.log(`🗑️ Deleted file: ${filePath}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("❌ deleteByUrl error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
