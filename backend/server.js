import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import transcriptionRoutes from './routes/transcription.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🎙️ Meeting Summarizer API',
    version: '1.0.0',
    endpoints: {
      upload: 'POST /api/transcription/upload',
      meetings: 'GET /api/transcription/meetings',
      meeting: 'GET /api/transcription/meetings/:id',
      delete: 'DELETE /api/transcription/meetings/:id',
    },
  });
});

app.use('/api/transcription', transcriptionRoutes);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
// Export for Vercel serverless
export default app;
