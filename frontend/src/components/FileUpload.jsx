import { useState } from 'react';

export default function FileUpload({ onUpload, isProcessing }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="upload-container">
      <div
        className={`upload-box ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <>
            <div className="upload-icon">🎤</div>
            <h3>Upload Audio File</h3>
            <p>Drag and drop your audio file here or</p>
            <label className="file-input-label">
              <input
                type="file"
                accept="audio/*"
                onChange={handleChange}
                disabled={isProcessing}
              />
              Choose File
            </label>
            <p className="file-types">Supported: MP3, WAV, M4A, OGG (max 100MB)</p>
          </>
        ) : (
          <div className="file-selected">
            <div className="file-icon">🎵</div>
            <div className="file-info">
              <div className="file-name">{selectedFile.name}</div>
              <div className="file-size">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
            {!isProcessing && (
              <button className="remove-btn" onClick={removeFile}>
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {selectedFile && (
        <button
          className="process-btn"
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            <>
              <span>🎙️</span>
              Process Meeting
            </>
          )}
        </button>
      )}
    </div>
  );
}
