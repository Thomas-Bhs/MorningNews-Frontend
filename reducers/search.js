import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  query: '',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    openSearch: (state) => {
      state.isOpen = true;
    },
    closeSearch: (state) => {
      state.isOpen = false;
      state.query = '';
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
  },
});

export const { openSearch, closeSearch, setQuery } = searchSlice.actions;
export default searchSlice.reducer;