class HuggingFaceService {
  constructor(apiKey) {
    console.log('🔑 Using Smart Local Summarizer (No API required)');
  }

  async generateSummary(transcript) {
    try {
      console.log('🤖 Generating intelligent summary...');
      console.log('📝 Transcript length:', transcript.length, 'characters');
      
      const summary = this.createSmartSummary(transcript);
      
      console.log('✅ Summary generated successfully');
      console.log('📊 Summary sections:', {
        overview: 'Generated',
        decisions: summary.keyDecisions.length,
        actions: summary.actionItems.length,
        topics: summary.discussionTopics.length,
        steps: summary.nextSteps.length,
      });
      
      return summary;
    } catch (error) {
      console.error('❌ Error:', error.message);
      return this.createBasicSummary(transcript);
    }
  }

  createSmartSummary(transcript) {
    // Split into sentences
    const sentences = transcript
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20);

    // Extract keywords
    const keywords = this.extractKeywords(transcript);
    
    // Word and sentence count
    const wordCount = transcript.split(/\s+/).length;
    
    // Create overview from beginning
    const overview = this.generateOverview(sentences, wordCount, keywords);
    
    // Extract different types of content
    const keyDecisions = this.extractContent(sentences, [
      'decide', 'decided', 'agree', 'agreed', 'approve', 'approved',
      'confirm', 'confirmed', 'resolution', 'conclude', 'concluded',
      'finalize', 'finalized', 'commit', 'committed'
    ]);
    
    const actionItems = this.extractContent(sentences, [
      'will', 'should', 'must', 'need to', 'have to', 'going to',
      'task', 'action', 'plan to', 'responsible', 'deadline',
      'assign', 'complete', 'finish', 'deliver', 'prepare'
    ]);
    
    const discussionTopics = this.createTopics(keywords, sentences);
    
    const nextSteps = this.extractContent(sentences, [
      'next', 'following', 'future', 'upcoming', 'schedule',
      'later', 'soon', 'tomorrow', 'next week', 'next month',
      'follow up', 'continue', 'revisit'
    ]);

    return {
      overview,
      keyDecisions: keyDecisions.length > 0 ? keyDecisions : ['No specific decisions identified in this meeting'],
      actionItems: actionItems.length > 0 ? actionItems : ['No action items identified - review transcript for details'],
      discussionTopics,
      nextSteps: nextSteps.length > 0 ? nextSteps : ['No next steps specified - see full transcript'],
    };
  }

  generateOverview(sentences, wordCount, keywords) {
    if (sentences.length === 0) {
      return 'No meaningful content found in transcript.';
    }

    // Use first 2-3 sentences as overview
    const overviewSentences = sentences.slice(0, Math.min(3, sentences.length));
    const overview = overviewSentences.join('. ') + '.';
    
    // Add summary statistics
    const topKeywords = keywords.slice(0, 3).join(', ');
    const stats = `Meeting covered ${sentences.length} key points in ${wordCount} words. Main topics: ${topKeywords}.`;
    
    return overview.length > 50 
      ? `${overview} ${stats}` 
      : stats;
  }

  extractContent(sentences, keywords) {
    const matches = [];
    const seen = new Set();
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      
      // Check if sentence contains any keyword
      const hasKeyword = keywords.some(keyword => 
        lowerSentence.includes(keyword.toLowerCase())
      );
      
      if (hasKeyword) {
        // Avoid duplicates
        const normalized = sentence.substring(0, 50).toLowerCase();
        if (!seen.has(normalized)) {
          matches.push(sentence);
          seen.add(normalized);
        }
      }
      
      // Limit to 5 items
      if (matches.length >= 5) break;
    }
    
    return matches;
  }

  createTopics(keywords, sentences) {
    const topics = [];
    
    for (let i = 0; i < Math.min(5, keywords.length); i++) {
      const keyword = keywords[i];
      
      // Find sentence mentioning this keyword
      const relevantSentence = sentences.find(s => 
        s.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (relevantSentence) {
        const snippet = relevantSentence.length > 100 
          ? relevantSentence.substring(0, 100) + '...'
          : relevantSentence;
        topics.push(`${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: ${snippet}`);
      } else {
        topics.push(`Discussion about ${keyword}`);
      }
    }
    
    return topics.length > 0 ? topics : ['General discussion - see full transcript'];
  }

  extractKeywords(text) {
    // Split into words and count frequency
    const words = text.toLowerCase().split(/\W+/);
    
    const stopWords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 
      'in', 'with', 'to', 'for', 'of', 'as', 'by', 'this', 'that', 'it',
      'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do',
      'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
      'can', 'said', 'say', 'also', 'than', 'them', 'then', 'these',
      'those', 'very', 'some', 'such', 'just', 'about', 'into', 'through'
    ]);
    
    const wordFreq = {};
    
    words.forEach(word => {
      // Only count meaningful words (length > 4, not a stop word)
      if (word.length > 4 && !stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    // Sort by frequency and get top keywords
    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word]) => word);
  }

  createBasicSummary(transcript) {
    const wordCount = transcript.split(/\s+/).length;
    
    return {
      overview: transcript.length > 200 
        ? transcript.substring(0, 200) + '...'
        : transcript || 'No transcript available.',
      keyDecisions: ['Unable to analyze - see full transcript'],
      actionItems: ['Unable to analyze - see full transcript'],
      discussionTopics: ['Unable to analyze - see full transcript'],
      nextSteps: ['Unable to analyze - see full transcript'],
    };
  }
}

export default HuggingFaceService;
