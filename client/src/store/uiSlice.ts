import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'error';
  message: string;
}

interface UiState {
  notifications: NotificationItem[];
}

const initialState: UiState = {
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    pushNotification(
      state,
      action: PayloadAction<Omit<NotificationItem, 'id'> & { id?: string }>,
    ) {
      state.notifications.push({
        id: action.payload.id ?? crypto.randomUUID(),
        type: action.payload.type,
        message: action.payload.message,
      });
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload,
      );
    },
  },
});

export const { pushNotification, removeNotification } = uiSlice.actions;
export default uiSlice.reducer;
