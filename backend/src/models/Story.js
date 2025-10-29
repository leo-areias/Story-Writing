const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  premise: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true,
    enum: ['fantasy', 'sci-fi', 'mystery', 'romance', 'thriller', 'horror', 'drama', 'comedy', 'adventure', 'historical', 'other']
  },
  setting: {
    time: String,
    place: String,
    atmosphere: String,
    worldRules: [String]
  },
  tone: {
    type: String,
    enum: ['dark', 'light', 'serious', 'humorous', 'mysterious', 'romantic', 'epic', 'intimate'],
    default: 'serious'
  },
  targetAudience: {
    type: String,
    enum: ['children', 'young-adult', 'adult', 'all-ages'],
    default: 'adult'
  },
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'completed', 'archived'],
    default: 'draft'
  },
  currentChapter: {
    type: Number,
    default: 1
  },
  totalChapters: {
    type: Number,
    default: 0
  },
  wordCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  userId: {
    type: String,
    required: true
  },
  characters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  chapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  }],
  plotPoints: [{
    chapter: Number,
    description: String,
    importance: {
      type: String,
      enum: ['major', 'minor', 'climax', 'resolution'],
      default: 'minor'
    }
  }],
  branchingPaths: [{
    fromChapter: Number,
    choice: String,
    toChapter: Number,
    description: String
  }],
  agentProgress: {
    agent1: {
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'failed'],
        default: 'pending'
      },
      completedAt: Date,
      notes: String
    },
    agent2: {
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'failed'],
        default: 'pending'
      },
      completedAt: Date,
      notes: String
    },
    agent3: {
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'failed'],
        default: 'pending'
      },
      completedAt: Date,
      notes: String
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
storySchema.index({ userId: 1, isActive: 1 });
storySchema.index({ genre: 1, status: 1 });
storySchema.index({ createdAt: -1 });

// Virtual for story summary
storySchema.virtual('summary').get(function() {
  return `${this.title} - ${this.genre}: ${this.premise.substring(0, 100)}...`;
});

// Virtual for progress percentage
storySchema.virtual('progressPercentage').get(function() {
  if (this.totalChapters === 0) return 0;
  return Math.round((this.currentChapter / this.totalChapters) * 100);
});

// Method to add a character to the story
storySchema.methods.addCharacter = function(characterId) {
  if (!this.characters.includes(characterId)) {
    this.characters.push(characterId);
  }
  return this.save();
};

// Method to add a chapter to the story
storySchema.methods.addChapter = function(chapterId) {
  if (!this.chapters.includes(chapterId)) {
    this.chapters.push(chapterId);
    this.totalChapters = this.chapters.length;
  }
  return this.save();
};

// Method to update agent progress
storySchema.methods.updateAgentProgress = function(agentName, status, notes = '') {
  this.agentProgress[agentName] = {
    status,
    completedAt: status === 'completed' ? new Date() : undefined,
    notes
  };
  return this.save();
};

// Method to get next chapter number
storySchema.methods.getNextChapterNumber = function() {
  return this.chapters.length + 1;
};

// Static method to find stories by user
storySchema.statics.findByUser = function(userId) {
  return this.find({ userId, isActive: true }).sort({ updatedAt: -1 });
};

// Static method to find public stories
storySchema.statics.findPublic = function() {
  return this.find({ isPublic: true, isActive: true }).sort({ createdAt: -1 });
};

// Static method to find stories by genre
storySchema.statics.findByGenre = function(genre) {
  return this.find({ genre, isActive: true }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Story', storySchema);
