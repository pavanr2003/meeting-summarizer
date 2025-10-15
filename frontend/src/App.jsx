import { useState } from 'react';
import { Mic, Loader2, RefreshCw } from 'lucide-react';
import AudioUpload from './components/AudioUpload';
import TranscriptDisplay from './components/TranscriptDisplay';
import SummaryDisplay from './components/SummaryDisplay';
import MeetingHistory from './components/MeetingHistory';
import { uploadAudio } from './services/api';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError(null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an audio file first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setUploadProgress(0);

    try {
      const response = await uploadAudio(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      setResult(response.data);
      setSelectedFile(null);
      setRefreshTrigger((prev) => prev + 1); // Refresh history
    } catch (err) {
      setError(err.toString());
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleSelectMeeting = (meeting) => {
    setResult(meeting);
    setSelectedFile(null);
    setError(null);
  };

  const handleNewMeeting = () => {
    setResult(null);
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Mic size={32} />
            <h1>Meeting Summarizer</h1>
          </div>
          <p className="tagline">
            AI-powered meeting transcription & summarization
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        {!result ? (
          <>
            {/* Upload Section */}
            <div className="upload-section">
              <AudioUpload
                onFileSelect={handleFileSelect}
                isProcessing={isProcessing}
              />

              {error && (
                <div className="error-message">
                  <p>❌ {error}</p>
                </div>
              )}

              {selectedFile && !isProcessing && (
                <button className="process-btn" onClick={handleUpload}>
                  <Mic size={20} />
                  Process Meeting
                </button>
              )}

              {isProcessing && (
                <div className="processing-status">
                  <Loader2 size={24} className="spinner" />
                  <p>Processing your meeting...</p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="progress-text">{uploadProgress}%</p>
                  <p className="processing-note">
                    This may take a few minutes depending on file size
                  </p>
                </div>
              )}
            </div>

            {/* Meeting History */}
            <MeetingHistory
              onSelectMeeting={handleSelectMeeting}
              refreshTrigger={refreshTrigger}
            />
          </>
        ) : (
          <>
            {/* Results Section */}
            <div className="results-header">
              <h2>📊 Meeting Analysis</h2>
              <button className="new-meeting-btn" onClick={handleNewMeeting}>
                <RefreshCw size={18} />
                New Meeting
              </button>
            </div>

            <div className="results-container">
              {/* Meeting Metadata */}
              <div className="metadata-section">
                <h4>Meeting Details</h4>
                <div className="metadata-grid">
                  <div className="metadata-item">
                    <strong>File:</strong>
                    <span>{result.filename || result.originalName}</span>
                  </div>
                  <div className="metadata-item">
                    <strong>Engine:</strong>
                    <span>{result.metadata?.transcriptionEngine}</span>
                  </div>
                  <div className="metadata-item">
                    <strong>Processing Time:</strong>
                    <span>
                      {result.metadata?.processingTime?.toFixed(2)}s
                    </span>
                  </div>
                  <div className="metadata-item">
                    <strong>Audio Length:</strong>
                    <span>
                      {result.metadata?.audioLength?.toFixed(0)}s
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <SummaryDisplay summary={result.summary} />

              {/* Transcript */}
              <TranscriptDisplay transcript={result.transcript} />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          Powered by AssemblyAI & Gemini AI • Built with ❤️ using MERN Stack
        </p>
      </footer>
    </div>
  );
}

export default App;
