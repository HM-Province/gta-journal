import { createSlice } from '@reduxjs/toolkit'

export const mtaSlice = createSlice({
  name: 'mta',
  initialState: {
    isRunning: false
  },
  reducers: {
    changeState: (state, action) => {
      state.value += action.payload;
    }
  }
})

// Action creators are generated for each case reducer function
export const { changeState } = mtaSlice.actions

export default mtaSlice.reducer