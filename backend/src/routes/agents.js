const express = require('express');
const router = express.Router();
const CharacterCreatorAgent = require('../agents/CharacterCreatorAgent');
const StoryWriterAgent = require('../agents/StoryWriterAgent');
const PlotReviewerAgent = require('../agents/PlotReviewerAgent');
const geminiService = require('../utils/gemini');
const { createResponse, createErrorResponse } = require('../utils/helpers');

// Initialize agents
const characterAgent = new CharacterCreatorAgent();
const storyAgent = new StoryWriterAgent();
const reviewAgent = new PlotReviewerAgent();

// GET /api/agents - Get all agents information
router.get('/', async (req, res) => {
  try {
    const agents = [
      characterAgent.getAgentInfo(),
      storyAgent.getAgentInfo(),
      reviewAgent.getAgentInfo()
    ];

    res.json(createResponse(true, agents, 'Agents information retrieved successfully'));
  } catch (error) {
    console.error('Error getting agents info:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve agents information', 500));
  }
});

// GET /api/agents/health - Get health status of all agents
router.get('/health', async (req, res) => {
  try {
    const healthChecks = await Promise.all([
      characterAgent.healthCheck(),
      storyAgent.healthCheck(),
      reviewAgent.healthCheck()
    ]);

    const overallStatus = healthChecks.every(check => check.status === 'healthy') ? 'healthy' : 'unhealthy';

    res.json(createResponse(true, {
      overall: overallStatus,
      agents: healthChecks,
      timestamp: new Date().toISOString()
    }, 'Health status retrieved successfully'));
  } catch (error) {
    console.error('Error getting agents health:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve agents health status', 500));
  }
});

// GET /api/agents/character-creator - Get character creator agent info
router.get('/character-creator', async (req, res) => {
  try {
    const agentInfo = characterAgent.getAgentInfo();
    const healthStatus = await characterAgent.healthCheck();

    res.json(createResponse(true, {
      ...agentInfo,
      health: healthStatus
    }, 'Character creator agent info retrieved successfully'));
  } catch (error) {
    console.error('Error getting character creator info:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve character creator info', 500));
  }
});

// GET /api/agents/story-writer - Get story writer agent info
router.get('/story-writer', async (req, res) => {
  try {
    const agentInfo = storyAgent.getAgentInfo();
    const healthStatus = await storyAgent.healthCheck();

    res.json(createResponse(true, {
      ...agentInfo,
      health: healthStatus
    }, 'Story writer agent info retrieved successfully'));
  } catch (error) {
    console.error('Error getting story writer info:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve story writer info', 500));
  }
});

// GET /api/agents/plot-reviewer - Get plot reviewer agent info
router.get('/plot-reviewer', async (req, res) => {
  try {
    const agentInfo = reviewAgent.getAgentInfo();
    const healthStatus = await reviewAgent.healthCheck();

    res.json(createResponse(true, {
      ...agentInfo,
      health: healthStatus
    }, 'Plot reviewer agent info retrieved successfully'));
  } catch (error) {
    console.error('Error getting plot reviewer info:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve plot reviewer info', 500));
  }
});

// POST /api/agents/test-gemini - Test Gemini API connection
router.post('/test-gemini', async (req, res) => {
  try {
    const { prompt = 'Hello, this is a test message.' } = req.body;
    
    const response = await geminiService.generateText(prompt, { maxTokens: 100 });
    
    res.json(createResponse(true, {
      prompt,
      response,
      timestamp: new Date().toISOString()
    }, 'Gemini API test successful'));
  } catch (error) {
    console.error('Error testing Gemini API:', error.message);
    res.status(500).json(createErrorResponse(`Gemini API test failed: ${error.message}`, 500));
  }
});

// POST /api/agents/character-creator/test - Test character creation
router.post('/character-creator/test', async (req, res) => {
  try {
    const { premise = 'A detective solves mysteries in a small town', genre = 'mystery' } = req.body;
    
    const characters = await geminiService.generateCharacters(premise, genre, 2);
    
    res.json(createResponse(true, {
      premise,
      genre,
      characters,
      timestamp: new Date().toISOString()
    }, 'Character creation test successful'));
  } catch (error) {
    console.error('Error testing character creation:', error.message);
    res.status(500).json(createErrorResponse(`Character creation test failed: ${error.message}`, 500));
  }
});

