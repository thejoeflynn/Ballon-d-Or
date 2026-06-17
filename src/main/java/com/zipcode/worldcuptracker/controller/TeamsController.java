package com.zipcode.worldcuptracker.controller;

import com.zipcode.worldcuptracker.standings.MockTeamsData;
import com.zipcode.worldcuptracker.standings.TeamEntry;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class TeamsController {

    @GetMapping("/teams")
    public String teams(@RequestParam(required = false) String group, Model model) {
        List<TeamEntry> teams = (group != null && !group.isBlank())
            ? MockTeamsData.ALL.stream().filter(t -> t.group().equals(group)).toList()
            : MockTeamsData.ALL;

        model.addAttribute("teams",       teams);
        model.addAttribute("groups",      MockTeamsData.GROUPS);
        model.addAttribute("activeGroup", group != null ? group : "ALL");
        model.addAttribute("activePage",  "teams");
        return "teams/teams";
    }

    @GetMapping("/teams/{slug}")
    public String teamDetail(@PathVariable String slug, Model model) {
        TeamEntry team = MockTeamsData.BY_SLUG.get(slug);
        if (team == null) return "redirect:/teams";

        model.addAttribute("team",       team);
        model.addAttribute("activePage", "teams");
        return "teams/team-detail";
    }
}
