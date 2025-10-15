import axios from 'axios';

// Backend URL
const API_URL = 'http://localhost:5000/api/transcription';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Upload and process audio
export const uploadAudio = async (audioFile, onUploadProgress) => {
  const formData = new FormData();
  formData.append('audio', audioFile);

  try {
    const response = await api.post('/upload', formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onUploadProgress) {
          onUploadProgress(percentCompleted);
        }
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Upload failed';
  }
};

// Get all meetings
export const getAllMeetings = async () => {
  try {
    const response = await api.get('/meetings');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch meetings';
  }
};

// Get single meeting
export const getMeeting = async (id) => {
  try {
    const response = await api.get(`/meetings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch meeting';
  }
};

// Delete meeting
export const deleteMeeting = async (id) => {
  try {
    const response = await api.delete(`/meetings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete meeting';
  }
};

export default api;
