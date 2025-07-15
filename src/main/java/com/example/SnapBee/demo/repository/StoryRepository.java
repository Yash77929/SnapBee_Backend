package com.example.SnapBee.demo.repository;

import com.example.SnapBee.demo.entities.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {

    @Query("SELECT s FROM Story s WHERE s.user.id = :userId")
    List<Story> findAllStoriesByUserId(@Param("userId") Long userId);
}
