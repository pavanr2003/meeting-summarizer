import { useState, useEffect, useCallback } from 'react';
import { History, Trash2, Eye, Calendar } from 'lucide-react';
import { getAllMeetings, deleteMeeting } from '../services/api';

const MeetingHistory = ({ onSelectMeeting, refreshTrigger }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllMeetings();
      setMeetings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load meetings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [refreshTrigger, fetchMeetings]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await deleteMeeting(id);
        fetchMeetings();
      } catch (err) {
        alert('Failed to delete meeting');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="history-section">
        <h2>
          <History size={24} /> Meeting History
        </h2>
        <p className="loading-text">Loading meetings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-section">
        <h2>
          <History size={24} /> Meeting History
        </h2>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="history-section">
      <h2>
        <History size={24} /> Meeting History ({meetings.length})
      </h2>
      {meetings.length === 0 ? (
        <p className="no-meetings">No meetings yet. Upload your first audio!</p>
      ) : (
        <div className="meetings-list">
          {meetings.map((meeting) => (
            <div
              key={meeting._id}
              className="meeting-card"
              onClick={() => onSelectMeeting(meeting)}
            >
              <div className="meeting-info">
                <h4>{meeting.originalName}</h4>
                <p className="meeting-date">
                  <Calendar size={14} />
                  {formatDate(meeting.createdAt)}
                </p>
                <p className="meeting-meta">
                  {meeting.metadata?.transcriptionEngine} •{' '}
                  {meeting.metadata?.processingTime?.toFixed(1)}s
                </p>
              </div>
              <div className="meeting-actions">
                <button
                  className="action-btn view-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMeeting(meeting);
                  }}
                >
                  <Eye size={18} />
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={(e) => handleDelete(meeting._id, e)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingHistory;
