import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser, getMyProfile } from '@/api';

export interface User {
  id?: number;
  username: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  initializing: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  initializing: true,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await loginUser(email, password);
    } catch (err: any) {
      return rejectWithValue(err.message as string);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    { username, email, password }: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      return await registerUser(username, email, password);
    } catch (err: any) {
      return rejectWithValue(err.message as string);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (token: string, { rejectWithValue }) => {
    try {
      return await getMyProfile(token);
    } catch (err: any) {
      return rejectWithValue(err.message as string);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      state.initializing = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token ?? null;
        state.user = action.payload.user ?? null;
        if (action.payload.token && typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload?.token) {
          state.token = action.payload.token;
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', action.payload.token);
          }
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.token = null;
        state.user = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      });
  },
});

export const { hydrate, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
