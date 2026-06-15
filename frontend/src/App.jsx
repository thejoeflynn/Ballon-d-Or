import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Teams from './pages/Teams.jsx';
import Matches from './pages/Matches.jsx';
import MatchDetail from './pages/MatchDetail.jsx';
import Venues from './pages/Venues.jsx';

/**
 * App routing shell (PLAN.md §1). Feature pages are placeholders owned per the
 * work split; each slice owner fills in their page(s).
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="teams" element={<Teams />} />
        <Route path="matches" element={<Matches />} />
        <Route path="matches/:id" element={<MatchDetail />} />
        <Route path="venues" element={<Venues />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
