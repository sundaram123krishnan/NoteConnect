import { create } from "zustand";

export interface Notes {
  title: string;
  state: string;
  district: string;
  college: string;
  categories: string[];
  fileUrl: string;
}

interface NotesState {
  notes: Notes[];
  addNotes: (notes: Notes) => void;
}

const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  addNotes: (note: Notes) =>
    set((state) => ({
      notes: [...state.notes, note],
    })),
}));
