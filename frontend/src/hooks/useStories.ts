import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { StoryListState, CreateStoryForm, UpdateStoryForm } from '../types';

export function useStories(userId?: string) {
  const [state, setState] = useState<StoryListState>({
    stories: [],
    total: 0,
    page: 1,
    hasMore: true,
    isLoading: false,
    error: null,
  });

  const fetchStories = useCallback(async (page = 1, reset = false) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.getStories(userId, page, 10);
      
      setState(prev => ({
        ...prev,
        stories: reset ? response.data.items : [...prev.stories, ...response.data.items],
        total: response.data.total,
        page: response.data.page,
        hasMore: response.data.page < response.data.totalPages,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stories',
      }));
    }
  }, [userId]);

  const createStory = useCallback(async (storyData: CreateStoryForm) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.createStory(storyData);
      setState(prev => ({
        ...prev,
        stories: [response.data, ...prev.stories],
        total: prev.total + 1,
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create story',
      }));
      throw error;
    }
  }, []);

  const updateStory = useCallback(async (id: string, storyData: UpdateStoryForm) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.updateStory(id, storyData);
      setState(prev => ({
        ...prev,
        stories: prev.stories.map(story => 
          story._id === id ? response.data : story
        ),
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update story',
      }));
      throw error;
    }
  }, []);

  const deleteStory = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await apiService.deleteStory(id);
      setState(prev => ({
        ...prev,
        stories: prev.stories.filter(story => story._id !== id),
        total: prev.total - 1,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete story',
      }));
      throw error;
    }
  }, []);

  const loadMore = useCallback(() => {
    if (state.hasMore && !state.isLoading) {
      fetchStories(state.page + 1, false);
    }
  }, [state.hasMore, state.isLoading, state.page, fetchStories]);

  const refresh = useCallback(() => {
    fetchStories(1, true);
  }, [fetchStories]);

  useEffect(() => {
    fetchStories(1, true);
  }, [fetchStories]);

  return {
    ...state,
    createStory,
    updateStory,
    deleteStory,
    loadMore,
    refresh,
  };
}
