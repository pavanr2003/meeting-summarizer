import asyncHandler from 'express-async-handler';
import fs from 'fs/promises';
import Meeting from '../models/Meeting.js';
import AssemblyAIService from '../services/assemblyAIService.js';
import HuggingFaceService from '../services/huggingFaceService.js';

// Initialize services
const assemblyAI = new AssemblyAIService(process.env.ASSEMBLYAI_API_KEY);
const huggingFace = new HuggingFaceService(process.env.HUGGINGFACE_API_KEY);

// @desc    Upload and process audio file
// @route   POST /api/transcription/upload
// @access  Public
export const uploadAndProcess = asyncHandler(async (req, res) => {
  const startTime = Date.now();

  if (!req.file) {
    res.status(400);
    throw new Error('No audio file uploaded');
  }

  const { filename, originalname, size, path: filePath } = req.file;

  let meeting;

  try {
    // Create meeting record
    meeting = await Meeting.create({
      filename,
      originalName: originalname,
      fileSize: size,
      transcript: '',
      status: 'processing',
    });

    // Transcribe with AssemblyAI
    const transcriptionResult = await assemblyAI.transcribeAudio(filePath);

    // Generate summary with HuggingFace
    const summary = await huggingFace.generateSummary(transcriptionResult.transcript);

    // Calculate total processing time
    const processingTime = (Date.now() - startTime) / 1000;

    // Update meeting record
    meeting.transcript = transcriptionResult.transcript;
    meeting.summary = summary;
    meeting.metadata = {
      transcriptionEngine: 'AssemblyAI',
      summarizationEngine: 'HuggingFace BART',
      processingTime,
      audioLength: transcriptionResult.audioLength,
      language: transcriptionResult.language,
    };
    meeting.status = 'completed';
    await meeting.save();

    // Delete uploaded file
    await fs.unlink(filePath);

    res.status(200).json({
      success: true,
      data: {
        id: meeting._id,
        filename: meeting.originalName,
        transcript: meeting.transcript,
        summary: meeting.summary,
        metadata: meeting.metadata,
        createdAt: meeting.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ PROCESSING ERROR:', error);
    
    // Clean up file on error
    try {
      if (filePath) {
        await fs.unlink(filePath);
        console.log('🗑️ Cleaned up file after error');
      }
    } catch (cleanupError) {
      console.error('Failed to cleanup file:', cleanupError.message);
    }

    // Update meeting status to failed if it was created
    try {
      if (meeting) {
        meeting.status = 'failed';
        await meeting.save();
      }
    } catch (saveError) {
      console.error('Failed to update meeting status:', saveError.message);
    }

    // Send detailed error response
    let errorMessage = 'Processing failed';
    
    if (error.message.includes('API key')) {
      errorMessage = 'Invalid API key. Please check your AssemblyAI or HuggingFace API key.';
    } else if (error.message.includes('quota')) {
      errorMessage = 'API quota exceeded. Please wait or upgrade your plan.';
    } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else {
      errorMessage = error.message;
    }

    res.status(500);
    throw new Error(errorMessage);
  }
});

// @desc    Get all meetings
// @route   GET /api/transcription/meetings
// @access  Public
export const getAllMeetings = asyncHandler(async (req, res) => {
  const meetings = await Meeting.find()
    .sort({ createdAt: -1 })
    .select('-__v');

  res.status(200).json({
    success: true,
    count: meetings.length,
    data: meetings,
  });
});

// @desc    Get single meeting
// @route   GET /api/transcription/meetings/:id
// @access  Public
export const getMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);

  if (!meeting) {
    res.status(404);
    throw new Error('Meeting not found');
  }

  res.status(200).json({
    success: true,
    data: meeting,
  });
});

// @desc    Delete meeting
// @route   DELETE /api/transcription/meetings/:id
// @access  Public
export const deleteMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);

  if (!meeting) {
    res.status(404);
    throw new Error('Meeting not found');
  }

  await meeting.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Meeting deleted successfully',
  });
});
