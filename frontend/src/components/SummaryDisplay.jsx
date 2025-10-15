import {
  Lightbulb,
  CheckCircle,
  Target,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

const SummaryDisplay = ({ summary }) => {
  return (
    <div className="summary-container">
      {/* Overview */}
      <div className="result-section">
        <div className="section-header">
          <Lightbulb size={24} />
          <h3>Overview</h3>
        </div>
        <p className="overview-text">{summary.overview}</p>
      </div>

      {/* Key Decisions */}
      <div className="result-section">
        <div className="section-header">
          <CheckCircle size={24} />
          <h3>Key Decisions</h3>
        </div>
        <ul className="summary-list">
          {summary.keyDecisions && summary.keyDecisions.length > 0 ? (
            summary.keyDecisions.map((decision, index) => (
              <li key={index}>{decision}</li>
            ))
          ) : (
            <li className="no-items">No key decisions found</li>
          )}
        </ul>
      </div>

      {/* Action Items */}
      <div className="result-section action-items">
        <div className="section-header">
          <Target size={24} />
          <h3>Action Items</h3>
        </div>
        <ul className="summary-list">
          {summary.actionItems && summary.actionItems.length > 0 ? (
            summary.actionItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))
          ) : (
            <li className="no-items">No action items found</li>
          )}
        </ul>
      </div>

      {/* Discussion Topics */}
      <div className="result-section">
        <div className="section-header">
          <MessageSquare size={24} />
          <h3>Discussion Topics</h3>
        </div>
        <ul className="summary-list">
          {summary.discussionTopics && summary.discussionTopics.length > 0 ? (
            summary.discussionTopics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))
          ) : (
            <li className="no-items">No discussion topics found</li>
          )}
        </ul>
      </div>

      {/* Next Steps */}
      <div className="result-section">
        <div className="section-header">
          <ArrowRight size={24} />
          <h3>Next Steps</h3>
        </div>
        <ul className="summary-list">
          {summary.nextSteps && summary.nextSteps.length > 0 ? (
            summary.nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))
          ) : (
            <li className="no-items">No next steps found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SummaryDisplay;
