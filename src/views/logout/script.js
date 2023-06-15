function redirect() {
  localStorage.removeItem("session_info");

  return window.location.replace('../login/index.html');
}

redirect();