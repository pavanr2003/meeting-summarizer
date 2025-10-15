import dotenv from 'dotenv';
dotenv.config();

import asyncHandler from 'express-async-handler';
import fs from 'fs';
import Meeting from '../models/Meeting.js';
import AssemblyAIService from '../services/assemblyAIService.js';
import GroqService from '../services/groqService.js';

console.log('🔑 Loading API keys...');
console.log('AssemblyAI:', process.env.ASSEMBLYAI_API_KEY ? '✅ Set' : '❌ Missing');
console.log('Groq:', process.env.GROQ_API_KEY ? '✅ Set' : '❌ Missing');

// Initialize services
const assemblyAIService = new AssemblyAIService(process.env.ASSEMBLYAI_API_KEY);
const groqService = new GroqService(process.env.GROQ_API_KEY);

export const uploadAudio = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No audio file provided',
    });
  }

  try {
    console.log('📁 Processing:', req.file.originalname);

    // Transcribe
    const transcriptionResult = await assemblyAIService.transcribeAudio(req.file.path);

    // Summarize
    const summary = await groqService.generateSummary(transcriptionResult.text);

    // Save to database
    const meeting = await Meeting.create({
      fileName: req.file.originalname,
      fileSize: req.file.size,
      transcription: transcriptionResult.text,
      summary,
      audioUrl: req.file.path,
      duration: transcriptionResult.duration || 0,
    });

    console.log('💾 Saved:', meeting._id);

    // Clean up
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(201).json({
      success: true,
      message: 'Audio processed successfully',
      data: meeting,
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process audio',
    });
  }
});

export const getAllMeetings = asyncHandler(async (req, res) => {
  const meetings = await Meeting.find().sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: meetings.length,
    data: meetings,
  });
});

export const getMeetingById = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);

  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: 'Meeting not found',
    });
  }

  res.status(200).json({
    success: true,
    data: meeting,
  });
});

export const deleteMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);

  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: 'Meeting not found',
    });
  }

  await meeting.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Meeting deleted successfully',
  });
});
