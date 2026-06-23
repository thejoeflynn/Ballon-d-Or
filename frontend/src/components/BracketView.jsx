import { Link } from 'react-router-dom';
import Flag from './Flag.jsx';
import {
  R16_SLOTS, QF_SLOTS, SF_SLOTS, FINAL_SLOT, THIRD_PLACE_SLOT,
} from '../lib/bracketTemplate.js';

// Layout constants
const MW = 176; // match card width
const TH = 26;  // team row height
const MH = TH * 2 + 2; // match card height (2 rows + 1px divider + 1px border)
const SH = 72;  // slot height per R32 match
const CW = 28;  // connector arm width
const LH = 36;  // round label height above matches
const BH = 16 * SH; // total bracket height = 1152

const TOTAL_W = 5 * MW + 4 * CW; // 992

function roundX(ri) { return ri * (MW + CW); }
function matchCenterY(ri, mi) { return LH + (mi + 0.5) * Math.pow(2, ri) * SH; }
function matchTopY(ri, mi) { return matchCenterY(ri, mi) - MH / 2; }

function resolveKnockoutSlot(slot) {
  if (slot.startsWith('W-')) return { placeholder: true, label: `Winner of M${slot.slice(2)}` };
  if (slot.startsWith('L-')) return { placeholder: true, label: `Loser of M${slot.slice(2)}` };
  return null;
}

function TeamSlot({ team }) {
  const base = {
    display: 'flex', alignItems: 'center', height: TH,
    overflow: 'hidden', padding: '0 7px', gap: 5,
  };
  if (!team || team.placeholder) {
    return (
      <div style={base}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {team ? team.label : 'TBD'}
        </span>
      </div>
    );
  }
  return (
    <Link
      to={`/teams/${team.slug}`}
      style={{ ...base, textDecoration: 'none', color: 'inherit', borderLeft: `3px solid var(--group-${team.group}, var(--border))` }}
      className="standings-team-link"
    >
      <Flag slug={team.slug} alt={team.name} style={{ width: 18, height: 13, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{team.name}</span>
    </Link>
  );
}

function MatchCard({ match, ri, mi }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: roundX(ri),
        top: matchTopY(ri, mi),
        width: MW,
        height: MH,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      aria-label={`Match M${match.id}`}
    >
      <TeamSlot team={match.home} />
      <div style={{ height: 1, background: 'var(--border)', flexShrink: 0 }} />
      <TeamSlot team={match.away} />
    </div>
  );
}

function Connectors({ ri, count }) {
  const xs = roundX(ri) + MW;
  const xm = xs + CW / 2;
  const xt = roundX(ri + 1);
  const pairs = Math.floor(count / 2);
  const paths = [];
  for (let i = 0; i < pairs; i++) {
    const y0 = matchCenterY(ri, i * 2);
    const y1 = matchCenterY(ri, i * 2 + 1);
    // bracket arm: top horizontal + vertical + bottom horizontal + connector to next round
    paths.push(`M ${xs} ${y0} H ${xm} V ${y1} H ${xs} M ${xm} ${(y0 + y1) / 2} H ${xt}`);
  }
  return <path d={paths.join(' ')} style={{ stroke: 'var(--text-muted)', fill: 'none' }} strokeWidth={1.5} />;
}

function ThirdPlaceMatch({ match }) {
  return (
    <div style={{ padding: '16px 16px 16px' }}>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
          3rd Place — M{match.id}
        </div>
        <div style={{ display: 'inline-flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', minWidth: MW }}>
          <TeamSlot team={match.home} />
          <div style={{ height: 1, background: 'var(--border)' }} />
          <TeamSlot team={match.away} />
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 6 }}>Losers of both semi-finals</div>
      </div>
    </div>
  );
}

const ROUND_LABELS = ['Round of 32', 'Round of 16', 'Quarter-finals', 'Semi-finals', 'Final'];

export default function BracketView({ matchups }) {
  const r16 = R16_SLOTS.map(s => ({ id: s.id, home: resolveKnockoutSlot(s.home), away: resolveKnockoutSlot(s.away) }));
  const qf  = QF_SLOTS.map(s  => ({ id: s.id, home: resolveKnockoutSlot(s.home), away: resolveKnockoutSlot(s.away) }));
  const sf  = SF_SLOTS.map(s  => ({ id: s.id, home: resolveKnockoutSlot(s.home), away: resolveKnockoutSlot(s.away) }));
  const fin = [{ id: FINAL_SLOT.id,       home: resolveKnockoutSlot(FINAL_SLOT.home),       away: resolveKnockoutSlot(FINAL_SLOT.away) }];
  const trd = { id: THIRD_PLACE_SLOT.id,  home: resolveKnockoutSlot(THIRD_PLACE_SLOT.home), away: resolveKnockoutSlot(THIRD_PLACE_SLOT.away) };

  const allRounds = [matchups, r16, qf, sf, fin];

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div className="card-header section-title">Projected Bracket</div>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ position: 'relative', width: TOTAL_W, height: BH + LH + 16, margin: '12px 16px' }}>

          {/* SVG layer: round labels + connector lines */}
          <svg
            width={TOTAL_W}
            height={BH + LH}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
            aria-hidden="true"
          >
            {/* Round labels */}
            {ROUND_LABELS.map((label, ri) => (
              <text
                key={ri}
                x={roundX(ri) + MW / 2}
                y={LH / 2 + 5}
                textAnchor="middle"
                style={{ fontSize: 10, fontWeight: 700, fill: 'var(--text-muted)', letterSpacing: '0.07em', fontFamily: 'inherit', textTransform: 'uppercase' }}
              >
                {label.toUpperCase()}
              </text>
            ))}
            {/* Connectors between rounds (not after Final) */}
            {allRounds.slice(0, -1).map((round, ri) => (
              <Connectors key={ri} ri={ri} count={round.length} />
            ))}
          </svg>

          {/* Match cards */}
          {allRounds.map((round, ri) =>
            round.map((m, mi) => <MatchCard key={m.id} match={m} ri={ri} mi={mi} />)
          )}
        </div>
      </div>

      <ThirdPlaceMatch match={trd} />
    </div>
  );
}
