let state = {
  settings: {
    theme: "dark"
  }
}

const lightThemeButton = document.getElementById("settings:theme:light");
const darkThemeButton = document.getElementById("settings:theme:dark");
const saveSettingsButton = document.getElementById("settings:save");

lightThemeButton.addEventListener("click", () => {
  state.settings.theme = "light";
  render();
});

darkThemeButton.addEventListener("click", () => {
  state.settings.theme = "dark";
  render();
});

saveSettingsButton.addEventListener("click", () => saveSettings());

function firstRender() {
  if (localStorage.getItem("settings"))
    state.settings = JSON.parse(localStorage.getItem("settings"));
  render();
}

function render() {
  if (state.settings.theme === "dark") {
    lightThemeButton.classList.remove("active");
    darkThemeButton.classList.add("active");
  } else {
    lightThemeButton.classList.add("active");
    darkThemeButton.classList.remove("active");
  }
}

function saveSettings() {
  localStorage.setItem("settings", JSON.stringify(state.settings));
  window.location.reload();
}

firstRender();