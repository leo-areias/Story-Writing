const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  chapterNumber: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  wordCount: {
    type: Number,
    required: true
  },
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  characters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  settings: [{
    location: String,
    timeOfDay: String,
    atmosphere: String
  }],
  plotPoints: [{
    description: String,
    importance: {
      type: String,
      enum: ['major', 'minor', 'climax', 'resolution'],
      default: 'minor'
    }
  }],
  choices: [{
    choiceText: String,
    nextChapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter'
    },
    consequence: String,
    isEnding: {
      type: Boolean,
      default: false
    }
  }],
  mood: {
    type: String,
    enum: ['tense', 'romantic', 'action', 'mysterious', 'dramatic', 'comedic', 'sad', 'hopeful'],
    default: 'dramatic'
  },
  pacing: {
    type: String,
    enum: ['slow', 'medium', 'fast', 'varying'],
    default: 'medium'
  },
  createdBy: {
    type: String,
    enum: ['user', 'agent1', 'agent2', 'agent3'],
    default: 'agent2'
  },
  reviewStatus: {
    type: String,
    enum: ['pending', 'in-review', 'approved', 'needs-revision', 'rejected'],
    default: 'pending'
  },
  reviewNotes: [{
    reviewer: {
      type: String,
      enum: ['agent3', 'user'],
      required: true
    },
    note: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  revisions: [{
    version: Number,
    content: String,
    changes: String,
    revisedBy: String,
    revisedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
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
chapterSchema.index({ storyId: 1, chapterNumber: 1 });
chapterSchema.index({ storyId: 1, isActive: 1 });
chapterSchema.index({ createdBy: 1, reviewStatus: 1 });

// Virtual for chapter reading time (assuming 200 words per minute)
chapterSchema.virtual('readingTimeMinutes').get(function() {
  return Math.ceil(this.wordCount / 200);
});

// Virtual for chapter status
chapterSchema.virtual('status').get(function() {
  if (this.reviewStatus === 'approved' && this.isPublished) {
    return 'published';
  } else if (this.reviewStatus === 'needs-revision') {
    return 'needs-revision';
  } else if (this.reviewStatus === 'in-review') {
    return 'in-review';
  } else {
    return 'draft';
  }
});

// Method to add a character to the chapter
chapterSchema.methods.addCharacter = function(characterId) {
  if (!this.characters.includes(characterId)) {
    this.characters.push(characterId);
  }
  return this.save();
};

// Method to add a choice to the chapter
chapterSchema.methods.addChoice = function(choiceData) {
  this.choices.push(choiceData);
  return this.save();
};

// Method to add review note
chapterSchema.methods.addReviewNote = function(reviewer, note, severity = 'medium') {
  this.reviewNotes.push({
    reviewer,
    note,
    severity,
    timestamp: new Date()
  });
  return this.save();
};

// Method to create a revision
chapterSchema.methods.createRevision = function(newContent, changes, revisedBy) {
  const version = this.revisions.length + 1;
  this.revisions.push({
    version,
    content: newContent,
    changes,
    revisedBy,
    revisedAt: new Date()
  });
  this.content = newContent;
  this.reviewStatus = 'pending';
  return this.save();
};

// Method to approve chapter
chapterSchema.methods.approve = function() {
  this.reviewStatus = 'approved';
  this.isPublished = true;
  return this.save();
};

// Method to reject chapter
chapterSchema.methods.reject = function() {
  this.reviewStatus = 'rejected';
  return this.save();
};

// Static method to find chapters by story
chapterSchema.statics.findByStory = function(storyId) {
  return this.find({ storyId, isActive: true }).sort({ chapterNumber: 1 });
};

// Static method to find chapters by status
chapterSchema.statics.findByStatus = function(status) {
  return this.find({ reviewStatus: status, isActive: true });
};

// Static method to find chapters needing review
chapterSchema.statics.findNeedingReview = function() {
  return this.find({ 
    reviewStatus: { $in: ['pending', 'needs-revision'] }, 
    isActive: true 
  });
};

module.exports = mongoose.model('Chapter', chapterSchema);
