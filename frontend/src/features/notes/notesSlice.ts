import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { notesApi } from './notesApi';
import type { Note, CreateNoteRequest, UpdateNoteRequest, GenerateNoteRequest } from './types';

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  selectedNote: Note | null;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
  selectedNote: null,
};

// Async thunks
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async () => {
    return await notesApi.getAllNotes();
  }
);

export const fetchNote = createAsyncThunk(
  'notes/fetchNote',
  async (id: number) => {
    return await notesApi.getNote(id);
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (note: CreateNoteRequest) => {
    return await notesApi.createNote(note);
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, note }: { id: number; note: UpdateNoteRequest }) => {
    return await notesApi.updateNote(id, note);
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id: number) => {
    await notesApi.deleteNote(id);
    return id;
  }
);

export const generateNote = createAsyncThunk(
  'notes/generateNote',
  async (request: GenerateNoteRequest) => {
    return await notesApi.generateNote(request);
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedNote: (state, action: PayloadAction<Note | null>) => {
      state.selectedNote = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notes';
      })
      // Fetch single note
      .addCase(fetchNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNote.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNote = action.payload;
      })
      .addCase(fetchNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch note';
      })
      // Create note
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.push(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create note';
      })
      // Update note
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
        if (state.selectedNote?.id === action.payload.id) {
          state.selectedNote = action.payload;
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update note';
      })
      // Delete note
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter(note => note.id !== action.payload);
        if (state.selectedNote?.id === action.payload) {
          state.selectedNote = null;
        }
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete note';
      })
      // Generate note
      .addCase(generateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateNote.fulfilled, (state) => {
        state.loading = false;
        // The generated note can be used to create a new note
        // We'll handle this in the component
      })
      .addCase(generateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate note';
      });
  },
});

export const { clearError, setSelectedNote } = notesSlice.actions;
export default notesSlice.reducer;