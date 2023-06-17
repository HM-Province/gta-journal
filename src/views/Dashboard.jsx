import React from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import Icon from "@mdi/react";
import { mdiBriefcase, mdiGhost, mdiSleep } from "@mdi/js";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState({
    isLoaded: false,
    username: "",
    avatar: "",
    tag: "",
  });

  return (
    <>
      <div className="grid">
        <div className="col-6">
          <div className="surface-card p-2 flex flex-column border-round-md">
          <span className="text-xl flex align-items-center">
            Вошли как{" "}
            {
              <Skeleton
                className="ml-2"
                width="100px"
                height="24px"
                borderRadius="5px"
              ></Skeleton>
            }
          </span>
          <span className="text-2xl flex align-items-center">
            Вы сейчас{" "}
            {
              <Skeleton
                className="ml-2"
                width="100px"
                height="24px"
                borderRadius="5px"
              ></Skeleton>
            }
          </span>
          </div>
        </div>
        <div className="col-6">
          <div className="flex flex-wrap gap-2 p-2 border-round-md surface-card">
          <Button
            icon={<Icon path={mdiBriefcase} size={1} />}
            loading
            severity={"success"}
            label="Онлайн"
          />
          <Button
            icon={<Icon path={mdiSleep} size={1} />}
            loading
            severity={"warning"}
            label="АФК"
          />
          <Button
            icon={<Icon path={mdiGhost} size={1} />}
            loading
            severity={"danger"}
            label="Оффлайн"
          />
          </div>
        </div>
      </div>
    </>
  );
}
