const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = null;
    this.isInitialized = false;
    
    if (this.apiKey) {
      this.initialize();
    } else {
      console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
    }
  }

  initialize() {
    try {
      if (!this.apiKey) {
        throw new Error('Gemini API key is required');
      }

      const genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      this.isInitialized = true;
      console.log('✅ Gemini AI service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI service:', error.message);
      this.isInitialized = false;
    }
  }

  async generateText(prompt, options = {}) {
    if (!this.isInitialized) {
      throw new Error('Gemini AI service not initialized. Check your API key.');
    }

    try {
      const {
        maxTokens = 1000,
        temperature = 0.7,
        topP = 0.8,
        topK = 40
      } = options;

      const generationConfig = {
        maxOutputTokens: maxTokens,
        temperature,
        topP,
        topK,
      };

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('❌ Gemini API error:', error.message);
      throw new Error(`Gemini API request failed: ${error.message}`);
    }
  }

  async generateCharacters(premise, genre, count = 3) {
    const prompt = `
    Create ${count} compelling characters for a ${genre} story based on this premise: "${premise}"
    
    For each character, provide:
    - Name
    - Age and gender
    - Physical description
    - Personality traits (3-4 key traits)
    - Background/history
    - Role in the story (protagonist, antagonist, supporting, minor)
    - Motivations and goals
    - Key relationships with other characters
    
    Format the response as a JSON array with the following structure:
    [
      {
        "name": "Character Name",
        "age": 25,
        "gender": "male/female/other",
        "physicalDescription": "Detailed physical description",
        "personality": "Key personality traits",
        "background": "Character's history and background",
        "role": "protagonist/antagonist/supporting/minor",
        "motivations": ["motivation1", "motivation2"],
        "relationships": [
          {
            "character": "Other Character Name",
            "relationshipType": "friend/enemy/family/romantic/mentor/rival/adversary/colleague/acquaintance",
            "description": "Description of the relationship"
          }
        ]
      }
    ]
    
    Make the characters diverse, interesting, and well-suited for the story premise.
    `;

    let response;
    try {
      response = await this.generateText(prompt, { maxTokens: 4000 });
      
      // Clean the response to extract JSON
      let jsonString = response;
      
      // Remove markdown code blocks if present
      if (jsonString.includes('```json')) {
        jsonString = jsonString.split('```json')[1].split('```')[0];
      } else if (jsonString.includes('```')) {
        jsonString = jsonString.split('```')[1].split('```')[0];
      }
      
      // Try to find the JSON array in the response
      const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      
      return JSON.parse(jsonString.trim());
    } catch (error) {
      console.error('❌ Error generating characters:', error.message);
      console.error('Response was:', response);
      throw new Error('Failed to generate characters');
    }
  }

  async generateSetting(premise, genre) {
    const prompt = `
    Create a detailed setting for a ${genre} story based on this premise: "${premise}"
    
    Provide:
    - Time period (when the story takes place)
    - Location/place (where the story takes place)
    - Atmosphere and mood
    - Key world-building elements (rules, magic system, technology, etc.)
    - Important locations within the setting
    - Cultural and social context
    
    Format the response as JSON:
    {
      "time": "Time period description",
      "place": "Location description",
      "atmosphere": "Atmosphere and mood description",
      "worldRules": ["rule1", "rule2", "rule3"],
      "keyLocations": ["location1", "location2", "location3"],
      "culturalContext": "Cultural and social context"
    }
    `;

    let response;
    try {
      response = await this.generateText(prompt, { maxTokens: 1500 });
      
      // Clean the response to extract JSON
      let jsonString = response;
      
      // Remove markdown code blocks if present
      if (jsonString.includes('```json')) {
        jsonString = jsonString.split('```json')[1].split('```')[0];
      } else if (jsonString.includes('```')) {
        jsonString = jsonString.split('```')[1].split('```')[0];
      }
      
      return JSON.parse(jsonString.trim());
    } catch (error) {
      console.error('❌ Error generating setting:', error.message);
      console.error('Response was:', response);
      throw new Error('Failed to generate setting');
    }
  }

  async generateChapter(storyData, chapterNumber, previousChapters = []) {
    const { premise, genre, characters, setting } = storyData;
    
    const prompt = `
    Write Chapter ${chapterNumber} for a ${genre} story.
    
    Story Premise: ${premise}
    
    Characters:
    ${characters.map(char => `- ${char.name}: ${char.description}`).join('\n')}
    
    Setting:
    - Time: ${setting.time}
    - Place: ${setting.place}
    - Atmosphere: ${setting.atmosphere}
    
    ${previousChapters.length > 0 ? `
    Previous Chapter Summary:
    ${previousChapters.map(ch => `Chapter ${ch.chapterNumber}: ${ch.summary}`).join('\n')}
    ` : ''}
    
    Requirements:
    - Write 800-1200 words
    - Include character dialogue and action
    - Advance the plot meaningfully
    - Create 2-3 meaningful choices for the reader
    - End with a hook or cliffhanger
    - Maintain consistency with previous chapters
    
    Format the response as JSON:
    {
      "title": "Chapter Title",
      "content": "Full chapter content...",
      "summary": "Brief chapter summary",
      "wordCount": 1000,
      "choices": [
        {
          "choiceText": "Choice 1 description",
          "consequence": "What happens if this choice is made",
          "isEnding": false
        },
        {
          "choiceText": "Choice 2 description", 
          "consequence": "What happens if this choice is made",
          "isEnding": false
        }
      ],
      "mood": "tense/romantic/action/mysterious/dramatic/comedic/sad/hopeful",
      "pacing": "slow/medium/fast/varying"
    }
    `;

    let response;
    try {
      response = await this.generateText(prompt, { maxTokens: 3000 });
      
      // Clean the response to extract JSON
      let jsonString = response;
      
      // Remove markdown code blocks if present
      if (jsonString.includes('```json')) {
        jsonString = jsonString.split('```json')[1].split('```')[0];
      } else if (jsonString.includes('```')) {
        jsonString = jsonString.split('```')[1].split('```')[0];
      }
      
      return JSON.parse(jsonString.trim());
    } catch (error) {
      console.error('❌ Error generating chapter:', error.message);
      console.error('Response was:', response);
      throw new Error('Failed to generate chapter');
    }
  }

  async reviewChapter(chapterContent, storyContext) {
    const prompt = `
    Review this chapter for a story and provide constructive feedback:
    
    Chapter Content:
    ${chapterContent}
    
    Story Context:
    - Genre: ${storyContext.genre}
    - Premise: ${storyContext.premise}
    - Characters: ${storyContext.characters.map(c => c.name).join(', ')}
    
    Please analyze:
    1. Plot consistency and pacing
    2. Character development and dialogue
    3. Writing quality and style
    4. Plot holes or inconsistencies
    5. Suggestions for improvement
    
    Format the response as JSON:
    {
      "overallScore": 8.5,
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "suggestions": ["suggestion1", "suggestion2"],
      "plotHoles": ["hole1", "hole2"],
      "characterIssues": ["issue1", "issue2"],
      "recommendations": ["recommendation1", "recommendation2"]
    }
    `;

    let response;
    try {
      response = await this.generateText(prompt, { maxTokens: 2000 });
      
      // Clean the response to extract JSON
      let jsonString = response;
      
      // Remove markdown code blocks if present
      if (jsonString.includes('```json')) {
        jsonString = jsonString.split('```json')[1].split('```')[0];
      } else if (jsonString.includes('```')) {
        jsonString = jsonString.split('```')[1].split('```')[0];
      }
      
      return JSON.parse(jsonString.trim());
    } catch (error) {
      console.error('❌ Error reviewing chapter:', error.message);
      console.error('Response was:', response);
      throw new Error('Failed to review chapter');
    }
  }

  async healthCheck() {
    try {
      if (!this.isInitialized) {
        return { status: 'not-initialized', message: 'Gemini service not initialized' };
      }

      // Test with a simple prompt
      await this.generateText('Hello, this is a test.', { maxTokens: 10 });
      
      return { 
        status: 'healthy', 
        message: 'Gemini API is working correctly' 
      };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        message: 'Gemini API health check failed',
        error: error.message 
      };
    }
  }
}

// Create singleton instance
const geminiService = new GeminiService();

module.exports = geminiService;
