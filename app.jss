// 1. Reusable showToast() function
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
  }, 3000);
}

// 2. Smooth scrolling & toast notification when clicking "Book" in the schedule
document.addEventListener("DOMContentLoaded", () => {
  const scheduleBookButtons = document.querySelectorAll("#schedule tbody a, #schedule tbody button");
  const bookingSection = document.getElementById("booking");
  const matchSelect = document.getElementById("match-select");

  scheduleBookButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      // Find the row where the button was clicked
      const row = button.closest("tr");
      const matchNumber = row.cells.textContent.trim();
      const teams = row.cells.textContent.trim();
      const rowIndex = row.sectionRowIndex;

      // Auto-select the match in the booking form dropdown
      if (matchSelect) {
        matchSelect.value = `match${rowIndex + 1}`;
      }

      // Smoothly scroll down to the booking section
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth" });
      }

      // Show confirmation toast
      showToast(`Selected ${matchNumber}: ${teams}. Complete your booking below!`);
    });
  });
});
