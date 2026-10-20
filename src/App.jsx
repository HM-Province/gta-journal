import React from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./styles/globals.css";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.min.css";
import "./theme/common/theme.scss";
import Root from "./views/Root.jsx";
import Login from "./views/Login.jsx";
import WindowTopbar from "./components/WindowTopbar.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Logout from "./views/Logout.jsx";
import Top from "./views/Top.jsx";
import Stats from "./views/Stats.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import Settings from "./views/Settings.jsx";
import AddUser from "./views/users/Add.jsx";
import PrimeReact from 'primereact/api';
import EditUser from "./views/users/Edit.jsx";
import UserStats from "./views/users/Stats.jsx";
import { Dialog } from "primereact/dialog";

PrimeReact.ripple = true;

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/top",
        element: <Top />,
      },
      {
        path: "/stats",
        element: <Stats />,
      },
      {
        path: '/settings',
        element: <Settings />
      },
      {
        path: "/users/add",
        element: <AddUser />
      },
      {
        path: "/users/edit",
        element: <EditUser />
      },
      {
        path: "/users/stats",
        element: <UserStats />
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

const root = createRoot(document.getElementById("app"));

function App() {
  const [noticeVisible, setNoticeVisible] = React.useState(true);

  return (
    <Provider store={store}>
      <Dialog
        header="Эта версия больше не поддерживается"
        visible={noticeVisible}
        onHide={() => setNoticeVisible(false)}
        modal
        closable
        draggable={false}
        resizable={false}
        style={{ width: "min(32rem, calc(100vw - 2rem))" }}
      >
        <p>
          Скачайте новую редакцию журнала со страницы{" "}
          <a
            href="https://mz.kaze.red/journal"
            onClick={(event) => {
              event.preventDefault();
              window.electronAPI.openExternal("https://mz.kaze.red/journal");
            }}
          >
            mz.kaze.red/journal
          </a>
          . После этого удалите эту программу средствами Windows.
        </p>
        <small>
          Резервная ссылка: {" "}
          <a
            href="https://github.com/HM-Province/GtaJournal-Reloaded/blob/master/README.md"
            onClick={(event) => {
              event.preventDefault();
              window.electronAPI.openExternal(
                "https://github.com/HM-Province/GtaJournal-Reloaded/blob/master/README.md"
              );
            }}
          >
            GitHub README
          </a>
        </small>
      </Dialog>
      <WindowTopbar />
      <main className="flex" style={{ paddingTop: "33px" }}>
        <RouterProvider router={router} />
      </main>
    </Provider>
  );
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);