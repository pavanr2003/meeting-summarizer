import { AssemblyAI } from 'assemblyai';
import fs from 'fs';

class AssemblyAIService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('AssemblyAI API key is required');
    }
    
    this.client = new AssemblyAI({
      apiKey: apiKey,
    });
    
    console.log('✅ AssemblyAI service initialized');
  }

  async transcribeAudio(filePath) {
    try {
      console.log('🎤 Starting AssemblyAI transcription...');
      console.log('📁 File path:', filePath);

      // Verify file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const stats = fs.statSync(filePath);
      console.log('📊 File size:', stats.size, 'bytes');

      if (stats.size === 0) {
        throw new Error('File is empty (0 bytes)');
      }

      // Read file as buffer
      const audioData = fs.readFileSync(filePath);
      console.log('✅ File read successfully');

      // Upload to AssemblyAI and transcribe in one step
      console.log('⬆️ Uploading and transcribing...');
      
      const params = {
        audio: audioData,
        language_code: 'en',
      };

      const transcript = await this.client.transcripts.transcribe(params);

      console.log('📊 Transcript status:', transcript.status);
      console.log('📊 Transcript ID:', transcript.id);

      // Check for errors
      if (transcript.status === 'error') {
        console.error('❌ AssemblyAI error:', transcript.error);
        throw new Error(`AssemblyAI error: ${transcript.error}`);
      }

      // Check if text exists
      if (!transcript.text) {
        console.error('❌ No text in transcript:', JSON.stringify(transcript, null, 2));
        throw new Error('No transcription text received from AssemblyAI');
      }

      if (transcript.text.trim() === '') {
        throw new Error('AssemblyAI returned empty transcription text');
      }

      console.log('✅ Transcription successful!');
      console.log('📝 Text preview:', transcript.text.substring(0, 100) + '...');
      console.log('📝 Text length:', transcript.text.length, 'characters');
      console.log('⏱️ Audio duration:', transcript.audio_duration, 'seconds');
      console.log('🎯 Confidence:', transcript.confidence);

      return {
        text: transcript.text,
        duration: transcript.audio_duration || 0,
        confidence: transcript.confidence || 0,
        id: transcript.id,
        status: transcript.status,
      };

    } catch (error) {
      console.error('❌ AssemblyAI transcription failed');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Re-throw with more context
      if (error.response) {
        console.error('API Response:', error.response);
        throw new Error(`AssemblyAI API error: ${error.response.data?.error || error.message}`);
      }
      
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }
}

export default AssemblyAIService;
