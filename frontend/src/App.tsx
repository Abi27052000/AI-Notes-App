
import { NoteList, NoteForm, GenerateNoteForm } from './components';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          AI Notes App
        </h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            <NoteForm />
            <GenerateNoteForm />
          </div>

          {/* Right Column - Notes List */}
          <div>
            <NoteList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
