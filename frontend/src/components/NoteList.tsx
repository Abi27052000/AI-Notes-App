import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { fetchNotes, deleteNote, setSelectedNote } from '../features/notes';
import type { Note } from '../features/notes/types';

const NoteList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notes, loading, error } = useSelector((state: RootState) => state.notes);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote(id));
    }
  };

  const handleSelect = (note: Note) => {
    dispatch(setSelectedNote(note));
  };

  if (loading) {
    return <div className="text-center py-4">Loading notes...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Notes</h2>
      {notes.length === 0 ? (
        <p className="text-gray-500">No notes found. Create your first note!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSelect(note)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;