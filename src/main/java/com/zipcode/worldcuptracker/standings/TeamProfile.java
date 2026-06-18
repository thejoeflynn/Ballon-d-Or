package com.zipcode.worldcuptracker.standings;

public record TeamProfile(String slug, String history, String style) {
    public String getSlug()    { return slug; }
    public String getHistory() { return history; }
    public String getStyle()   { return style; }
}
