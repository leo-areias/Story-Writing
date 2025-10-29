import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { ArrowLeft, BookOpen, Users, FileText, PenLine, Calendar } from 'lucide-react';

export function StoryViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await apiService.getStory(id);
        setStory(response.data);
      } catch (err) {
        console.error('Error fetching story:', err);
        setError('Failed to load story');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStoryStatus = (story: any) => {
    const agentProgress = story.agentProgress;
    if (agentProgress?.agent1?.status === 'completed' && 
        agentProgress?.agent2?.status === 'completed' && 
        agentProgress?.agent3?.status === 'completed') {
      return 'Complete';
    }
    return 'In Progress';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Story Not Found
          </h2>
          <p className="text-gray-700 mb-6">{error || 'The story you are looking for does not exist.'}</p>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-amber-800 hover:bg-amber-900 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200">
      {/* Header */}
      <header className="border-b border-stone-300 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="gap-2 bg-white hover:bg-gray-50 text-gray-800 border-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-stone-200 px-3 py-1 text-sm text-gray-700 capitalize">
                {story.genre}
              </span>
              <span className={`rounded-full px-3 py-1 text-sm ${
                getStoryStatus(story) === 'Complete' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {getStoryStatus(story)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Story Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Story Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl lg:text-5xl tracking-tight text-gray-800 mb-6">
            {story.title}
          </h1>
          
          {/* Story Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{story.characters.length} characters</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{story.chapters.length} chapters</span>
            </div>
            <div className="flex items-center gap-2">
              <PenLine className="h-4 w-4" />
              <span>{story.wordCount} words</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(story.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Story Content */}
        <div className="bg-white rounded-lg border border-stone-300 shadow-sm p-8 mb-8">
          {story.chapters.length > 0 ? (
            <div className="space-y-8">
              {story.chapters.map((chapter: any) => (
                <div key={chapter._id} className="border-b border-stone-200 pb-8 last:border-b-0">
                  {/* Chapter Number - Centered, Large, Italic */}
                  <div className="text-center mb-4">
                    <h2 className="font-serif text-4xl lg:text-5xl text-gray-800 italic font-light">
                      Chapter {chapter.chapterNumber}
                    </h2>
                  </div>
                  
                  {/* Chapter Title - Centered below Chapter */}
                  <div className="text-center mb-8">
                    <h3 className="font-serif text-2xl lg:text-3xl text-gray-700">
                      {chapter.title}
                    </h3>
                  </div>
                  
                  {/* Story Content */}
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    {chapter.content.split('\n').map((paragraph: string, pIndex: number) => (
                      paragraph.trim() && (
                        <p key={pIndex} className="mb-4">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                  {chapter.wordCount && (
                    <p className="text-sm text-gray-500 mt-4">
                      {chapter.wordCount} words
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Chapters Yet
              </h3>
              <p className="text-gray-600">
                {getStoryStatus(story) === 'In Progress' 
                  ? 'Our AI agents are working on creating chapters for your story...'
                  : 'This story doesn\'t have any chapters yet.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Characters Section */}
        {story.characters.length > 0 && (
          <div className="bg-white rounded-lg border border-stone-300 shadow-sm p-8">
            <h2 className="font-serif text-2xl text-gray-800 mb-6">Characters</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {story.characters.map((character: any) => (
                <div key={character._id} className="border border-stone-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{character.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 capitalize">{character.role}</p>
                  <p className="text-sm text-gray-700 mb-3">{character.personality}</p>
                  {character.appearance && (
                    <div className="text-xs text-gray-500">
                      <p><strong>Age:</strong> {character.appearance.age}</p>
                      <p><strong>Gender:</strong> {character.appearance.gender}</p>
                      {character.appearance.physicalDescription && (
                        <p><strong>Description:</strong> {character.appearance.physicalDescription}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
