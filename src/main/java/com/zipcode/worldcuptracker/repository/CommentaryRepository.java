package com.zipcode.worldcuptracker.repository;

import com.zipcode.worldcuptracker.model.Commentary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentaryRepository extends JpaRepository<Commentary, String> {}
