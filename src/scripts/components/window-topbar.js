const topbars = document.getElementsByTagName("v-window-topbar");

for (const i in topbars) {
  const topbar = topbars[i];

  const element = document.createElement("div");
  element.setAttribute(
    "style",
    "-webkit-app-region: drag;backdrop-filter: blur(40px);"
  );
  element.classList.add(
    "top-0",
    "left-0",
    "flex",
    "z-5",
    "fixed",
    "surface-hover",
    "w-12",
    "align-items-center",
    "justify-content-between"
  );

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("ml-2", "flex", "align-items-center");

  const appName = document.createElement("span");
  appName.innerText = "GTA Journal";
  appName.classList.add("font-bold", "text-xl", "mr-2");
  titleDiv.appendChild(appName);

  const appTag = document.createElement("span");
  appTag.innerText = "RC";
  appTag.setAttribute(
    "style",
    "background-color: var(--primary-color); border-radius: 5px;padding: 5px 10px;"
  );
  appTag.classList.add("font-bold", "text-md");
  titleDiv.appendChild(appTag);

  element.appendChild(titleDiv);

  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("flex", "align-items-center", "mr-2");
  actionsDiv.setAttribute("style", "-webkit-app-region: none;");

  const hideSpan = document.createElement("span");
  hideSpan.setAttribute("id", "window:hide");
  hideSpan.innerText = "_";
  hideSpan.setAttribute("style", "margin-top: -16px;");
  hideSpan.classList.add("font-bold", "select-none", "cursor-pointer", "p-2", "text-xl");
  actionsDiv.appendChild(hideSpan);

  const closeSpan = document.createElement("span");
  closeSpan.setAttribute("id", "window:close");
  closeSpan.innerText = "х";
  closeSpan.classList.add("font-bold", "select-none", "cursor-pointer", "p-2", "text-xl");
  actionsDiv.appendChild(closeSpan);

  element.appendChild(actionsDiv);

  topbar.parentNode?.replaceChild(element, topbar);
}

document.getElementById("window:hide")?.addEventListener("click", () => {
  window.electronAPI.hideWindow();
});
document
  .getElementById("window:close")
  ?.addEventListener("click", () => window.electronAPI.closeWindow());

{
  /* <div style="-webkit-app-region: drag;backdrop-filter: blur(40px);" class="top-0 left-0 flex z-5 fixed surface-hover w-12 mb-4 align-items-center justify-content-between">
      <div class="ml-2 flex align-items-center">
        <span class="font-bold text-xl mr-2">GTA Journal</span>
        <span style="background-color: var(--primary-color); border-radius: 5px;padding: 5px 10px;" class="font-bold text-md">ALPHA</span>
      </div>
      <div class="flex align-items-center mr-2 z-2" style="-webkit-app-region: none;">
        <span id="window_hide" style="margin-top: -16px;" class="z-2 font-bold select-none cursor-pointer p-2 text-xl">_</span>
        <span id="window_close" class="z-2 font-bold select-none cursor-pointer p-2 text-xl">х</span>
      </div>
    </div> */
}
