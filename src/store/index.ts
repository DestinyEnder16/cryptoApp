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
import { baseApi } from '@/src/store/baseApi';
import '@/src/features/alerts/store/alertsApi';
import '@/src/features/auth/store/authApi';
import '@/src/features/kyc/store/kycApi';
import '@/src/features/markets/store/marketApi';
import '@/src/features/notifications/store/notificationApi';
import '@/src/features/profile/store/profileApi';
import '@/src/features/profile/store/settingsApi';
import '@/src/features/auth/store/verificationApi';
import '@/src/features/wallet/store/walletApi';
import '@/src/features/markets/store/watchListApi';
import '@/src/features/trades/store/tradeApi';
import authReducer from '@/src/features/auth/store/authSlice';
import coinReducer from '@/src/features/markets/store/coinSlice';
import profileReducer from '@/src/features/profile/store/profileSlice';
import userReducer from '@/src/features/auth/store/userSlice';
import kycReducer from '@/src/features/kyc/store/kycSlice';

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
