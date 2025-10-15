import { useState } from 'react';
import FileUpload from './components/FileUpload';
import MeetingResults from './components/MeetingResults';
import MeetingHistory from './components/MeetingHistory';
import { uploadAudio } from './services/api';

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = async (file) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const response = await uploadAudio(file);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🎙️ Meeting Summarizer</h1>
        <p>AI-powered meeting transcription & summarization</p>
      </header>

      <main>
        <FileUpload onUpload={handleUpload} isProcessing={isProcessing} />
        <MeetingResults result={result} error={error} />
        <MeetingHistory />
      </main>
    </div>
  );
}

export default App;
