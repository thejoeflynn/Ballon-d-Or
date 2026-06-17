package com.zipcode.worldcuptracker.standings;

public record TeamEntry(String slug, String name, String abbr, String group) {
    public String getSlug()  { return slug; }
    public String getName()  { return name; }
    public String getAbbr()  { return abbr; }
    public String getGroup() { return group; }
}
