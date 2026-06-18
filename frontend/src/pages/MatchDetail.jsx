import { useParams } from 'react-router-dom';
export default function MatchDetail() {
  const { id } = useParams();
  return <div className="page"><h1 className="page-title">Match {id}</h1><p className="page-subtitle">Match detail — coming soon.</p></div>;
}
