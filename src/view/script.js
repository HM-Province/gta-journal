import parseCookies from "../scripts/set-cookie.js";

let state = {
  isLoading: true,
  showLogin: false,
  showActions: false,
  login: {
    login: "",
    password: "",
  },
  status: 0,
  currentUser: {
    tag: "N/A",
    username: "Anonymous"
  },
  users: {
    online: [],
    afk: [],
    offline: [],
  },
};

const activityStatuses = [
  {
    id: 0,
    value: "offline",
    title: "Оффлайн",
    color: "--red-600"
  },
  {
    id: 1,
    value: "online",
    title: "Онлайн",
    color: "--green-600"
  },
  {
    id: 2,
    value: "afk",
    title: "АФК",
    color: "--yellow-600"
  },
];

const loginField = document.getElementById("login_input");
const passwordField = document.getElementById("password_input");

loginField.addEventListener("input", (ev) => {
  state.login.login = ev.target.value;
});

passwordField.addEventListener("input", (ev) => {
  state.login.password = ev.target.value;
});

document
  .getElementById("logout_button")
  ?.addEventListener("click", () => logout());
document
  .getElementById("refresh_button")
  ?.addEventListener("click", () => loadStatus());
document
  .getElementById("login_button")
  ?.addEventListener("click", () => checkLogin(true));

document.getElementById("window_hide")?.addEventListener("click", () => {
  window.electronAPI.hideWindow();
});
document
  .getElementById("window_close")
  ?.addEventListener("click", () => window.electronAPI.closeWindow());

document
  .getElementById("online_button")
  ?.addEventListener("click", () => setStatus(1));
document
  .getElementById("afk_button")
  ?.addEventListener("click", () => setStatus(2));
document
  .getElementById("offline_button")
  ?.addEventListener("click", () => setStatus(0));

function render() {
  if (state.isLoading) {
    document.getElementById("loading")?.classList.remove("hidden");
  } else {
    document.getElementById("loading")?.classList.add("hidden");
  }

  if (state.showLogin) {
    document.getElementById("login")?.classList.remove("hidden");
  } else {
    document.getElementById("login")?.classList.add("hidden");
  }

  if (state.showActions) {
    document.getElementById("actions")?.classList.remove("hidden");
    renderActivity();
  } else {
    document.getElementById("actions")?.classList.add("hidden");
  }
}

function renderActivity() {
  const activityStatus = activityStatuses.find(
    (status) => status.id == state.status
  );
  document.getElementById("activity-status").innerText = activityStatus.title;
  document.getElementById("activity-status").style = `color: var(${activityStatus.color})`;
  document.getElementById("activity-nickname").innerText = state.currentUser.username;

  const onlineUsers = document.getElementById("online_users");
  if (!onlineUsers) return;
  onlineUsers.replaceChildren([]);

  document.getElementById("online_users_title").innerText = `Онлайн пользователи (${state.users.online.length})`;

  for (const i in state.users.online) {
    const user = state.users.online[i];
    const element = createUserElement(user);

    onlineUsers.appendChild(element);
  }

  const afkUsers = document.getElementById("afk_users");
  if (!afkUsers) return;
  afkUsers.replaceChildren([]);

  document.getElementById("afk_users_title").innerText = `AFK пользователи (${state.users.afk.length})`;

  for (const i in state.users.afk) {
    const user = state.users.afk[i];
    const element = createUserElement(user);

    afkUsers.appendChild(element);
  }

  const offlineUsers = document.getElementById("offline_users");
  if (!offlineUsers) return;
  offlineUsers.replaceChildren([]);

  document.getElementById("offline_users_title").innerText = `Оффлайн пользователи (${state.users.offline.length})`;

  for (const i in state.users.offline) {
    const user = state.users.offline[i];
    const element = createUserElement(user);

    offlineUsers.appendChild(element);
  }
}

function createUserElement(user) {
  const element = document.createElement("div");

  element.classList.add(
    "px-3",
    "py-2",
    "flex",
    "align-items-center",
    "surface-card",
    "px-3",
    "py-2",
    "border-round-xl",
    "shadow-3"
  );

  const image = document.createElement("img");
  image.src = "https://gta-journal.ru/" + user.avatar;
  image.classList.add("border-circle", "mr-2");
  element.appendChild(image);

  const nickname = document.createElement("div");
  nickname.classList.add("flex", "align-items-center");
  const tag = document.createElement("span");
  tag.innerText = user.tag;
  tag.classList.add(
    "p-1",
    "bg-primary",
    "border-round-md",
    "text-color",
    "font-bold",
    "mr-1"
  );
  nickname.appendChild(tag);
  const nicknameContent = document.createElement("span");
  nicknameContent.innerText = user.nickname;
  nicknameContent.classList.add("font-bold", "select-all");
  if (user.isAdmin)
    nicknameContent.classList.add("text-orange-500");
  nickname.appendChild(nicknameContent);
  element.appendChild(nickname);

  return element;
}

