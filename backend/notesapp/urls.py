from django.urls import path
from .views import NoteListCreateView, NoteDetailView, GenerateNoteView

urlpatterns = [
    path('notes/', NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', NoteDetailView.as_view(), name='note-detail'),
    path('generate-note/', GenerateNoteView.as_view(), name='generate-note'),
]