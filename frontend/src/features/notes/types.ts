export interface Note {
  id: number;
  title: string;
  content: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
}

export interface UpdateNoteRequest {
  title: string;
  content: string;
}

export interface GenerateNoteRequest {
  description: string;
}

export interface GeneratedNoteResponse {
  success: boolean;
  generated_note: {
    title: string;
    content: string;
  };
}