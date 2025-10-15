import express from 'express';
import {
  uploadAudio,
  getAllMeetings,
  getMeetingById,
  deleteMeeting,
} from '../controllers/transcriptionController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Upload and process audio with error handling
router.post('/upload', (req, res, next) => {
  upload.single('audio')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer upload error:', err.message);
      
      // Handle specific multer errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 100MB.',
        });
      }
      
      if (err.message === 'Invalid file type. Only audio files are allowed.') {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Please upload an audio file (MP3, WAV, M4A, etc.)',
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed',
      });
    }
    
    // Continue to controller if no error
    next();
  });
}, uploadAudio);

// Get all meetings
router.get('/meetings', getAllMeetings);

// Get single meeting
router.get('/meetings/:id', getMeetingById);

// Delete meeting
router.delete('/meetings/:id', deleteMeeting);

export default router;
