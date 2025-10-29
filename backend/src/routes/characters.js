const express = require('express');
const router = express.Router();
const Character = require('../models/Character');
const Story = require('../models/Story');
const CharacterCreatorAgent = require('../agents/CharacterCreatorAgent');
const { createResponse, createErrorResponse, paginate } = require('../utils/helpers');

// Initialize agent
const characterAgent = new CharacterCreatorAgent();

// GET /api/characters - Get characters with filters
router.get('/', async (req, res) => {
  try {
    const { storyId, role, page = 1, limit = 10, isActive = true } = req.query;
    
    let query = { isActive: isActive === 'true' };
    if (storyId) query.storyId = storyId;
    if (role) query.role = role;

    const characters = await Character.find(query)
      .populate('storyId')
      .populate('relationships.characterId')
      .sort({ createdAt: -1 });
    
    const paginatedResult = paginate(characters, parseInt(page), parseInt(limit));

    res.json(createResponse(true, paginatedResult, 'Characters retrieved successfully'));
  } catch (error) {
    console.error('Error getting characters:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve characters', 500));
  }
});

// GET /api/characters/:id - Get a specific character
router.get('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id)
      .populate('storyId')
      .populate('relationships.characterId');
    
    if (!character) {
      return res.status(404).json(createErrorResponse('Character not found', 404));
    }

    res.json(createResponse(true, character, 'Character retrieved successfully'));
  } catch (error) {
    console.error('Error getting character:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve character', 500));
  }
});

// POST /api/characters - Create a new character (manual)
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      personality, 
      background, 
      role, 
      appearance, 
      motivations = [], 
      relationships = [], 
      storyId 
    } = req.body;
    
    if (!name || !description || !personality || !background || !storyId) {
      return res.status(400).json(createErrorResponse(
        'Name, description, personality, background, and storyId are required', 
        400
      ));
    }

    // Verify story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json(createErrorResponse('Story not found', 404));
    }

    const character = new Character({
      name,
      description,
      personality,
      background,
      role: role || 'supporting',
      appearance: appearance || {},
      motivations,
      relationships,
      storyId,
      createdBy: 'user'
    });

    const savedCharacter = await character.save();
    
    // Add character to story
    await story.addCharacter(savedCharacter._id);

    res.status(201).json(createResponse(true, savedCharacter, 'Character created successfully'));
  } catch (error) {
    console.error('Error creating character:', error.message);
    res.status(500).json(createErrorResponse('Failed to create character', 500));
  }
});

// PUT /api/characters/:id - Update a character
router.put('/:id', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      personality, 
      background, 
      role, 
      appearance, 
      motivations, 
      relationships 
    } = req.body;
    
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json(createErrorResponse('Character not found', 404));
    }

    // Update allowed fields
    if (name) character.name = name;
    if (description) character.description = description;
    if (personality) character.personality = personality;
    if (background) character.background = background;
    if (role) character.role = role;
    if (appearance) character.appearance = { ...character.appearance, ...appearance };
    if (motivations) character.motivations = motivations;
    if (relationships) character.relationships = relationships;

    const updatedCharacter = await character.save();
    res.json(createResponse(true, updatedCharacter, 'Character updated successfully'));
  } catch (error) {
    console.error('Error updating character:', error.message);
    res.status(500).json(createErrorResponse('Failed to update character', 500));
  }
});

// DELETE /api/characters/:id - Delete a character (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json(createErrorResponse('Character not found', 404));
    }

    character.isActive = false;
    await character.save();

    res.json(createResponse(true, null, 'Character deleted successfully'));
  } catch (error) {
    console.error('Error deleting character:', error.message);
    res.status(500).json(createErrorResponse('Failed to delete character', 500));
  }
});

// POST /api/characters/:id/add-relationship - Add a relationship
router.post('/:id/add-relationship', async (req, res) => {
  try {
    const { characterId, relationshipType, description } = req.body;
    
    if (!characterId || !relationshipType) {
      return res.status(400).json(createErrorResponse(
        'Character ID and relationship type are required', 
        400
      ));
    }

    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json(createErrorResponse('Character not found', 404));
    }

    // Verify target character exists
    const targetCharacter = await Character.findById(characterId);
    if (!targetCharacter) {
      return res.status(404).json(createErrorResponse('Target character not found', 404));
    }

    // Add relationship
    character.relationships.push({
      characterId,
      relationshipType,
      description: description || ''
    });

    const updatedCharacter = await character.save();
    res.json(createResponse(true, updatedCharacter, 'Relationship added successfully'));
  } catch (error) {
    console.error('Error adding relationship:', error.message);
    res.status(500).json(createErrorResponse('Failed to add relationship', 500));
  }
});

// DELETE /api/characters/:id/relationships/:relationshipId - Remove a relationship
router.delete('/:id/relationships/:relationshipId', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json(createErrorResponse('Character not found', 404));
    }

    const relationship = character.relationships.id(req.params.relationshipId);
    if (!relationship) {
      return res.status(404).json(createErrorResponse('Relationship not found', 404));
    }

    relationship.remove();
    await character.save();

    res.json(createResponse(true, character, 'Relationship removed successfully'));
  } catch (error) {
    console.error('Error removing relationship:', error.message);
    res.status(500).json(createErrorResponse('Failed to remove relationship', 500));
  }
});

// GET /api/characters/story/:storyId - Get all characters for a story
router.get('/story/:storyId', async (req, res) => {
  try {
    const characters = await Character.findByStory(req.params.storyId);
    res.json(createResponse(true, characters, 'Story characters retrieved successfully'));
  } catch (error) {
    console.error('Error getting story characters:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve story characters', 500));
  }
});

// GET /api/characters/story/:storyId/main - Get main characters for a story
router.get('/story/:storyId/main', async (req, res) => {
  try {
    const characters = await Character.findMainCharacters(req.params.storyId);
    res.json(createResponse(true, characters, 'Main characters retrieved successfully'));
  } catch (error) {
    console.error('Error getting main characters:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve main characters', 500));
  }
});

// POST /api/characters/story/:storyId/update-relationships - Update character relationships
router.post('/story/:storyId/update-relationships', async (req, res) => {
  try {
    const result = await characterAgent.updateCharacterRelationships(req.params.storyId);
    
    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating relationships:', error.message);
    res.status(500).json(createErrorResponse('Failed to update relationships', 500));
  }
});

// GET /api/characters/:id/relationships - Get character relationships
router.get('/:id/relationships', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id).populate('relationships.characterId');
    if (!character) {
      return res.status(404).json(createErrorResponse('Character not found', 404));
    }

    const relationships = character.getRelationships();
    res.json(createResponse(true, relationships, 'Character relationships retrieved successfully'));
  } catch (error) {
    console.error('Error getting character relationships:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve character relationships', 500));
  }
});

// GET /api/characters/roles/:role - Get characters by role
router.get('/roles/:role', async (req, res) => {
  try {
    const { storyId, page = 1, limit = 10 } = req.query;
    
    let query = { role: req.params.role, isActive: true };
    if (storyId) query.storyId = storyId;

    const characters = await Character.find(query)
      .populate('storyId')
      .sort({ createdAt: -1 });
    
    const paginatedResult = paginate(characters, parseInt(page), parseInt(limit));

    res.json(createResponse(true, paginatedResult, 'Characters by role retrieved successfully'));
  } catch (error) {
    console.error('Error getting characters by role:', error.message);
    res.status(500).json(createErrorResponse('Failed to retrieve characters by role', 500));
  }
});

module.exports = router;
