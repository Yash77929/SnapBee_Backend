package com.example.SnapBee.demo.dto;

import com.example.SnapBee.demo.entities.User;
import lombok.Data;

@Data
public class SignupDto extends User {
    String name;
    String email;
    String username;
    String password;
}
