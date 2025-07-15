package com.example.SnapBee.demo.services;

import com.example.SnapBee.demo.entities.Story;
import com.example.SnapBee.demo.entities.User;
import com.example.SnapBee.demo.exceptions.StoryException;
import com.example.SnapBee.demo.exceptions.UserException;
import com.example.SnapBee.demo.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StoryServiceImpl implements StoryService {

    private final StoryRepository storyRepository;
    private final UserService userService;

    @Override
    public Story createStory(Story story, Long userId) throws UserException {
        User user = userService.findUserById(userId);

        story.setUser(user);
        story.setTimestamp(LocalDateTime.now());

        user.getStories().add(story); // Optional: maintain bi-directional relationship

        return storyRepository.save(story);
    }
    @Override
    public List<Story> findStoryByUserId(Long userId) throws UserException, StoryException {
        User user = userService.findUserById(userId); // Validates the user exists

        List<Story> stories = storyRepository.findAllStoriesByUserId(userId);

        if (stories.isEmpty()) {
            throw new StoryException("No stories found for user with ID: " + userId);
        }

        return stories;
    }

}
