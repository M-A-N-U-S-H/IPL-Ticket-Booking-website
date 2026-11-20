function showToast(message) {
  let toast = document.getElementById("toast-notification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notification";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

document.addEventListener("click", (event) => {
  const bookLink = event.target.closest("#schedule tbody a");
  if (!bookLink) return;

  event.preventDefault();

  const row = bookLink.closest("tr");
  const matchNumber = row.cells[0].textContent.trim();
  const teams = row.cells[1].textContent.trim();

  const matchSelect = document.getElementById("match-select");
  if (matchSelect) {
    matchSelect.value = `match${row.sectionRowIndex + 1}`;
  }

  const bookingSection = document.getElementById("booking");
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: "smooth" });
  }

  showToast(`Selected ${matchNumber}: ${teams}. Complete your booking below!`);
});
