package com.zipcode.worldcuptracker.controller;

import com.zipcode.worldcuptracker.model.Commentary;
import com.zipcode.worldcuptracker.service.CommentaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/matches")
public class CommentaryController {

    private final CommentaryService commentaryService;

    public CommentaryController(CommentaryService commentaryService) {
        this.commentaryService = commentaryService;
    }

    @PostMapping("/{number}/commentary/generate")
    public ResponseEntity<Map<String, Object>> generate(@PathVariable int number) {
        try {
            Commentary commentary = commentaryService.generate(number);
            return ResponseEntity.ok(Map.of(
                "matchId",   commentary.getMatchId(),
                "generated", true,
                "flagged",   commentary.isFlagged(),
                "content",   commentary.getContent() != null ? commentary.getContent() : ""
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to generate commentary: " + e.getMessage()
            ));
        }
    }
}
