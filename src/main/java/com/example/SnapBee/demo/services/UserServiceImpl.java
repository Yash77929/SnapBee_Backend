package com.example.SnapBee.demo.services;

import com.example.SnapBee.demo.entities.User;
import com.example.SnapBee.demo.exceptions.UserException;
import com.example.SnapBee.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;


    //    @Override
//    public User findUserById(Long id) throws UserException{
//        User user = userRepository.findById(id)
//                .orElseThrow(()-> new UserException("User do not exsit with id: "+id));
//       return user;
//    }
// UserServiceImpl.java
    @Override
    public User findUserById(Long id) throws UserException {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserException("User does not exist with id: " + id));
    }

    //    @Override
//    public User findUserByUsername(String username) throws UserException{
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(()-> new UserException("User not found with username: "+username));
//        return user;
//    }
    @Override
    public User findByUsername(String username) throws UserException {
        return userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UserException("User not found with username: " + username));
    }

    public User findUserByToken(String token) throws UserException {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // Remove "Bearer " prefix
        } else {
            throw new UserException("Invalid or missing Authorization token");
        }

        Long id = jwtService.getIdFromToken(token);

        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }

    @Override
    public String followUser(Long reqUserId, Long followUserId) throws UserException {
        User reqUser = userRepository.findById(reqUserId)
                .orElseThrow(() -> new UserException("User not found with id: " + reqUserId));
        User followUser = userRepository.findById(followUserId)
                .orElseThrow(() -> new UserException("User not found with id: " + followUserId));
        if (reqUserId.equals(followUserId)) {
            throw new UserException("You cannot follow yourself.");
        }
        if (reqUser.getFollowing().contains(followUser)) {
            throw new UserException("You are already following " + followUser.getUsername());
        }
        reqUser.getFollowing().add(followUser);
        followUser.getFollowers().add(reqUser);
        userRepository.save(reqUser);
        userRepository.save(followUser);
        return "You are now following " + followUser.getUsername();
    }

    @Override
    public String unFollowUser(Long reqUserId, Long followUserId) throws UserException {
        User reqUser = userRepository.findById(reqUserId)
                .orElseThrow(() -> new UserException("User not found with id: " + reqUserId));
        User followUser = userRepository.findById(followUserId)
                .orElseThrow(() -> new UserException("User not found with id: " + followUserId));
        if (reqUserId.equals(followUserId)) {
            throw new UserException("You cannot unfollow yourself.");
        }
        if (!reqUser.getFollowing().contains(followUser)) {
            throw new UserException("You are not following " + followUser.getUsername());
        }
        reqUser.getFollowing().remove(followUser);
        followUser.getFollowers().remove(reqUser);
        userRepository.save(reqUser);
        userRepository.save(followUser);
        return "You have unfollowed " + followUser.getUsername();
    }

    @Override
    public List<User> findUserByIds(List<Long> userIds) throws UserException{
        List<User> users = userRepository.findAllUsersByUserIds(userIds);
        return users;
    }

    @Override
    public List<User> searchUser(String query) throws UserException{
        List<User> users = userRepository.findByQuery(query);
        if(users.isEmpty()){
            throw new UserException("User not found");
        }
        return users;
    }

    @Override
    public User updateUser(User updateUser, User existingUser) throws UserException {
        if (!updateUser.getId().equals(existingUser.getId())){
            throw new UserException("you can not update user");
        }
        if (updateUser.getEmail() != null) {
            existingUser.setEmail(updateUser.getEmail());
        }
        if (updateUser.getBio() != null) {
            existingUser.setBio(updateUser.getBio());
        }
        if (updateUser.getName() != null) {
            existingUser.setName(updateUser.getName());
        }
        if (updateUser.getUsername() != null) {
            existingUser.setUsername(updateUser.getUsername());
        }
        if (updateUser.getMobile() != null) {
            existingUser.setMobile(updateUser.getMobile());
        }
        if (updateUser.getImage() != null) {
            existingUser.setName(updateUser.getImage());
        }
        if (updateUser.getId().equals(existingUser.getId())) {
            userRepository.save(existingUser);
        }
        throw new UserException("you cannot update user");
    }

}
