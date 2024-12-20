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
    },
    setStatus: async (state, action) => {
      const session = JSON.parse(localStorage.getItem("session_data"));

      await window.electronAPI.postRequest(
        "https://journal.gtajournal.ru/api.editstatus",
        {
          status: action.payload,
        },
        {
          headers: {
            "Accept-Language": "ru-RU,ru;q=0.9",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
            Cookie: `id=${session.id}; usid=${session.usid}`,
          },
        }
      );

      state.status = {
        id: 0,
        value: "offline",
        title: "Оффлайн",
        color: "--red-200",
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { resetState, setUser, toggleLoading, setStatus } =
  userSlice.actions;

export default userSlice.reducer;
