const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const Story = require('../models/Story');
const StoryWriterAgent = require('../agents/StoryWriterAgent');
const PlotReviewerAgent = require('../agents/PlotReviewerAgent');
const { createResponse, createErrorResponse, paginate } = require('../utils/helpers');

// Initialize agents
const storyAgent = new StoryWriterAgent();
const reviewAgent = new PlotReviewerAgent();

// GET /api/chapters - Get chapters with filters
router.get('/', async (req, res) => {
  try {
    const { storyId, status, page = 1, limit = 10, createdBy } = req.query;
    
    let query = { isActive: true };
    if (storyId) query.storyId = storyId;
    if (status) query.reviewStatus = status;
    if (createdBy) query.createdBy = createdBy;

    const chapters = await Chapter.find(query).populate('storyId').sort({ createdAt: -1 });
    const paginatedResult = paginate(chapters, parseInt(page), parseInt(limit));

    res.json(createResponse(true, paginatedResult, 'Chapters retrieved successfully'));
  } catch (error) {
    console.error('Error getting chapters:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve chapters', 500));
  }
});

// GET /api/chapters/:id - Get a specific chapter
router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id)
      .populate('storyId')
      .populate('characters');
    
    if (!chapter) {
      return res.status(404).json(createErrorResponse('Chapter not found', 404));
    }

    res.json(createResponse(true, chapter, 'Chapter retrieved successfully'));
  } catch (error) {
    console.error('Error getting chapter:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve chapter', 500));
  }
});

// POST /api/chapters - Create a new chapter (manual)
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      chapterNumber, 
      content, 
      summary, 
      storyId, 
      characters = [], 
      settings = [],
      choices = [],
      mood = 'dramatic',
      pacing = 'medium'
    } = req.body;
    
    if (!title || !chapterNumber || !content || !summary || !storyId) {
      return res.status(400).json(createErrorResponse(
        'Title, chapterNumber, content, summary, and storyId are required', 
        400
      ));
    }

    const chapter = new Chapter({
      title,
      chapterNumber,
      content,
      summary,
      wordCount: content.split(/\s+/).length,
      storyId,
      characters,
      settings,
      choices,
      mood,
      pacing,
      createdBy: 'user'
    });

    const savedChapter = await chapter.save();
    
    // Add chapter to story
    const story = await Story.findById(storyId);
    if (story) {
      await story.addChapter(savedChapter._id);
    }

    res.status(201).json(createResponse(true, savedChapter, 'Chapter created successfully'));
  } catch (error) {
    console.error('Error creating chapter:', error.message);
    res.status(500).json(createErrorResponse('Failed to create chapter', 500));
  }
});

// PUT /api/chapters/:id - Update a chapter
router.put('/:id', async (req, res) => {
  try {
    const { 
      title, 
      content, 
      summary, 
      characters, 
      settings, 
      choices, 
      mood, 
      pacing 
    } = req.body;
    
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json(createErrorResponse('Chapter not found', 404));
    }

    // Update allowed fields
    if (title) chapter.title = title;
    if (content) {
      chapter.content = content;
      chapter.wordCount = content.split(/\s+/).length;
    }
    if (summary) chapter.summary = summary;
    if (characters) chapter.characters = characters;
    if (settings) chapter.settings = settings;
    if (choices) chapter.choices = choices;
    if (mood) chapter.mood = mood;
    if (pacing) chapter.pacing = pacing;

    const updatedChapter = await chapter.save();
    res.json(createResponse(true, updatedChapter, 'Chapter updated successfully'));
  } catch (error) {
    console.error('Error updating chapter:', error.message);
    res.status(500).json(createErrorResponse('Failed to update chapter', 500));
  }
});

// DELETE /api/chapters/:id - Delete a chapter (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json(createErrorResponse('Chapter not found', 404));
    }

    chapter.isActive = false;
    await chapter.save();

    res.json(createResponse(true, null, 'Chapter deleted successfully'));
  } catch (error) {
    console.error('Error deleting chapter:', error.message);
    res.status(500).json(createErrorResponse('Failed to delete chapter', 500));
  }
});

// POST /api/chapters/:id/review - Review a specific chapter
router.post('/:id/review', async (req, res) => {
  try {
    const result = await reviewAgent.reviewChapter(req.params.id);
    
    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error reviewing chapter:', error.message);
    res.status(500).json(createErrorResponse('Failed to review chapter', 500));
  }
});

// POST /api/chapters/:id/improve - Improve a chapter
router.post('/:id/improve', async (req, res) => {
  try {
    const { improvementType = 'general' } = req.body;
    
    const result = await storyAgent.improveChapter(req.params.id, improvementType);
    
    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error improving chapter:', error.message);
    res.status(500).json(createErrorResponse('Failed to improve chapter', 500));
  }
});

// POST /api/chapters/:id/approve - Approve a chapter
router.post('/:id/approve', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json(createErrorResponse('Chapter not found', 404));
    }

    await chapter.approve();
    res.json(createResponse(true, chapter, 'Chapter approved successfully'));
  } catch (error) {
    console.error('Error approving chapter:', error.message);
    res.status(500).json(createErrorResponse('Failed to approve chapter', 500));
  }
});

// POST /api/chapters/:id/reject - Reject a chapter
router.post('/:id/reject', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json(createErrorResponse('Chapter not found', 404));
    }

    await chapter.reject();
    res.json(createResponse(true, chapter, 'Chapter rejected successfully'));
  } catch (error) {
    console.error('Error rejecting chapter:', error.message);
    res.status(500).json(createErrorResponse('Failed to reject chapter', 500));
  }
});

// POST /api/chapters/:id/continue - Continue from a choice
router.post('/:id/continue', async (req, res) => {
  try {
    const { choiceId } = req.body;
    
    if (!choiceId) {
      return res.status(400).json(createErrorResponse('Choice ID is required', 400));
    }

    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json(createErrorResponse('Chapter not found', 404));
    }

    const result = await storyAgent.continueFromChoice(chapter.storyId, choiceId);
    
    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error continuing from choice:', error.message);
    res.status(500).json(createErrorResponse('Failed to continue from choice', 500));
  }
});

// GET /api/chapters/needing-review - Get chapters needing review
router.get('/needing-review', async (req, res) => {
  try {
    const result = await reviewAgent.getChaptersNeedingRevision();
    
    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error getting chapters needing review:', error.message);
    res.status(500).json(createErrorResponse('Failed to get chapters needing review', 500));
  }
});

// GET /api/chapters/:id/reading-path - Get reading path for a chapter
router.get('/:id/reading-path', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('storyId');
    if (!chapter) {
      return res.status(404).json(createErrorResponse('Chapter not found', 404));
    }

    // Get all chapters in the story for context
    const allChapters = await Chapter.findByStory(chapter.storyId);
    
    // Find chapters that lead to this one
    const previousChapters = allChapters.filter(ch => 
      ch.choices.some(choice => choice.nextChapter && choice.nextChapter.toString() === chapter._id.toString())
    );

    res.json(createResponse(true, {
      chapter: chapter,
      previousChapters: previousChapters,
      readingPath: {
        current: chapter.chapterNumber,
        total: allChapters.length,
        canContinue: chapter.choices.length > 0
      }
    }, 'Reading path retrieved successfully'));
  } catch (error) {
    console.error('Error getting reading path:', error.message);
    res.status(500).json(createErrorResponse('Failed to get reading path', 500));
  }
});

module.exports = router;
