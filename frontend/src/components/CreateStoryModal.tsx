import { useState } from 'react';
import { apiService } from '../services/api';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader } from './ui/Card';
import { GENRE_OPTIONS, type CreateStoryForm } from '../types';
import { cn, validateStoryTitle, validateStoryPremise } from '../utils';
import { X, BookOpen, Sparkles } from 'lucide-react';

interface CreateStoryModalProps {
  onClose: () => void;
  onSuccess: (story: any) => void;
}

export function CreateStoryModal({ onClose, onSuccess }: CreateStoryModalProps) {
  const [form, setForm] = useState<CreateStoryForm>({
    title: '',
    premise: '',
    genre: 'mystery',
    userId: 'leo',
  });
  
  const [errors, setErrors] = useState<Partial<CreateStoryForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof CreateStoryForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateStoryForm> = {};
    
    const titleError = validateStoryTitle(form.title);
    if (titleError) newErrors.title = titleError;
    
    const premiseError = validateStoryPremise(form.premise);
    if (premiseError) newErrors.premise = premiseError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Create the story
      const response = await apiService.createStory(form);
      
      // Automatically start AI creation process
      try {
        await apiService.startStoryCreation(response.data._id);
        console.log('✅ AI creation started successfully');
        
        // Start the workflow progression in the background
        progressWorkflow(response.data._id);
        
      } catch (aiError) {
        console.error('❌ Failed to start AI creation:', aiError);
        // Don't fail the whole process if AI creation fails
      }
      
      onSuccess(response.data);
    } catch (error) {
      console.error('Failed to create story:', error);
      // Handle error (you might want to show a toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  // Progress through the AI workflow by checking status and triggering next steps
  const progressWorkflow = async (storyId: string) => {
    console.log('🔄 Starting workflow progression for story:', storyId);
    
    // Wait for Agent 1 to complete
    await waitForAgentCompletion(storyId, 'agent1', 30000); // 30 second timeout
    
    // Start Agent 2 (Chapter Writing)
    try {
      await apiService.writeChapter(storyId);
      console.log('✅ Chapter writing started successfully');
      
      // Wait for Agent 2 to complete
      await waitForAgentCompletion(storyId, 'agent2', 30000); // 30 second timeout
      
      // Start Agent 3 (Story Review)
      try {
        await apiService.reviewStory(storyId);
        console.log('✅ Story review started successfully');
        console.log('🎉 Complete workflow finished!');
      } catch (reviewError) {
        console.error('❌ Failed to start story review:', reviewError);
      }
    } catch (chapterError) {
      console.error('❌ Failed to start chapter writing:', chapterError);
    }
  };

  // Wait for a specific agent to complete
  const waitForAgentCompletion = async (storyId: string, agentName: string, timeoutMs: number) => {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const response = await apiService.getStory(storyId);
        const agentStatus = (response.data.agentProgress as any)[agentName];
        
        if (agentStatus.status === 'completed') {
          console.log(`✅ ${agentName} completed successfully`);
          return;
        } else if (agentStatus.status === 'failed') {
          console.error(`❌ ${agentName} failed`);
          return;
        }
        
        // Wait 2 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`❌ Error checking ${agentName} status:`, error);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.warn(`⚠️ Timeout waiting for ${agentName} to complete`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-primary-900">
                Create New Story
              </h2>
              <p className="text-sm text-primary-600">
                Let AI help you create an amazing story
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-primary-700 mb-2">
                Story Title *
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={cn(
                  'input w-full',
                  errors.title && 'input-error'
                )}
                placeholder="Enter your story title..."
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-error-600 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Premise */}
            <div>
              <label htmlFor="premise" className="block text-sm font-medium text-primary-700 mb-2">
                Story Premise *
              </label>
              <textarea
                id="premise"
                value={form.premise}
                onChange={(e) => handleInputChange('premise', e.target.value)}
                className={cn(
                  'input w-full min-h-[100px] resize-none',
                  errors.premise && 'input-error'
                )}
                placeholder="Describe your story idea, setting, or what you want to explore..."
                disabled={isLoading}
              />
              {errors.premise && (
                <p className="text-sm text-error-600 mt-1">{errors.premise}</p>
              )}
              <p className="text-xs text-primary-500 mt-1">
                {form.premise.length}/500 characters
              </p>
            </div>

            {/* Genre */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-primary-700 mb-2">
                Genre *
              </label>
              <select
                id="genre"
                value={form.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="input w-full"
                disabled={isLoading}
              >
                {GENRE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Features Preview */}
            <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-accent-100 rounded">
                  <Sparkles className="w-4 h-4 text-accent-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-accent-900 mb-1">
                    AI-Powered Features
                  </h4>
                  <p className="text-xs text-accent-700">
                    Our AI agents will automatically create characters, write chapters, 
                    and review your story to help bring your vision to life.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-primary-200">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Story'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
