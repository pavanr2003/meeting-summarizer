import express from 'express';
import upload from '../middleware/upload.js';
import {
  uploadAndProcess,
  getAllMeetings,
  getMeeting,
  deleteMeeting,
} from '../controllers/transcriptionController.js';

const router = express.Router();

router.post('/upload', upload.single('audio'), uploadAndProcess);
router.get('/meetings', getAllMeetings);
router.get('/meetings/:id', getMeeting);
router.delete('/meetings/:id', deleteMeeting);

export default router;
