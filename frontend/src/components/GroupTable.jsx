import StandingsRow from './StandingsRow.jsx';

const HEADERS = [
  { label: '',    title: '',                   align: 'left'   },
  { label: '#',   title: 'Rank',               align: 'center' },
  { label: 'Team',title: 'Team',               align: 'left'   },
  { label: 'P',   title: 'Played',             align: 'center' },
  { label: 'W',   title: 'Won',                align: 'center' },
  { label: 'D',   title: 'Drawn',              align: 'center' },
  { label: 'L',   title: 'Lost',               align: 'center' },
  { label: 'GF',  title: 'Goals For',          align: 'center' },
  { label: 'GA',  title: 'Goals Against',      align: 'center' },
  { label: 'GD',  title: 'Goal Difference',    align: 'center' },
  { label: 'Pts', title: 'Points',             align: 'center' },
];

export default function GroupTable({ group }) {
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div className="card-header section-title group-table-header" data-group={group.id}>
        Group {group.id}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 340 }}>
          <caption style={{ display: 'none' }}>Group {group.id} standings</caption>
          <thead>
            <tr>
              {HEADERS.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  title={h.title}
                  style={{
                    padding: '4px 6px',
                    fontSize: '0.7rem',
                    fontWeight: i === HEADERS.length - 1 ? 700 : 600,
                    color: i === HEADERS.length - 1 ? 'var(--text)' : 'var(--text-muted)',
                    textAlign: h.align,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid var(--border)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.teams.map((row, i) => (
              <StandingsRow key={row.slug} row={row} rank={row.rank ?? i + 1} state={row.state} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
