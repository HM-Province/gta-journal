import React from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Icon from "@mdi/react";
import {
  mdiAccountMultiplePlus,
  mdiAccountPlus,
  mdiContentSave,
} from "@mdi/js";
import { InputSwitch } from "primereact/inputswitch";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { SelectButton } from "primereact/selectbutton";

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

export default function EditUser() {
  const navigate = useNavigate();

  const [user, setUser] = React.useState({
    isLoaded: false,
    info: {
      nickname: "",
      status: "1",
      password: "",
      rank: "",
      bank: "",
      isAdmin: false,
      updateAvatar: false,
    },
  });
  const toast = React.useRef(null);

  const statuses = [
    {
      label: "Оффлайн",
      value: "1",
    },
    {
      label: "Онлайн",
      value: "2",
    },
    {
      label: "АФК",
      value: "3",
    },
  ];

  const loadData = async () => {
    const session = JSON.parse(localStorage.getItem("session_data"));

    const response = await window.electronAPI.getRequest(
      `https://gta-journal.ru/user?id=${window.location.href
        .match(/id=[0-9]+/g)[0]
        .substring(3)}`,
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

    user.info.nickname = parsedDocument.getElementById("login").value;
    user.info.bank = parsedDocument.getElementById("bank").value;
    user.info.rank = parsedDocument
      .getElementById("role")
      .querySelector("option[selected]").value;
    user.info.isAdmin = parsedDocument.getElementById("admin").checked;
    user.info.status = parsedDocument
      .getElementById("status")
      .querySelector("option[selected]").value;

    setUser({ isLoaded: true, info: user.info });
  };

  const editUser = async () => {
    const session = JSON.parse(localStorage.getItem("session_data"));

    const response = await window.electronAPI.postRequest(
      "https://gta-journal.ru/api.user",
      {
        id: window.location.href.match(/id=[0-9]+/g)[0].substring(3),
        status: user.info.status,
        login: user.info.nickname,
        password: user.info.password,
        role: user.info.rank,
        bank: user.info.bank,
        vk: Number(user.info.updateAvatar),
        admin: Number(user.info.isAdmin),
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

    if (response.data.res == 1) {
      navigate("/");
    } else if (response.data.res === 3) {
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: response.data.text,
        life: 3000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Неизвестная ошибка",
        life: 3000,
      });
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="mx-auto w-6 shadow-4 flex flex-column align-items-center surface-card p-4 border-round-xl">
      <h2 className="mt-0">Изменить пользователя</h2>
      <Toast ref={toast} />

      <SelectButton
        value={user.info.status}
        onChange={(e) =>
          setUser({
            ...user,
            info: { ...user.info, status: e.value },
          })
        }
        options={statuses}
      />
      <div className="flex flex-column gap-2 w-12 mt-3">
        <label htmlFor="nickname-field" className="font-bold">
          Никнейм
        </label>
        <InputText
          value={user.info.nickname}
          onChange={(e) =>
            setUser({
              ...user,
              info: { ...user.info, nickname: e.target.value },
            })
          }
          id="nickname-field"
          placeholder="[ТЕГ] Ivan_Ivanov"
          disabled={!user.isLoaded}
        />
      </div>
      <div className="flex flex-column gap-2 w-12 mt-2">
        <label htmlFor="password-field" className="font-bold">
          Пароль
        </label>
        <InputText
          value={user.info.password}
          onChange={(e) =>
            setUser({
              ...user,
              info: { ...user.info, password: e.target.value },
            })
          }
          id="password-field"
          placeholder="Оставьте поле пустым чтобы не менять"
          disabled={!user.isLoaded}
        />
      </div>
      <div className="flex flex-column gap-2 w-12 mt-2">
        <label htmlFor="bank-field" className="font-bold">
          Счёт в банке
        </label>
        <InputText
          value={user.info.bank}
          onChange={(e) =>
            setUser({ ...user, info: { ...user.info, bank: e.target.value } })
          }
          id="bank-field"
          placeholder="123456"
          disabled={!user.isLoaded}
        />
      </div>
      <div className="flex flex-column gap-2 w-12 mt-2">
        <label htmlFor="rank-field" className="font-bold">
          Ранг
        </label>
        <InputText
          value={user.info.rank}
          onChange={(e) =>
            setUser({
              ...user,
              info: { ...user.info, rank: e.target.value },
            })
          }
          id="rank-field"
          placeholder="От 1 до 10"
          disabled={!user.isLoaded}
        />
      </div>
      <div className="flex w-12 mt-3">
        <InputSwitch
          checked={user.info.isAdmin}
          onChange={(e) =>
            setUser({ ...user, info: { ...user.info, isAdmin: e.value } })
          }
        />
        <div className="flex flex-column w-10 ml-2">
          <span className="font-bold text-md mb-0">Администратор</span>
          <p className="text-color-secondary mt-1">
            Может управлять пользователями. Выдавайте с осторожностью!
          </p>
        </div>
      </div>
      <div className="flex w-12 mt-1">
        <InputSwitch
          checked={user.info.updateAvatar}
          onChange={(e) =>
            setUser({
              ...user,
              info: { ...user.info, updateAvatar: e.value },
            })
          }
        />
        <div className="flex flex-column w-10 ml-2">
          <span className="font-bold text-md mb-0">Обновить аватар</span>
          <p className="text-color-secondary mt-1">
            Если пользователь обновил аватар в ВК.
          </p>
        </div>
      </div>
      {/* <div className="flex align-items-center w-12 mt-2">
        <Checkbox id="is-admin" checked={user.info.isAdmin} onChange={(e) => setUser({ ...user, info: { ...user.info, isAdmin: e.checked } })} />
        <label htmlFor="is-admin" className="font-bold ml-2">Администратор</label>
      </div>
      <div className="flex align-items-center w-12 mt-2">
        <Checkbox id="vk" checked={user.info.updateAvatar} onChange={(e) => setUser({ ...user, info: { ...user.info, updateAvatar: e.checked } })} />
        <label htmlFor="vk" className="font-bold ml-2">Обновить аватар</label>
      </div> */}
      <div className="flex flex-column w-12 gap-2 mt-4">
        <Button
          icon={<Icon size={1} path={mdiContentSave} />}
          label="Сохранить изменения"
          disabled={
            !user.info.nickname.match(/\[.+\] [A-Z][a-z]+_[A-Z][A-Za-z]+/g) ||
            isNaN(Number(user.info.rank)) ||
            Number(user.info.rank) > 10 ||
            Number(user.info.rank) < 0 ||
            !user.info.bank.length
          }
          onClick={() => editUser()}
        />
      </div>
    </div>
  );
}
