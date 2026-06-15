import { useParams } from 'react-router-dom';

// TODO: [Dev B] Match detail: teams, venue link, score, events timeline.
// Hosts the commentary panel slot owned by Dev C.
export default function MatchDetail() {
  const { id } = useParams();
  return (
    <section className="page">
      <h1>Match #{id}</h1>
      <p className="muted">Placeholder — owned by Dev B; commentary panel slot for Dev C.</p>
    </section>
  );
}
