// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { IncomingForm } from "formidable";
import { promises as fs } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: "http://localhost:9000",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER || "",
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD || "",
  },
  forcePathStyle: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing the files" });
    }

    if (!files || !files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = files.file as unknown as formidable.File;
    console.log("ファイルパス:", file.filepath); // ファイルパスをログ出力

    if (!file.filepath) {
      return res.status(400).json({ error: "File path is undefined" });
    }

    try {
      const fileContent = await fs.readFile(file.filepath);
      const fileName = file.originalFilename || "default.png";

      const uploadParams = {
        Bucket: "test",
        Key: fileName,
        Body: fileContent,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      res.status(200).json({ message: "Image uploaded successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error uploading image" });
    }
  });
}

// import type { NextApiRequest, NextApiResponse } from "next";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import formidable, { IncomingForm } from "formidable";
// import { promises as fs } from "fs";

// const s3Client = new S3Client({
//   endpoint: "http://localhost:9000",
//   region: "us-east-1",
//   credentials: {
//     accessKeyId: process.env.MINIO_ROOT_USER || "",
//     secretAccessKey: process.env.MINIO_ROOT_PASSWORD || "",
//   },
//   forcePathStyle: true,
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   const form = new IncomingForm();
//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ error: "Error parsing the files" });
//     }

//     const file = files.file as unknown as formidable.File;
//     const fileContent = await fs.readFile(file.filepath);
//     const fileName = file.originalFilename || "default.png";

//     try {
//       const uploadParams = {
//         Bucket: "test",
//         Key: fileName,
//         Body: fileContent,
//       };

//       await s3Client.send(new PutObjectCommand(uploadParams));
//       res.status(200).json({ message: "Image uploaded successfully!" });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Error uploading image" });
//     }
//   });
// }

// import type { NextApiRequest, NextApiResponse } from "next";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// //時間あれば型定義しよかな、、
// const s3Client = new S3Client({
//   endpoint: "http://localhost:9000", // MinIOのエンドポイント
//   region: "us-east-1",
//   credentials: {
//     accessKeyId: process.env.MINIO_ROOT_USER || "", // MinIOのアクセスキー
//     secretAccessKey: process.env.MINIO_PORT_PASSWORD || "", // MinIOのシークレットキー
//   },
//   forcePathStyle: true, // パススタイルのエンドポイントを強制
// });

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).send("Method Not Allowed");
//   }

//   try {
//     // ここに画像のデータをとりあえずハードコーディング(test用)
//     const imageBuffer = Buffer.from("ここに画像のバイナリデータ", "binary");
//     const fileName = "example.png"; // ファイル名

//     const uploadParams = {
//       Bucket: "test", // MinIOのバケット名
//       Key: fileName,
//       Body: imageBuffer,
//     };

//     const command = new PutObjectCommand(uploadParams);
//     await s3Client.send(command);

//     res.status(200).json({ message: "Image uploaded successfully!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error uploading image" });
//   }
// }
