import { configureStore } from '@reduxjs/toolkit'

import mta from "./mta.slice.js";
import userSlice from './user.slice.js';

export default configureStore({
  reducer: {
    mta: mta,
    user: userSlice
  }
});