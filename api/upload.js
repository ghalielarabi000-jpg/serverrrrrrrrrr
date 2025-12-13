import cloudinary from "cloudinary";
import { Client } from "pg";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const db = new Client({
  connectionString: process.env.DATABASE_URL,
});
db.connect();

export default async function handler(req, res) {
  const { image } = req.body;

  const upload = await cloudinary.v2.uploader.upload(image, {
    folder: "profiles",
  });

  await db.query(
    "UPDATE users SET image_url=$1 WHERE id=1",
    [upload.secure_url]
  );

  res.status(200).json({ image_url: upload.secure_url });
}
