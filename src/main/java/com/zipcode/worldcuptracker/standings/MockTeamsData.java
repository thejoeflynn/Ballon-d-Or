package com.zipcode.worldcuptracker.standings;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public final class MockTeamsData {
    private MockTeamsData() {}

    public static final List<TeamEntry> ALL = List.of(
        new TeamEntry("united-states",      "United States",   "USA", "A"),
        new TeamEntry("uruguay",            "Uruguay",         "URU", "A"),
        new TeamEntry("panama",             "Panama",          "PAN", "A"),
        new TeamEntry("curacao",            "Curaçao",         "CUR", "A"),
        new TeamEntry("canada",             "Canada",          "CAN", "B"),
        new TeamEntry("colombia",           "Colombia",        "COL", "B"),
        new TeamEntry("south-korea",        "South Korea",     "KOR", "B"),
        new TeamEntry("ivory-coast",        "Ivory Coast",     "CIV", "B"),
        new TeamEntry("mexico",             "Mexico",          "MEX", "C"),
        new TeamEntry("brazil",             "Brazil",          "BRA", "C"),
        new TeamEntry("iraq",               "Iraq",            "IRQ", "C"),
        new TeamEntry("new-zealand",        "New Zealand",     "NZL", "C"),
        new TeamEntry("argentina",          "Argentina",       "ARG", "D"),
        new TeamEntry("japan",              "Japan",           "JPN", "D"),
        new TeamEntry("australia",          "Australia",       "AUS", "D"),
        new TeamEntry("algeria",            "Algeria",         "ALG", "D"),
        new TeamEntry("england",            "England",         "ENG", "E"),
        new TeamEntry("ecuador",            "Ecuador",         "ECU", "E"),
        new TeamEntry("south-africa",       "South Africa",    "RSA", "E"),
        new TeamEntry("saudi-arabia",       "Saudi Arabia",    "KSA", "E"),
        new TeamEntry("france",             "France",          "FRA", "F"),
        new TeamEntry("morocco",            "Morocco",         "MAR", "F"),
        new TeamEntry("paraguay",           "Paraguay",        "PAR", "F"),
        new TeamEntry("ghana",              "Ghana",           "GHA", "F"),
        new TeamEntry("germany",            "Germany",         "GER", "G"),
        new TeamEntry("egypt",              "Egypt",           "EGY", "G"),
        new TeamEntry("uzbekistan",         "Uzbekistan",      "UZB", "G"),
        new TeamEntry("cape-verde",         "Cape Verde",      "CPV", "G"),
        new TeamEntry("spain",              "Spain",           "ESP", "H"),
        new TeamEntry("dr-congo",           "DR Congo",        "COD", "H"),
        new TeamEntry("tunisia",            "Tunisia",         "TUN", "H"),
        new TeamEntry("haiti",              "Haiti",           "HAI", "H"),
        new TeamEntry("portugal",           "Portugal",        "POR", "I"),
        new TeamEntry("senegal",            "Senegal",         "SEN", "I"),
        new TeamEntry("norway",             "Norway",          "NOR", "I"),
        new TeamEntry("jordan",             "Jordan",          "JOR", "I"),
        new TeamEntry("netherlands",        "Netherlands",     "NED", "J"),
        new TeamEntry("belgium",            "Belgium",         "BEL", "J"),
        new TeamEntry("iran",               "Iran",            "IRN", "J"),
        new TeamEntry("qatar",              "Qatar",           "QAT", "J"),
        new TeamEntry("croatia",            "Croatia",         "CRO", "K"),
        new TeamEntry("scotland",           "Scotland",        "SCO", "K"),
        new TeamEntry("sweden",             "Sweden",          "SWE", "K"),
        new TeamEntry("austria",            "Austria",         "AUT", "K"),
        new TeamEntry("switzerland",        "Switzerland",     "SUI", "L"),
        new TeamEntry("turkiye",            "Türkiye",         "TUR", "L"),
        new TeamEntry("czechia",            "Czech Republic",  "CZE", "L"),
        new TeamEntry("bosnia-herzegovina", "Bosnia & Herz.",  "BIH", "L")
    );

    public static final List<String> GROUPS =
        List.of("A","B","C","D","E","F","G","H","I","J","K","L");

    public static final Map<String, TeamEntry> BY_SLUG =
        ALL.stream().collect(Collectors.toMap(TeamEntry::slug, t -> t));
}
