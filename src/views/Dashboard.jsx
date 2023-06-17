import React from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import Icon from "@mdi/react";
import { mdiBriefcase, mdiGhost, mdiLogout, mdiSleep, mdiSync } from "@mdi/js";
import styles from "../styles/modules/Dashboard.module.css";
import { cities } from "../constants/cities";

const activityStatuses = [
  {
    id: 0,
    value: "offline",
    title: "Оффлайн",
    color: "--red-200",
  },
  {
    id: 1,
    value: "online",
    title: "Онлайн",
    color: "--green-200",
  },
  {
    id: 2,
    value: "afk",
    title: "АФК",
    color: "--yellow-200",
  },
];

function UserCard(props) {
  const cityColor = cities.find((city) => props.tag.includes(city.tag))?.color || "--text-color";

  return <div className="relative px-3 py-2 flex align-items-center surface-ground my-2 border-round-xl shadow-3 hover:surface-hover">
    <img className="border-circle mr-2 overflow-hidden" src={props.avatar} alt="" />
    <span className="flex align-items-center z-2 font-bold">{props.username}</span>
    <span className="z-1 absolute text-sm font-bold select-none mr-2" style={{top: '1px', right: '1px', opacity: 0.7, color: `var(${cityColor})`}}>{props.tag}</span>
  </div>
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState({
    isLoaded: false,
    status: activityStatuses[0],
    username: "",
    avatar: "",
    tag: "",
  });
  const [onlineUsers, setOnlineUsers] = React.useState({
    isLoaded: false,
    arr: [],
  });
  const [afkUsers, setAfkUsers] = React.useState({ isLoaded: false, arr: [] });
  const [offlineUsers, setOfflineUsers] = React.useState({
    isLoaded: false,
    arr: [],
  });

  const addUser = (i, user) => {
    if (i == 0) onlineUsers.arr.push(user);
    else if (i == 1) afkUsers.arr.push(user);
    else offlineUsers.arr.push(user);
  };

  const loadUser = async () => {
    setCurrentUser({
      ...currentUser,
      isLoaded: false,
    });
    onlineUsers.arr = []; afkUsers.arr = []; offlineUsers.arr = [];
    setOnlineUsers({ ...onlineUsers, isLoaded: false });
    setAfkUsers({ ...afkUsers, isLoaded: false });
    setOfflineUsers({ ...offlineUsers, isLoaded: false });

    const session = JSON.parse(localStorage.getItem("session_data"));

    const response = await window.electronAPI.getRequest(
      "https://gta-journal.ru/dashboard",
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

    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(response.data, "text/html");

    const actionStatusDiv = parsedDocument.querySelector(".action-status");
    if (!actionStatusDiv) return navigate("/logout");

    const currentActivity = Array.from(
      actionStatusDiv.querySelector(".active").classList.values()
    )[1];
    const currentUserElement = parsedDocument.querySelector("p.username");
    currentUser.username = currentUserElement.innerText.substring(
      currentUserElement.innerText.match(/\[.+\] /g)[0].length
    );
    currentUser.status = activityStatuses.find(
      (status) => status.value === currentActivity
    );
    currentUser.tag = currentUserElement.innerText
      .match(/\[.+\]/g)[0]
      .replace(/\[|\]/g, "");
    currentUser.avatar = `https://gta-journal.ru${parsedDocument
      .querySelector("div.avatar")
      .getElementsByTagName("img")[0]
      .getAttribute("src")}`;

    const userColumns = parsedDocument.querySelectorAll(".col-12.col-lg-4");
    for (const i in Array.from(userColumns.keys())) {
      const column = userColumns[i];

      const items = column.querySelectorAll(".item");
      for (const j in Array.from(items.keys())) {
        const item = items[j];

        const user = {
          isAdmin: !!item.querySelector("span.admin"),
          tag: item
            .querySelector(".username")
            .innerText.match(/\[.+\]/g)[0]
            ?.replace(/\[|\]/g, ""),
          username: item
            .querySelector(".username")
            .innerText.substring(
              item.querySelector(".username").innerText.match(/\[.+\] /g)[0]
                .length
            ),
          avatar: `https://gta-journal.ru${item
            .getElementsByTagName("img")[0]
            .getAttribute("src")}`,
        };

        addUser(i, user);
      }
    }

    setCurrentUser({ ...currentUser, isLoaded: true });
    setOnlineUsers({ ...onlineUsers, isLoaded: true });
    setAfkUsers({ ...afkUsers, isLoaded: true });
    setOfflineUsers({ ...offlineUsers, isLoaded: true });
  };

  const changeStatus = async (code) => {
    setCurrentUser({ ...currentUser, isLoaded: false });
    setOnlineUsers({ ...onlineUsers, isLoaded: false });
    setAfkUsers({ ...afkUsers, isLoaded: false });
    setOfflineUsers({ ...offlineUsers, isLoaded: false });

    const session = JSON.parse(localStorage.getItem("session_data"));

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
          Cookie: `id=${session.id}; usid=${session.usid}`,
        },
      }
    );

    loadUser();
  };

  React.useEffect(() => {
    loadUser();
  }, []);

  return (
    <>
      {!currentUser.isLoaded && (
        <div className="surface-card border-round-xl overflow-hidden align-items-center flex mb-2">
          <Skeleton
            className={`p-2 surface-card`}
            width="100px"
            height="100px"
            borderRadius="50%"
          ></Skeleton>
          <div>
            <Skeleton
              className="ml-2 mb-1"
              width="200px"
              height="24px"
              borderRadius="5px"
            ></Skeleton>
            <Skeleton
              className="ml-2"
              width="200px"
              height="24px"
              borderRadius="5px"
            ></Skeleton>
          </div>
          <Button
            className="ml-auto mr-2"
            severity={"info"}
            loading
            icon={<Icon path={mdiLogout} size={1} />}
          />
        </div>
      )}
      {currentUser.isLoaded && (
        <div className="surface-card border-round-xl overflow-hidden flex align-items-center mb-2">
          <img
            className={`p-2 surface-card border-2 border-transparent border-circle overflow-hidden`}
            src={currentUser.avatar}
            height={100}
            width={100}
            alt="Аватар"
          />
          <div className="flex flex-column">
            <span className="text-xl font-bold">{currentUser.username}</span>
            <span
              className="flex align-items-center justify-content-center border-round-md font-bold mt-1"
              style={{
                backgroundColor: `var(${currentUser.status?.color})`,
                color: "var(--primary-color-text)",
              }}
            >
              {currentUser.status?.title}
            </span>
          </div>
          <Button
            onClick={() => loadUser()}
            className="ml-auto mr-2"
            severity={"info"}
            icon={<Icon path={mdiSync} size={1} />}
          />
        </div>
      )}
      <div className="p-4 flex surface-card border-round-xl gap-2">
        <Button
          icon={<Icon path={mdiBriefcase} size={1} />}
          loading={!currentUser.isLoaded}
          disabled={currentUser.status?.id == 1}
          onClick={() => changeStatus(1)}
          className="w-4"
          severity={"success"}
          label="Онлайн"
        />
        <Button
          icon={<Icon path={mdiSleep} size={1} />}
          loading={!currentUser.isLoaded}
          disabled={currentUser.status?.id == 2}
          onClick={() => changeStatus(2)}
          className="w-4"
          severity={"warning"}
          label="АФК"
        />
        <Button
          icon={<Icon path={mdiGhost} size={1} />}
          loading={!currentUser.isLoaded}
          disabled={currentUser.status?.id == 0}
          onClick={() => changeStatus(0)}
          className="w-4"
          severity={"danger"}
          label="Оффлайн"
        />
      </div>
      <div className="p-2 surface-card mt-2 border-round-xl">
      {!onlineUsers.isLoaded && <div className="grid">
        <div className="col">
          <span className="text-xl font-bold w-12 flex justify-content-center mb-2">Онлайн пользователи</span>
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
        </div>
        <div className="col">
        <span className="text-xl font-bold w-12 flex justify-content-center mb-2">AFK пользователи</span>
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
        </div>
        <div className="col">
          <span className="text-xl font-bold w-12 flex justify-content-center mb-2">Оффлайн пользователи</span>
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
          <Skeleton className="my-1" height="50px" width="100%" />
        </div>
      </div>}
      {onlineUsers.isLoaded && <div className="grid">
        <div className="col">
          <span className="text-xl font-bold w-12 flex justify-content-center mb-2">Онлайн пользователи ({onlineUsers.arr.length})</span>
          {!onlineUsers.arr.length && <span className="text-xl font-bold w-12 flex justify-content-center">Все уснули :(</span>}
          <div className="overflow-y-auto h-screen">
            {onlineUsers.arr.map((user) => <UserCard key={user.username} username={user.username} tag={user.tag} avatar={user.avatar} />)}
          </div>
        </div>
        <div className="col">
          <span className="text-xl font-bold w-12 flex justify-content-center mb-2">AFK пользователи ({afkUsers.arr.length})</span>
          {!afkUsers.arr.length && <span className="text-xl font-bold w-12 flex justify-content-center">Нет АФКшеров ╰(*°▽°*)╯</span>}
          <div className="overflow-y-auto h-screen">
            {afkUsers.arr.map((user) => <UserCard key={user.username} username={user.username} tag={user.tag} avatar={user.avatar} />)}
          </div>
        </div>
        <div className="col">
          <span className="text-xl font-bold w-12 flex justify-content-center mb-2">Оффлайн пользователи ({offlineUsers.arr.length})</span>
          {!offlineUsers.arr.length && <span className="text-xl font-bold w-12 flex justify-content-center">Все онлайн O_O</span>}
          <div className="overflow-y-auto h-screen">
            {offlineUsers.arr.map((user) => <UserCard key={user.username} username={user.username} tag={user.tag} avatar={user.avatar} />)}
          </div>
        </div>
      </div>}
      </div>
    </>
  );
}
