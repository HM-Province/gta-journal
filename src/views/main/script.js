function redirect() {
  if (localStorage.getItem("session_info")) {
    const sessionInfo = JSON.parse(localStorage.getItem("session_info"));

    if (new Date() < new Date(sessionInfo.expires)) return window.location.replace('../dashboard/index.html');  
  }

  return window.location.replace('../login/index.html');
}

redirect();