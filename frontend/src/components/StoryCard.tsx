import { type Story } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { 
  formatDate, 
  formatWordCount, 
  getGenreColor, 
  getGenreIcon, 
  truncateText,
  cn
} from '../utils';
import { BookOpen, Users, FileText, Calendar, Eye } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  onView?: (story: Story) => void;
  className?: string;
}

export function StoryCard({ 
  story, 
  onView, 
  className 
}: StoryCardProps) {
  const isCompleted = story.agentProgress.agent1.status === 'completed' && 
                     story.agentProgress.agent2.status === 'completed' && 
                     story.agentProgress.agent3.status === 'completed';

  const hasCharacters = story.characters.length > 0;
  const hasChapters = story.chapters.length > 0;

  return (
    <Card 
      hover 
      className={cn('story-card group', className)}
      onClick={() => onView?.(story)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-primary-900 group-hover:text-accent-700 transition-colors">
            {story.title}
          </h3>
          <p className="text-sm text-primary-600 mt-1">
            {truncateText(story.premise, 100)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <span className={cn(
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
            getGenreColor(story.genre)
          )}>
            <span className="mr-1">{getGenreIcon(story.genre)}</span>
            {story.genre}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-primary-600">
          <Users className="w-4 h-4 mr-2" />
          <span>{story.characters.length} characters</span>
        </div>
        <div className="flex items-center text-sm text-primary-600">
          <FileText className="w-4 h-4 mr-2" />
          <span>{story.chapters.length} chapters</span>
        </div>
        <div className="flex items-center text-sm text-primary-600">
          <BookOpen className="w-4 h-4 mr-2" />
          <span>{formatWordCount(story.wordCount)} words</span>
        </div>
        <div className="flex items-center text-sm text-primary-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formatDate(story.updatedAt)}</span>
        </div>
      </div>

      {/* Agent Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-primary-500 mb-2">
          <span>AI Progress</span>
          <span className={cn(
            'px-2 py-1 rounded-full font-medium',
            isCompleted ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
          )}>
            {isCompleted ? 'Complete' : 'In Progress'}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex space-x-2">
            {Object.entries(story.agentProgress).map(([agent, status]) => (
              <div
                key={agent}
                className={cn(
                  'flex-1 h-2 rounded-full',
                  status.status === 'completed' ? 'bg-success-400' : 
                  status.status === 'in-progress' ? 'bg-warning-400' : 
                  'bg-primary-200'
                )}
              />
            ))}
          </div>
          
          {/* Agent Status Details */}
          <div className="text-xs text-primary-600 space-y-1">
            {Object.entries(story.agentProgress).map(([agent, status]) => (
              <div key={agent} className="flex items-center justify-between">
                <span className="capitalize">
                  {agent === 'agent1' ? 'Characters' : 
                   agent === 'agent2' ? 'Writing' : 'Review'}
                </span>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs',
                  status.status === 'completed' ? 'bg-success-100 text-success-700' :
                  status.status === 'in-progress' ? 'bg-warning-100 text-warning-700' :
                  'bg-primary-100 text-primary-700'
                )}>
                  {status.status === 'completed' ? '✓' :
                   status.status === 'in-progress' ? '⏳' : '⏸️'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {hasCharacters && (
            <span className="text-xs text-success-600 bg-success-50 px-2 py-1 rounded-full">
              Characters Ready
            </span>
          )}
          {hasChapters && (
            <span className="text-xs text-accent-600 bg-accent-50 px-2 py-1 rounded-full">
              Chapters Written
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(story);
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
        </div>
      </div>
    </Card>
  );
}

