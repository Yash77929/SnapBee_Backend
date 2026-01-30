package com.example.SnapBee.demo.services;

import com.example.SnapBee.demo.entities.Comment;
import com.example.SnapBee.demo.entities.Post;
import com.example.SnapBee.demo.entities.User;
import com.example.SnapBee.demo.exceptions.CommentException;
import com.example.SnapBee.demo.exceptions.PostException;
import com.example.SnapBee.demo.exceptions.UserException;
import com.example.SnapBee.demo.repository.CommentRepository;
import com.example.SnapBee.demo.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.Comments;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final UserService userService;
    private final PostService postService;
    private final PostRepository postRepository;

    public Comment createComment(Comment comment, Long userId, Long postId) throws UserException, PostException {
        User user = userService.findUserById(userId);
        Post post = postService.findPostById(postId);

        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());
        Comment createdComment = commentRepository.save(comment);
        post.getComments().add(createdComment);
        return createdComment;
    }

    @Override
    public Comment findCommentById(Long commentId) throws CommentException {
        return commentRepository.findById(commentId).orElseThrow(()->new CommentException("Comment not found"));
    }

    @Override
    public Comment likeComment(Long commentId, Long userId) throws UserException, CommentException{
        User user = userService.findUserById(userId);
        Comment comment = findCommentById(commentId);

        comment.getLikedByUsers().add(user);
        return commentRepository.save(comment);
    }

    @Override
    public Comment unlikeComment(Long commentId, Long userId) throws UserException, CommentException{
        User user = userService.findUserById(userId);
        Comment comment = findCommentById(commentId);
        comment.getLikedByUsers().remove(user);
        return commentRepository.save(comment);
    }
}