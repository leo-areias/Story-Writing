import { useState } from 'react';
import { useStories } from '../hooks/useStories';
import { Button } from '../components/ui/Button';
import { LoadingCard } from '../components/ui/Loading';
import { CreateStoryModal } from '../components/CreateStoryModal';
import { Plus, BookOpen, Users, FileText, PenLine, RefreshCw, Eye, Check, Pause } from 'lucide-react';

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

  // Helper function to get story status
  const getStoryStatus = (story: any) => {
    const agentProgress = story.agentProgress;
    if (agentProgress?.agent1?.status === 'completed' && 
        agentProgress?.agent2?.status === 'completed' && 
        agentProgress?.agent3?.status === 'completed') {
      return 'complete';
    }
    return 'in-progress';
  };

  // Helper function to get progress badges
  const getProgressBadges = (story: any) => {
    const badges = [];
    const agentProgress = story.agentProgress;
    
    if (agentProgress?.agent1?.status === 'completed') {
      badges.push('Characters Ready');
    }
    if (agentProgress?.agent2?.status === 'completed') {
      badges.push('Chapters Written');
    }
    if (agentProgress?.agent3?.status === 'completed') {
      badges.push('Story Reviewed');
    }
    
    return badges;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button onClick={refresh}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200">
      {/* Header */}
      <header className="border-b border-stone-300">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="font-serif text-4xl tracking-tight text-gray-800 lg:text-5xl">Your Stories</h1>
              <p className="text-lg text-gray-700 leading-relaxed">Craft narratives with the help of AI</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="lg" 
                className="gap-2 bg-white hover:bg-gray-50 text-gray-800 border-gray-300"
                onClick={handleManualRefresh}
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button 
                size="lg" 
                className="gap-2 bg-amber-800 hover:bg-amber-900 text-white"
                onClick={handleCreateStory}
              >
                <Plus className="h-4 w-4" />
                New Story
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Stats Overview */}
        <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-lg border border-stone-300 bg-white p-6 transition-colors hover:border-stone-400">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-stone-100 p-3">
                <BookOpen className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Stories</p>
                <p className="font-serif text-3xl text-gray-800">{stats.totalStories}</p>
              </div>
            </div>
          </div>

          <div className="group rounded-lg border border-stone-300 bg-white p-6 transition-colors hover:border-stone-400">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-stone-100 p-3">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Characters</p>
                <p className="font-serif text-3xl text-gray-800">{stats.totalCharacters}</p>
              </div>
            </div>
          </div>

          <div className="group rounded-lg border border-stone-300 bg-white p-6 transition-colors hover:border-stone-400">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-stone-100 p-3">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chapters</p>
                <p className="font-serif text-3xl text-gray-800">{stats.totalChapters}</p>
              </div>
            </div>
          </div>

          <div className="group rounded-lg border border-stone-300 bg-white p-6 transition-colors hover:border-stone-400">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-stone-100 p-3">
                <PenLine className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Words Written</p>
                <p className="font-serif text-3xl text-gray-800">{stats.totalWords.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="space-y-6">
          {isLoading && stories.length === 0 ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-stone-300 bg-white p-8">
                  <LoadingCard />
                </div>
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No stories yet
              </h3>
              <p className="text-gray-700 mb-6">
                Create your first AI-powered story to get started
              </p>
              <Button 
                onClick={handleCreateStory} 
                size="lg"
                className="bg-amber-800 hover:bg-amber-900 text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Story
              </Button>
            </div>
          ) : (
            stories.map((story) => {
              const status = getStoryStatus(story);
              const badges = getProgressBadges(story);
              const agentProgress = story.agentProgress;
              
              return (
                <article
                  key={story._id}
                  className="group rounded-lg border border-stone-300 bg-white transition-all hover:border-stone-400 hover:shadow-sm"
                >
                  <div className="p-8">
                    {/* Story Header */}
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h2 className="font-serif text-2xl tracking-tight text-gray-800">{story.title}</h2>
                          <span className="rounded-full bg-stone-200 px-3 py-1 text-sm text-gray-700 capitalize">
                            {story.genre}
                          </span>
                        </div>
                        <p className="text-base leading-relaxed text-gray-700">{story.premise}</p>
                      </div>
                    </div>

                    {/* Story Metadata */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{story.characters.length} characters</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>{story.chapters.length} chapters</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="h-4 w-4" />
                        <span>{story.wordCount} words</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{formatDate(story.createdAt)}</span>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">AI Progress</span>
                        <span className={`rounded-full px-3 py-1 text-sm ${
                          status === 'complete' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {status === 'complete' ? 'Complete' : 'In Progress'}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Characters</span>
                          {agentProgress?.agent1?.status === 'completed' ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Pause className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Writing</span>
                          {agentProgress?.agent2?.status === 'completed' ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Pause className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Review</span>
                          {agentProgress?.agent3?.status === 'completed' ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Pause className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Story Actions */}
                    <div className="flex items-center justify-between border-t border-stone-200 pt-6">
                      <div className="flex flex-wrap gap-2">
                        {badges.map((badge) => (
                          <span 
                            key={badge} 
                            className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs text-gray-700"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <Button 
                        variant="ghost" 
                        className="gap-2 bg-white hover:bg-gray-50 text-gray-800 border-gray-300"
                        onClick={() => handleViewStory(story)}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })
          )}

          {/* Load More */}
          {hasMore && stories.length > 0 && (
            <div className="text-center mt-8">
              <Button
                variant="secondary"
                onClick={loadMore}
                loading={isLoading}
                disabled={isLoading}
                className="bg-white hover:bg-gray-50 text-gray-800 border-gray-300"
              >
                Load More Stories
              </Button>
            </div>
          )}
        </div>
      </main>

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
