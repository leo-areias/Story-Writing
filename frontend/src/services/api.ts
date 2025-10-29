import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { 
  ApiResponse, 
  PaginatedResponse, 
  Story, 
  Character, 
  Chapter, 
  CreateStoryForm, 
  UpdateStoryForm
} from '../types';
import { API_ENDPOINTS } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
      timeout: 30000, // 30 seconds for AI operations
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<any>> {
    const response = await this.api.get(API_ENDPOINTS.HEALTH);
    return response.data;
  }

  // Story Methods
  async getStories(userId?: string, page = 1, limit = 10): Promise<PaginatedResponse<Story>> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await this.api.get(`${API_ENDPOINTS.STORIES}?${params}`);
    return response.data;
  }

  async getStory(id: string): Promise<ApiResponse<Story>> {
    const response = await this.api.get(`${API_ENDPOINTS.STORIES}/${id}`);
    return response.data;
  }

  async createStory(storyData: CreateStoryForm): Promise<ApiResponse<Story>> {
    const response = await this.api.post(API_ENDPOINTS.STORIES, storyData);
    return response.data;
  }

  async updateStory(id: string, storyData: UpdateStoryForm): Promise<ApiResponse<Story>> {
    const response = await this.api.put(`${API_ENDPOINTS.STORIES}/${id}`, storyData);
    return response.data;
  }

  async deleteStory(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`${API_ENDPOINTS.STORIES}/${id}`);
    return response.data;
  }

  async getStoryStatus(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.get(`${API_ENDPOINTS.STORIES}/${id}/status`);
    return response.data;
  }

  async startStoryCreation(id: string): Promise<ApiResponse<Story>> {
    const response = await this.api.post(`${API_ENDPOINTS.STORIES}/${id}/start-creation`);
    return response.data;
  }

  async writeChapter(id: string, chapterNumber?: number): Promise<ApiResponse<Chapter>> {
    const response = await this.api.post(`${API_ENDPOINTS.STORIES}/${id}/write-chapter`, {
      chapterNumber
    });
    return response.data;
  }

  async reviewStory(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.post(`${API_ENDPOINTS.STORIES}/${id}/review`);
    return response.data;
  }

  async getStoryCharacters(id: string): Promise<ApiResponse<Character[]>> {
    const response = await this.api.get(`${API_ENDPOINTS.STORIES}/${id}/characters`);
    return response.data;
  }

  async getStoryChapters(id: string): Promise<ApiResponse<Chapter[]>> {
    const response = await this.api.get(`${API_ENDPOINTS.STORIES}/${id}/chapters`);
    return response.data;
  }

  // Character Methods
  async getCharacters(storyId?: string): Promise<ApiResponse<Character[]>> {
    const params = storyId ? `?storyId=${storyId}` : '';
    const response = await this.api.get(`${API_ENDPOINTS.CHARACTERS}${params}`);
    return response.data;
  }

  async getCharacter(id: string): Promise<ApiResponse<Character>> {
    const response = await this.api.get(`${API_ENDPOINTS.CHARACTERS}/${id}`);
    return response.data;
  }

  async createCharacter(characterData: Partial<Character>): Promise<ApiResponse<Character>> {
    const response = await this.api.post(API_ENDPOINTS.CHARACTERS, characterData);
    return response.data;
  }

  async updateCharacter(id: string, characterData: Partial<Character>): Promise<ApiResponse<Character>> {
    const response = await this.api.put(`${API_ENDPOINTS.CHARACTERS}/${id}`, characterData);
    return response.data;
  }

  async deleteCharacter(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`${API_ENDPOINTS.CHARACTERS}/${id}`);
    return response.data;
  }

  // Chapter Methods
  async getChapters(storyId?: string): Promise<ApiResponse<Chapter[]>> {
    const params = storyId ? `?storyId=${storyId}` : '';
    const response = await this.api.get(`${API_ENDPOINTS.CHAPTERS}${params}`);
    return response.data;
  }

  async getChapter(id: string): Promise<ApiResponse<Chapter>> {
    const response = await this.api.get(`${API_ENDPOINTS.CHAPTERS}/${id}`);
    return response.data;
  }

  async updateChapter(id: string, chapterData: Partial<Chapter>): Promise<ApiResponse<Chapter>> {
    const response = await this.api.put(`${API_ENDPOINTS.CHAPTERS}/${id}`, chapterData);
    return response.data;
  }

  async deleteChapter(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`${API_ENDPOINTS.CHAPTERS}/${id}`);
    return response.data;
  }

  async reviewChapter(id: string): Promise<ApiResponse<any>> {
    const response = await this.api.post(`${API_ENDPOINTS.CHAPTERS}/${id}/review`);
    return response.data;
  }

  async approveChapter(id: string): Promise<ApiResponse<Chapter>> {
    const response = await this.api.post(`${API_ENDPOINTS.CHAPTERS}/${id}/approve`);
    return response.data;
  }

  // Agent Methods
  async testGemini(prompt: string): Promise<ApiResponse<any>> {
    const response = await this.api.post(`${API_ENDPOINTS.AGENTS}/test-gemini`, { prompt });
    return response.data;
  }

  async testCharacterCreator(premise: string, genre: string): Promise<ApiResponse<any>> {
    const response = await this.api.post(`${API_ENDPOINTS.AGENTS}/character-creator/test`, {
      premise,
      genre
    });
    return response.data;
  }

  async testStoryWriter(): Promise<ApiResponse<any>> {
    const response = await this.api.post(`${API_ENDPOINTS.AGENTS}/story-writer/test`, {});
    return response.data;
  }

  async testPlotReviewer(): Promise<ApiResponse<any>> {
    const response = await this.api.post(`${API_ENDPOINTS.AGENTS}/plot-reviewer/test`, {});
    return response.data;
  }

  async runWorkflow(storyId: string, steps: string[]): Promise<ApiResponse<any>> {
    const response = await this.api.post(`${API_ENDPOINTS.AGENTS}/run-workflow`, {
      storyId,
      steps
    });
    return response.data;
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
