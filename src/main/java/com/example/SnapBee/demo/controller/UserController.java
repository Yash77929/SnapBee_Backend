package com.example.SnapBee.demo.controller;

import com.example.SnapBee.demo.entities.User;
import com.example.SnapBee.demo.exceptions.UserException;
import com.example.SnapBee.demo.response.MessageResponse;
import com.example.SnapBee.demo.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<User> findUserById(@PathVariable Long id )throws UserException {
        User user = userService.findUserById(id);
        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    @GetMapping("username/{username}")
    public ResponseEntity<User> findByUsername(@PathVariable String username)throws UserException{
        User user = userService.findByUsername(username);
        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    //List of users are under user like :- 1,2,3
    @GetMapping("/users/{userIds}")
    public ResponseEntity<List<User>> findUserByIds(@PathVariable List<Long> userIds)throws UserException{
        List<User> users = userService.findUserByIds(userIds);
        return new ResponseEntity<List<User>>(users, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUser(@RequestParam("q") String query)throws UserException{
        List<User> users = userService.searchUser(query);
        return new ResponseEntity<List<User>>(users, HttpStatus.OK);
    }
    @PutMapping("/follow/{userId}")
    public ResponseEntity<MessageResponse> followUser(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String token) throws UserException {

        User user = userService.findUserByToken(token);
        String res = userService.followUser(user.getId(), userId);

        MessageResponse message = new MessageResponse(res);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @PutMapping("/unfollow/{userId}")
    public ResponseEntity<MessageResponse> unfollowUser(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String token) throws UserException {

        User user = userService.findUserByToken(token);
        String res = userService.unFollowUser(user.getId(), userId);

        MessageResponse message = new MessageResponse(res);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @GetMapping("/req")
    public ResponseEntity<User> findUser(@RequestHeader("Authorization") String token) throws UserException {
        User user = userService.findUserByToken(token);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<User> updateUser(
            @RequestBody User user,
            @RequestHeader("Authorization") String token) throws UserException {

        User currentUser = userService.findUserByToken(token);
        User updatedUser = userService.updateUser(user, currentUser);

        return new ResponseEntity<>(updatedUser, HttpStatus.ACCEPTED);
    }
}