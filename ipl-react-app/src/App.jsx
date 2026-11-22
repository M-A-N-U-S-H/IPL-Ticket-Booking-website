import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/Matchcard";
import "./App.css";

const MATCHES_DATA = [
  {
    id: "match1",
    matchNumber: "Match 1",
    teams: "RCB vs MI",
    teamCodes: ["RCB", "MI"],
    dateTime: "April 02, 2026 • 7:30 PM",
    venue: "M. Chinnaswamy Stadium, Bengaluru",
    prices: { general: 1500, premium: 4500, vip: 12000 },
  },
  {
    id: "match2",
    matchNumber: "Match 2",
    teams: "CSK vs KKR",
    teamCodes: ["CSK", "KKR"],
    dateTime: "April 03, 2026 • 7:30 PM",
    venue: "MA Chidambaram Stadium, Chennai",
    prices: { general: 1200, premium: 4000, vip: 10500 },
  },
  {
    id: "match3",
    matchNumber: "Match 3",
    teams: "MI vs CSK",
    teamCodes: ["MI", "CSK"],
    dateTime: "April 05, 2026 • 7:30 PM",
    venue: "Wankhede Stadium, Mumbai",
    prices: { general: 1800, premium: 5000, vip: 14000 },
  },
  {
    id: "match4",
    matchNumber: "Match 4",
    teams: "KKR vs RCB",
    teamCodes: ["KKR", "RCB"],
    dateTime: "April 07, 2026 • 7:30 PM",
    venue: "Eden Gardens, Kolkata",
    prices: { general: 1400, premium: 4200, vip: 11000 },
  },
];

function App() {
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedMatch, setSelectedMatch] = useState(null);

  const filteredMatches =
    selectedTeam === "all"
      ? MATCHES_DATA
      : MATCHES_DATA.filter((m) => m.teamCodes.includes(selectedTeam));

  return (
    <div className="app">
      <Navbar />
      <Hero />

      <main className="container">
        <section id="matches">
          <h2>Match Schedule</h2>

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

          <div className="match-grid">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onSelectMatch={(chosenMatch) => setSelectedMatch(chosenMatch)}
              />
            ))}
          </div>
        </section>

        {selectedMatch && (
          <section id="booking" className="selected-banner">
            <h3>
              Selected Match: {selectedMatch.matchNumber} — {selectedMatch.teams}
            </h3>
            <p>
              {selectedMatch.venue} ({selectedMatch.dateTime})
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
