package com.example.SnapBee.demo.services;

import com.example.SnapBee.demo.entities.Comment;
import com.example.SnapBee.demo.exceptions.CommentException;
import com.example.SnapBee.demo.exceptions.PostException;
import com.example.SnapBee.demo.exceptions.UserException;

public interface CommentService{

    Comment createComment(Comment comment, Long userId, Long postId)
            throws UserException, PostException;

    Comment findCommentById(Long commentId)
            throws CommentException;

    Comment likeComment(Long commentId, Long userId)
            throws UserException, CommentException;

    Comment unlikeComment(Long commentId, Long userId)
            throws UserException, CommentException;
}
