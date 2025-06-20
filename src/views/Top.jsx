import { Skeleton } from "primereact/skeleton";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cities } from "../constants/cities";

export default function Top() {
  const navigate = useNavigate();

  const [top, setTop] = React.useState({ isLoaded: false, arr: [] });

  const loadTable = async () => {
    const sessionData = JSON.parse(localStorage.getItem("session_data"));

    const response = await window.electronAPI.getRequest(
      "https://status-journal.com/top",
      {
        headers: {
          "Accept-Language": "ru-RU,ru;q=0.9",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
          Cookie: `id=${sessionData.id}; usid=${sessionData.usid}`,
        },
      }
    );

    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(response.data, "text/html");
    const table = parsedDocument.querySelector(".table");
    if (!table)
      return navigate("/logout");

    const tableRows = table.getElementsByTagName("tr");
    top.arr = [];

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

      top.arr.push(user);
    }

    setTop({ isLoaded: true, arr: top.arr });
  }

  useEffect(() => {
    loadTable();
  }, [])

  return (<>
    <div className="p-4 border-round-xl surface-card flex flex-column align-items-center justify-content-center w-12">
      <h1>Топ-10 по онлайну</h1>
      <div className="p-2 surface-ground border-round-xl shadow-4 w-12">
        <div className="w-12 flex justify-content-between align-items-center mb-3 px-2">
          <span class="font-bold w-1">#</span>
          <span class="font-bold w-5">Никнейм</span>
          <span class="font-bold w-3">Время онлайна</span>
          <span class="font-bold w-3">Последнее обновление</span>
        </div>
        <div className="flex flex-column gap-2">
          {!top.isLoaded && Array.from(Array(10).keys()).map((i) => <Skeleton key={i} height="40px" className="w-12 border-round-md" />)}
          {top.isLoaded && Array.from(Array(10).keys()).map((i) => {
            const cityColor = cities.find((city) => top.arr[i].tag.includes(city.tag))?.colorDark || "--orange-400";

            return <div key={i} style={{backgroundColor: `var(${cityColor})`}} className="p-2 border-round-md flex align-items-center justify-content-center shadow-2">
              <span class="font-bold text-0 w-1">{i+1}</span>
              <span class="font-bold text-0 w-5">{top.arr[i].username}</span>
              <span class="font-bold text-0 w-3">{top.arr[i].time}</span>
              <span class="font-bold text-0 w-3">{top.arr[i].lastUpdate}</span>
            </div>
          })}
        </div>
      </div>
    </div>
  </>)
}