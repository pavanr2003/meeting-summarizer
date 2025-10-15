import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Use /tmp directory (only writable location in Vercel serverless)
const uploadDir = '/tmp/uploads';

// Ensure upload directory exists on initialization
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Created upload directory:', uploadDir);
  }
} catch (error) {
  console.error('❌ Error creating upload directory:', error.message);
}

// Configure storage for serverless
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Double-check directory exists before each upload
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('✅ Created upload directory on-demand:', uploadDir);
      }
      cb(null, uploadDir);
    } catch (error) {
      console.error('❌ Error ensuring upload directory:', error.message);
      cb(error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('📝 Generated filename:', filename);
    cb(null, filename);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  console.log('📁 Checking file type:', file.mimetype, file.originalname);
  
  const allowedTypes = /mp3|wav|m4a|mp4|webm|ogg|aac|flac|mpeg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.startsWith('audio/');

  if (extname && mimetype) {
    console.log('✅ File type accepted');
    cb(null, true);
  } else {
    console.log('❌ File type rejected');
    cb(new Error('Invalid file type. Only audio files are allowed.'));
  }
};

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: 104857600, // 100MB
  },
  fileFilter,
});

export default upload;
