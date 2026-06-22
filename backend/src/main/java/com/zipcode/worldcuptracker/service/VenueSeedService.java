package com.zipcode.worldcuptracker.service;

import java.util.Map;

import com.zipcode.worldcuptracker.model.Team;
import com.zipcode.worldcuptracker.model.Venue;
import com.zipcode.worldcuptracker.repository.TeamRepository;
import com.zipcode.worldcuptracker.repository.VenueRepository;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.stereotype.Service;

@Service
public class VenueSeedService {

    private final VenueRepository venueRepository;
    private final TeamRepository teamRepository;

    // Teams whose group label comes back from the API as "Group Stage - N"
    // because the API uses generic round names for them.
    private static final Map<String, String> TEAM_GROUP_FIXES = Map.of(
        "Bosnia & Herzegovina",    "Group B",
        "Bosnia & Herzegowina",    "Group B",
        "Bosnia and Herzegovina",  "Group B",
        "Türkiye",                 "Group D",
        "Turkey",                  "Group D",
        "Cape Verde Islands",      "Group H",
        "Cape Verde",              "Group H"
    );

    public VenueSeedService(VenueRepository venueRepository, TeamRepository teamRepository) {
        this.venueRepository = venueRepository;
        this.teamRepository = teamRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seedVenues() {
        // Upsert: patch rich fields onto existing API-imported rows, or create new ones.
        // Never skip just because rows exist — API import leaves lat/lng/capacity null.
        Object[][] rows = {
            // id  name                        city                      country   flag   capacity  lat        lng         imageUrl                      countryColor
            {1,  "MetLife Stadium",           "New York / New Jersey",  "USA",    "🇺🇸", 82500,   40.8136,  -74.0744,  "/images/USA/MetLife",        "#B22234"},
            {2,  "SoFi Stadium",              "Los Angeles",            "USA",    "🇺🇸", 70240,   33.9535, -118.3392,  "/images/USA/SoFi",           "#B22234"},
            {3,  "AT&T Stadium",              "Dallas",                 "USA",    "🇺🇸", 80000,   32.7473,  -97.0945,  "/images/USA/ATT",            "#B22234"},
            {4,  "Levi's Stadium",            "San Francisco Bay Area", "USA",    "🇺🇸", 68500,   37.4032, -121.9698,  "/images/USA/Levis",          "#B22234"},
            {5,  "Hard Rock Stadium",         "Miami",                  "USA",    "🇺🇸", 65326,   25.9580,  -80.2389,  "/images/USA/HardRock",       "#B22234"},
            {6,  "Gillette Stadium",          "Boston",                 "USA",    "🇺🇸", 65878,   42.0909,  -71.2643,  "/images/USA/Gillette",       "#B22234"},
            {7,  "Lincoln Financial Field",   "Philadelphia",           "USA",    "🇺🇸", 69796,   39.9008,  -75.1675,  "/images/USA/Lincoln",        "#B22234"},
            {8,  "Arrowhead Stadium",         "Kansas City",            "USA",    "🇺🇸", 76416,   39.0489,  -94.4839,  "/images/USA/Arrowhead",      "#B22234"},
            {9,  "Lumen Field",               "Seattle",                "USA",    "🇺🇸", 68740,   47.5952, -122.3316,  "/images/USA/Lumen",          "#B22234"},
            {10, "BC Place",                  "Vancouver",              "Canada", "🇨🇦", 54500,   49.2768, -123.1115,  "/images/Canada/BCPlace",     "#FF0000"},
            {11, "BMO Field",                 "Toronto",                "Canada", "🇨🇦", 45736,   43.6333,  -79.4187,  "/images/Canada/BMOField",    "#FF0000"},
            {12, "Estadio Azteca",            "Mexico City",            "Mexico", "🇲🇽", 87523,   19.3029,  -99.1505,  "/images/Mexico/Azteca",      "#006847"},
            {13, "Estadio Akron",             "Guadalajara",            "Mexico", "🇲🇽", 45456,   20.6867, -103.4670,  "/images/Mexico/Akron",       "#006847"},
            {14, "Estadio BBVA",              "Monterrey",              "Mexico", "🇲🇽", 53500,   25.6693, -100.2440,  "/images/Mexico/BBVA",        "#006847"},
            {15, "NRG Stadium",               "Houston",                "USA",    "🇺🇸", 72220,   29.6847,  -95.4107,  "/images/USA/NRG",            "#B22234"},
            {16, "Rose Bowl",                 "Los Angeles",            "USA",    "🇺🇸", 92542,   34.1614, -118.1676,  "/images/USA/RoseBowl",       "#B22234"},
        };

        for (Object[] r : rows) {
            String name = (String) r[1];
            String city = (String) r[2];
            Venue v = venueRepository.findByNameAndCity(name, city)
                    .orElseGet(Venue::new);
            v.setName(name);
            v.setCity(city);
            v.setCountry((String) r[3]);
            v.setFlag((String) r[4]);
            v.setCapacity((Integer) r[5]);
            v.setLat((Double) r[6]);
            v.setLng((Double) r[7]);
            v.setImageUrl((String) r[8]);
            v.setCountryColor((String) r[9]);
            venueRepository.save(v);
        }

        repairTeamGroups();
    }

    private void repairTeamGroups() {
        for (Team team : teamRepository.findAll()) {
            String correct = TEAM_GROUP_FIXES.get(team.getName());
            if (correct != null && !correct.equals(team.getGroupLabel())) {
                team.setGroupLabel(correct);
                teamRepository.save(team);
            }
        }
    }
}
