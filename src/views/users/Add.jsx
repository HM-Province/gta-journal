import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Icon from "@mdi/react";
import { mdiAccountMultiplePlus, mdiAccountPlus } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

function makePassword(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export default function AddUser() {
  const navigate = useNavigate();

  const [user, setUser] = React.useState({
    nickname: "",
    password: "",
    bank: "",
    vkLink: "",
    rank: "1",
  });
  const toast = React.useRef(null);

  const checkAccess = async () => {
    const session = JSON.parse(localStorage.getItem("session_data"));

    const response = await window.electronAPI.getRequest(
      "https://gta-journal.ru/user/add",
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

    if (!parsedDocument.getElementById("bank")) navigate("/");
  };

  React.useEffect(() => {
    checkAccess();
  }, []);

  const createUser = async (redirect = true) => {
    const session = JSON.parse(localStorage.getItem("session_data"));

    const payload = {
      login: user.nickname,
      password: user.password || makePassword(10),
      bank: user.bank,
      vk: user.vkLink,
      role: user.rank,
    };

    const response = await window.electronAPI.postRequest(
      "https://gta-journal.ru/api.user/add",
      payload,
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

    if (response.data.res == 1) {
      navigator.clipboard.writeText(`Логин: ${payload.login}\nПароль: ${payload.password}`);

      if (redirect) navigate("/");
      else {
        setUser({
          nickname: "",
          password: "",
          bank: "",
          vkLink: "",
          rank: "1",
        });
        toast.current.show({ severity: "success", summary: "Успешно", life: 3000 });
      }
    } else if (response.data.res === 3) {
      toast.current.show({ severity: "error", summary: "Ошибка", details: response.data.text, life: 3000 });
    } else {
      toast.current.show({ severity: "error", summary: "Ошибка", details: "Неизвестная ошибка", life: 3000 });
    }
  };

  return (
    <div className="mx-auto w-6 shadow-4 flex flex-column align-items-center surface-card p-4 border-round-xl">
      <h2 className="mt-0">Добавить пользователя</h2>
      <Toast ref={toast} />
      <div className="flex flex-column gap-2 w-12 mt-3">
        <label htmlFor="nickname-field" className="font-bold">
          Никнейм
        </label>
        <InputText
          value={user.nickname}
          onChange={(e) => setUser({ ...user, nickname: e.target.value })}
          id="nickname-field"
          placeholder="[ТЕГ] Ivan_Ivanov"
        />
      </div>
      <div className="flex flex-column gap-2 w-12 mt-2">
        <label htmlFor="password-field" className="font-bold">
          Пароль
        </label>
        <InputText
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          id="password-field"
          placeholder="Оставьте поле пустым для случайного"
        />
      </div>
      <div className="flex flex-column gap-2 w-12 mt-2">
        <label htmlFor="bank-field" className="font-bold">
          Счёт в банке
        </label>
        <InputText
          value={user.bank}
          onChange={(e) => setUser({ ...user, bank: e.target.value })}
          id="bank-field"
          placeholder="123456"
        />
      </div>
      <div className="flex flex-column gap-2 w-12 mt-2">
        <label htmlFor="password-field" className="font-bold">
          Ссылка на ВК
        </label>
        <InputText
          value={user.vkLink}
          onChange={(e) => setUser({ ...user, vkLink: e.target.value })}
          id="password-field"
          placeholder="https://vk.com/id1"
        />
      </div>
      <div className="flex flex-column gap-2 w-12 mt-2">
        <label htmlFor="password-field" className="font-bold">
          Ранг
        </label>
        <InputText
          value={user.rank}
          onChange={(e) => setUser({ ...user, rank: e.target.value })}
          id="password-field"
          placeholder="1"
        />
      </div>

      <div className="flex flex-column w-12 gap-2 mt-4">
        <h5 className="mt-0 mb-1 mx-auto text-color-secondary">Данные для входа будут скопированы в буфер обмена</h5>
        <Button
          icon={<Icon size={1} path={mdiAccountPlus} />}
          label="Добавить пользователя"
          disabled={
            !user.nickname.match(/\[.+\] [A-Z][a-z]+_[A-Z][A-Za-z]+/g) ||
            isNaN(Number(user.rank)) ||
            Number(user.rank) > 10 ||
            Number(user.rank) < 0 ||
            !user.bank.length ||
            !user.vkLink.match(/https:\/\/vk\.com\/.+/g)
          }
          onClick={() => createUser()}
        />
        <Button
          icon={<Icon size={1} path={mdiAccountMultiplePlus} />}
          label="Добавить и создать ещё"
          disabled={
            !user.nickname.match(/\[.+\] [A-Z][a-z]+_[A-Z][A-Za-z]+/g) ||
            isNaN(Number(user.rank)) ||
            Number(user.rank) > 10 ||
            Number(user.rank) < 0 ||
            !user.bank.length ||
            !user.vkLink.match(/https:\/\/vk\.com\/.+/g)
          }
          onClick={() => createUser(false)}
        />
      </div>
    </div>
  );
}
