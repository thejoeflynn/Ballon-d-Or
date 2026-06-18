package com.zipcode.worldcuptracker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "commentary")
public class Commentary {

    @Id
    private String matchId;

    @Column(length = 2000)
    private String content;

    private LocalDateTime generatedAt;

    private boolean flagged;

    public Commentary() {}

    public Commentary(String matchId, String content, LocalDateTime generatedAt, boolean flagged) {
        this.matchId = matchId;
        this.content = content;
        this.generatedAt = generatedAt;
        this.flagged = flagged;
    }

    public String getMatchId()           { return matchId; }
    public void   setMatchId(String v)   { this.matchId = v; }

    public String getContent()           { return content; }
    public void   setContent(String v)   { this.content = v; }

    public LocalDateTime getGeneratedAt()              { return generatedAt; }
    public void          setGeneratedAt(LocalDateTime v) { this.generatedAt = v; }

    public boolean isFlagged()          { return flagged; }
    public void    setFlagged(boolean v) { this.flagged = v; }
}
