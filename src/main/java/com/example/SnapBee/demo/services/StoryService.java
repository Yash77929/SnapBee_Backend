package com.example.SnapBee.demo.services;

import com.example.SnapBee.demo.entities.Story;
import com.example.SnapBee.demo.exceptions.StoryException;
import com.example.SnapBee.demo.exceptions.UserException;

import java.util.List;

public interface StoryService {

    Story createStory(Story story, Long userId) throws UserException;

    List<Story> findStoryByUserId(Long userId) throws UserException, StoryException;
}