function MatchCard({ match, onSelectMatch }) {
  return (
    <article className="match-card">
      <div className="match-card-header">
        <span className="match-badge">{match.match_number}</span>
        <span className="match-date">{match.date_time}</span>
      </div>

      <h3>{match.teams}</h3>
      <p className="match-venue">{match.venue}</p>
      <p className="seats-badge">
        Available Seats: <strong>{match.available_seats}</strong>
      </p>

      <div className="price-tiers">
        <span>
          General: <strong>₹{match.general_price.toLocaleString("en-IN")}</strong>
        </span>
        <span>
          Premium: <strong>₹{match.premium_price.toLocaleString("en-IN")}</strong>
        </span>
        <span>
          VIP: <strong>₹{match.vip_price.toLocaleString("en-IN")}</strong>
        </span>
      </div>

      <button
        type="button"
        className="btn-book"
        disabled={match.available_seats <= 0}
        onClick={() => onSelectMatch(match)}
      >
        {match.available_seats > 0 ? "Book Ticket" : "Sold Out"}
      </button>
    </article>
  );
}

export default MatchCard;
