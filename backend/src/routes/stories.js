const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const Character = require('../models/Character');
const Chapter = require('../models/Chapter');
const CharacterCreatorAgent = require('../agents/CharacterCreatorAgent');
const StoryWriterAgent = require('../agents/StoryWriterAgent');
const PlotReviewerAgent = require('../agents/PlotReviewerAgent');
const { createResponse, createErrorResponse, paginate } = require('../utils/helpers');

// Initialize agents
const characterAgent = new CharacterCreatorAgent();
const storyAgent = new StoryWriterAgent();
const reviewAgent = new PlotReviewerAgent();

// GET /api/stories - Get all stories for a user
router.get('/', async (req, res) => {
  try {
    const { userId, page = 1, limit = 10, genre, status } = req.query;
    
    if (!userId) {
      return res.status(400).json(createErrorResponse('User ID is required', 400));
    }

    let query = { userId, isActive: true };
    if (genre) query.genre = genre;
    if (status) query.status = status;

    const stories = await Story.find(query).sort({ updatedAt: -1 });
    const paginatedResult = paginate(stories, parseInt(page), parseInt(limit));

    res.json(createResponse(true, paginatedResult, 'Stories retrieved successfully'));
  } catch (error) {
    console.error('Error getting stories:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve stories', 500));
  }
});

// GET /api/stories/public - Get public stories
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 10, genre } = req.query;
    
    let query = { isPublic: true, isActive: true };
    if (genre) query.genre = genre;

    const stories = await Story.find(query).sort({ createdAt: -1 });
    const paginatedResult = paginate(stories, parseInt(page), parseInt(limit));

    res.json(createResponse(true, paginatedResult, 'Public stories retrieved successfully'));
  } catch (error) {
    console.error('Error getting public stories:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve public stories', 500));
  }
});

// GET /api/stories/:id - Get a specific story
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('characters')
      .populate('chapters');
    
    if (!story) {
      return res.status(404).json(createErrorResponse('Story not found', 404));
    }

    res.json(createResponse(true, story, 'Story retrieved successfully'));
  } catch (error) {
    console.error('Error getting story:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve story', 500));
  }
});

// POST /api/stories - Create a new story
router.post('/', async (req, res) => {
  try {
    const { title, premise, genre, tone, targetAudience, userId, tags = [] } = req.body;
    
    if (!title || !premise || !genre || !userId) {
      return res.status(400).json(createErrorResponse('Title, premise, genre, and userId are required', 400));
    }

    const story = new Story({
      title,
      premise,
      genre,
      tone: tone || 'serious',
      targetAudience: targetAudience || 'adult',
      userId,
      tags,
      status: 'draft'
    });

    const savedStory = await story.save();
    res.status(201).json(createResponse(true, savedStory, 'Story created successfully'));
  } catch (error) {
    console.error('Error creating story:', error.message);
    res.status(500).json(createErrorResponse('Failed to create story', 500));
  }
});

// PUT /api/stories/:id - Update a story
router.put('/:id', async (req, res) => {
  try {
    const { title, premise, genre, tone, targetAudience, tags, isPublic } = req.body;
    
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json(createErrorResponse('Story not found', 404));
    }

    // Update allowed fields
    if (title) story.title = title;
    if (premise) story.premise = premise;
    if (genre) story.genre = genre;
    if (tone) story.tone = tone;
    if (targetAudience) story.targetAudience = targetAudience;
    if (tags) story.tags = tags;
    if (isPublic !== undefined) story.isPublic = isPublic;

    const updatedStory = await story.save();
    res.json(createResponse(true, updatedStory, 'Story updated successfully'));
  } catch (error) {
    console.error('Error updating story:', error.message);
    res.status(500).json(createErrorResponse('Failed to update story', 500));
  }
});

// DELETE /api/stories/:id - Delete a story (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json(createErrorResponse('Story not found', 404));
    }

    story.isActive = false;
    await story.save();

    res.json(createResponse(true, null, 'Story deleted successfully'));
  } catch (error) {
    console.error('Error deleting story:', error.message);
    res.status(500).json(createErrorResponse('Failed to delete story', 500));
  }
});

// POST /api/stories/:id/start-creation - Start AI creation process
router.post('/:id/start-creation', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json(createErrorResponse('Story not found', 404));
    }

    // Start with Agent 1: Character Creator
    const characterResult = await characterAgent.createCharactersAndSetting(
      story._id,
      {
        premise: story.premise,
        genre: story.genre,
        userId: story.userId
      }
    );

    if (!characterResult.success) {
      return res.status(500).json(characterResult);
    }

    res.json(createResponse(true, {
      story: story,
      characters: characterResult.data.characters,
      setting: characterResult.data.setting,
      nextStep: 'story-writing'
    }, 'Character creation completed. Ready for story writing.'));

  } catch (error) {
    console.error('Error starting creation:', error.message);
    res.status(500).json(createErrorResponse('Failed to start creation process', 500));
  }
});

// POST /api/stories/:id/write-chapter - Write a new chapter
router.post('/:id/write-chapter', async (req, res) => {
  try {
    const { chapterNumber } = req.body || {};
    
    const result = await storyAgent.writeChapter(req.params.id, chapterNumber);
    
    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error writing chapter:', error.message);
    res.status(500).json(createErrorResponse('Failed to write chapter', 500));
  }
});

// POST /api/stories/:id/write-multiple-chapters - Write multiple chapters
router.post('/:id/write-multiple-chapters', async (req, res) => {
  try {
    const { count = 3 } = req.body;
    
    const result = await storyAgent.writeMultipleChapters(req.params.id, count);
    
    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error writing multiple chapters:', error.message);
    res.status(500).json(createErrorResponse('Failed to write multiple chapters', 500));
  }
});

// POST /api/stories/:id/review - Review entire story
router.post('/:id/review', async (req, res) => {
  try {
    const result = await reviewAgent.reviewStory(req.params.id);
    
    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error reviewing story:', error.message);
    res.status(500).json(createErrorResponse('Failed to review story', 500));
  }
});

// GET /api/stories/:id/status - Get story creation status
router.get('/:id/status', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json(createErrorResponse('Story not found', 404));
    }

    res.json(createResponse(true, {
      story: story,
      agentProgress: story.agentProgress,
      currentStep: story.agentProgress.agent1.status === 'completed' ? 
        (story.agentProgress.agent2.status === 'completed' ? 'review' : 'writing') : 'characters'
    }, 'Story status retrieved successfully'));
  } catch (error) {
    console.error('Error getting story status:', error.message);
    res.status(500).json(createErrorResponse('Failed to get story status', 500));
  }
});

// GET /api/stories/:id/characters - Get story characters
router.get('/:id/characters', async (req, res) => {
  try {
    const characters = await Character.findByStory(req.params.id);
    res.json(createResponse(true, characters, 'Characters retrieved successfully'));
  } catch (error) {
    console.error('Error getting characters:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve characters', 500));
  }
});

// GET /api/stories/:id/chapters - Get story chapters
router.get('/:id/chapters', async (req, res) => {
  try {
    const chapters = await Chapter.findByStory(req.params.id);
    res.json(createResponse(true, chapters, 'Chapters retrieved successfully'));
  } catch (error) {
    console.error('Error getting chapters:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve chapters', 500));
  }
});

module.exports = router;
