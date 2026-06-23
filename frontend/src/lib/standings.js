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
  const rankedGroups = groups.map(g => ({ ...g, teams: rankGroup(g.teams) }));
  const rankedThirds = getRankedThirds(rankedGroups);
  const qualifyingThirdKeys = new Set(
    rankedThirds.filter(t => t.thirdRank <= 8).map(t => `${t.group}:${t.slug}`)
  );
  return rankedGroups.map(g => {
    const annotated = g.teams.map(t => {
      let state = 'none';
      if (t.rank === 1) state = 'winner';
      else if (t.rank === 2) state = 'runner';
      else if (t.rank === 3 && qualifyingThirdKeys.has(`${g.id}:${t.slug}`)) state = 'third';
      return { ...t, state };
    });
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
