import { useState, useEffect } from 'react';
import { getMeetings, deleteMeeting } from '../services/api';

export default function MeetingHistory() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const response = await getMeetings();
      setMeetings(response.data);
    } catch (error) {
      console.error('Failed to load meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this meeting?')) {
      try {
        await deleteMeeting(id);
        setMeetings(meetings.filter((m) => m._id !== id));
      } catch (error) {
        alert('Failed to delete meeting');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="history-container">
      <h2>🕒 Meeting History ({meetings.length})</h2>
      
      {meetings.length === 0 ? (
        <p>No meetings yet. Upload an audio file to get started!</p>
      ) : (
        <div className="meeting-list">
          {meetings.map((meeting) => (
            <div key={meeting._id} className="meeting-card">
              <div className="meeting-header">
                <h3>{meeting.fileName}</h3>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(meeting._id)}
                >
                  🗑️
                </button>
              </div>
              <p className="meeting-date">
                {new Date(meeting.createdAt).toLocaleDateString()}
              </p>
              <p className="meeting-summary">{meeting.summary.overview}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
