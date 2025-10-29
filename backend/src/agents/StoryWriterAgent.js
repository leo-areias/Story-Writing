const geminiService = require('../utils/gemini');
const Chapter = require('../models/Chapter');
const Story = require('../models/Story');
const Character = require('../models/Character');
const { createResponse, createErrorResponse, countWords } = require('../utils/helpers');

class StoryWriterAgent {
  constructor() {
    this.name = 'Story Writer Agent';
    this.version = '1.0.0';
  }

  /**
   * Write a new chapter for a story
   * @param {string} storyId - Story ID
   * @param {number} chapterNumber - Chapter number to write
   * @returns {Object} Agent response
   */
  async writeChapter(storyId, chapterNumber = null) {
    try {
      console.log(`🤖 ${this.name} starting work on story: ${storyId}`);

      const story = await Story.findById(storyId).populate('characters');
      if (!story) {
        return createErrorResponse('Story not found', 404);
      }

      // Determine chapter number
      const nextChapterNumber = chapterNumber || story.getNextChapterNumber();

      // Update story status
      await Story.findByIdAndUpdate(storyId, {
        'agentProgress.agent2.status': 'in-progress',
        'agentProgress.agent2.notes': `Writing chapter ${nextChapterNumber}...`
      });

      // Get previous chapters for context
      const previousChapters = await Chapter.findByStory(storyId);

      // Prepare story data for Gemini
      const storyData = {
        premise: story.premise,
        genre: story.genre,
        characters: story.characters.map(char => ({
          name: char.name,
          description: char.description,
          role: char.role
        })),
        setting: story.setting
      };

      // Generate chapter using Gemini
      console.log(`📝 Generating chapter ${nextChapterNumber}...`);
      console.log('📝 Story data:', JSON.stringify(storyData, null, 2));
      const chapterData = await geminiService.generateChapter(
        storyData, 
        nextChapterNumber, 
        previousChapters
      );
      console.log('📝 Generated chapter data:', JSON.stringify(chapterData, null, 2));

      // Create chapter document
      const chapter = new Chapter({
        title: chapterData.title,
        chapterNumber: nextChapterNumber,
        content: chapterData.content,
        summary: chapterData.summary,
        wordCount: countWords(chapterData.content),
        storyId,
        characters: story.characters.map(char => char._id),
        settings: [{
          location: story.setting.place,
          timeOfDay: 'Not specified',
          atmosphere: story.setting.atmosphere
        }],
        plotPoints: chapterData.plotPoints || [],
        choices: chapterData.choices || [],
        mood: chapterData.mood,
        pacing: chapterData.pacing,
        createdBy: 'agent2'
      });

      const savedChapter = await chapter.save();
      console.log(`✅ Created chapter: ${savedChapter.title}`);

      // Add chapter to story
      await story.addChapter(savedChapter._id);
      story.currentChapter = nextChapterNumber;
      story.wordCount += savedChapter.wordCount;
      await story.save();

      // Update agent progress
      await story.updateAgentProgress('agent2', 'completed', 
        `Chapter ${nextChapterNumber} written successfully`);

      return createResponse(true, {
        chapter: savedChapter,
        story: {
          currentChapter: story.currentChapter,
          totalChapters: story.totalChapters,
          wordCount: story.wordCount
        }
      }, `Chapter ${nextChapterNumber} written successfully`);

    } catch (error) {
      console.error(`❌ ${this.name} error:`, error.message);
      console.error('Full error:', error);
      
      // Update story with error status
      await Story.findByIdAndUpdate(storyId, {
        'agentProgress.agent2.status': 'failed',
        'agentProgress.agent2.notes': `Error: ${error.message}`
      });

      return createErrorResponse(
        `Chapter writing failed: ${error.message}`,
        500,
        { agent: this.name, storyId, chapterNumber }
      );
    }
  }

