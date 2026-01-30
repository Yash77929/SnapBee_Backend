package com.example.SnapBee.demo.controller;

import com.example.SnapBee.demo.entities.Comment;
import com.example.SnapBee.demo.entities.User;
import com.example.SnapBee.demo.exceptions.CommentException;
import com.example.SnapBee.demo.exceptions.PostException;
import com.example.SnapBee.demo.exceptions.UserException;
import com.example.SnapBee.demo.services.CommentService;
import com.example.SnapBee.demo.services.PostService;
import com.example.SnapBee.demo.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;
    private final PostService postService;

    @PostMapping("/create/{postId}")
    public ResponseEntity<Comment> createComment(
            @RequestBody Comment comment,
            @PathVariable Long postId,
            @RequestHeader("Authorization") String token) throws UserException, PostException {

        User user = userService.findUserByToken(token);
        Comment createdComment = commentService.createComment(comment, user.getId(), postId);

        return new ResponseEntity<>(createdComment, HttpStatus.OK);
    }
    @GetMapping("/{commentId}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Long commentId) throws CommentException {
        Comment comment = commentService.findCommentById(commentId);
        return new ResponseEntity<>(comment, HttpStatus.OK);
    }
    @PutMapping("/like/{commentId}")
    public ResponseEntity<Comment> likeComment(
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String token) throws UserException, CommentException {

        User user = userService.findUserByToken(token);
        Comment comment = commentService.likeComment(commentId, user.getId());

        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @PutMapping("/unlike/{commentId}")
    public ResponseEntity<Comment> unlikeComment(
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String token) throws UserException, CommentException {

        User user = userService.findUserByToken(token);
        Comment comment = commentService.unlikeComment(commentId, user.getId());

        return new ResponseEntity<>(comment, HttpStatus.OK);
    }
}
