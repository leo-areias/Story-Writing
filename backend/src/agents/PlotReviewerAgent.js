const geminiService = require('../utils/gemini');
const Chapter = require('../models/Chapter');
const Story = require('../models/Story');
const { createResponse, createErrorResponse } = require('../utils/helpers');

class PlotReviewerAgent {
  constructor() {
    this.name = 'Plot Reviewer Agent';
    this.version = '1.0.0';
  }

  /**
   * Review a specific chapter
   * @param {string} chapterId - Chapter ID to review
   * @returns {Object} Agent response
   */
  async reviewChapter(chapterId) {
    try {
      console.log(`🤖 ${this.name} reviewing chapter: ${chapterId}`);

      const chapter = await Chapter.findById(chapterId);
      if (!chapter) {
        return createErrorResponse('Chapter not found', 404);
      }

      const story = await Story.findById(chapter.storyId).populate('characters');
      if (!story) {
        return createErrorResponse('Story not found', 404);
      }

      // Update chapter review status
      chapter.reviewStatus = 'in-review';
      await chapter.save();

      // Prepare story context for review
      const storyContext = {
        genre: story.genre,
        premise: story.premise,
        characters: story.characters.map(char => ({
          name: char.name,
          role: char.role,
          description: char.description
        }))
      };

      // Generate review using Gemini
      console.log('📝 Generating chapter review...');
      const reviewData = await geminiService.reviewChapter(chapter.content, storyContext);

      // Add review notes to chapter
      await chapter.addReviewNote(
        'agent3',
        `Overall Score: ${reviewData.overallScore}/10. Strengths: ${reviewData.strengths.join(', ')}. Weaknesses: ${reviewData.weaknesses.join(', ')}`,
        reviewData.overallScore < 6 ? 'high' : reviewData.overallScore < 8 ? 'medium' : 'low'
      );

      // Add detailed suggestions
      for (const suggestion of reviewData.suggestions) {
        await chapter.addReviewNote('agent3', suggestion, 'medium');
      }

      // Add plot hole notes
      for (const plotHole of reviewData.plotHoles) {
        await chapter.addReviewNote('agent3', `Plot Hole: ${plotHole}`, 'high');
      }

      // Add character issue notes
      for (const issue of reviewData.characterIssues) {
        await chapter.addReviewNote('agent3', `Character Issue: ${issue}`, 'medium');
      }

      // Determine final review status
      let finalStatus = 'approved';
      if (reviewData.overallScore < 5) {
        finalStatus = 'rejected';
      } else if (reviewData.overallScore < 7) {
        finalStatus = 'needs-revision';
      }

      chapter.reviewStatus = finalStatus;
      await chapter.save();

      console.log(`✅ Chapter review completed with score: ${reviewData.overallScore}/10`);

      return createResponse(true, {
        chapter: chapter,
        review: reviewData,
        status: finalStatus
      }, `Chapter review completed with score ${reviewData.overallScore}/10`);

    } catch (error) {
      console.error(`❌ ${this.name} review error:`, error.message);
      
      // Update chapter with error status
      await Chapter.findByIdAndUpdate(chapterId, {
        reviewStatus: 'pending',
        $push: {
          reviewNotes: {
            reviewer: 'agent3',
            note: `Review failed: ${error.message}`,
            severity: 'high',
            timestamp: new Date()
          }
        }
      });

      return createErrorResponse(
        `Chapter review failed: ${error.message}`,
        500,
        { agent: this.name, chapterId }
      );
    }
  }

