import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoaded: false,
    isAdmin: false,
    status: {
      id: 0,
      value: "offline",
      title: "Оффлайн",
      color: "--red-200",
    },
    username: "Anonymous",
    tag: "N/A",
    avatar: "",
  },
  reducers: {
    resetState: (state) => {
      state.isAdmin = false;
      state.isLoaded = false;
      state.username = "Anonymous";
      state.status = {
        id: 0,
        value: "offline",
        title: "Оффлайн",
        color: "--red-200",
      };
      state.tag = "N/A";
      state.avatar = "";
    },
    setUser: (state, action) => {
      state.isAdmin = action.payload.isAdmin || state.isAdmin || false;
      state.isLoaded = true;
      state.username = action.payload.username || state.username || "Anonymous";
      state.tag = action.payload.tag || state.tag || "N/A";
      state.avatar = action.payload.avatar || state.avatar || "";
      state.status = action.payload.status ||
        state.status || {
          id: 0,
          value: "offline",
          title: "Оффлайн",
          color: "--red-200",
        };
    },
    toggleLoading: (state) => {
      state.isLoaded = !state.isLoaded;
    }
  },
});

// Action creators are generated for each case reducer function
export const { resetState, setUser, toggleLoading } = userSlice.actions;

export default userSlice.reducer;
