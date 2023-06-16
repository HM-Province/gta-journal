import { cities } from "../../scripts/constants/cities.js";

let state = {
  isLoading: false,
  top: []
};

function render() {
  if (state.isLoading) {
    document.getElementById("top:loading")?.classList.remove("hidden");
    document.getElementById("top:info")?.classList.add("hidden");
  } else {
    document.getElementById("top:loading")?.classList.add("hidden");
    document.getElementById("top:info")?.classList.remove("hidden");
  }
}

function getTableRow(position, user) {
  const element = document.createElement("tr");
  const cityColor = cities.find((city) => user.tag.includes(city.tag))?.colorDark || "--surface-section";
  element.setAttribute("style", `height: 35px; background-color: var(${cityColor});`);

  const positionHolder = document.createElement("td");
  positionHolder.classList.add("p-2", "font-bold", "text-white");
  positionHolder.innerText = `${position}`;
  element.appendChild(positionHolder);

  const usernameHolder = document.createElement("td");
  usernameHolder.classList.add("px-2", "text-white");
  usernameHolder.innerText = `${user.username}`;
  element.appendChild(usernameHolder);

  const timeHolder = document.createElement("td");
  timeHolder.classList.add("px-2", "text-white");
  timeHolder.innerText = user.time;
  element.appendChild(timeHolder);

  const loadUpdateHolder = document.createElement("td");
  loadUpdateHolder.classList.add("px-2", "text-white");
  loadUpdateHolder.innerText = user.lastUpdate;
  element.appendChild(loadUpdateHolder);

  return element;
}

async function loadTop() {
  state.isLoading = true;
  render();

  const sessionInfo = JSON.parse(localStorage.getItem("session_info"));

  const response = await window.electronAPI.getRequest(
    "https://gta-journal.ru/top",
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
  const table = parsedDocument.querySelector(".table");
  if (!table)
    return window.location.replace("../logout/index.html");

  const tableRows = table.getElementsByTagName("tr");
  state.top = [];

  for (const i in tableRows) {
    if (i == 0) continue;
    const tableRow = tableRows[i];
    if (!tableRow.innerHTML) break;

    let user = {
      tag: "-",
      username: "Anonymous",
      time: "Ч: 0 М: 0 (0)",
      lastUpdate: "-"
    }

    const tableDatas = tableRow.getElementsByTagName("td");
    for (const j in tableDatas) {
      if (!tableDatas[j].innerText) break;
      if (j == 0) {
        const nicknameUnion = tableDatas[j].innerText;
        user.tag = nicknameUnion.match(/\[.+\]/g)[0]?.replace(/\[|\]/g, "");
        user.username = nicknameUnion.match(/[A-Za-z]+_[A-Za-z]+/g)[0];
      }
      else if (j == 1)
        user.time = tableDatas[j].innerText;
      else if (j == 2)
        user.lastUpdate = tableDatas[j].innerText;
    }

    state.top.push(user);
  }

  const tableBody = document.getElementById("top:table:body");
  for (const i in state.top) {
    tableBody.appendChild(getTableRow(Number(i)+1, state.top[i]));
  }
  
  state.isLoading = false;
  render();
}

loadTop();