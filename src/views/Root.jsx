import { useEffect } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import React from "react";
import Icon from "@mdi/react";
import {
  mdiViewDashboard,
  mdiCalendarClock,
  mdiPoll,
  mdiCog,
  mdiLogout,
} from "@mdi/js";

function SidebarLink(props) {
  return (
    <>
      {!props.active && (
        <Link
          className="flex align-items-center mb-2 py-2 px-3 border-round-md font-bold hover:surface-hover transition-duration-300 transition-colors transition-ease-in-out"
          to={props.to}
        >
          {props.icon && <Icon className="mr-2" size={1} path={props.icon} />}{" "}
          {props.label}
        </Link>
      )}
      {props.active && (
        <Link
          className="flex align-items-center mb-2 py-2 px-3 border-round-md font-bold surface-hover text-primary transition-duration-300 transition-colors transition-ease-in-out"
          to={props.to}
        >
          {props.icon && <Icon className="mr-2" size={1} path={props.icon} />}{" "}
          {props.label}
        </Link>
      )}
    </>
  );
}

export default function Root() {
  const naviagate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sessionInfo = localStorage.getItem("session_data")
      ? JSON.parse(localStorage.getItem("session_data"))
      : null;
    if (!sessionInfo || Date.now() >= sessionInfo?.expires)
      return naviagate("/login");
  }, []);

  return (
    <>
      <nav
        style={{ height: "calc(100vh - 33px)" }}
        className="surface-overlay py-2 pl-2 pr-3"
      >
        <div className="flex flex-column">
          <SidebarLink
            active={
              location.pathname == "/dashboard" || location.pathname == "/"
            }
            to="/dashboard"
            label="Панель управления"
            icon={mdiViewDashboard}
          />
          <SidebarLink
            active={location.pathname == "/stats"}
            to="/stats"
            label="Статистика"
            icon={mdiCalendarClock}
          />
          <SidebarLink
            active={location.pathname == "/top"}
            to="/top"
            label="Топ 10"
            icon={mdiPoll}
          />
          <SidebarLink
            active={false}
            to="/logout"
            label="Выйти"
            icon={mdiLogout}
          />
        </div>
      </nav>
      <section
        style={{ height: "calc(100vh - 33px)" }}
        className="pt-2 pb-4 px-2 overflow-y-auto w-12"
      >
        <Outlet />
      </section>
    </>
  );
}
