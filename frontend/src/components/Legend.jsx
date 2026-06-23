function Dot({ color }) {
  return <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />;
}

function LegendItem({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Dot color={color} />
      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{label}</span>
    </div>
  );
}

export default function Legend() {
  return (
    <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <LegendItem color="var(--status-advance)" label="Group winner (advances)" />
        <LegendItem color="var(--status-runner)"  label="Runner-up (advances)" />
        <LegendItem color="var(--status-third)"   label="Best 3rd place (advancing)" />
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
        <span><b>P</b> Played</span>
        <span><b>W</b> Won</span>
        <span><b>D</b> Drawn</span>
        <span><b>L</b> Lost</span>
        <span><b>GF</b> Goals For</span>
        <span><b>GA</b> Goals Against</span>
        <span><b>GD</b> Goal Difference</span>
        <span><b>Pts</b> Points</span>
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        Tiebreakers (simplified): points → GD → GF → alphabetical. Official FIFA order adds fair-play points and drawing of lots — ties the app cannot break are marked equal.
      </div>
    </div>
  );
}
