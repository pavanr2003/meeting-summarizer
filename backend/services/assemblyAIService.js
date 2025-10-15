import { AssemblyAI } from 'assemblyai';

class AssemblyAIService {
  constructor(apiKey) {
    const finalKey = apiKey || '687820f0353e4d0da22ec696de1e97d3';
    
    console.log('🔑 AssemblyAI Key being used:', finalKey);
    
    this.client = new AssemblyAI({ apiKey: finalKey });
  }

  async transcribeAudio(audioPath) {
    try {
      console.log('🎤 Starting AssemblyAI transcription...');
      
      const startTime = Date.now();
      
      // Upload and transcribe
      const transcript = await this.client.transcripts.transcribe({
        audio: audioPath,
        speaker_labels: true,
      });

      const processingTime = (Date.now() - startTime) / 1000;

      if (transcript.status === 'error') {
        throw new Error(`Transcription failed: ${transcript.error}`);
      }

      console.log(`✅ Transcription completed in ${processingTime}s`);

      return {
        transcript: transcript.text,
        speakers: this.formatSpeakers(transcript.utterances),
        language: transcript.language_code || 'en',
        duration: processingTime,
        audioLength: transcript.audio_duration,
      };
    } catch (error) {
      console.error('❌ AssemblyAI Error:', error.message);
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  formatSpeakers(utterances) {
    if (!utterances || utterances.length === 0) return null;

    return utterances.map(u => ({
      speaker: u.speaker,
      text: u.text,
      start: u.start,
      end: u.end,
    }));
  }
}

export default AssemblyAIService;
