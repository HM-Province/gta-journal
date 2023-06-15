import parseCookies from "../../scripts/libs/set-cookie.js";

let state = {
  isLoading: false,
  login: "",
  password: "",
};

document
  .getElementById("login:button")
  .addEventListener("click", () => checkLogin());

document.getElementById("login:input:login").addEventListener("input", (ev) => {
  state.login = ev.target.value;
});
document
  .getElementById("login:input:password")
  .addEventListener("input", (ev) => {
    state.password = ev.target.value;
  });

function render() {
  if (state.isLoading) {
    document.getElementById("login:loading")?.classList.remove("hidden");
    document.getElementById("login:form")?.classList.add("hidden");
  } else {
    document.getElementById("login:loading")?.classList.add("hidden");
    document.getElementById("login:form")?.classList.remove("hidden");
  }
}

async function checkLogin() {
  state.isLoading = true;
  render();

  console.log(state);

  const response = await window.electronAPI.postRequest(
    "https://gta-journal.ru/api.login",
    {
      login: state.login,
      password: state.password,
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
    render();
    alert("Неверные данные авторизации");
    return;
  }

  const cookies = response.headers["set-cookie"];

  const parsedCookies = parseCookies(cookies);
  localStorage.setItem(
    "session_info",
    JSON.stringify({
      id: parsedCookies.find((cookie) => cookie.name == "id").value,
      usid: parsedCookies.find((cookie) => cookie.name == "usid").value,
      expires: parsedCookies[0].expires.getTime(),
    })
  );

  document.location.replace("../dashboard/index.html");
}

render();
