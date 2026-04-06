import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decodeToken, SessionUser } from '../utils/auth';

export interface SessionState {
  token: string | null;
  user: SessionUser | null;
}

const initialToken = localStorage.getItem('token');

const initialState: SessionState = {
  token: initialToken,
  user: decodeToken(initialToken),
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.user = decodeToken(action.payload);
      localStorage.setItem('token', action.payload);
    },
    clearSession(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('guest');
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
