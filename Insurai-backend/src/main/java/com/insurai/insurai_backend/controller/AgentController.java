package com.insurai.insurai_backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.insurai.insurai_backend.config.JwtUtil;
import com.insurai.insurai_backend.model.Agent;
import com.insurai.insurai_backend.model.AgentAvailability;
import com.insurai.insurai_backend.model.EmployeeQuery;
import com.insurai.insurai_backend.service.AgentAvailabilityService;
import com.insurai.insurai_backend.service.AgentService;
import com.insurai.insurai_backend.service.AuditLogService;
import com.insurai.insurai_backend.service.EmployeeQueryService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/agent")
@CrossOrigin(origins = "http://localhost:5173")
public class AgentController {

    private final AgentService agentService;
    private final AgentAvailabilityService availabilityService;
    private final EmployeeQueryService queryService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    // -------------------- Register a new agent --------------------
    @PostMapping("/register")
    public ResponseEntity<?> registerAgent(@RequestBody Agent agent) {
        try {
            agent.setPassword(passwordEncoder.encode(agent.getPassword()));
            Agent savedAgent = agentService.registerAgent(agent);

            auditLogService.logAction(
                    savedAgent.getId().toString(),
                    savedAgent.getName(),
                    "AGENT",
                    "REGISTER",
                    "New agent registered"
            );

            return ResponseEntity.ok(savedAgent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error registering agent: " + e.getMessage());
        }
    }

    // -------------------- Agent login --------------------
    @PostMapping("/login")
    public ResponseEntity<?> loginAgent(@RequestBody Agent loginRequest) {
        try {
            Agent agent = agentService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Agent not found"));

            if (!passwordEncoder.matches(loginRequest.getPassword(), agent.getPassword())) {
                return ResponseEntity.status(401).body("Invalid password");
            }

            String token = jwtUtil.generateToken(agent.getEmail(), "AGENT");

            auditLogService.logAction(
                    agent.getId().toString(),
                    agent.getName(),
                    "AGENT",
                    "LOGIN",
                    "Agent logged in"
            );

            return ResponseEntity.ok(new AgentLoginResponse(
                    "Login successful",
                    agent.getId(),
                    agent.getName(),
                    "AGENT",
                    token
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }

    // -------------------- Save availability --------------------
    @PostMapping("/availability")
    public ResponseEntity<?> setAvailability(@RequestBody AvailabilityRequest request) {
        try {
            Agent agent = getAuthenticatedAgent();

            AgentAvailability saved = availabilityService.setAvailability(
                    agent.getId(),
                    request.isAvailable(),
                    request.getStartTime(),
                    request.getEndTime()
            );

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // -------------------- Respond to query --------------------
    @PutMapping("/queries/respond/{queryId}")
    public ResponseEntity<?> respondToQuery(
            @PathVariable Long queryId,
            @RequestBody RespondQueryRequest request
    ) {
        try {
            Agent agent = getAuthenticatedAgent();

            EmployeeQuery updatedQuery =
                    queryService.respondToQuery(agent.getId(), queryId, request.getResponse());

            auditLogService.logAction(
                    agent.getId().toString(),
                    agent.getName(),
                    "AGENT",
                    "RESPOND_QUERY",
                    "Responded to query ID: " + queryId
            );

            return ResponseEntity.ok(updatedQuery);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // -------------------- Get all queries for agent --------------------
    @GetMapping("/queries/all/{agentId}")
    public ResponseEntity<?> getAllQueriesForAgent(@PathVariable Long agentId) {
        try {
            return ResponseEntity.ok(queryService.getAllQueriesForAgent(agentId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // ================== Helper ==================
    private Agent getAuthenticatedAgent() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Agent) auth.getPrincipal();
    }

    // ================== DTOs ==================

    public static class AgentLoginResponse {
        private String message;
        private Long agentId;
        private String name;
        private String role;
        private String token;

        public AgentLoginResponse(String message, Long agentId, String name, String role, String token) {
            this.message = message;
            this.agentId = agentId;
            this.name = name;
            this.role = role;
            this.token = token;
        }

        public String getMessage() { return message; }
        public Long getAgentId() { return agentId; }
        public String getName() { return name; }
        public String getRole() { return role; }
        public String getToken() { return token; }
    }

    public static class AvailabilityRequest {
        private boolean available;
        private LocalDateTime startTime;
        private LocalDateTime endTime;

        public boolean isAvailable() { return available; }
        public void setAvailable(boolean available) { this.available = available; }
        public LocalDateTime getStartTime() { return startTime; }
        public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
        public LocalDateTime getEndTime() { return endTime; }
        public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    }

    public static class RespondQueryRequest {
        private String response;
        public String getResponse() { return response; }
        public void setResponse(String response) { this.response = response; }
    }
}
