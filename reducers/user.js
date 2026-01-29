import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.value = {
        token: action.payload.token,
        username: action.payload.username,
      };
      localStorage.setItem('user', JSON.stringify(state.value));
    },
    logout: (state) => {
      state.value = null;
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
