import React, { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import Icon from "@mdi/react";
import { mdiLogin } from "@mdi/js";
import { Toast } from "primereact/toast";
import parseCookies from "../utils/cookies.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginInfo, setLoginInfo] = React.useState({ login: "", password: "" });

  const navigate = useNavigate();

  const toast = React.useRef(null);

  const loginAttempt = async () => {
    setIsLoading(true);

    localStorage.setItem("auth_credentials", JSON.stringify(loginInfo));

    const response = await window.electronAPI.postRequest(
      "https://status-journal.com/api.login",
      {
        login: loginInfo.login,
        password: loginInfo.password,
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
      toast.current.show({
        severity: "error",
        summary: "Ошибка",
        detail: "Не удалось авторизоваться",
      });
      setIsLoading(false);
      return;
    }

    const cookies = response.headers["set-cookie"];
    const parsedCookies = parseCookies(cookies);
    localStorage.setItem(
      "session_data",
      JSON.stringify({
        id: parsedCookies.find((cookie) => cookie.name == "id").value,
        usid: parsedCookies.find((cookie) => cookie.name == "usid").value,
        expires: parsedCookies[0].expires.getTime(),
      })
    );

    navigate("/dashboard");
  };

  useEffect(() => {
    if (localStorage.getItem("auth_credentials"))
      setLoginInfo(JSON.parse(localStorage.getItem("auth_credentials")));
  }, []);

  return (
    <>
      <div className="mt-4 border-round-xl mx-auto shadow-4 p-4 surface-card flex flex-column justify-content-center">
        <h2>Вход в учётную запись</h2>
        <div className="flex flex-column gap-2">
          <label className="font-bold" htmlFor="username">
            Логин
          </label>
          <InputText
            placeholder="Логин от ЖА"
            value={loginInfo.login}
            onChange={(e) =>
              setLoginInfo({ ...loginInfo, login: e.target.value })
            }
            disabled={isLoading}
          />
          <small id="username-help">
            Логин в формате [ТЕГ] Никнейм (как в ЖА)
          </small>
        </div>
        <div className="flex flex-column gap-2 mt-2">
          <label className="font-bold">Пароль</label>
          <Password
            placeholder="Пароль от ЖА"
            value={loginInfo.password}
            onChange={(e) =>
              setLoginInfo({ ...loginInfo, password: e.target.value })
            }
            toggleMask
            feedback={false}
            disabled={isLoading}
          />
        </div>
        <Button
          onClick={() => loginAttempt()}
          loading={isLoading}
          icon={<Icon path={mdiLogin} size={1} />}
          className="mt-4"
          label="Войти"
          disabled={
            !loginInfo.password.length ||
            !loginInfo.login.match(/\[.+\] [A-Z][a-z]+_[A-Z][A-Za-z]+/g)
          }
        />
      </div>
      <Toast ref={toast} />
    </>
  );
}
