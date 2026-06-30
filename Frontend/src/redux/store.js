import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from '../reduxslice/AuthSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import ScheduleReducer from '../reduxslice/ScheduleMeetSlice';
import pharmacyReducer from '../Pharmacy/store/pharmacySlice';

const persistConfig = {
  key: 'medimentor',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, AuthReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    schedule: ScheduleReducer,
    pharmacy: pharmacyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export default store;