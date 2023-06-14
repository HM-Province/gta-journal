let state = {
  isLoading: true,
  showLogin: false,
  showActions: false
}

function render() {
  console.log("Called render")

  if (state.isLoading) {
    document.getElementById("loading")?.classList.remove("hidden");
  } else {
    document.getElementById("loading")?.classList.add("hidden");
  }

  if (state.showLogin) {
    document.getElementById("login")?.classList.remove("hidden");
  } else {
    document.getElementById("login")?.classList.add("hidden");
  }

  if (state.showActions) {
    document.getElementById("actions")?.classList.remove("hidden");
  } else {
    document.getElementById("actions")?.classList.add("hidden");
  }
}

function loadData() {
  if (!localStorage.getItem("auth_credentials")) {
    state.isLoading = false;
    state.showLogin = true;
    return render();
  }

  state.isLoading = false;
  state.showActions = true;
  return render();
}

loadData();