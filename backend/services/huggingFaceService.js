import { HfInference } from '@huggingface/inference';

class HuggingFaceService {
  constructor(apiKey) {
    this.hf = new HfInference(apiKey);
  }

  async generateSummary(text) {
    try {
      const prompt = `Analyze this meeting transcript and provide a structured summary:

${text}

Please provide:
1. Overview (2-3 sentences)
2. Key Decisions Made
3. Action Items
4. Discussion Topics
5. Next Steps`;

      const response = await this.hf.textGeneration({
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.95,
        },
      });

      const summary = this.parseSummary(response.generated_text);
      return summary;
    } catch (error) {
      console.error('HuggingFace error:', error);
      return this.generateFallbackSummary(text);
    }
  }

  parseSummary(text) {
    return {
      overview: this.extractSection(text, 'Overview'),
      keyDecisions: this.extractSection(text, 'Key Decisions'),
      actionItems: this.extractSection(text, 'Action Items'),
      discussionTopics: this.extractSection(text, 'Discussion Topics'),
      nextSteps: this.extractSection(text, 'Next Steps'),
    };
  }

  extractSection(text, sectionName) {
    const regex = new RegExp(`${sectionName}[:\\s]+([\\s\\S]*?)(?=\\n\\d+\\.|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : 'Not available';
  }

  generateFallbackSummary(text) {
    const words = text.split(' ');
    const preview = words.slice(0, 50).join(' ');

    return {
      overview: `This meeting transcript contains ${words.length} words. ${preview}...`,
      keyDecisions: 'Summary generation unavailable',
      actionItems: 'Please review transcript',
      discussionTopics: 'Not available',
      nextSteps: 'Not available',
    };
  }
}

export default HuggingFaceService;
