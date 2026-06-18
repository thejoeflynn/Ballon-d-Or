package com.zipcode.worldcuptracker.controller;

import com.zipcode.worldcuptracker.model.Commentary;
import com.zipcode.worldcuptracker.repository.CommentaryRepository;
import com.zipcode.worldcuptracker.standings.MatchEntry;
import com.zipcode.worldcuptracker.standings.MockMatchesData;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;
import java.util.stream.Collectors;

@Controller
public class MatchesController {

    private final CommentaryRepository commentaryRepository;

    public MatchesController(CommentaryRepository commentaryRepository) {
        this.commentaryRepository = commentaryRepository;
    }

    @GetMapping("/matches/{number}")
    public String matchDetail(@PathVariable int number, Model model) {
        MatchEntry match = MockMatchesData.ALL.stream()
            .filter(m -> m.number() == number)
            .findFirst()
            .orElse(null);

        if (match == null) {
            return "redirect:/matches";
        }

        Commentary commentary = commentaryRepository.findById(String.valueOf(number)).orElse(null);

        model.addAttribute("match",      match);
        model.addAttribute("commentary", commentary);
        model.addAttribute("activePage", "matches");
        return "matches/match-detail";
    }

    @GetMapping("/matches")
    public String matches(@RequestParam(required = false, defaultValue = "ALL") String filter,
                          Model model) {
        List<MatchEntry> all = MockMatchesData.ALL;

        List<MatchEntry> filtered = switch (filter) {
            case "LIVE"     -> all.stream().filter(MatchEntry::isLive).toList();
            case "FINAL"    -> all.stream().filter(MatchEntry::isPlayed).toList();
            case "UPCOMING" -> all.stream().filter(MatchEntry::isUpcoming).toList();
            default         -> all;
        };

        // Group by date, preserving insertion order
        LinkedHashMap<String, List<MatchEntry>> byDate = filtered.stream()
            .collect(Collectors.groupingBy(MatchEntry::date,
                LinkedHashMap::new, Collectors.toList()));

        long liveCount = all.stream().filter(MatchEntry::isLive).count();

        model.addAttribute("byDate",     byDate);
        model.addAttribute("filter",     filter);
        model.addAttribute("totalCount", filtered.size());
        model.addAttribute("liveCount",  liveCount);
        model.addAttribute("activePage", "matches");
        return "matches/matches";
    }
}
