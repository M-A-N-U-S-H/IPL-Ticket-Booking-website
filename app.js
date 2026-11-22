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

// Exact prices from your index.html Match Schedule table
const matchPrices = {
  match1: { general: 1500, premium: 4500, vip: 12000 },
  match2: { general: 1200, premium: 4000, vip: 10500 }
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
    summaryPrice.textContent = unitPrice > 0 ? `₹${unitPrice.toLocaleString("en-IN")}` : "-";
  }
  if (summaryQty) summaryQty.textContent = quantity > 0 ? quantity : "-";
  if (summaryTotal) summaryTotal.textContent = `₹${totalAmount.toLocaleString("en-IN")}`;

  if (notify) {
    showToast(`Booking summary updated! Total: ₹${totalAmount.toLocaleString("en-IN")}`);
  }
}

// Smooth scrolling & auto-selection when clicking "Book" in the Match Schedule
document.addEventListener("click", (event) => {
  const bookLink = event.target.closest('a[href="#booking"]');
  if (!bookLink) return;

  event.preventDefault();

  const row = bookLink.closest("tr");
  if (row && matchSelect) {
    const matchNumber = row.cells[0].textContent.trim();
    const teams = row.cells[1].textContent.trim();

    matchSelect.value = `match${row.sectionRowIndex + 1}`;
    updateBookingSummary(false);

    showToast(`Selected ${matchNumber}: ${teams}. Complete your booking below!`);
  }

  const bookingSection = document.getElementById("booking");
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: "smooth" });
  }
});

// Listen for changes on Match, Stand Category, and Number of Tickets
if (matchSelect && standSelect && qtyInput) {
  matchSelect.addEventListener("change", () => updateBookingSummary(true));
  standSelect.addEventListener("change", () => updateBookingSummary(true));
  qtyInput.addEventListener("change", () => updateBookingSummary(true));
}
