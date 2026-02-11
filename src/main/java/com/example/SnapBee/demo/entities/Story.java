package com.example.SnapBee.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "story")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Story {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long Id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"following", "followers", "stories", "savePost", "password"})
    private User user;
    @NonNull
    private String image;
    private String caption;
    private LocalDateTime timestamp;
}
