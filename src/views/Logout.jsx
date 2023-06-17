import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.removeItem("session_data");
    navigate("/login");
  }, []);

  return (<></>)
}