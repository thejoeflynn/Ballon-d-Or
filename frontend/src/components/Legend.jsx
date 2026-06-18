export default function Legend() {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--status-advance)', flexShrink: 0 }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Advancing (1st / 2nd)</span>
      </div>
    </div>
  );
}
