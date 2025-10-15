export default function MeetingResults({ result, error }) {
  if (error) {
    return (
      <div className="error-box">
        <h3>❌ {error}</h3>
      </div>
    );
  }

  if (!result) return null;

  const { summary, transcription } = result.data;

  return (
    <div className="results-container">
      <h2>📊 Meeting Summary</h2>

      <div className="summary-section">
        <h3>Overview</h3>
        <p>{summary.overview}</p>
      </div>

      <div className="summary-section">
        <h3>🎯 Key Decisions</h3>
        <ul>
          {summary.keyDecisions?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="summary-section">
        <h3>✅ Action Items</h3>
        <ul>
          {summary.actionItems?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="summary-section">
        <h3>💬 Discussion Topics</h3>
        <ul>
          {summary.discussionTopics?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="summary-section">
        <h3>🚀 Next Steps</h3>
        <ul>
          {summary.nextSteps?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="transcript-section">
        <h3>📝 Full Transcript</h3>
        <div className="transcript-text">{transcription}</div>
      </div>
    </div>
  );
}
