import { createUserMiniCard } from "../../scripts/utils/user.js";

let state = {
  isLoading: true,
  showActions: false,
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

document
  .getElementById("logout_button")
  ?.addEventListener("click", () => logout());
document
  .getElementById("refresh_button")
  ?.addEventListener("click", () => loadStatus());

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
    const element = createUserMiniCard(user);

    onlineUsers.appendChild(element);
  }

  const afkUsers = document.getElementById("afk_users");
  if (!afkUsers) return;
  afkUsers.replaceChildren([]);

  document.getElementById("afk_users_title").innerText = `AFK пользователи (${state.users.afk.length})`;

  for (const i in state.users.afk) {
    const user = state.users.afk[i];
    const element = createUserMiniCard(user);

    afkUsers.appendChild(element);
  }

  const offlineUsers = document.getElementById("offline_users");
  if (!offlineUsers) return;
  offlineUsers.replaceChildren([]);

  document.getElementById("offline_users_title").innerText = `Оффлайн пользователи (${state.users.offline.length})`;

  for (const i in state.users.offline) {
    const user = state.users.offline[i];
    const element = createUserMiniCard(user);

    offlineUsers.appendChild(element);
  }
}

function loadData() {
  if (!localStorage.getItem("session_info"))
    return window.location.replace("../login/index.html");
  const sessionInfo = JSON.parse(localStorage.getItem("session_info"));

  if (new Date() > new Date(sessionInfo.expires)) return window.location.replace('../login/index.html');  
  loadStatus();
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
  if (!actionStatusDiv)
    return logout();
  
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
  window.location.replace("../logout/index.html");
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
