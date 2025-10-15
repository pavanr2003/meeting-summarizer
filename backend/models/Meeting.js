import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  transcript: {
    type: String,
    required: false,
    default: '',
  },
  summary: {
    overview: {
      type: String,
      default: '',
    },
    keyDecisions: {
      type: [String],
      default: [],
    },
    actionItems: {
      type: [String],
      default: [],
    },
    discussionTopics: {
      type: [String],
      default: [],
    },
    nextSteps: {
      type: [String],
      default: [],
    },
  },
  metadata: {
    transcriptionEngine: String,
    summarizationEngine: String,
    processingTime: Number,
    audioLength: Number,
    language: String,
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;
