import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from '../reduxslice/AuthSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Local storage (can be changed to sessionStorage, etc.)
// import cartReducer from '../reduxslice/cartSlice';

const persistConfig = {
  key: 'medimentor',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, AuthReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    // cart: cartReducer,
  },
});

export const persistor = persistStore(store);
export default store;