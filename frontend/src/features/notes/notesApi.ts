import axios from 'axios';
import type {
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  GenerateNoteRequest,
  GeneratedNoteResponse
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notesApi = {
  // Fetch all notes
  getAllNotes: async (): Promise<Note[]> => {
    const response = await api.get('/notes/');
    return response.data;
  },

  // Fetch single note
  getNote: async (id: number): Promise<Note> => {
    const response = await api.get(`/notes/${id}/`);
    return response.data;
  },

  // Create new note
  createNote: async (note: CreateNoteRequest): Promise<Note> => {
    const response = await api.post('/notes/', note);
    return response.data;
  },

  // Update note
  updateNote: async (id: number, note: UpdateNoteRequest): Promise<Note> => {
    const response = await api.put(`/notes/${id}/`, note);
    return response.data;
  },

  // Delete note
  deleteNote: async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}/`);
  },

  // Generate note using AI
  generateNote: async (request: GenerateNoteRequest): Promise<GeneratedNoteResponse> => {
    const response = await api.post('/generate-note/', request);
    return response.data;
  },
};