import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/Matchcard";
import { supabase } from "./supabase";
import "./App.css";

function App() {
  const [matches, setMatches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [standCategory, setStandCategory] = useState("general");
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function fetchInitialData() {
    const { data: matchData, error: matchErr } = await supabase
      .from("matches")
      .select("*")
      .order("id", { ascending: true });

    if (!matchErr && matchData) {
      setMatches(matchData);
    }

    const { data: bookingData, error: bookingErr } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (!bookingErr && bookingData) {
      setBookings(bookingData);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchInitialData();

    const channel = supabase
      .channel("ipl-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        () => fetchInitialData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => fetchInitialData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredMatches =
    selectedTeam === "all"
      ? matches
      : matches.filter((m) => m.team_codes && m.team_codes.includes(selectedTeam));

  const activeMatch = matches.find((m) => String(m.id) === String(selectedMatchId));

  const unitPrice = activeMatch
    ? standCategory === "general"
      ? activeMatch.general_price
      : standCategory === "premium"
      ? activeMatch.premium_price
      : activeMatch.vip_price
    : 0;

  const totalAmount = unitPrice * (Number(quantity) || 0);

  function handleSelectMatch(match) {
    setSelectedMatchId(String(match.id));
    setStatusMsg(`Selected ${match.match_number}: ${match.teams}`);
    const bookingEl = document.getElementById("booking");
    if (bookingEl) bookingEl.scrollIntoView({ behavior: "smooth" });
  }

  async function handleBookingSubmit(e) {
    e.preventDefault();
    if (!activeMatch) {
      setStatusMsg("Please select a match first.");
      return;
    }
    if (quantity > activeMatch.available_seats) {
      setStatusMsg(`Only ${activeMatch.available_seats} seats left!`);
      return;
    }

    setSubmitting(true);
    setStatusMsg("");

    const { error: insertError } = await supabase.from("bookings").insert([
      {
        match_id: activeMatch.id,
        match_name: `${activeMatch.match_number}: ${activeMatch.teams}`,
        stand_category: standCategory.toUpperCase(),
        quantity: Number(quantity),
        total_amount: totalAmount,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
    ]);

    if (insertError) {
      setStatusMsg(`Booking failed: ${insertError.message}`);
      setSubmitting(false);
      return;
    }

    const updatedSeats = activeMatch.available_seats - Number(quantity);
    const { error: updateError } = await supabase
      .from("matches")
      .update({ available_seats: updatedSeats })
      .eq("id", activeMatch.id);

    if (updateError) {
      setStatusMsg(`Booked, but seat count failed to update: ${updateError.message}`);
    } else {
      setStatusMsg(
        `Booking confirmed for ${activeMatch.teams}! Remaining seats: ${updatedSeats}`
      );
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setQuantity(1);
    }

    setSubmitting(false);
  }

  return (
    <div className="app">
      <Navbar />
      <Hero />

      <main className="container">
        {statusMsg && <div className="status-toast">{statusMsg}</div>}

        <section id="matches">
          <h2>Match Schedule (Live Supabase DB)</h2>

          <div className="filter-bar">
            <label htmlFor="team-filter">
              <strong>Filter by Team:</strong>
            </label>
            <select
              id="team-filter"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="all">All Teams</option>
              <option value="RCB">RCB</option>
              <option value="MI">MI</option>
              <option value="CSK">CSK</option>
              <option value="KKR">KKR</option>
            </select>
          </div>

          {loading ? (
            <p>Loading matches from Supabase...</p>
          ) : (
            <div className="match-grid">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onSelectMatch={handleSelectMatch}
                />
              ))}
            </div>
          )}
        </section>

        <section id="booking" className="booking-section">
          <h2>Book Your Tickets</h2>

          <div className="booking-grid">
            <form onSubmit={handleBookingSubmit} className="booking-form">
              <div className="form-group">
                <label htmlFor="match-select">Select Match</label>
                <select
                  id="match-select"
                  value={selectedMatchId}
                  onChange={(e) => setSelectedMatchId(e.target.value)}
                  required
                >
                  <option value="">-- Choose a Match --</option>
                  {matches.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.match_number}: {m.teams} ({m.available_seats} seats left)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stand-select">Stand Category</label>
                <select
                  id="stand-select"
                  value={standCategory}
                  onChange={(e) => setStandCategory(e.target.value)}
                  required
                >
                  <option value="general">General</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="qty-input">Number of Tickets</label>
                <input
                  id="qty-input"
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cust-name">Full Name</label>
                <input
                  id="cust-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cust-email">Email</label>
                <input
                  id="cust-email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cust-phone">Phone Number</label>
                <input
                  id="cust-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? "Processing..." : "Confirm Booking"}
              </button>
            </form>

            <aside className="summary-card">
              <h3>Booking Summary</h3>
              <p>
                <span>Match:</span>
                <strong>
                  {activeMatch ? `${activeMatch.match_number}: ${activeMatch.teams}` : "-"}
                </strong>
              </p>
              <p>
                <span>Stand:</span>
                <strong>{standCategory.toUpperCase()}</strong>
              </p>
              <p>
                <span>Ticket Price:</span>
                <strong>₹{unitPrice.toLocaleString("en-IN")}</strong>
              </p>
              <p>
                <span>Quantity:</span>
                <strong>{quantity}</strong>
              </p>
              <hr />
              <p className="summary-total">
                <span>Total Amount:</span>
                <strong>₹{totalAmount.toLocaleString("en-IN")}</strong>
              </p>
            </aside>
          </div>
        </section>

        <section id="my-bookings" className="bookings-section">
          <h2>Recent Bookings (Live from PostgreSQL)</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Match</th>
                  <th>Stand</th>
                  <th>Tickets</th>
                  <th>Total Paid</th>
                  <th>Passenger</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No bookings yet. Book a ticket above to test live DB insert!
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td>#{b.id}</td>
                      <td>{b.match_name}</td>
                      <td>{b.stand_category}</td>
                      <td>{b.quantity}</td>
                      <td>₹{b.total_amount.toLocaleString("en-IN")}</td>
                      <td>{b.customer_name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
