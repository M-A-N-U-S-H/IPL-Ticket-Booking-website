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

// =========================================
// Activity 8: Mobile Hamburger Menu Toggle
// =========================================
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}

// =========================================
// Activity 8: Team Filter & Grid/List Toggle
// =========================================
const teamFilter = document.getElementById("team-filter");
const matchCards = document.querySelectorAll(".match-card");

if (teamFilter) {
  teamFilter.addEventListener("change", () => {
    const selectedTeam = teamFilter.value;
    let visibleCount = 0;

    matchCards.forEach((card) => {
      const teams = card.getAttribute("data-teams") || "";
      if (selectedTeam === "all" || teams.includes(selectedTeam)) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    showToast(
      selectedTeam === "all"
        ? `Showing all ${visibleCount} matches`
        : `Filtered by ${selectedTeam}: ${visibleCount} match(es) found`
    );
  });
}

// Event delegation for Grid View and List View buttons
document.addEventListener("click", (event) => {
  const gridBtn = event.target.closest("#grid-view-btn");
  const listBtn = event.target.closest("#list-view-btn");
  if (!gridBtn && !listBtn) return;

  const matchGrid =
    document.getElementById("match-cards-grid") ||
    document.querySelector(".match-grid");

  if (!matchGrid) return;

  const gBtn = document.getElementById("grid-view-btn");
  const lBtn = document.getElementById("list-view-btn");

  if (gridBtn) {
    matchGrid.classList.remove("list-view");
    if (gBtn) gBtn.classList.add("active");
    if (lBtn) lBtn.classList.remove("active");
    showToast("Switched to Grid View");
  } else if (listBtn) {
    matchGrid.classList.add("list-view");
    if (lBtn) lBtn.classList.add("active");
    if (gBtn) gBtn.classList.remove("active");
    showToast("Switched to List View");
  }
});

// =========================================
// Activity 7: Live Booking Summary Update
// =========================================
const matchSelect = document.getElementById("match-select");
const standSelect = document.getElementById("stand-category");
const qtyInput = document.getElementById("ticket-quantity");

const summaryMatch = document.querySelector("#summary-match");
const summaryStand = document.querySelector("#summary-stand");
const summaryPrice = document.querySelector("#summary-price");
const summaryQty = document.querySelector("#summary-quantity");
const summaryTotal = document.querySelector("#summary-total");

const matchPrices = {
  match1: { general: 1500, premium: 4500, vip: 12000 },
  match2: { general: 1200, premium: 4000, vip: 10500 },
  match3: { general: 1800, premium: 5000, vip: 14000 },
  match4: { general: 1400, premium: 4200, vip: 11000 }
};

function updateBookingSummary(notify = true) {
  if (!matchSelect || !standSelect || !qtyInput) return;

  const matchValue = matchSelect.value;
  const matchText = matchValue
    ? matchSelect.options[matchSelect.selectedIndex].text
    : "-";

  const standValue = standSelect.value;
  const standText = standValue
    ? standSelect.options[standSelect.selectedIndex].text
    : "-";

  const quantity = Math.max(0, parseInt(qtyInput.value, 10) || 0);
  const unitPrice =
    matchPrices[matchValue] && matchPrices[matchValue][standValue]
      ? matchPrices[matchValue][standValue]
      : 0;

  const totalAmount = unitPrice * quantity;

  if (summaryMatch) summaryMatch.textContent = matchText;
  if (summaryStand) summaryStand.textContent = standText;
  if (summaryPrice) {
    summaryPrice.textContent =
      unitPrice > 0 ? `₹${unitPrice.toLocaleString("en-IN")}` : "-";
  }
  if (summaryQty) summaryQty.textContent = quantity > 0 ? quantity : "-";
  if (summaryTotal) {
    summaryTotal.textContent = `₹${totalAmount.toLocaleString("en-IN")}`;
  }

  if (notify) {
    showToast(
      `Booking summary updated! Total: ₹${totalAmount.toLocaleString("en-IN")}`
    );
  }
}

// Smooth scrolling & auto-selection when clicking "Book Ticket" on a match card
document.addEventListener("click", (event) => {
  const bookLink = event.target.closest('a[href="#booking"]');
  if (!bookLink) return;

  event.preventDefault();

  const card = bookLink.closest(".match-card");
  if (card && matchSelect) {
    const matchVal = card.getAttribute("data-match-value");
    const matchTitle = card.querySelector("h3").textContent.trim();

    if (matchVal) {
      matchSelect.value = matchVal;
      updateBookingSummary(false);
    }
    showToast(`Selected ${matchTitle}. Complete your booking below!`);
  }

  const bookingSection = document.getElementById("booking");
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: "smooth" });
  }
});

if (matchSelect && standSelect && qtyInput) {
  matchSelect.addEventListener("change", () => updateBookingSummary(true));
  standSelect.addEventListener("change", () => updateBookingSummary(true));
  qtyInput.addEventListener("change", () => updateBookingSummary(true));
}
