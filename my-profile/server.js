import express from "express";
import multer from "multer";
import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});
db.connect();

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const filePath = `uploads/${req.file.filename}`;
    const fileUrl = `http://localhost:3000/${filePath}`;

    await db.query(
      "UPDATE users SET image_url = $1 WHERE id = $2",
      [fileUrl, 1] // change user ID if needed
    );

    res.json({ message: "Image uploaded!", image_url: fileUrl });
  } catch (e) {
    res.json({ message: "Error uploading image" });
  }
});

app.use("/uploads", express.static("uploads"));

app.listen(3000, () => console.log("Server running on port 3000"));
