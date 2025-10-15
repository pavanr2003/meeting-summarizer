import express from 'express';
import {
  uploadAudio,
  getAllMeetings,
  getMeetingById,
  deleteMeeting,
} from '../controllers/transcriptionController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', upload.single('audio'), uploadAudio);
router.get('/meetings', getAllMeetings);
router.get('/meetings/:id', getMeetingById);
router.delete('/meetings/:id', deleteMeeting);

export default router;