  /**
   * Continue writing from a specific chapter
   * @param {string} storyId - Story ID
   * @param {string} choiceId - Choice ID to continue from
   * @returns {Object} Agent response
   */
  async continueFromChoice(storyId, choiceId) {
    try {
      const story = await Story.findById(storyId);
      if (!story) {
        return createErrorResponse('Story not found', 404);
      }

      // Find the chapter with the choice
      const chapters = await Chapter.findByStory(storyId);
      let sourceChapter = null;
      let choice = null;

      for (const chapter of chapters) {
        const foundChoice = chapter.choices.id(choiceId);
        if (foundChoice) {
          sourceChapter = chapter;
          choice = foundChoice;
          break;
        }
      }

      if (!sourceChapter || !choice) {
        return createErrorResponse('Choice not found', 404);
      }

      // Write next chapter based on choice
      const nextChapterNumber = story.getNextChapterNumber();
      const result = await this.writeChapter(storyId, nextChapterNumber);

      if (result.success) {
        // Update the choice to point to the new chapter
        choice.nextChapter = result.data.chapter._id;
        await sourceChapter.save();
      }

      return result;

    } catch (error) {
      console.error(`❌ ${this.name} continue error:`, error.message);
      return createErrorResponse(`Failed to continue from choice: ${error.message}`, 500);
    }
  }

  /**
   * Write multiple chapters in sequence
   * @param {string} storyId - Story ID
   * @param {number} count - Number of chapters to write
   * @returns {Object} Agent response
   */
  async writeMultipleChapters(storyId, count = 3) {
    try {
      console.log(`🤖 ${this.name} writing ${count} chapters for story: ${storyId}`);

      const results = [];
      let lastResult = null;

      for (let i = 0; i < count; i++) {
        console.log(`📝 Writing chapter ${i + 1}/${count}...`);
        
        lastResult = await this.writeChapter(storyId);
        
        if (!lastResult.success) {
          return createErrorResponse(
            `Failed to write chapter ${i + 1}: ${lastResult.message}`,
            500
          );
        }

        results.push(lastResult.data.chapter);
      }

      return createResponse(true, {
        chapters: results,
        totalChapters: results.length,
        totalWords: results.reduce((sum, chapter) => sum + chapter.wordCount, 0)
      }, `Successfully wrote ${count} chapters`);

    } catch (error) {
      console.error(`❌ ${this.name} multiple chapters error:`, error.message);
      return createErrorResponse(`Failed to write multiple chapters: ${error.message}`, 500);
    }
  }

  /**
   * Improve an existing chapter
   * @param {string} chapterId - Chapter ID
   * @param {string} improvementType - Type of improvement
   * @returns {Object} Agent response
   */
  async improveChapter(chapterId, improvementType = 'general') {
    try {
      const chapter = await Chapter.findById(chapterId);
      if (!chapter) {
        return createErrorResponse('Chapter not found', 404);
      }

      const story = await Story.findById(chapter.storyId).populate('characters');
      if (!story) {
        return createErrorResponse('Story not found', 404);
      }

      // Generate improvement suggestions using Gemini
      const improvementPrompt = `
      Improve this chapter for a ${story.genre} story:
      
      Chapter: ${chapter.title}
      Content: ${chapter.content}
      
      Improvement type: ${improvementType}
      
      Focus on:
      - Better pacing and flow
      - Enhanced dialogue
      - Stronger character development
      - More engaging descriptions
      - Improved plot progression
      
      Provide the improved version of the chapter.
      `;

      const improvedContent = await geminiService.generateText(improvementPrompt, {
        maxTokens: 3000
      });

      // Create revision
      await chapter.createRevision(
        improvedContent,
        `Improved ${improvementType} aspects`,
        'agent2'
      );

      return createResponse(true, {
        chapter: chapter,
        improvements: improvementType
      }, 'Chapter improved successfully');

    } catch (error) {
      console.error(`❌ ${this.name} improve error:`, error.message);
      return createErrorResponse(`Failed to improve chapter: ${error.message}`, 500);
    }
  }

  /**
   * Get agent status and capabilities
   * @returns {Object} Agent information
   */
  getAgentInfo() {
    return {
      name: this.name,
      version: this.version,
      capabilities: [
        'Write engaging story chapters',
        'Create branching narrative paths',
        'Maintain story consistency',
        'Develop character arcs',
        'Build suspense and pacing',
        'Generate meaningful choices'
      ],
      status: 'active'
    };
  }

  /**
   * Health check for the agent
   * @returns {Object} Health status
   */
  async healthCheck() {
    try {
      const geminiHealth = await geminiService.healthCheck();
      
      return {
        agent: this.name,
        status: geminiHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
        dependencies: {
          gemini: geminiHealth
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        agent: this.name,
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = StoryWriterAgent;
