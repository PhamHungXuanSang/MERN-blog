import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserProfileStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateUserProfileSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserProfileFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signOutSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        successfullyPurchase: (state, action) => {
            state.currentUser = action.payload;
        },
        setCurrentUser: (state, action) => {
            // Hàm này đa năng dùng để set lại các giá trị cho currentUser
            state.currentUser = action.payload;
        },
    },
});

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateUserProfileStart,
    updateUserProfileSuccess,
    updateUserProfileFailure,
    signOutSuccess,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    successfullyPurchase,
    setCurrentUser,
} = userSlice.actions;

export default userSlice.reducer;
