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
        <span><b>GP</b> Games Played</span>
        <span><b>W</b> Won</span>
        <span><b>D</b> Drawn</span>
        <span><b>L</b> Lost</span>
        <span><b>Pts</b> Points</span>
      </div>
    </div>
  );
}
