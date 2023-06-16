let state = {
  isLoading: false
};

function render() {
  if (state.isLoading) {
    document.getElementById("stats:loading")?.classList.remove("hidden");
    document.getElementById("stats:info")?.classList.add("hidden");
  } else {
    document.getElementById("stats:loading")?.classList.add("hidden");
    document.getElementById("stats:info")?.classList.remove("hidden");
  }
}

render();