function loadData() {
  if (!localStorage.getItem("auth_credentials")) {
    state.isLoading = false;
    state.showLogin = true;
    return render();
  }

  state.login = JSON.parse(localStorage.getItem("auth_credentials"));
  checkLogin();
}

async function loadStatus() {
  state.isLoading = true;
  state.showActions = false;
  render();

  const sessionInfo = JSON.parse(localStorage.getItem("session_info"));

  const response = await window.electronAPI.getRequest(
    "https://gta-journal.ru/dashboard",
    {
      headers: {
        "Accept-Language": "ru-RU,ru;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        Cookie: `id=${sessionInfo.id}; usid=${sessionInfo.usid}`,
      },
    }
  );

  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(response.data, "text/html");

  const actionStatusDiv = parsedDocument.querySelector(".action-status");
  const currentActivity = Array.from(
    actionStatusDiv.querySelector(".active").classList.values()
  )[1];

  state.status = activityStatuses.find(
    (status) => status.value === currentActivity
  ).id;
  state.users = {
    online: [],
    afk: [],
    offline: [],
  };

  const userColumns = parsedDocument.querySelectorAll(".col-12.col-lg-4");
  for (const i in Array.from(userColumns.keys())) {
    const column = userColumns[i];

    const items = column.querySelectorAll(".item");
    for (const j in Array.from(items.keys())) {
      const item = items[j];

      const user = {
        isAdmin: !!item.querySelector("span.admin"),
        tag: item.querySelector(".username").innerText.match(/\[.+\]/g)[0],
        nickname: item.querySelector(".username").innerText.substring(item.querySelector(".username").innerText.match(/\[.+\]/g)[0].length),
        avatar: item.getElementsByTagName("img")[0].getAttribute("src"),
      };

      if (i == 0) state.users.online.push(user);
      else if (i == 1) state.users.afk.push(user);
      else state.users.offline.push(user);
    }
  }

  const currentUser = parsedDocument.querySelector("p.username");
  state.currentUser = {
    tag: currentUser.innerText.match(/\[.+\]/g)[0],
    username: currentUser.innerText.substring(currentUser.innerText.match(/\[.+\]/g)[0].length),
  }

  state.isLoading = false;
  state.showActions = true;
  render();
}

function logout() {
  localStorage.removeItem("session_info");
  state.isLoading = false;
  state.showLogin = true;
  state.showActions = false;
  render();
}

async function checkLogin(force = false) {
  state.isLoading = true;
  state.showLogin = false;
  render();

  if (!force && localStorage.getItem("session_info")) {
    const sessionInfo = JSON.parse(localStorage.getItem("session_info"));

    if (new Date() < new Date(sessionInfo.expires)) return loadStatus();
  }

  localStorage.setItem(
    "auth_credentials",
    JSON.stringify({ login: state.login.login, password: state.login.password })
  );

  const response = await window.electronAPI.postRequest(
    "https://gta-journal.ru/api.login",
    {
      login: state.login.login,
      password: state.login.password,
    },
    {
      headers: {
        "Accept-Language": "ru-RU,ru;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
      },
    }
  );

  if (response.data.res == 0) {
    state.isLoading = false;
    state.showLogin = true;
    localStorage.removeItem("auth_credentials");
    render();
    return alert("Неверные данные авторизации");
  }

  const cookies = response.headers["set-cookie"];

  const parsedCookies = parseCookies(cookies);
  localStorage.setItem(
    "session_info",
    JSON.stringify({
      id: parsedCookies.find((cookie) => cookie.name == "id").value,
      usid: parsedCookies.find((cookie) => cookie.name == "usid").value,
      expires: parsedCookies[0].expires,
    })
  );

  loadStatus();
}

async function setStatus(code) {
  state.isLoading = true;
  state.showActions = false;
  render();

  const sessionInfo = JSON.parse(localStorage.getItem("session_info"));

  await window.electronAPI.postRequest(
    "https://gta-journal.ru/api.editstatus",
    {
      status: code,
    },
    {
      headers: {
        "Accept-Language": "ru-RU,ru;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        Cookie: `id=${sessionInfo.id}; usid=${sessionInfo.usid}`,
      },
    }
  );

  loadStatus();
}

loadData();
