package com.zipcode.worldcuptracker.service;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.zipcode.worldcuptracker.model.Commentary;
import com.zipcode.worldcuptracker.repository.CommentaryRepository;
import com.zipcode.worldcuptracker.standings.MatchEntry;
import com.zipcode.worldcuptracker.standings.MockMatchesData;
import com.zipcode.worldcuptracker.standings.MockTeamProfiles;
import com.zipcode.worldcuptracker.standings.TeamProfile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentaryService {

    private static final String SYSTEM_PROMPT = """
            You are a football (soccer) broadcast analyst giving pre-match color commentary
            for a FIFA World Cup 2026 match, in the voice of a TV analyst moments before kickoff.

            Write ONE engaging paragraph of about 4–6 sentences. No headings, no bullet points,
            no lists — just the paragraph.

            Strict rules:
            - Use ONLY the facts given in the match data. Do not add statistics, results, dates,
              player names, or any claim that is not provided. If something isn't given, keep it
              general instead of inventing specifics.
            - Do NOT predict or imply an outcome: no winner, no "favorite", no "edge", no scoreline,
              no betting language. Give both teams their due and stay neutral.
            - Focus on the stylistic and tactical contrast between the two sides, their World Cup
              pedigree, and what makes the matchup compelling to watch.
            - Keep it spoiler-free and present-tense, as if the match has not started.
            - Output only the commentary paragraph — nothing else.
            """;

    private static final List<String> PREDICTION_TERMS = List.of(
        "will win", "will beat", "should beat", "going to win", "will triumph",
        "favourite", "favorite", "the edge", "odds", "scoreline"
    );

    private final CommentaryRepository commentaryRepository;
    private final AnthropicClient anthropicClient;
    private final String anthropicModel;

    public CommentaryService(
            CommentaryRepository commentaryRepository,
            @Value("${api.anthropic.key}") String apiKey,
            @Value("${api.anthropic.model:claude-sonnet-4-6}") String anthropicModel) {
        this.commentaryRepository = commentaryRepository;
        this.anthropicClient = AnthropicOkHttpClient.builder()
            .apiKey(apiKey)
            .build();
        this.anthropicModel = anthropicModel;
    }

    public Commentary generate(int matchNumber) {
        String matchId = String.valueOf(matchNumber);

        // Return cached commentary if clean copy already exists
        Commentary existing = commentaryRepository.findById(matchId).orElse(null);
        if (existing != null && !existing.isFlagged()) {
            return existing;
        }

        MatchEntry match = MockMatchesData.ALL.stream()
            .filter(m -> m.number() == matchNumber)
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchNumber));

        String userMessage = buildUserMessage(match);
        String content = callApi(userMessage);

        boolean flagged = containsPredictionTerms(content);
        if (flagged) {
            // Regenerate once
            content = callApi(userMessage);
            flagged = containsPredictionTerms(content);
        }

        Commentary commentary = new Commentary(matchId, content, LocalDateTime.now(), flagged);
        return commentaryRepository.save(commentary);
    }

    private String buildUserMessage(MatchEntry match) {
        TeamProfile home = MockTeamProfiles.BY_SLUG.get(match.homeSlug());
        TeamProfile away = MockTeamProfiles.BY_SLUG.get(match.awaySlug());

        StringBuilder sb = new StringBuilder();
        sb.append("Match: ").append(match.homeName()).append(" vs ").append(match.awayName()).append("\n");
        sb.append("Group: ").append(match.round()).append("\n\n");

        sb.append(match.homeName()).append("\n");
        if (home != null) {
            sb.append("- World Cup history: ").append(home.history()).append("\n");
            sb.append("- Key players / style: ").append(home.style()).append("\n");
        }
        sb.append("\n");

        sb.append(match.awayName()).append("\n");
        if (away != null) {
            sb.append("- World Cup history: ").append(away.history()).append("\n");
            sb.append("- Key players / style: ").append(away.style()).append("\n");
        }
        sb.append("\nWrite the pre-match color commentary.");

        return sb.toString();
    }

    private String callApi(String userMessage) {
        var params = MessageCreateParams.builder()
            .model(Model.of(anthropicModel))
            .maxTokens(300L)
            .system(SYSTEM_PROMPT)
            .addUserMessage(userMessage)
            .build();

        var response = anthropicClient.messages().create(params);

        return response.content().stream()
            .flatMap(block -> block.text().stream())
            .map(textBlock -> textBlock.text())
            .collect(Collectors.joining())
            .trim();
    }

    private boolean containsPredictionTerms(String text) {
        String lower = text.toLowerCase();
        return PREDICTION_TERMS.stream().anyMatch(lower::contains);
    }
}
