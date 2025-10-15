const API_URL = 'http://localhost:5000/api/transcription';

export const uploadAudio = async (file) => {
  const formData = new FormData();
  formData.append('audio', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};

export const getMeetings = async () => {
  const response = await fetch(`${API_URL}/meetings`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch meetings');
  }

  return response.json();
};

export const deleteMeeting = async (id) => {
  const response = await fetch(`${API_URL}/meetings/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete meeting');
  }

  return response.json();
};
