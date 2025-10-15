import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, X } from 'lucide-react';

const AudioUpload = ({ onFileSelect, isProcessing }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.aac', '.flac'],
      'video/*': ['.mp4', '.webm'],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="upload-container">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${
            isProcessing ? 'disabled' : ''
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={48} className="upload-icon" />
          <h3>Drag & Drop Audio File Here</h3>
          <p>or click to browse</p>
          <span className="file-types">
            Supports: MP3, WAV, M4A, MP4, OGG, AAC, FLAC
          </span>
        </div>
      ) : (
        <div className="file-selected">
          <div className="file-info">
            <FileAudio size={40} className="file-icon" />
            <div className="file-details">
              <h4>{selectedFile.name}</h4>
              <p>{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
          {!isProcessing && (
            <button className="remove-btn" onClick={removeFile}>
              <X size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioUpload;
