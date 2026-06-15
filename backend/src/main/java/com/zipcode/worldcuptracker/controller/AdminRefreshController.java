package com.zipcode.worldcuptracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zipcode.worldcuptracker.service.SampleDataService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminRefreshController {

    private final SampleDataService sampleDataService;

    public AdminRefreshController(SampleDataService sampleDataService) {
        this.sampleDataService = sampleDataService;
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refreshData() {
        sampleDataService.refreshSampleData();
        return ResponseEntity.ok("Sample data refreshed");
    }
}
