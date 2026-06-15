import { useEffect, useState } from "react";

export default function Teams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>World Cup Tracker</h1>

      {teams.map((team) => (
        <div
          key={team.id}
          style={{
            border: "1px solid #ccc",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <h2>{team.name}</h2>
          <p>Country: {team.country}</p>
          <p>Group: {team.groupLabel}</p>
          <p>Coach: {team.coach}</p>

          <h4>Players</h4>
          <ul>
            {team.players.map((player) => (
              <li key={player.id}>
                #{player.shirtNumber} {player.name} ({player.position})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
