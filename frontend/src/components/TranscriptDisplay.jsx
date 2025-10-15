import { FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const TranscriptDisplay = ({ transcript }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-section">
      <div className="section-header">
        <div className="header-left">
          <FileText size={24} />
          <h3>Full Transcript</h3>
        </div>
        <button className="copy-btn" onClick={copyToClipboard}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="transcript-content">
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default TranscriptDisplay;
