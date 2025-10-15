import { AssemblyAI } from 'assemblyai';
import fs from 'fs';

class AssemblyAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.client = new AssemblyAI({ apiKey });
    console.log('✅ AssemblyAI initialized');
  }

  async transcribeAudio(filePath) {
    try {
      console.log('🎤 Transcribing...');
      
      const buffer = fs.readFileSync(filePath);
      
      const transcript = await this.client.transcripts.transcribe({
        audio: buffer,
      });

      if (!transcript.text) {
        throw new Error('No text received');
      }

      console.log('✅ Transcription done');

      return {
        text: transcript.text,
        duration: transcript.audio_duration || 0,
      };
    } catch (error) {
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }
}

export default AssemblyAIService;
