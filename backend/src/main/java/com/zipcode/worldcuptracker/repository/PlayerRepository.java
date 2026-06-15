package com.zipcode.worldcuptracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipcode.worldcuptracker.model.Player;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByTeamId(Long teamId);
}
