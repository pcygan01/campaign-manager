package com.example.campaignmanager.service;

import com.example.campaignmanager.dto.AuthenticationRequest;
import com.example.campaignmanager.dto.AuthenticationResponse;
import com.example.campaignmanager.dto.RegisterRequest;
import com.example.campaignmanager.dto.LoginRequest;
import com.example.campaignmanager.model.Role;
import com.example.campaignmanager.model.User;
import com.example.campaignmanager.repository.UserRepository;
import com.example.campaignmanager.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .balance(0.0)
                .build();

        userRepository.save(user);
        var token = jwtService.generateToken(user);
        
        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        var user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
        var token = jwtService.generateToken(user);
        
        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }
} 