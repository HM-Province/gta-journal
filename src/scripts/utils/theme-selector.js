// <link rel="stylesheet" href="../../styles/alarm-spinner.css" />

let theme = "dark";
if (localStorage.getItem("settings")) {
  const settings = JSON.parse(localStorage.getItem("settings"));
  if (settings.theme) theme = settings.theme;
}

const element = document.getElementById("css-theme");
element.href = `../../styles/${theme}.css`;