import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm({
      uploadDir: path.join(process.cwd(), '/public/uploads'),
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) return res.status(500).json({ error: 'Upload failed' });

      const file = files.image[0]; // assumes field name = image
      const fileName = path.basename(file.filepath);
      res.status(200).json({ url: `/uploads/${fileName}` });
    });
  } else {
    res.status(405).send('Method not allowed');
  }
}
