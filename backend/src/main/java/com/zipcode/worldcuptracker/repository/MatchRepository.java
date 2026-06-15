package com.zipcode.worldcuptracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipcode.worldcuptracker.model.Match;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByStatus(String status);
    List<Match> findByGroupLabel(String groupLabel);
}
