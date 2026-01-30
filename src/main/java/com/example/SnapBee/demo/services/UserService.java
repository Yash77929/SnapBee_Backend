package com.example.SnapBee.demo.services;

import com.example.SnapBee.demo.entities.User;
import com.example.SnapBee.demo.exceptions.UserException;

import java.util.List;

public interface UserService {

    public User findUserByToken(String token) throws UserException;
    public User findUserById(Long id) throws UserException;
    /** Find a user by username. */
    public User findByUsername(String username) throws UserException;

    public  String followUser(Long reqUserId, Long followeUserId) throws UserException;

    public  String unFollowUser(Long reqUserId, Long followeUserId) throws UserException;

    public List<User>findUserByIds(List<Long> userIds) throws UserException;

    public List<User>searchUser(String query)throws UserException;

    public User updateUser(User updateUser, User existingUser) throws UserException;
}
