package com.zipcode.worldcuptracker.controller;

import com.zipcode.worldcuptracker.model.Match;
import com.zipcode.worldcuptracker.model.Venue;
import com.zipcode.worldcuptracker.repository.MatchRepository;
import com.zipcode.worldcuptracker.repository.VenueRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/venues")
@CrossOrigin(origins = "http://localhost:5173")
public class VenueController {

    private final VenueRepository venueRepository;
    private final MatchRepository matchRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final Map<Integer, String> WMO_ICON = new LinkedHashMap<>();
    private static final Map<Integer, String> WMO_LABEL = new LinkedHashMap<>();

    static {
        WMO_ICON.put(0, "☀️");   WMO_LABEL.put(0, "Clear sky");
        WMO_ICON.put(1, "🌤️");  WMO_LABEL.put(1, "Mainly clear");
        WMO_ICON.put(2, "⛅");   WMO_LABEL.put(2, "Partly cloudy");
        WMO_ICON.put(3, "☁️");   WMO_LABEL.put(3, "Overcast");
        WMO_ICON.put(45, "🌫️");  WMO_LABEL.put(45, "Fog");
        WMO_ICON.put(48, "🌫️");  WMO_LABEL.put(48, "Icy fog");
        WMO_ICON.put(51, "🌦️");  WMO_LABEL.put(51, "Light drizzle");
        WMO_ICON.put(61, "🌧️");  WMO_LABEL.put(61, "Slight rain");
        WMO_ICON.put(63, "🌧️");  WMO_LABEL.put(63, "Moderate rain");
        WMO_ICON.put(65, "🌧️");  WMO_LABEL.put(65, "Heavy rain");
        WMO_ICON.put(71, "🌨️");  WMO_LABEL.put(71, "Slight snow");
        WMO_ICON.put(80, "🌦️");  WMO_LABEL.put(80, "Rain showers");
        WMO_ICON.put(95, "⛈️");  WMO_LABEL.put(95, "Thunderstorm");
    }

    public VenueController(VenueRepository venueRepository, MatchRepository matchRepository) {
        this.venueRepository = venueRepository;
        this.matchRepository = matchRepository;
    }

    @GetMapping
    public List<Venue> getVenues(@RequestParam(required = false) String country) {
        if (country != null && !country.isBlank()) {
            return venueRepository.findByCountryIgnoreCase(country);
        }
        return venueRepository.findAll();
    }

    @GetMapping("/{id}")
    public Venue getVenue(@PathVariable Long id) {
        return venueRepository.findById(id).orElseThrow();
    }

    @GetMapping("/{id}/matches")
    public List<Match> getMatchesAtVenue(@PathVariable Long id) {
        return matchRepository.findByVenueId(id);
    }

    @GetMapping("/{id}/images")
    public List<String> getVenueImages(@PathVariable Long id) {
        Venue venue = venueRepository.findById(id).orElseThrow();
        if (venue.getImageUrl() == null || venue.getImageUrl().isBlank()) {
            return List.of();
        }
        String relativePath = venue.getImageUrl();
        Path dir = Paths.get("src/main/resources/static" + relativePath);
        if (!Files.isDirectory(dir)) return List.of();
        try {
            return Files.list(dir)
                .filter(p -> !Files.isDirectory(p))
                .filter(p -> p.getFileName().toString().matches("(?i).*\\.(jpg|jpeg|png|webp|avif)"))
                .sorted(Comparator.comparing(p -> p.getFileName().toString()))
                .map(p -> relativePath + "/" + p.getFileName().toString())
                .toList();
        } catch (IOException e) {
            return List.of();
        }
    }

    @GetMapping("/{id}/weather")
    public Map<String, Object> getVenueWeather(@PathVariable Long id) {
        Venue venue = venueRepository.findById(id).orElseThrow();
        if (venue.getLat() == null || venue.getLng() == null) return Map.of();
        try {
            String url = String.format(
                "https://api.open-meteo.com/v1/forecast?latitude=%s&longitude=%s" +
                "&current_weather=true&temperature_unit=fahrenheit&wind_speed_unit=mph",
                venue.getLat(), venue.getLng()
            );
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response == null) return Map.of();
            @SuppressWarnings("unchecked")
            Map<String, Object> cw = (Map<String, Object>) response.get("current_weather");
            if (cw == null) return Map.of();

            int code = ((Number) cw.get("weathercode")).intValue();
            double tempF = ((Number) cw.get("temperature")).doubleValue();
            double windMph = ((Number) cw.get("windspeed")).doubleValue();
            String icon = resolveWmoIcon(code);
            String label = resolveWmoLabel(code);

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("tempF", tempF);
            result.put("windMph", windMph);
            result.put("code", code);
            result.put("label", label);
            result.put("icon", icon);
            return result;
        } catch (Exception e) {
            return Map.of();
        }
    }

    @GetMapping("/{id}/attraction-images")
    public List<List<String>> getAttractionImages(@PathVariable Long id) {
        // Static images not yet on this branch — return empty lists per attraction slot
        return List.of();
    }

    private String resolveWmoIcon(int code) {
        // Floor to nearest key
        int best = 0;
        for (int k : WMO_ICON.keySet()) {
            if (k <= code) best = k;
        }
        return WMO_ICON.getOrDefault(best, "🌡️");
    }

    private String resolveWmoLabel(int code) {
        int best = 0;
        for (int k : WMO_LABEL.keySet()) {
            if (k <= code) best = k;
        }
        return WMO_LABEL.getOrDefault(best, "Unknown");
    }
}
