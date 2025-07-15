package com.example.SnapBee.demo.controller;

import com.example.SnapBee.demo.entities.Post;
import com.example.SnapBee.demo.entities.User;
import com.example.SnapBee.demo.exceptions.PostException;
import com.example.SnapBee.demo.exceptions.UserException;
import com.example.SnapBee.demo.response.MessageResponse;
import com.example.SnapBee.demo.services.PostService;
import com.example.SnapBee.demo.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;
    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<Post> createPost(@RequestBody Post post,
                                           @RequestHeader("Authorization") String token) throws UserException {
        User user = userService.findUserByToken(token);
        Post createdPost = postService.createPost(post, user.getId());
        return new ResponseEntity<>(createdPost, HttpStatus.OK);
    }

    @GetMapping("/all/{userId}")
    public ResponseEntity<List<Post>> findPostByUserId(@PathVariable Long userId) throws UserException {
        List<Post> posts = postService.findPostByUserId(userId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/following/{userIds}")
    public ResponseEntity<List<Post>> findAllPostByUserIds(@PathVariable List<Long> userIds)
            throws UserException, PostException {

        List<Post> posts = postService.findAllPostsByUserIds(userIds);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Post> findPostById(@PathVariable Long postId) throws PostException {
        Post post = postService.findPostById(postId);
        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @PutMapping("/like/{postId}")
    public ResponseEntity<Post> likePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String token) throws PostException, UserException{
        User user = userService.findUserByToken(token);
        Post post = postService.likePost(postId,user.getId());
        return new ResponseEntity<Post>(post, HttpStatus.OK);
    }

    @PutMapping("/unlike/{postId}")
    public ResponseEntity<Post> unlikePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String token) throws PostException, UserException {

        User user = userService.findUserByToken(token);
        Post post = postService.unLikePost(postId, user.getId());

        return new ResponseEntity<>(post, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<MessageResponse> deletePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String token) throws PostException, UserException {

        User user = userService.findUserByToken(token);
        String message = postService.deletePost(postId, user.getId());
        MessageResponse res = new MessageResponse(message);

        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
    }

    @PutMapping("/save/{postId}")
    public ResponseEntity<MessageResponse> savePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String token) throws PostException, UserException {

        User user = userService.findUserByToken(token);
        String message = postService.savePost(postId, user.getId());
        MessageResponse res = new MessageResponse(message);

        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
    }
    @PutMapping("/unsave/{postId}")
    public ResponseEntity<MessageResponse> unsavePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String token) throws PostException, UserException {

        User user = userService.findUserByToken(token);
        String message = postService.unSavePost(postId, user.getId());
        MessageResponse res = new MessageResponse(message);

        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
    }
}