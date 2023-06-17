import { useEffect } from "react"
import { useNavigate, Link, Outlet } from "react-router-dom";
import React from "react";
import Icon from '@mdi/react';
import { mdiViewDashboard, mdiCalendarClock, mdiPoll, mdiCog, mdiLogout } from '@mdi/js';

function SidebarLink(props) {
  return <Link className="flex align-items-center py-2 px-3 border-round-md font-bold hover:surface-hover transition-duration-300 transition-colors transition-ease-in-out" to={props.to}>{props.icon && <Icon className="mr-2" size={1} path={props.icon} />} {props.label}</Link>
}

export default function Root() {
  const naviagate = useNavigate();

  useEffect(() => {
    const sessionInfo = localStorage.getItem("session_data") ? JSON.parse(localStorage.getItem("session_data")) : null;
    if (!sessionInfo || Date.now() >= sessionInfo?.expires) return naviagate("/login");
  }, []);

  return (
    <>
      <nav  style={{height: 'calc(100vh - 33px)'}} className="surface-overlay py-2 pl-2 pr-3">
        <div className="flex flex-column">
          <SidebarLink to="/dashboard" label="Панель управления" icon={mdiViewDashboard} />
          <SidebarLink to="/stats" label="Статистика" icon={mdiCalendarClock} />
          <SidebarLink to="/top" label="Топ 10" icon={mdiPoll} />
          <SidebarLink to="/logout" label="Выйти" icon={mdiLogout} />
        </div>
      </nav>
      <section style={{height: 'calc(100vh - 33px)'}} className="pt-2 pb-4 px-2 overflow-y-auto w-12">
        <Outlet />
      </section>
    </>
  )
}