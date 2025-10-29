const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  personality: {
    type: String,
    required: true
  },
  background: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['protagonist', 'antagonist', 'supporting', 'minor'],
    default: 'supporting'
  },
  appearance: {
    age: Number,
    gender: String,
    physicalDescription: String,
    clothing: String
  },
  motivations: [String],
  relationships: [{
    characterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character'
    },
    relationshipType: {
      type: String,
      enum: ['friend', 'enemy', 'family', 'romantic', 'mentor', 'rival', 'neutral', 'adversary', 'adversarial', 'colleague', 'acquaintance'],
      default: 'neutral'
    },
    description: String
  }],
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  createdBy: {
    type: String,
    enum: ['user', 'agent1', 'agent2', 'agent3'],
    default: 'agent1'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
characterSchema.index({ storyId: 1, isActive: 1 });
characterSchema.index({ name: 1, storyId: 1 });

// Virtual for character summary
characterSchema.virtual('summary').get(function() {
  return `${this.name} - ${this.role}: ${this.description.substring(0, 100)}...`;
});

// Method to get character relationships
characterSchema.methods.getRelationships = function() {
  return this.relationships.map(rel => ({
    character: rel.characterId,
    type: rel.relationshipType,
    description: rel.description
  }));
};

// Static method to find characters by story
characterSchema.statics.findByStory = function(storyId) {
  return this.find({ storyId, isActive: true }).populate('relationships.characterId');
};

// Static method to find main characters
characterSchema.statics.findMainCharacters = function(storyId) {
  return this.find({ 
    storyId, 
    isActive: true, 
    role: { $in: ['protagonist', 'antagonist'] } 
  });
};

module.exports = mongoose.model('Character', characterSchema);