  /**
   * Review entire story for consistency and plot issues
   * @param {string} storyId - Story ID to review
   * @returns {Object} Agent response
   */
  async reviewStory(storyId) {
    try {
      console.log(`🤖 ${this.name} reviewing entire story: ${storyId}`);

      const story = await Story.findById(storyId);
      if (!story) {
        return createErrorResponse('Story not found', 404);
      }

      // Update story status
      await Story.findByIdAndUpdate(storyId, {
        'agentProgress.agent3.status': 'in-progress',
        'agentProgress.agent3.notes': 'Reviewing entire story...'
      });

      const chapters = await Chapter.findByStory(storyId);
      if (chapters.length === 0) {
        return createErrorResponse('No chapters found to review', 404);
      }

      // Review each chapter
      const reviewResults = [];
      let totalScore = 0;
      let issuesFound = 0;

      for (const chapter of chapters) {
        console.log(`📝 Reviewing chapter ${chapter.chapterNumber}...`);
        
        const result = await this.reviewChapter(chapter._id);
        if (result.success) {
          reviewResults.push(result.data);
          totalScore += result.data.review.overallScore;
          if (result.data.review.overallScore < 7) {
            issuesFound++;
          }
        }
      }

      const averageScore = totalScore / chapters.length;
      
      // Generate overall story analysis
      const storyAnalysisPrompt = `
      Analyze this entire story for overall consistency and plot development:
      
      Story: ${story.title}
      Genre: ${story.genre}
      Premise: ${story.premise}
      
      Chapters: ${chapters.map(ch => `Chapter ${ch.chapterNumber}: ${ch.title}`).join('\n')}
      
      Provide analysis of:
      1. Overall plot consistency
      2. Character development arc
      3. Pacing throughout the story
      4. Theme development
      5. Ending satisfaction
      6. Suggestions for improvement
      
      Format as JSON with overall score and detailed analysis.
      `;

      const storyAnalysis = await geminiService.generateText(storyAnalysisPrompt, {
        maxTokens: 2000
      });

      // Update story with review results
      await story.updateAgentProgress('agent3', 'completed', 
        `Story review completed. Average score: ${averageScore.toFixed(1)}/10. Issues found: ${issuesFound}`);

      return createResponse(true, {
        story: story,
        chapters: reviewResults,
        overallScore: averageScore,
        issuesFound,
        analysis: storyAnalysis
      }, `Story review completed with average score ${averageScore.toFixed(1)}/10`);

    } catch (error) {
      console.error(`❌ ${this.name} story review error:`, error.message);
      
      // Update story with error status
      await Story.findByIdAndUpdate(storyId, {
        'agentProgress.agent3.status': 'failed',
        'agentProgress.agent3.notes': `Error: ${error.message}`
      });

      return createErrorResponse(
        `Story review failed: ${error.message}`,
        500,
        { agent: this.name, storyId }
      );
    }
  }

  /**
   * Suggest plot improvements for a story
   * @param {string} storyId - Story ID
   * @returns {Object} Agent response
   */
  async suggestPlotImprovements(storyId) {
    try {
      const story = await Story.findById(storyId).populate('characters');
      if (!story) {
        return createErrorResponse('Story not found', 404);
      }

      const chapters = await Chapter.findByStory(storyId);
      
      const improvementPrompt = `
      Analyze this story and suggest specific plot improvements:
      
      Story: ${story.title}
      Genre: ${story.genre}
      Premise: ${story.premise}
      
      Characters: ${story.characters.map(char => 
        `${char.name} (${char.role}): ${char.description}`
      ).join('\n')}
      
      Chapters: ${chapters.map(ch => 
        `Chapter ${ch.chapterNumber}: ${ch.title} - ${ch.summary}`
      ).join('\n')}
      
      Suggest:
      1. Plot holes to fix
      2. Character development improvements
      3. Pacing adjustments
      4. Missing plot elements
      5. Ending improvements
      6. Specific chapter revisions needed
      
      Provide actionable suggestions with specific examples.
      `;

      const suggestions = await geminiService.generateText(improvementPrompt, {
        maxTokens: 2500
      });

      return createResponse(true, {
        story: story,
        suggestions: suggestions,
        chaptersReviewed: chapters.length
      }, 'Plot improvement suggestions generated');

    } catch (error) {
      console.error(`❌ ${this.name} suggestions error:`, error.message);
      return createErrorResponse(`Failed to generate suggestions: ${error.message}`, 500);
    }
  }

  /**
   * Get chapters that need revision
   * @param {string} storyId - Story ID (optional)
   * @returns {Object} Agent response
   */
  async getChaptersNeedingRevision(storyId = null) {
    try {
      let query = { reviewStatus: 'needs-revision', isActive: true };
      if (storyId) {
        query.storyId = storyId;
      }

      const chapters = await Chapter.find(query).populate('storyId');
      
      return createResponse(true, {
        chapters: chapters,
        count: chapters.length
      }, `Found ${chapters.length} chapters needing revision`);

    } catch (error) {
      console.error(`❌ ${this.name} get revisions error:`, error.message);
      return createErrorResponse(`Failed to get chapters needing revision: ${error.message}`, 500);
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
        'Review chapter quality and consistency',
        'Identify plot holes and inconsistencies',
        'Suggest character development improvements',
        'Analyze story pacing and flow',
        'Provide detailed feedback and recommendations',
        'Score content quality'
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

module.exports = PlotReviewerAgent;
