import { useState, useEffect } from 'react';
import { useStories } from '../hooks/useStories';
import { StoryCard } from '../components/StoryCard';
import { Button } from '../components/ui/Button';
import { LoadingCard } from '../components/ui/Loading';
import { CreateStoryModal } from '../components/CreateStoryModal';
import { Plus, BookOpen, Users, FileText, Sparkles, RefreshCw } from 'lucide-react';

export function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userId] = useState('leo'); // In a real app, this would come from auth context
  
  const {
    stories,
    total,
    isLoading,
    error,
    loadMore,
    hasMore,
    refresh
  } = useStories(userId);

  // Auto-refresh only when there are stories in progress (disabled for now)
  useEffect(() => {
    // Temporarily disabled auto-refresh to prevent infinite loops
    // const hasInProgressStories = stories.some(story => 
    //   Object.values(story.agentProgress).some(agent => 
    //     agent.status === 'in-progress' || agent.status === 'pending'
    //   )
    // );

    // if (!hasInProgressStories) {
    //   setIsAutoRefreshing(false);
    //   return; // Don't set up interval if no stories are in progress
    // }

    // setIsAutoRefreshing(true);
    // const interval = setInterval(() => {
    //   refresh();
    // }, 30000); // Refresh every 30 seconds (much less aggressive)

    // return () => {
    //   clearInterval(interval);
    //   setIsAutoRefreshing(false);
    // };
  }, [refresh, stories]);

  const handleViewStory = (story: any) => {
    // Navigate to story detail page
    console.log('View story:', story._id);
  };

  const handleManualRefresh = () => {
    refresh();
  };

  const handleCreateStory = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const stats = {
    totalStories: total,
    totalCharacters: stories.reduce((acc, story) => acc + story.characters.length, 0),
    totalChapters: stories.reduce((acc, story) => acc + story.chapters.length, 0),
    totalWords: stories.reduce((acc, story) => acc + story.wordCount, 0),
  };

  if (error) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-error-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-primary-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-primary-600 mb-4">{error}</p>
          <Button onClick={refresh}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-white border-b border-primary-200">
        <div className="container-calm py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-900">
                Story Writing Dashboard
              </h1>
              <p className="text-primary-600 mt-1">
                Create and manage your AI-powered stories
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleManualRefresh}
                variant="secondary"
                size="lg"
                className="text-primary-600 hover:text-primary-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              
              <Button onClick={handleCreateStory} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                New Story
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-calm section-padding">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-200">
            <div className="flex items-center">
              <div className="p-2 bg-accent-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-accent-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-primary-900">{stats.totalStories}</p>
                <p className="text-sm text-primary-600">Total Stories</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-200">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <Users className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-primary-900">{stats.totalCharacters}</p>
                <p className="text-sm text-primary-600">Characters</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-200">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <FileText className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-primary-900">{stats.totalChapters}</p>
                <p className="text-sm text-primary-600">Chapters</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-primary-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-primary-900">
                  {stats.totalWords.toLocaleString()}
                </p>
                <p className="text-sm text-primary-600">Words Written</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-primary-900">Your Stories</h2>
            <div className="text-sm text-primary-600">
              {total} {total === 1 ? 'story' : 'stories'}
            </div>
          </div>

          {isLoading && stories.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">
                No stories yet
              </h3>
              <p className="text-primary-600 mb-6">
                Create your first AI-powered story to get started
              </p>
              <Button onClick={handleCreateStory} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Story
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <StoryCard
                  key={story._id}
                  story={story}
                  onView={handleViewStory}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && stories.length > 0 && (
            <div className="text-center mt-8">
              <Button
                variant="secondary"
                onClick={loadMore}
                loading={isLoading}
                disabled={isLoading}
              >
                Load More Stories
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <CreateStoryModal
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            refresh();
          }}
        />
      )}
    </div>
  );
}
