import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBooks } from '@/api';

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  description?: string;
  genres?: string[];
  genreIds?: number[];
  publicationYear?: number;
  coverUrl?: string;
  isbn?: string;
  stockQuantity?: number;
  rating?: number;
}

interface BooksState {
  items: Book[];
  total: number;
  page: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BooksState = {
  items: [],
  total: 0,
  page: 0,
  status: 'idle',
  error: null,
};

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (
    { page, size }: { page: number; size: number },
    { rejectWithValue }
  ) => {
    try {
      return await getBooks(page, size);
    } catch (err: any) {
      return rejectWithValue(err.message as string);
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.content ?? [];
        state.total = action.payload.totalElements ?? 0;
        state.page = action.payload.number ?? 0;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default booksSlice.reducer;