// POST /api/agents/story-writer/test - Test story writing
router.post('/story-writer/test', async (req, res) => {
  try {
    const storyData = {
      premise: 'A detective solves mysteries in a small town',
      genre: 'mystery',
      characters: [
        { name: 'Detective Smith', description: 'A seasoned detective', role: 'protagonist' }
      ],
      setting: {
        time: 'Present day',
        place: 'Small town',
        atmosphere: 'Mysterious and quiet'
      }
    };
    
    const chapter = await geminiService.generateChapter(storyData, 1);
    
    res.json(createResponse(true, {
      storyData,
      chapter,
      timestamp: new Date().toISOString()
    }, 'Story writing test successful'));
  } catch (error) {
    console.error('Error testing story writing:', error.message);
    res.status(500).json(createErrorResponse(`Story writing test failed: ${error.message}`, 500));
  }
});

// POST /api/agents/plot-reviewer/test - Test plot review
router.post('/plot-reviewer/test', async (req, res) => {
  try {
    const chapterContent = req.body.chapterContent || `
    Detective Smith walked into the old mansion. The door creaked loudly as he pushed it open. 
    Inside, he found a mysterious letter on the table. The letter contained clues about the missing person.
    Smith knew this was going to be a difficult case.
    `;
    
    const storyContext = {
      genre: 'mystery',
      premise: 'A detective solves mysteries in a small town',
      characters: [
        { name: 'Detective Smith', role: 'protagonist', description: 'A seasoned detective' }
      ]
    };
    
    const review = await geminiService.reviewChapter(chapterContent, storyContext);
    
    res.json(createResponse(true, {
      chapterContent,
      storyContext,
      review,
      timestamp: new Date().toISOString()
    }, 'Plot review test successful'));
  } catch (error) {
    console.error('Error testing plot review:', error.message);
    res.status(500).json(createErrorResponse(`Plot review test failed: ${error.message}`, 500));
  }
});

// GET /api/agents/gemini/health - Get Gemini API health status
router.get('/gemini/health', async (req, res) => {
  try {
    const healthStatus = await geminiService.healthCheck();
    
    res.json(createResponse(true, healthStatus, 'Gemini API health status retrieved'));
  } catch (error) {
    console.error('Error getting Gemini health:', error.message);
    res.status(500).json(createErrorResponse('Failed to get Gemini health status', 500));
  }
});

// POST /api/agents/run-workflow - Run complete AI workflow
router.post('/run-workflow', async (req, res) => {
  try {
    const { storyId, steps = ['characters', 'writing', 'review'] } = req.body;
    
    if (!storyId) {
      return res.status(400).json(createErrorResponse('Story ID is required', 400));
    }

    const results = {};
    
    // Step 1: Character Creation
    if (steps.includes('characters')) {
      console.log('🤖 Running character creation...');
      const story = await require('../models/Story').findById(storyId);
      if (story) {
        const charResult = await characterAgent.createCharactersAndSetting(storyId, {
          premise: story.premise,
          genre: story.genre,
          userId: story.userId
        });
        results.characters = charResult;
      }
    }
    
    // Step 2: Story Writing
    if (steps.includes('writing') && results.characters?.success) {
      console.log('🤖 Running story writing...');
      const writeResult = await storyAgent.writeMultipleChapters(storyId, 3);
      results.writing = writeResult;
    }
    
    // Step 3: Plot Review
    if (steps.includes('review') && results.writing?.success) {
      console.log('🤖 Running plot review...');
      const reviewResult = await reviewAgent.reviewStory(storyId);
      results.review = reviewResult;
    }

    res.json(createResponse(true, {
      storyId,
      steps,
      results,
      completed: Object.keys(results).length,
      timestamp: new Date().toISOString()
    }, 'AI workflow completed successfully'));
  } catch (error) {
    console.error('Error running AI workflow:', error.message);
    res.status(500).json(createErrorResponse(`AI workflow failed: ${error.message}`, 500));
  }
});

module.exports = router;
