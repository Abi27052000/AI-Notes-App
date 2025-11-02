import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { generateNote, createNote, clearError } from '../features/notes';
import type { CreateNoteRequest } from '../features/notes';

const GenerateNoteForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.notes);

  const [description, setDescription] = useState('');
  const [generatedNote, setGeneratedNote] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      const result = await dispatch(generateNote({ description: description.trim() })).unwrap();
      setGeneratedNote(result.generated_note);
      dispatch(clearError());
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleSaveGeneratedNote = async () => {
    if (!generatedNote) return;

    try {
      const createData: CreateNoteRequest = {
        title: generatedNote.title,
        content: generatedNote.content
      };
      await dispatch(createNote(createData)).unwrap();
      setDescription('');
      setGeneratedNote(null);
      dispatch(clearError());
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleDiscard = () => {
    setDescription('');
    setGeneratedNote(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Generate Note with AI</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!generatedNote ? (
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe what you want to generate a note about..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Note'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-lg mb-2">{generatedNote.title}</h3>
            <p className="text-gray-700">{generatedNote.content}</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSaveGeneratedNote}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Note'}
            </button>
            <button
              onClick={handleDiscard}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateNoteForm;