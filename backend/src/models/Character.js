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

// Pre-save middleware to clean up invalid enum values
characterSchema.pre('save', function(next) {
  // Clean up role field
  if (this.role) {
    const role = this.role.toLowerCase();
    if (role.includes('protagonist')) {
      this.role = 'protagonist';
    } else if (role.includes('antagonist')) {
      this.role = 'antagonist';
    } else if (role.includes('supporting')) {
      this.role = 'supporting';
    } else if (role.includes('minor')) {
      this.role = 'minor';
    } else {
      this.role = 'supporting'; // Default fallback
    }
  }

  // Clean up relationship types
  if (this.relationships && Array.isArray(this.relationships)) {
    this.relationships = this.relationships.map(rel => {
      if (rel.relationshipType) {
        const relType = rel.relationshipType.toLowerCase();
        // Handle complex relationship types with multiple keywords
        if (relType.includes('friend') || relType.includes('ally') || relType.includes('friend/ally')) {
          rel.relationshipType = 'friend';
        } else if (relType.includes('enemy') || relType.includes('adversary') || relType.includes('unknown/adversary') || relType.includes('former colleague/adversary')) {
          rel.relationshipType = 'enemy';
        } else if (relType.includes('family')) {
          rel.relationshipType = 'family';
        } else if (relType.includes('romantic')) {
          rel.relationshipType = 'romantic';
        } else if (relType.includes('mentor') || relType.includes('mentor/source') || relType.includes('source of information')) {
          rel.relationshipType = 'mentor';
        } else if (relType.includes('rival') || relType.includes('rival/adversary')) {
          rel.relationshipType = 'rival';
        } else if (relType.includes('colleague') || relType.includes('superior') || relType.includes('former colleague')) {
          rel.relationshipType = 'colleague';
        } else if (relType.includes('acquaintance') || relType.includes('potential') || relType.includes('suspicious') || relType.includes('acquaintance/source')) {
          rel.relationshipType = 'acquaintance';
        } else {
          rel.relationshipType = 'neutral'; // Default fallback
        }
      }
      return rel;
    });
  }

  next();
});

module.exports = mongoose.model('Character', characterSchema);
