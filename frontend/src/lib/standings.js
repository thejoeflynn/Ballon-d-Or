function cmp(a, b) {
  if (b.points !== a.points) return b.points - a.points;
  if (b.gd     !== a.gd)     return b.gd     - a.gd;
  if (b.gf     !== a.gf)     return b.gf     - a.gf;
  return a.name.localeCompare(b.name);
}

export function rankGroup(teams) {
  return [...teams].sort(cmp).map((t, i) => ({ ...t, rank: i + 1 }));
}

export function getRankedThirds(groups) {
  const thirds = groups.map(g => {
    const ranked = rankGroup(g.teams);
    return { ...ranked[2], group: g.id };
  });
  return [...thirds].sort(cmp).map((t, i) => ({ ...t, thirdRank: i + 1 }));
}

export function annotateGroups(groups) {
  return groups.map(g => {
    const ranked = rankGroup(g.teams);
    const annotated = ranked.map(t => ({
      ...t,
      state: t.rank <= 2 ? 'advance' : 'none',
    }));
    return { ...g, teams: annotated };
  });
}

export function getProjectedQualifiers(groups, cutoff = 8) {
  const winners = [], runnersUp = [];
  for (const g of groups) {
    const ranked = rankGroup(g.teams);
    winners.push({ ...ranked[0], group: g.id });
    runnersUp.push({ ...ranked[1], group: g.id });
  }
  const bestThirds = getRankedThirds(groups).filter(t => t.thirdRank <= cutoff);
  return { winners, runnersUp, bestThirds };
}
