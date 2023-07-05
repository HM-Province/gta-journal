import { createSlice } from '@reduxjs/toolkit'

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    mtaCheckFrequency: 10
  },
  reducers: {
    setMtaCheckFrequency: (state, action) => {
      state.mtaCheckFrequency = action.payload;
    }
  }
})

// Action creators are generated for each case reducer function
export const { setMtaCheckFrequency } = settingsSlice.actions

export default settingsSlice.reducer