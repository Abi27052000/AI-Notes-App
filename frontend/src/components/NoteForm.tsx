import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { createNote, updateNote, setSelectedNote, clearError } from '../features/notes';
import type { CreateNoteRequest, UpdateNoteRequest } from '../features/notes';

const NoteForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedNote, loading, error } = useSelector((state: RootState) => state.notes);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setIsEditing(true);
    } else {
      setTitle('');
      setContent('');
      setIsEditing(false);
    }
  }, [selectedNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      if (isEditing && selectedNote) {
        const updateData: UpdateNoteRequest = { title: title.trim(), content: content.trim() };
        await dispatch(updateNote({ id: selectedNote.id, note: updateData })).unwrap();
        dispatch(setSelectedNote(null));
      } else {
        const createData: CreateNoteRequest = { title: title.trim(), content: content.trim() };
        await dispatch(createNote(createData)).unwrap();
        setTitle('');
        setContent('');
      }
      dispatch(clearError());
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleCancel = () => {
    dispatch(setSelectedNote(null));
    setTitle('');
    setContent('');
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? 'Edit Note' : 'Create New Note'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter note title"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter note content"
            required
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Note' : 'Create Note')}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NoteForm;