package com.zipcode.worldcuptracker.standings;

import java.util.List;

public final class MockMatchesData {
    private MockMatchesData() {}

    private static MatchEntry fin(int n, String hs, String hn, String ha, String as, String an, String aa,
                                   int hg, int ag, String date, String time, String round, String venue) {
        return new MatchEntry(n, hs, hn, ha, as, an, aa, hg, ag, "FINAL", date, time, round, venue);
    }

    private static MatchEntry live(int n, String hs, String hn, String ha, String as, String an, String aa,
                                    int hg, int ag, String date, String time, String round, String venue) {
        return new MatchEntry(n, hs, hn, ha, as, an, aa, hg, ag, "LIVE", date, time, round, venue);
    }

    private static MatchEntry up(int n, String hs, String hn, String ha, String as, String an, String aa,
                                  String date, String time, String round, String venue) {
        return new MatchEntry(n, hs, hn, ha, as, an, aa, null, null, "UPCOMING", date, time, round, venue);
    }

    public static final List<MatchEntry> ALL = List.of(
        // ── Matchday 1 ─────────────────────────────────────────────────────
        fin( 1,"mexico",       "Mexico",       "MEX","uruguay",     "Uruguay",     "URU", 2, 0, "Jun 11","4:00 PM ET","Group A","SoFi Stadium, LA"),
        fin( 2,"argentina",    "Argentina",    "ARG","canada",      "Canada",      "CAN", 3, 1, "Jun 12","6:00 PM ET","Group B","MetLife Stadium, NJ"),
        fin( 3,"spain",        "Spain",        "ESP","brazil",      "Brazil",      "BRA", 1, 1, "Jun 12","9:00 PM ET","Group C","Hard Rock Stadium, Miami"),
        fin( 4,"england",      "England",      "ENG","france",      "France",      "FRA", 2, 1, "Jun 13","3:00 PM ET","Group D","AT&T Stadium, Dallas"),
        fin( 5,"germany",      "Germany",      "GER","portugal",    "Portugal",    "POR", 1, 2, "Jun 13","6:00 PM ET","Group E","Levi's Stadium, SF"),
        fin( 6,"netherlands",  "Netherlands",  "NED","morocco",     "Morocco",     "MAR", 2, 0, "Jun 14","3:00 PM ET","Group F","Lincoln Financial Field, Philly"),
        fin( 7,"united-states","United States","USA","croatia",     "Croatia",     "CRO", 3, 1, "Jun 14","6:00 PM ET","Group G","MetLife Stadium, NJ"),
        fin( 8,"japan",        "Japan",        "JPN","senegal",     "Senegal",     "SEN", 2, 1, "Jun 14","9:00 PM ET","Group H","Rose Bowl, LA"),
        fin( 9,"colombia",     "Colombia",     "COL","switzerland", "Switzerland", "SUI", 1, 0, "Jun 15","3:00 PM ET","Group I","BC Place, Vancouver"),
        fin(10,"norway",       "Norway",       "NOR","south-korea", "South Korea", "KOR", 1, 2, "Jun 15","6:00 PM ET","Group J","Arrowhead Stadium, KC"),
        fin(11,"belgium",      "Belgium",      "BEL","egypt",       "Egypt",       "EGY", 3, 0, "Jun 16","3:00 PM ET","Group K","NRG Stadium, Houston"),
        fin(12,"australia",    "Australia",    "AUS","scotland",    "Scotland",    "SCO", 1, 1, "Jun 16","6:00 PM ET","Group L","Gillette Stadium, Boston"),

        // ── Matchday 2 ─────────────────────────────────────────────────────
        fin(13,"brazil",       "Brazil",       "BRA","england",     "England",     "ENG", 0, 1, "Jun 18","4:00 PM ET","Group D","AT&T Stadium, Dallas"),
        fin(14,"france",       "France",       "FRA","germany",     "Germany",     "GER", 2, 2, "Jun 18","7:00 PM ET","Group E","SoFi Stadium, LA"),
        fin(15,"portugal",     "Portugal",     "POR","netherlands", "Netherlands", "NED", 1, 0, "Jun 19","3:00 PM ET","Group F","MetLife Stadium, NJ"),
        fin(16,"argentina",    "Argentina",    "ARG","spain",       "Spain",       "ESP", 2, 1, "Jun 19","6:00 PM ET","Group C","Hard Rock Stadium, Miami"),

        // ── Live ───────────────────────────────────────────────────────────
        live(17,"united-states","United States","USA","japan",      "Japan",       "JPN", 1, 0, "Jun 20","7:00 PM ET","Group G","MetLife Stadium, NJ"),

        // ── Upcoming ───────────────────────────────────────────────────────
        up(18,"mexico",       "Mexico",        "MEX","colombia",   "Colombia",    "COL","Jun 21","3:00 PM ET","Group A","SoFi Stadium, LA"),
        up(19,"morocco",      "Morocco",       "MAR","senegal",    "Senegal",     "SEN","Jun 21","6:00 PM ET","Group H","Rose Bowl, LA"),
        up(20,"canada",       "Canada",        "CAN","switzerland","Switzerland", "SUI","Jun 22","3:00 PM ET","Group I","BC Place, Vancouver"),
        up(21,"croatia",      "Croatia",       "CRO","south-korea","South Korea", "KOR","Jun 22","6:00 PM ET","Group J","Arrowhead Stadium, KC"),
        up(22,"norway",       "Norway",        "NOR","egypt",      "Egypt",       "EGY","Jun 23","3:00 PM ET","Group K","NRG Stadium, Houston"),
        up(23,"scotland",     "Scotland",      "SCO","belgium",     "Belgium",    "BEL","Jun 23","6:00 PM ET","Group K","NRG Stadium, Houston"),
        up(24,"australia",    "Australia",     "AUS","iran",        "Iran",       "IRN","Jun 24","3:00 PM ET","Group L","Gillette Stadium, Boston"),
        up(25,"uruguay",      "Uruguay",       "URU","senegal",    "Senegal",     "SEN","Jun 24","6:00 PM ET","Group H","Rose Bowl, LA")
    );
}
