import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	value: [],
};

export const hiddenArticlesSlice = createSlice({
	name: 'hiddenArticles',
	initialState,
	reducers: {
		addHiddenArticles: (state, action) => {
			state.value.push(action.payload);
		},
		removeHiddenArticles: (state, action) => {
			state.value = state.value.filter(hiddenArticles => hiddenArticles.title !== action.payload.title);
		},
		removeAllHiddenArticles: (state) => {
			state.value = [];
		},
	},
});

export const { addHiddenArticles, removeHiddenArticles, removeAllHiddenArticles} = hiddenArticlesSlice.actions;
export default hiddenArticlesSlice.reducer;