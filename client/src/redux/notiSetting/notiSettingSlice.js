import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    system: true,
    like: true,
    comment: true,
    reply: true,
    rate: true,
    subscriber: true,
    newBlog: true,
};

const notiSettingSlice = createSlice({
    name: 'notiSetting',
    initialState,
    reducers: {
        setNotiTypeSetting: (state, action) => {
            const type = action.payload;
            if (type in state) {
                state[type] = !state[type];
            }
        },
    },
});

export const { setNotiTypeSetting } = notiSettingSlice.actions;

export default notiSettingSlice.reducer;
