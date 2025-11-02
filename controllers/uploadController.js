import bucket from '../firebase.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const fileName = `uploads/${Date.now()}-${uuidv4()}${path.extname(req.file.originalname)}`;
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        cacheControl: 'public, max-age=31536000',
      },
    });

    await file.makePublic();
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

    res.json({ success: true, url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

// optional helper to delete by URL (same idea as Starly)
export const deleteByUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, message: "Missing 'url'" });

    const decoded = decodeURIComponent(url);
    const m = decoded.match(/\/o\/(.+)\?alt=media/);
    if (m && m[1]) {
      const fp = m[1];
      await bucket.file(fp).delete({ ignoreNotFound: true });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
