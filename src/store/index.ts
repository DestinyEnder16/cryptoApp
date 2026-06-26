import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import { baseApi } from './api/baseApi';
import './api/alertsApi';
import './api/authApi';
import './api/kycApi';
import './api/marketApi';
import './api/notificationApi';
import './api/profileApi';
import './api/settingsApi';
import './api/verificationApi';
import './api/walletApi';
import './api/watchListApi';
import './api/tradeApi';
import authReducer from './slices/authSlice';
import coinReducer from './slices/coinSlice';
import profileReducer from './slices/profileSlice';
import userReducer from './slices/userSlice';
import kycReducer from './slices/kycSlice';

const profilePersistConfig = {
  key: 'profile',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  coin: coinReducer,
  kyc: kycReducer,
  profile: persistReducer(profilePersistConfig, profileReducer),
  [baseApi.reducerPath]: baseApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
