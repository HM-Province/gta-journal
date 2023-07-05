import { configureStore } from '@reduxjs/toolkit'

import settingsSlice from "./settings.slice.js";
import userSlice from './user.slice.js';

export default configureStore({
  reducer: {
    settings: settingsSlice,
    user: userSlice
  }
});