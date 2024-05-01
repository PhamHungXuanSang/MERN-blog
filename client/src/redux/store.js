import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import darkModeReducer from './theme/themeSlice';
import selectedPackageReducer from './selectedPackage/selectedPackageSlice';
import notiSettingReducer from './notiSetting/notiSettingSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
    user: userReducer,
    darkMode: darkModeReducer,
    selectedPackage: selectedPackageReducer,
    notiSetting: notiSettingReducer,
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Để tránh error khi dùng redux toolkit
        }),
});

export const persistor = persistStore(store);
