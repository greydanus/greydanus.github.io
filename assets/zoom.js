(function () {
  var overlay = null;

  function close() {
    if (!overlay) return;
    overlay.classList.remove("active");
    document.documentElement.classList.remove("zoom-open");
  }

  function open(img) {
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "zoom-overlay";
      overlay.appendChild(document.createElement("img"));
      overlay.addEventListener("click", close);
      document.body.appendChild(overlay);
    }
    var big = overlay.firstChild;
    big.src = img.currentSrc || img.src;
    big.alt = img.alt || "";
    overlay.classList.add("active");
    overlay.scrollTop = 0;
    overlay.scrollLeft = 0;
    document.documentElement.classList.add("zoom-open");
  }

  document.addEventListener("click", function (e) {
    var img = e.target.closest ? e.target.closest("img.zoom") : null;
    if (img) open(img);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
})();
