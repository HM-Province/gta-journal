const navigators = document.getElementsByTagName("v-navigation");

function createNavigationLink(title, path) {
  const element = document.createElement("span");
  element.innerText = title;
  element.classList.add(
    "font-bold",
    "px-2",
    "py-1",
    "text-xl",
    "select-none",
    "cursor-pointer",
    "transition-duration-300",
    "transition-ease-in-out",
    "transition-all",
    "hover:text-primary",
    window.location.href.includes(path.substring(3)) ? "text-primary" : "text-color"
  );

  element.addEventListener("click", () => {
    window.location.replace(path);
  });

  return element;
}

for (const i in navigators) {
  const navigator = navigators[i];

  const element = document.createElement("div");
  element.classList.add(
    "flex",
    "w-12",
    "px-4",
    "align-items-center",
    "mb-2",
    "justify-content-center",
    "gap-2",
    "mx-auto",
    "overflow-y-auto"
  );

  element.appendChild(
    createNavigationLink("Панель управления", "../dashboard/index.html")
  );
  // element.appendChild(
  //   createNavigationLink("Ваша статистика", "../stats/index.html")
  // );
  element.appendChild(
    createNavigationLink("Топ 10", "../top/index.html")
  );
  element.appendChild(
    createNavigationLink("Настройки", "../settings/index.html")
  );

  navigator.parentNode?.replaceChild(element, navigator);
}
