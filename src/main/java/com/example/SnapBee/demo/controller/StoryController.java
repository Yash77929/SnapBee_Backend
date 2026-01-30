package com.example.SnapBee.demo.controller;

import com.example.SnapBee.demo.entities.Story;
import com.example.SnapBee.demo.entities.User;
import com.example.SnapBee.demo.exceptions.StoryException;
import com.example.SnapBee.demo.exceptions.UserException;
import com.example.SnapBee.demo.services.StoryService;
import com.example.SnapBee.demo.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/story")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;
    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<Story> createStory(
            @RequestBody Story story,
            @RequestHeader("Authorization") String token) throws UserException {

        User user = userService.findUserByToken(token);
        Story createdStory = storyService.createStory(story, user.getId());

        return new ResponseEntity<>(createdStory, HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Story>> getStoriesByUserId(@PathVariable Long userId)
            throws UserException, StoryException {

        List<Story> stories = storyService.findStoryByUserId(userId);
        return new ResponseEntity<>(stories, HttpStatus.OK);
    }

}