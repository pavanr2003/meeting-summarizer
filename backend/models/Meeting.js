import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    transcription: {
      type: String,
      required: true,
    },
    summary: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    audioUrl: {
      type: String,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;
