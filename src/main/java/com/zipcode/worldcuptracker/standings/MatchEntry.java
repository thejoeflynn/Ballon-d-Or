package com.zipcode.worldcuptracker.standings;

public record MatchEntry(
    int number,
    String homeSlug, String homeName, String homeAbbr,
    String awaySlug, String awayName, String awayAbbr,
    Integer homeScore, Integer awayScore,   // null = not played
    String status,   // "FINAL" | "LIVE" | "UPCOMING"
    String date,     // "Jun 11"
    String time,     // "3:00 PM ET"
    String round,    // "Group A", "Round of 32", etc.
    String venue
) {
    public String getHomeSlug()  { return homeSlug; }
    public String getHomeName()  { return homeName; }
    public String getHomeAbbr()  { return homeAbbr; }
    public String getAwaySlug()  { return awaySlug; }
    public String getAwayName()  { return awayName; }
    public String getAwayAbbr()  { return awayAbbr; }
    public Integer getHomeScore(){ return homeScore; }
    public Integer getAwayScore(){ return awayScore; }
    public String getStatus()    { return status; }
    public String getDate()      { return date; }
    public String getTime()      { return time; }
    public String getRound()     { return round; }
    public String getVenue()     { return venue; }
    public int getNumber()       { return number; }

    public boolean isPlayed()    { return "FINAL".equals(status); }
    public boolean isLive()      { return "LIVE".equals(status); }
    public boolean isUpcoming()  { return "UPCOMING".equals(status); }
}
