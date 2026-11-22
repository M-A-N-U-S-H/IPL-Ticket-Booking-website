import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">IPL Tickets 2026</div>

      <button
        type="button"
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <a href="#matches" onClick={() => setMenuOpen(false)}>
            Matches
          </a>
        </li>
        <li>
          <a href="#booking" onClick={() => setMenuOpen(false)}>
            Book Ticket
          </a>
        </li>
        <li>
          <a href="#guidelines" onClick={() => setMenuOpen(false)}>
            Guidelines
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
