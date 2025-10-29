import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { StoryDetailState } from '../types';

export function useStory(storyId: string) {
  const [state, setState] = useState<StoryDetailState>({
    story: null,
    characters: [],
    chapters: [],
    isLoading: false,
    error: null,
  });

  const fetchStory = useCallback(async () => {
    if (!storyId) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const [storyResponse, charactersResponse, chaptersResponse] = await Promise.all([
        apiService.getStory(storyId),
        apiService.getStoryCharacters(storyId),
        apiService.getStoryChapters(storyId),
      ]);

      setState({
        story: storyResponse.data,
        characters: charactersResponse.data,
        chapters: chaptersResponse.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch story',
      }));
    }
  }, [storyId]);

  const startCreation = useCallback(async () => {
    if (!storyId) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.startStoryCreation(storyId);
      setState(prev => ({
        ...prev,
        story: response.data,
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start creation',
      }));
      throw error;
    }
  }, [storyId]);

  const writeChapter = useCallback(async (chapterNumber?: number) => {
    if (!storyId) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.writeChapter(storyId, chapterNumber);
      setState(prev => ({
        ...prev,
        chapters: [...prev.chapters, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to write chapter',
      }));
      throw error;
    }
  }, [storyId]);

  const reviewStory = useCallback(async () => {
    if (!storyId) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.reviewStory(storyId);
      setState(prev => ({
        ...prev,
        story: response.data,
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to review story',
      }));
      throw error;
    }
  }, [storyId]);

  const refresh = useCallback(() => {
    fetchStory();
  }, [fetchStory]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  return {
    ...state,
    startCreation,
    writeChapter,
    reviewStory,
    refresh,
  };
}
