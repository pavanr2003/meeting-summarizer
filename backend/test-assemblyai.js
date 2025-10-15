import { AssemblyAI } from 'assemblyai';

const client = new AssemblyAI({
  apiKey: '687820f0353e4d0da22ec696de1e97d3',
});

const audioUrl = 'https://storage.googleapis.com/aai-docs-samples/espn.mp3';

console.log('Testing AssemblyAI API key...');

const transcript = await client.transcripts.transcribe({
  audio: audioUrl,
});

console.log('Status:', transcript.status);
console.log('Text:', transcript.text?.substring(0, 100));
