(function () {
  const btn = document.getElementById("theme-toggle");
  const modes = ["light", "dark", "auto"];
  const icons = {
    light: "🌞",
    dark: "🌙",
    auto: "🌓",
  };

  let current = localStorage.getItem("appearance") || "auto";
  document.body.setAttribute("a", current);
  if (btn) btn.textContent = icons[current];

  function nextMode(mode) {
    const i = modes.indexOf(mode);
    return modes[(i + 1) % modes.length];
  }

  btn?.addEventListener("click", () => {
    current = nextMode(current);
    document.body.setAttribute("a", current);
    localStorage.setItem("appearance", current);
    btn.textContent = icons[current];
  });
})();
