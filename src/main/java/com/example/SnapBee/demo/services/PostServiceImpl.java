package com.example.SnapBee.demo.services;

import com.example.SnapBee.demo.entities.Post;
import com.example.SnapBee.demo.entities.User;
import com.example.SnapBee.demo.exceptions.PostException;
import com.example.SnapBee.demo.exceptions.UserException;
import com.example.SnapBee.demo.repository.PostRepository;
import com.example.SnapBee.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    @Override
    public Post createPost(Post post, Long userId) throws UserException {
        User user = userService.findUserById(userId);
        post.setUser(user);
        return postRepository.save(post);
    }

    public List<Post> findPostByUserId(Long userId) throws UserException {
        List<Post> posts = postRepository.findByUserId(userId);

        if (posts.isEmpty()) {
            throw new UserException("This user does not have any posts");
        }

        return posts;
    }
    @Override
    public Post findPostById(Long postId) throws PostException {
        return postRepository.findById(postId)
                .orElseThrow(() -> new PostException("Post not found with id: " + postId));
    }

    @Override
    public List<Post> findAllPostsByUserIds(List<Long> userIds) throws PostException, UserException {
        List<Post> posts = postRepository.findAllPostsByUserIds(userIds);
        if (posts.isEmpty()) {
            throw new PostException("No posts available");
        }
        return posts;
    }

    @Override
    @Transactional
    public String savePost(Long postId, Long userId) throws UserException, PostException {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        if (user.getSavePost().contains(post)) {
            throw new PostException("Post is already saved");
        }

        user.getSavePost().add(post);
        userRepository.save(user);

        return "Post is successfully saved";
    }


    @Override
    @Transactional
    public String unSavePost(Long postId, Long userId) throws UserException, PostException {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        if (!user.getSavePost().contains(post)) {
            throw new PostException("Post was not saved");
        }

        user.getSavePost().remove(post);
        userRepository.save(user);

        return "Post has been unsaved successfully";
    }


    @Override
    @Transactional
    public Post likePost(Long postId, Long userId) throws UserException, PostException {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        // Add to both sides
        post.getLikedByUsers().add(user);

        // Save only one side (owning side — usually User in bidirectional)
        return postRepository.save(post);
    }
    @Override
    @Transactional
    public Post unLikePost(Long postId, Long userId) throws UserException, PostException {
        Post post = findPostById(postId);
        User user = userService.findUserById(userId);

        // Remove user from post's liked list and vice versa
        post.getLikedByUsers().remove(user);
        return postRepository.save(post);
    }
    @Transactional
    @Override
    public String deletePost(Long postId, Long userId) throws UserException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new UserException("Post not found with id: " + postId));

        if (!post.getUser().getId().equals(userId)) {
            throw new UserException("You are not authorized to delete this post");
        }

        postRepository.delete(post);
        return "Post deleted successfully";
    }
}