import asyncHandler from 'express-async-handler';
import fs from 'fs';
import Meeting from '../models/Meeting.js';
import AssemblyAIService from '../services/assemblyAIService.js';
import HuggingFaceService from '../services/huggingFaceService.js';

// Initialize services
const assemblyAIService = new AssemblyAIService(process.env.ASSEMBLYAI_API_KEY);
const huggingFaceService = new HuggingFaceService(process.env.HUGGINGFACE_API_KEY);

// @desc    Upload and process audio file
// @route   POST /api/transcription/upload
// @access  Public
export const uploadAudio = asyncHandler(async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file provided',
      });
    }

    console.log('📁 File uploaded:', req.file.filename);
    console.log('📍 File path:', req.file.path);
    console.log('📊 File size:', req.file.size, 'bytes');

    // Verify file exists
    if (!fs.existsSync(req.file.path)) {
      throw new Error(`File not found after upload: ${req.file.path}`);
    }

    // Start transcription
    console.log('🎤 Starting transcription with AssemblyAI...');
    const transcriptionResult = await assemblyAIService.transcribeAudio(req.file.path);

    if (!transcriptionResult || !transcriptionResult.text) {
      throw new Error('Transcription failed - no text received from AssemblyAI');
    }

    console.log('✅ Transcription completed');
    console.log('📝 Transcript length:', transcriptionResult.text.length, 'characters');
    console.log('🤖 Generating summary with HuggingFace...');

    // Generate summary
    const summary = await huggingFaceService.generateSummary(transcriptionResult.text);

    console.log('✅ Summary generated');

    // Save to database
    const meeting = await Meeting.create({
      fileName: req.file.originalname,
      fileSize: req.file.size,
      transcription: transcriptionResult.text,
      summary,
      audioUrl: req.file.path,
      duration: transcriptionResult.duration || 0,
    });

    console.log('💾 Meeting saved to database with ID:', meeting._id);

    // Clean up temporary file
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Temporary file deleted:', req.file.path);
      }
    } catch (cleanupError) {
      console.error('⚠️ Cleanup error (non-critical):', cleanupError.message);
    }

    // Return response
    res.status(201).json({
      success: true,
      message: 'Audio processed successfully',
      data: meeting,
    });

  } catch (error) {
    console.error('❌ Upload/Processing error:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Clean up file on error
    if (req.file && req.file.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Cleaned up file after error');
        }
      } catch (cleanupError) {
        console.error('⚠️ Cleanup error:', cleanupError.message);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process audio',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// @desc    Get all meetings
// @route   GET /api/transcription/meetings
// @access  Public
export const getAllMeetings = asyncHandler(async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .sort({ createdAt: -1 })
      .select('-transcription'); // Exclude full transcription for list view

    console.log('📋 Retrieved', meetings.length, 'meetings');

    res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings,
    });
  } catch (error) {
    console.error('❌ Error getting meetings:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve meetings',
      error: error.message,
    });
  }
});

// @desc    Get single meeting by ID
// @route   GET /api/transcription/meetings/:id
// @access  Public
export const getMeetingById = asyncHandler(async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
      });
    }

    console.log('📄 Retrieved meeting:', meeting._id);

    res.status(200).json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    console.error('❌ Error getting meeting:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found - invalid ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve meeting',
      error: error.message,
    });
  }
});

// @desc    Delete meeting
// @route   DELETE /api/transcription/meetings/:id
// @access  Public
export const deleteMeeting = asyncHandler(async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
      });
    }

    await meeting.deleteOne();

    console.log('🗑️ Deleted meeting:', meeting._id);

    res.status(200).json({
      success: true,
      message: 'Meeting deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('❌ Error deleting meeting:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found - invalid ID',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete meeting',
      error: error.message,
    });
  }
});
