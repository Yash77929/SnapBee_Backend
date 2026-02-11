package com.example.SnapBee.demo.controller;

import com.example.SnapBee.demo.dto.LoginDto;
import com.example.SnapBee.demo.dto.SignupDto;
import com.example.SnapBee.demo.exceptions.UserException;
import com.example.SnapBee.demo.services.AuthService;
import com.example.SnapBee.demo.services.UserUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserUserDetailsService userService;
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody SignupDto signupDto) throws UserException {
        userService.registerUser(signupDto);
        return ResponseEntity.ok(Map.of("message", "Signup successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDto loginDto) throws UserException {
        String token = authService.login(loginDto);
        return ResponseEntity.ok(token);
    }
}
