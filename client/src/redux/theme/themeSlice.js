import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    //darkMode: 'light',
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
};

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        darkModeToogle: (state) => {
            //state.darkMode = state.darkMode === 'light' ? 'dark' : 'light';
            state.darkMode = state.darkMode === 'dark' ? 'light' : 'dark';
        },
    },
});

export const { darkModeToogle } = darkModeSlice.actions;

export default darkModeSlice.reducer;
