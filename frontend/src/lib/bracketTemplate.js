// FIFA 2026 World Cup — confirmed R32 bracket skeleton (matches 73–88).
// Source: docs/features/bracket-reference.md
//
// Slot notation:
//   'W-{G}' = winner of Group G
//   'R-{G}' = runner-up of Group G
//   'T3:{A,B,...}' = best third-place finisher from one of the listed groups
//                    (resolved by the 495-scenario FIFA allocation table once available)

export const BRACKET_SLOTS = [
  { id: 73, home: 'R-A',           away: 'R-B'           },
  { id: 74, home: 'W-E',           away: 'T3:{A,B,C,D,F}'},
  { id: 75, home: 'W-F',           away: 'R-C'           },
  { id: 76, home: 'W-C',           away: 'R-F'           },
  { id: 77, home: 'W-I',           away: 'T3:{C,D,F,G,H}'},
  { id: 78, home: 'R-E',           away: 'R-I'           },
  { id: 79, home: 'W-A',           away: 'T3:{C,E,F,H,I}'},
  { id: 80, home: 'W-L',           away: 'T3:{E,H,I,J,K}'},
  { id: 81, home: 'W-D',           away: 'T3:{B,E,F,I,J}'},
  { id: 82, home: 'W-G',           away: 'T3:{A,E,H,I,J}'},
  { id: 83, home: 'R-K',           away: 'R-L'           },
  { id: 84, home: 'W-H',           away: 'R-J'           },
  { id: 85, home: 'W-B',           away: 'T3:{E,F,G,I,J}'},
  { id: 86, home: 'W-J',           away: 'R-H'           },
  { id: 87, home: 'W-K',           away: 'T3:{D,E,I,J,L}'},
  { id: 88, home: 'R-D',           away: 'R-G'           },
];

// R16 progression: winner of each R32 pair advances (sequential pairing M73+M74→M89, etc.)
export const R16_SLOTS = [
  { id: 89,  home: 'W-73', away: 'W-74' },
  { id: 90,  home: 'W-75', away: 'W-76' },
  { id: 91,  home: 'W-77', away: 'W-78' },
  { id: 92,  home: 'W-79', away: 'W-80' },
  { id: 93,  home: 'W-81', away: 'W-82' },
  { id: 94,  home: 'W-83', away: 'W-84' },
  { id: 95,  home: 'W-85', away: 'W-86' },
  { id: 96,  home: 'W-87', away: 'W-88' },
];

export const QF_SLOTS = [
  { id: 97,  home: 'W-89', away: 'W-90' },
  { id: 98,  home: 'W-91', away: 'W-92' },
  { id: 99,  home: 'W-93', away: 'W-94' },
  { id: 100, home: 'W-95', away: 'W-96' },
];

export const SF_SLOTS = [
  { id: 101, home: 'W-97',  away: 'W-98'  },
  { id: 102, home: 'W-99',  away: 'W-100' },
];

export const FINAL_SLOT       = { id: 104, home: 'W-101', away: 'W-102' };
export const THIRD_PLACE_SLOT = { id: 103, home: 'L-101', away: 'L-102' };

/**
 * Resolves a slot string to a team row, or a placeholder descriptor.
 * Returns null only when the team data is genuinely missing.
 */
export function resolveSlot(slot, { winners, runnersUp }) {
  if (slot.startsWith('W-')) {
    const g = slot.slice(2);
    return winners.find(t => t.group === g) ?? null;
  }
  if (slot.startsWith('R-')) {
    const g = slot.slice(2);
    return runnersUp.find(t => t.group === g) ?? null;
  }
  if (slot.startsWith('T3:')) {
    // Third-place allocation pending official FIFA 495-scenario table.
    const groups = slot.slice(3).replace(/[{}]/g, '');
    return { placeholder: true, label: `3rd of ${groups}` };
  }
  return null;
}
