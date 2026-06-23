import { useState, useEffect, useMemo } from 'react';
import { groups as mockGroups } from '../data/mockStandings.js';
import { annotateGroups, getProjectedQualifiers } from '../lib/standings.js';
import { BRACKET_SLOTS, resolveSlot } from '../lib/bracketTemplate.js';
import { fetchStandings } from '../lib/api.js';
import Tabs from '../components/Tabs.jsx';
import Legend from '../components/Legend.jsx';
import GroupTable from '../components/GroupTable.jsx';
import BracketView from '../components/BracketView.jsx';

const TABS = [
  { id: 'group',   label: 'Group Stage' },
  { id: 'bracket', label: 'Bracket' },
];

export default function Standings() {
  const [tab, setTab] = useState('group');
  const [rawGroups, setRawGroups] = useState(mockGroups);

  useEffect(() => {
    fetchStandings().then(setRawGroups);
  }, []);

  const hasResults = useMemo(
    () => rawGroups.some(g => g.teams.some(t => t.played > 0)),
    [rawGroups]
  );

  const annotated = useMemo(() => annotateGroups(rawGroups), [rawGroups]);
  const { winners, runnersUp } = useMemo(() => getProjectedQualifiers(rawGroups), [rawGroups]);
  const matchups = useMemo(() => BRACKET_SLOTS.map(slot => ({
    id:   slot.id,
    home: resolveSlot(slot.home, { winners, runnersUp }),
    away: resolveSlot(slot.away, { winners, runnersUp }),
  })), [winners, runnersUp]);

  return (
    <div>
      <h1 className="page-title">Standings</h1>
      <p className="page-subtitle">
        {tab === 'bracket'
          ? 'Projected — based on current group standings.'
          : 'Group stage results — top 2 from each group advance.'}
      </p>
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'group' && (
        <>
          {!hasResults && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '10px 14px', marginBottom: 16, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              No results yet — standings update as matches are played.
            </div>
          )}
          <Legend />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {annotated.map(g => <GroupTable key={g.id} group={g} />)}
          </div>
        </>
      )}

      {tab === 'bracket' && <BracketView matchups={matchups} />}
    </div>
  );
}
