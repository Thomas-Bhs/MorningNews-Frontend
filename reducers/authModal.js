import { createSlice } from '@reduxjs/toolkit';

const authModalSlice = createSlice({
  name: 'authModal',
  initialState: { isOpen: false },
  reducers: {
    openAuthModal: (state) => {
      state.isOpen = true;
    },
    closeAuthModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openAuthModal, closeAuthModal } = authModalSlice.actions;
export default authModalSlice.reducer;