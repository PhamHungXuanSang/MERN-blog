import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedPackage: null,
};

const selectedPackageSlice = createSlice({
    name: 'selectedPackage',
    initialState,
    reducers: {
        setSelectedPackage: (state, action) => {
            state.selectedPackage = action.payload;
        },
        removeSelectedPackage: (state) => {
            state.selectedPackage = null;
        },
    },
});

export const { setSelectedPackage, removeSelectedPackage } = selectedPackageSlice.actions;
export default selectedPackageSlice.reducer;
