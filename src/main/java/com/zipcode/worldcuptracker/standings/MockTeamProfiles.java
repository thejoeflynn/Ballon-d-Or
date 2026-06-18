package com.zipcode.worldcuptracker.standings;

import java.util.Map;

public final class MockTeamProfiles {

    public static final Map<String, TeamProfile> BY_SLUG = Map.ofEntries(
        Map.entry("mexico", new TeamProfile("mexico",
            "Seventeen World Cup appearances; best finish quarter-finals (1970, 1986).",
            "Organized defensive block with technical midfielders and quick counter-attacks; consistent tournament presence.")),

        Map.entry("uruguay", new TeamProfile("uruguay",
            "Fourteen appearances; two-time world champions (1930, 1950); fourth place in 2010.",
            "Physically combative and tactically disciplined with clinical finishers; renowned Garra Charrúa spirit.")),

        Map.entry("argentina", new TeamProfile("argentina",
            "Nineteen appearances; three-time world champions (1978, 1986, 2022).",
            "Possession-based attacking football built around creative forwards and a dynamic midfield.")),

        Map.entry("canada", new TeamProfile("canada",
            "Second World Cup appearance (first in 2022); co-hosts of the 2026 tournament.",
            "High-energy pressing with pace in wide areas and growing physicality and depth in central midfield.")),

        Map.entry("spain", new TeamProfile("spain",
            "Fifteen appearances; world champions in 2010; four-time European Champions.",
            "Fluid possession football with rapid rotations, technical midfield control, and patient build-up play.")),

        Map.entry("brazil", new TeamProfile("brazil",
            "Twenty-two appearances — more than any nation; five-time world champions (1958, 1962, 1970, 1994, 2002).",
            "Fluid attacking play built on technical forwards and overlapping full-backs; expressive, attack-minded football.")),

        Map.entry("england", new TeamProfile("england",
            "Sixteen appearances; world champions on home soil in 1966.",
            "Direct and energetic with pace up front, a physical midfield presence, and a potent set-piece threat.")),

        Map.entry("france", new TeamProfile("france",
            "Sixteen appearances; two-time world champions (1998, 2018); runners-up in 2022.",
            "Athletic and technically gifted across all positions; capable of playing multiple tactical systems at the highest level.")),

        Map.entry("germany", new TeamProfile("germany",
            "Nineteen appearances; four-time world champions (1954, 1974, 1990, 2014).",
            "Efficient pressing, structured build-up through the lines, and tactical versatility; the definition of tournament reliability.")),

        Map.entry("portugal", new TeamProfile("portugal",
            "Eight appearances; 2016 European Champions; never won the World Cup.",
            "Attack-minded with creative wingers and deep playmaking quality; historically reliant on individual brilliance.")),

        Map.entry("netherlands", new TeamProfile("netherlands",
            "Eleven appearances; three-time finalists (1974, 1978, 2010); never won the World Cup.",
            "Total Football heritage expressed through fluid positional play, technical midfield, and an incisive attacking threat.")),

        Map.entry("morocco", new TeamProfile("morocco",
            "Seven appearances; semi-finalists in 2022 — the best World Cup finish by an African nation.",
            "Defensively organized and extremely hard to break down; dangerous and direct on the counter with pace in wide areas.")),

        Map.entry("united-states", new TeamProfile("united-states",
            "Eleven appearances; best finish third place (1930); co-hosts alongside Canada and Mexico in 2026.",
            "Athletic and high-pressing with pace in behind; a growing technical quality matched by increasing tactical sophistication.")),

        Map.entry("croatia", new TeamProfile("croatia",
            "Eight appearances; runners-up in 2018, third place in 1998 and 2022.",
            "Patient midfield control and exceptional composure in knockout moments; technically gifted through the centre of the park.")),

        Map.entry("japan", new TeamProfile("japan",
            "Eight appearances; four-time AFC Asian Cup champions; consistent Round of 16 performers.",
            "Compact defensive organization, rapid transitions, and technical quality distributed across the squad.")),

        Map.entry("senegal", new TeamProfile("senegal",
            "Three appearances; quarter-finalists in 2002; Africa Cup of Nations champions in 2021/2022.",
            "Physically imposing and direct with explosive athleticism on the flanks and a strong aerial presence.")),

        Map.entry("colombia", new TeamProfile("colombia",
            "Six appearances; quarter-finalists in 2014.",
            "Creative and attack-minded with technical midfielders who combine well and direct forwards who threaten in behind.")),

        Map.entry("switzerland", new TeamProfile("switzerland",
            "Twelve appearances; quarter-finalists in 2022.",
            "Disciplined defensive organization that transitions quickly and sharply into counter-attacks; a reliable European presence.")),

        Map.entry("norway", new TeamProfile("norway",
            "Three World Cup appearances; best finish third place in 1930.",
            "Physical and direct with an effective long-ball and aerial game; combative in midfield and hard to beat.")),

        Map.entry("south-korea", new TeamProfile("south-korea",
            "Eleven appearances; semi-finalists on home soil in 2002.",
            "Energetic high press, disciplined defensive shape, and fast transitions built on collective team effort.")),

        Map.entry("belgium", new TeamProfile("belgium",
            "Fourteen appearances; third place at the 2018 World Cup in Russia.",
            "Creative and technical with dynamic forwards and a playmaking midfield; historically strong on the counter-attack.")),

        Map.entry("egypt", new TeamProfile("egypt",
            "Three World Cup appearances; most recent in 1990.",
            "Compact and organized defensively; composed in possession and clinical on the counter and from set pieces.")),

        Map.entry("australia", new TeamProfile("australia",
            "Five appearances; reached the Round of 16 in 2006 and the quarter-finals in 2022.",
            "Physical and direct with high energy throughout the squad; strong aerial game and pressing intensity.")),

        Map.entry("scotland", new TeamProfile("scotland",
            "Eight appearances; passionate tournament presence with a best finish in the group stage.",
            "Energetic pressing, a combative and technically capable midfield, and a strong collective spirit.")),

        Map.entry("iran", new TeamProfile("iran",
            "Six World Cup appearances; best finish the group stage.",
            "Organized and defensively solid with a disciplined tactical structure and counter-attacking capability."))
    );

    private MockTeamProfiles() {}
}
