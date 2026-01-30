package com.example.SnapBee.demo.services;


import com.example.SnapBee.demo.dto.SignupDto;
import com.example.SnapBee.demo.entities.User;
import com.example.SnapBee.demo.exceptions.UserException;
import com.example.SnapBee.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }

    public User registerUser(SignupDto signupDto) throws UserException {
        Optional<User> isEmailExist = userRepository.findByEmail(signupDto.getEmail());
        if (isEmailExist.isPresent()) {
            throw new UserException("Email already exists");
        }

        Optional<User> isUsernameExist = userRepository.findByUsername(signupDto.getEmail());
        if (isUsernameExist.isPresent()) {
            throw new UserException("This username already taken");
        }

        if (signupDto.getEmail() == null || signupDto.getPassword() == null || signupDto.getUsername() == null || signupDto.getName() == null) {
            throw new UserException("All fields are mandatory");
        }

        User newUser = new User();
        newUser.setEmail(signupDto.getEmail());
        newUser.setName(signupDto.getName());
        newUser.setPassword(passwordEncoder.encode(signupDto.getPassword()));
        newUser.setUsername(signupDto.getUsername());

        return userRepository.save(newUser);
    }
}