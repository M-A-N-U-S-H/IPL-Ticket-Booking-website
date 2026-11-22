function MatchCard({ match, onSelectMatch }) {
  return (
    <article className="match-card">
      <div className="match-card-header">
        <span className="match-badge">{match.matchNumber}</span>
        <span className="match-date">{match.dateTime}</span>
      </div>

      <h3>{match.teams}</h3>
      <p className="match-venue">{match.venue}</p>

      <div className="price-tiers">
        <span>
          General: <strong>₹{match.prices.general.toLocaleString("en-IN")}</strong>
        </span>
        <span>
          Premium: <strong>₹{match.prices.premium.toLocaleString("en-IN")}</strong>
        </span>
        <span>
          VIP: <strong>₹{match.prices.vip.toLocaleString("en-IN")}</strong>
        </span>
      </div>

      <button
        type="button"
        className="btn-book"
        onClick={() => onSelectMatch(match)}
      >
        Book Ticket
      </button>
    </article>
  );
}

export default MatchCard;
