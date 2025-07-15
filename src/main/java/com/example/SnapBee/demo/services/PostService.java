package com.example.SnapBee.demo.services;

import com.example.SnapBee.demo.entities.Post;
import com.example.SnapBee.demo.exceptions.PostException;
import com.example.SnapBee.demo.exceptions.UserException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PostService {

    Post createPost(Post post, Long userId) throws UserException;

    String deletePost(Long postId, Long userId) throws UserException, PostException;

    List<Post> findPostByUserId(Long userId) throws UserException;


    Post findPostById(Long postId) throws PostException;

    List<Post> findAllPostsByUserIds(List<Long> userIds) throws PostException, UserException;

    String savePost(Long postId, Long userId) throws UserException, PostException;

    String unSavePost(Long postId, Long userId) throws UserException, PostException;

    Post likePost(Long postId, Long userId) throws UserException, PostException;

    Post unLikePost(Long postId, Long userId) throws UserException, PostException;


}