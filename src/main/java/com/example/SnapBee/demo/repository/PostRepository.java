package com.example.SnapBee.demo.repository;

import com.example.SnapBee.demo.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE p.user.id = :userId")
    List<Post> findByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Post p WHERE p.user.id IN :users ORDER BY p.createdAt DESC")
    List<Post> findAllPostsByUserIds(@Param("users") List<Long> userIds);
}