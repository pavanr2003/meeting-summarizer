import Groq from 'groq-sdk';

class GroqService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Groq API key is required');
    }
    
    this.groq = new Groq({
      apiKey: apiKey,
    });
    
    console.log('✅ Groq service initialized');
  }

  async generateSummary(text) {
    try {
      console.log('🤖 Generating summary...');
      
      const prompt = `Analyze this meeting transcript and provide a structured summary in JSON format.

Transcript:
${text.substring(0, 3000)}

Return ONLY valid JSON with this exact structure:
{
  "overview": "2-3 sentence summary",
  "keyDecisions": ["decision 1", "decision 2"],
  "actionItems": ["action 1", "action 2"],
  "discussionTopics": ["topic 1", "topic 2"],
  "nextSteps": ["step 1", "step 2"]
}`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a meeting summarization expert. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama3-8b-8192',
        temperature: 0.5,
        max_tokens: 1000,
      });

      let responseText = completion.choices[0]?.message?.content || '{}';
      
      // Clean markdown
      responseText = responseText.replace(/``````\n?/g, '').trim();

      const summary = JSON.parse(responseText);

      console.log('✅ Summary generated');

      return {
        overview: summary.overview || 'No overview available',
        keyDecisions: Array.isArray(summary.keyDecisions) ? summary.keyDecisions : [],
        actionItems: Array.isArray(summary.actionItems) ? summary.actionItems : [],
        discussionTopics: Array.isArray(summary.discussionTopics) ? summary.discussionTopics : [],
        nextSteps: Array.isArray(summary.nextSteps) ? summary.nextSteps : [],
      };

    } catch (error) {
      console.error('❌ Summary error:', error.message);
      return this.getFallbackSummary(text);
    }
  }

  getFallbackSummary(text) {
    const words = text.split(' ');
    const preview = words.slice(0, 100).join(' ');

    return {
      overview: `Transcript contains ${words.length} words. ${preview}...`,
      keyDecisions: ['Summary generation failed'],
      actionItems: ['Please review transcript'],
      discussionTopics: ['See full transcript'],
      nextSteps: ['Manual review needed'],
    };
  }
}

export default GroqService;
