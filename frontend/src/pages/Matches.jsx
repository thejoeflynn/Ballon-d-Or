import { useEffect, useState } from "react";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/matches")
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Matches</h1>

      {matches.map((match) => (
        <div key={match.id} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
          <h3>
            {match.homeTeam?.name} vs {match.awayTeam?.name}
          </h3>
          <p>Status: {match.status}</p>
          <p>
            Score: {match.homeScore ?? "-"} - {match.awayScore ?? "-"}
          </p>
          <p>
            Kickoff: {match.kickoffTime ? new Date(match.kickoffTime).toLocaleString() : "TBD"}
          </p>
          <p>Group: {match.groupLabel || "TBD"}</p>
        </div>
      ))}
    </div>
  );
}
